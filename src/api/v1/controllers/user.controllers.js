import { UserService, ProfileService } from "../services/user.services.js";
import process from "node:process";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { Role, Status } from "@prisma/client";
import wlogger from "../../../logger/winston.logger.js";
import { strict } from "node:assert";

const JWTSecret = process.env.JWT_TOKEN;

// Users
export async function getUsers(req, res, err) {
    const { user } = req;
    let { page, sort, order, take } = req.query;
    page = page ? page - 1 : 0;
    take = take ? take : 15;
    const skip = take * page;
    sort = sort ? sort : "createdAt";
    order = order ? order : "desc";
    let orderBy = [];
    let orderByObj = {};
    orderByObj[sort] = order;
    orderBy.push(orderByObj);
    const [profiles, total, error] = await UserService.get({
        include: {
            profiles: true
        },
        skip: skip,
        take: take,
        orderBy: orderBy
    });
    if (error) {
        wlogger.error(error);

        return res.status(500).json(error);
    }

    return res.status(200).render("users", {
        users: profiles,
        user: user ? user : undefined,
        curPage: page + 1,
        total: Math.ceil(total / take)
    });
}

export async function getUserProfile(req, res, err) {
    const { user } = req;
    const { profile_id } = req.params;
    const [profile, error] = await ProfileService.findOne({
        where: {
            id: profile_id
        },
        include: {
            projectAssociations: {
                select: {
                    id: true,
                    projectId: true,
                    userRole: true,
                    status: true,
                    project: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            ratings: true,
            participantEvents: true,
            createdEvents: true,
            courses: true
        }
    });
    if (req.user) {
        wlogger.info(`User ${req.user.profiles[0].userName} is logged in`);
    }
    if (error) {
        if (error.code == "NotFoundError") {
            return res.status(404).json(error);
        }
        wlogger.error(`error at getting profile: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).render("users/profiles/detail.ejs", {
        profile: profile,
        user: user ? user : undefined
    });
}

export async function createUsers(req, res, err) {
    /**
     * users = [ {email, roles=["DEVELOPER", etc]}]
     * file = bulkUpload.csv
     *
     */
    const reqUsers = req.body.users;

    let users = [];
    for (const user of reqUsers) {
        if (user.email == undefined || user.email == "") {
            continue;
        }
        users.push(user);
    }
    if (users.length == 0) {
        return res.status(400).json({ message: "No user to create" });
    }
    const umap = new Map();

    for (let user of users) {
        if (!user.roles) {
            continue;
        }

        if (!(user.roles instanceof Array)) {
            user.roles = [user.roles];
        }
        umap.set(user.email, user.roles);
    }
    // const role = req.body.role || undefined;

    let [createResponse, createError] = await UserService.createForToken(users);
    if (createError) {
        wlogger.error(`bulk-create-user error: ${createError}`);
        return res.status(500).json(createError);
    }

    let allErrors = [];
    let resArray = [];

    for (let idx = 0; idx < createResponse.length; idx++) {
        let user = createResponse[idx];
        let roles = umap.get(user.email);
        if (!roles) roles = ["PUBLIC"];
        let profiles = [];
        for (let role of roles) {
            profiles.push({
                role: role,
                email: user.email,
                userName: user.email.split("@")[0]
            });
        }
        user = { ...user, profiles: profiles };

        const [result, error] = await UserService.createMultipleProfiles(user);
        if (error) {
            allErrors.push(error);
            continue;
        }
        resArray.push(result);
    }

    if (allErrors.length > 0) {
        wlogger.error(`bulk-profile error: ${allErrors}`);
        return res.status(500).json({
            message: "Some Profiles failed to create",
            errors: allErrors
        });
    }
    // if (role) {
    //     for (const user of response) {
    //         const [res, err] = await ProfileService.create(
    //             user.email,
    //             user.id,
    //             role
    //         );
    //         if (err) {
    //             allErrors.push(err);
    //         }
    //         resArray.push(res);
    //     }

    //     let resError = null;
    //     if (allErrors.length > 0) {
    //         resError = Error(
    //             `profile creation error during bulk-create: ${allErrors}`
    //         );
    //     }
    //     return res.status(200).json({
    //         message: "Created Users but Profile Attachment failed.",
    //         response: resArray,
    //         error: resError
    //     });
    //     // return [resArray, resError];
    // }

    return res.status(201).redirect("/api/v1/users");
    // return [response, error];
}

// Profile
export async function createUserProfile(req, res, err) {
    const { email, id, role } = req.body;

    const [profileExists, _] = await dbFindFirstProfile({
        where: {
            userId: id,
            role: role
        }
    });
    if (profileExists) {
        const error = Error(
            `Profile with role: ${role} for user-email: ${email} already exists`
        );
        wlogger.error(`${error}`);
        return res.status(409).json(error);
    }

    const [response, error] = await ProfileService.create(email, id, role);
    if (error) {
        wlogger.error(`error creating Profile for user ${email}: ${error}`);
        return res.status(409).json(error);
    }

    return res.status(200).json(response);
}
export async function editUserProfile(req, res, err) {
    const id = req.user.id;
    const profileId = req.params.profileId;
    let newProfile = req.body.newProfile;

    delete newProfile.email;
    delete newProfile.role;
    delete newProfile.updatedAt;
    delete newProfile.createdAt;

    const [status, error] = await ProfileService.update(profileId, newProfile);
    if (error) {
        wlogger.error(`UpdateProfile error: ${error}`);

        return res.status(400).json(error);
    }
    return res.status(200).json(status);
}

export async function dashboardViewHandler(req, res, err) {
    const { user } = req;
    // if (!user) {
    //     return res.status(401).render("common/login.ejs");
    // }
    // choose dashboard accoring to user profile role.
    // This might require unpacking the JWT to determine the profile to fetch.
    // For now, This will go to simple unprotected dashboard.
    //
    //
    switch (user?.profiles[0].role) {
        case "PROJECT_MANAGER":
            return res.status(200).render("dashboards/project-manager.ejs", {
                profile: user.profiles[0],
                user: user
            });
        case "ADMIN":
            return res.status(200).render("dashboards/admin.ejs", {
                profile: user.profiles[0],
                user: user
            });
        case "DEVELOPER":
            return res.status(200).render("dashboards/developer.ejs", {
                profile: user.profiles[0],
                user: user
            });
        case "CLIENT":
            return res.status(200).render("dashboards/client.ejs", {
                profile: user.profiles[0],
                user: user
            });
        case "REVIEWER":
            return res.status(200).render("dashboards/reviewer.ejs", {
                profile: user.profiles[0],
                user: user
            });
        default:
            return res.status(200).render("dashboards/public.ejs", {
                profile: user ? user.profiles[0] : undefined,
                user: user ? user : undefined
            });
    }
    return res
        .status(200)
        .render("dashboards/public.ejs", { profile: user.profiles[0] });
}
// Login, Register, Logout
export async function loginViewHandler(req, res, err) {
    return res.status(200).render("common/login.ejs");
}
export async function registerViewHandler(req, res, err) {
    return res.status(200).render("common/register.ejs");
}

export async function registerHandler(req, res, err) {
    /**
     * extract email and password from req body
     *
     * check if there exists another user with same username/ email
     *  if so, return error.
     *
     * insert a new record into the db with email, username, password
     *  make sure to have a pre-save hook that hashes the password before saving into the db
     *
     * get an user.id in return after saving is confirmed.
     * (Future):
     *      1. generate an unhashed token, hash it and store it along with the user in db.
     *      2. generate an expiration token for it and store it as well.
     *      3. Put the unhashed token in email body and send it to user.email.
     *
     * return a success response
     */

    const { email, password } = req.body;

    const [response, error] = await UserService.create(
        email,
        password,
        Role.PUBLIC
    );

    if (error) {
        wlogger.error(`error: ${error}`);
        return res.status(400).json(error);
    }
    wlogger.info(`success: registered: ${email}`);

    return res.redirect("/api/v1/users/login");
}
export async function loginHandler(req, res, err) {
    /**
     * TODO: distinguish between login via token and login via email+password
     *
     * extract email, username or password from the request body
     *
     * check if user is present in the db.
     *  If no, return error.
     *
     * generate accessToken and refreshToken
     * store refreshToken back with user in the db.
     *
     * Attach accessToken and refreshToken to response body as a cookie.
     *
     * Return a success response.
     */

    const { email, password, token } = req.body;

    // if (token) {
    //     let decodedToken;
    //     try {
    //         decodedToken = jwt.verify(token, "randtoken");
    //         email = decodedToken.email;
    //         password = token;
    //     } catch (err) {
    //         wlogger.error(`error: ${err}`);
    //         return res.status(400).json(err);
    //     }
    // }

    const [result, error] = await UserService.getUnique({
        where: { email: email },
        include: {
            profiles: {
                select: {
                    id: true,
                    role: true,
                    userName: true
                }
            }
        },
        omit: {
            password: false,
            refreshToken: false,
            oneTimeToken: false
        }
    });

    if (error) {
        //check for if no such user
        wlogger.error(`No such user exists error: ${error}`);

        return res.status(401).render("common/404.ejs");
    }
    const user = result;

    // if (user.refreshToken) {
    //     wlogger.warn(`user ${user.userName} is logged in`);

    //     return res.status(409).json("User already logged in");
    // }

    const salt = user.salt;
    const reqPassHash = crypto
        .scryptSync(password, salt, 12)
        .toString("base64");
    const isValidPassword = reqPassHash === user.password;

    if (!isValidPassword) {
        wlogger.error(`Wrong Password: ${error}`);

        return res.status(400).json("Wrong Password");
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);

    //save refreshToken with the user.
    await UserService.updateTokenById(user.id, "refreshToken", refreshToken);

    const cookieOptions = {
        httpOnly: true,
        secure: false // make this dependant on NODE_ENV. should be false in dev, true in prod.
    };

    delete user.password;
    delete user.createdAt;

    return res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .redirect("/api/v1/users/profile/choose");
}
export async function logoutHandler(req, res, err) {
    /**
     * put accessToken in blacklist table
     *
     * delete refreshToken from user in the db
     *
     * clear out cookie from response
     *
     * return response
     */
    const user = req.user;

    const [_, error] = await UserService.updateTokenById(
        user.id,
        "refreshToken",
        null
    );

    if (error) {
        wlogger.error(`Failed to Logout error: ${error}`);
        return res.status(400).json(error);
    }

    const options = {
        httpOnly: true,
        secure: false
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .redirect("/");
    // .json({ message: "Logged out" });
}

export async function loginViaToken(req, res, err) {
    const { token } = req.body;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "randtoken");
    } catch (err) {
        wlogger.error(`OneTimeToken Expired : ${err}`);
        return res.status(400).json(err);
    }
    const [result, error] = await UserService.getUnique({
        where: { oneTimeToken: token, email: decodedToken.email },
        include: {
            profiles: {
                select: {
                    id: true,
                    role: true,
                    userName: true
                }
            }
        },
        omit: {
            password: false,
            refreshToken: false,
            oneTimeToken: false
        }
    });

    if (error) {
        wlogger.error(`error: ${error}`);
        return res.status(400).json(error);
    }
    const user = result;
    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);

    //save refreshToken with the user.
    await UserService.updateTokenById(user.id, "refreshToken", refreshToken);

    const cookieOptions = {
        httpOnly: true,
        secure: false // make this dependant on NODE_ENV. should be false in dev, true in prod.
    };
    return res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .redirect("/api/v1/users/profile/choose");
}

export async function generateAccessToken(user, profile_id = undefined) {
    if (!profile_id) {
        return jwt.sign({ id: user.id, email: user.email }, JWTSecret, {
            expiresIn: "20m"
        });
    }
    return jwt.sign(
        { id: user.id, email: user.email, profile_id: profile_id },
        JWTSecret,
        {
            expiresIn: "15m"
        }
    );
}
export async function generateRefreshToken(user, profile_id = undefined) {
    if (!profile_id) {
        return jwt.sign({ id: user.id }, JWTSecret, {
            expiresIn: "1hr"
        });
    }

    return jwt.sign({ id: user.id, profile_id: profile_id }, JWTSecret, {
        expiresIn: "1hr"
    });
}
export async function generateAccessAndRefreshTokens(
    user,
    profile_id = undefined
) {
    /**
     *
     * generate accessToken
     * generate refreshToken
     *
     * return {accessToken, refreshToken}
     */
    //
    //
    const accessToken = await generateAccessToken(user, profile_id);

    const refreshToken = await generateRefreshToken(user, profile_id);
    return { accessToken, refreshToken };
}
export async function refreshAccessToken(req, res, err) {
    /**
     * extract refreshToken from req
     *
     * if no refreshToken, return with error 401
     *
     * check if refreshToken is in db with user
     *  if not, then user is logged out, return with error 401
     *
     * decode user.id from refreshToken
     *
     * get user from db
     *
     * generate AccessToken and refreshToken
     * attach to response body and return response
     */

    const options = {
        httpOnly: true,
        secure: false
    };
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
        // no refreshToken found in cookies or authorization header. redirect to login
        return res
            .clearCookie("accessToken", options)
            .redirect("/api/v1/users/login"); // redirect to login page.
    }

    let decoded = undefined;
    try {
        decoded = jwt.verify(token, "randtoken");
    } catch (err) {
        wlogger.error(`error: ${err}`);
        return res
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .redirect("/api/v1/users/login"); // redirect to login page.
    }

    const profile_id = decoded.profile_id;
    const [user, total, error] = await UserService.get({
        where: { id: decoded.id },
        omit: { refreshToken: false }
    });
    if (error) {
        // token is valid but no such user found. Redirect to login page?
        wlogger.error(`no user with provided token`);
        return res.status(404).json({ message: "No such user" });
    }
    if (user.refreshToken !== token) {
        // User has logged out. Redirect to Login again?
        return res.redirect("/api/v1/users/login");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user,
        profile_id
    );
    // const cookieOptions = {
    //     httpOnly: true,
    //     secure: false
    // };
    wlogger.info(`Access Token refreshed`);
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: "Access Token refreshed" });
}

export async function assignmentHandler(req, res, err) {
    /**
     * get project-id
     * check role of logged-in user
     * if req.body is array of strings => consider them as emails
     *  (assume that the emails are vested for existence and profile-role validity )
     *  find profile ids of the given emails
     *  append req.user.profile-id to array if profile of logged-in user is DEV
     *  create entry for each {role, status="Queued"}, connect the project-id and profile-id
     *
     * if req.body is array of ints => consider them as profile-ids
     *  (assume that profile-ids are valid)
     *  create entry for each {role, status="Queued"}, connect the project-id and profile-id
     *
     */

    const { projectId } = req.params.id;
    const user = req.user;
    const role = await ProfileService.findOne({
        where: {
            OR: [
                {
                    email: other_users
                },
                {
                    id: other_users
                }
            ]
        }
    });
    const { other_users } = req.body.additionals;
    let profileIdArry = [];
    let response, error;
    if (typeof other_users[0] == "String") {
        other_users.push(user.email);
        // get profile-ids of the emails
        [response, error] = await ProfileService.update({
            where: {
                email: {
                    in: other_users
                },
                role: Role.DEVELOPER
            },
            data: {
                projectAssociations: {
                    create: {
                        data: {
                            userRole: Role.DEVELOPER,
                            status: Status.IS_ENROLL,
                            projectId: projectId
                        }
                    }
                }
            }
        });

        // append current profile-id
    } else {
        [response, error] = await ProfileService.update({
            where: {
                id: {
                    in: other_users
                },
                role: role
            },
            data: {
                projectAssociations: {
                    create: {
                        data: {
                            userRole: role,
                            status: Status.IS_ENROLL,
                            projectId: projectId
                        }
                    }
                }
            }
        });
    }

    if (error) {
        wlogger.error(`error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(response);
}

export async function detachHandler(req, res, err) {
    const { profileId } = req.params.profile_id;
    const { projectId } = req.body.project_id;
    const [response, error] = ProfileService.update({
        where: {
            id: profileId
        },
        data: {
            projectAssociations: {
                delete: {
                    projectId: projectId,
                    profileId: profileId
                }
            }
        }
    });

    if (error) {
        wlogger.error(`error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(response);
}

export async function getAvailableProfiles(req, res, err) {
    const { user } = req;
    const [response, error] = await ProfileService.findAll({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            role: true,
            userName: true,
            profilePic: true
        }
    });

    if (error) {
        wlogger.error(`error: ${error}`);
        return res.status(500).json(error);
    }

    if (!response || response.length == 0) {
        return res.status(203).render("partials2/modals/profile-chooser.ejs", {
            profiles: []
        });
    }

    return res.status(200).render("partials2/modals/profile-chooser.ejs", {
        profiles: response
    });
}

export async function chooseProfile(req, res, err) {
    const { user } = req;
    // const { profileId } = req.params;
    const profile_Id = parseInt(req.body.profile_Id);
    //
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user,
        profile_Id
    );

    await UserService.updateTokenById(user.id, "refreshToken", refreshToken);

    // let allProfiles = user.profiles;
    // const loggedinProfile = allProfiles.filter(
    //     (profile) => profile.id == profile_Id
    // );
    // let responseUser = { ...user };
    // delete responseUser.profiles;
    // responseUser.profiles = loggedinProfile;
    // let path = "dashboards/public.ejs";
    // switch (responseUser.profiles[0].role) {
    //     case Role.PROJECT_MANAGER:
    //         path = "dashboards/project-manager.ejs";
    //         break;
    //     case Role.ADMIN:
    //         path = "dashboards/admin.ejs";
    //         break;
    //     case Role.DEVELOPER:
    //         path = "dashboards/developer.ejs";
    //         break;
    //     case Role.CLIENT:
    //         path = "dashboards/client.ejs";
    //         break;
    //     case Role.REVIEWER:
    //         path = "dashboards/reviewer.ejs";
    //         break;
    //     default:
    //         break;
    // }
    const cookieOptions = {
        httpOnly: true,
        secure: false
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .redirect("/api/v1/users/dashboard");
}

export async function getCreateUserPage(req, res, err) {
    const { user } = req;
    return res.status(200).render("users/create.ejs", { user: user });
}

export async function getCreateUsersFormAdditional(req, res, err) {
    const { index } = req.params;

    return res
        .status(200)
        .render("partials2/forms/user.add.ejs", { index: index });
}
export async function getDemoUsers(req, res, err) {
    let { take } = req.query;
    take = take ? take : 3;

    const [response, total, error] = await UserService.get({
        select: {
            email: true,
            password: true
        },
        take: take
    });
    if (error) {
        wlogger.error(`error: ${error}`);
        return res.status(500).json(error);
    }
    return res.status(200).render("users/list.ejs", { users: response });
}
