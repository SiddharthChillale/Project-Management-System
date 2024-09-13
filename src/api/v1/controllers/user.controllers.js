import UserService from "../services/user.services.js";
import process from "node:process";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const JWTSecret = "randtoken";
export async function getUserProfileAll(req, res, err) {
    const [profiles, error] = await UserService.getAll({
        include: {
            UserProfiles: true
        }
    });
    if (error) {
        console.log(error);

        return res.status(500).json(error);
    }
    return res.status(200).json(profiles);
}

export async function getUserProfileOne(req, res, err) {
    const { id, profile_id } = req.params.id;
    const [profile, error] = await UserService.getOne({
        select: {
            UserProfiles: {
                where: {
                    id: profile_id
                }
            }
        },
        where: { id: id }
    });
    if (req.user) {
        console.log(`User ${req.user.userName} is logged in`);
    }
    if (error) {
        if (error.code == "NotFoundError") {
            return res.status(404).json(error);
        }

        return res.status(500).json(error);
    }

    return res.status(200).json(profile);
}

export async function editUserProfile(req, res, err) {
    const id = req.user.id;
    const profile_id = req.params.profile_id;
    let user = req.body.newProfile;
    user = { ...user, profile_id: profile_id };

    delete user.email;
    delete user.password;
    delete user.refreshToken;
    delete user.updatedAt;
    delete user.createdAt;

    const [status, error] = await UserService.updateOneById(id, user);
    if (error) {
        console.log(`UpdateProfile error: ${error}`);

        return res.status(400).json(error);
    }
    return res.status(200).json(status);
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
    const salt = "salt";
    // encrypt password
    const hashedPassword = crypto
        .scryptSync(password, salt, 12)
        .toString("base64");
    const [response, error] = await UserService.register(
        email,
        salt,
        hashedPassword
    );

    if (error) {
        console.log(`error: ${error}`);
        return res.status(400).json(error);
    }
    console.log(`success: registered: ${email}`);

    return res.status(200).json(response);
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
    const { email, password, role } = req.body;
    const [user, error] = await UserService.findOne({
        where: { email: email },
        include: {
            UserProfiles: true
        },
        omit: {
            password: false,
            refreshToken: false
        }
    });

    if (error) {
        //check for if no such user
        console.log(`No such user exists error: ${error}`);

        return res.status(404).json(error);
    }

    if (user.refreshToken) {
        console.log(`user ${user.userName} is logged in`);

        return res.status(409).json("User already logged in");
    }

    const salt = user.salt;
    const reqPassHash = crypto
        .scryptSync(password, salt, 12)
        .toString("base64");
    const isValidPassword = reqPassHash === user.password;

    if (!isValidPassword) {
        console.log(`Wrong Password: ${error}`);

        return res.status(400).json("Wrong Password");
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);

    //save refreshToken with the user.
    await UserService.updateTokenById(user.id, { refreshToken: refreshToken });

    const cookieOptions = {
        httpOnly: true,
        secure: false // make this dependant on NODE_ENV. should be false in dev, true in prod.
    };

    delete user.password;
    delete user.createdAt;

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
            message: "Login successful",
            user: user
        });
}

export async function generateAccessToken(user) {
    // const JWTSecret = process.env.JWT_TOKEN;
    // const JWTSecret = "randtoken";
    return jwt.sign({ id: user.id, email: user.email }, JWTSecret, {
        expiresIn: "20m"
    });
}
export async function generateRefreshToken(user) {
    // const JWTSecret = process.env.JWT_TOKEN;
    // const JWTSecret = "randtoken";

    return jwt.sign({ id: user.id }, JWTSecret, {
        expiresIn: "1hr"
    });
}
export async function generateAccessAndRefreshTokens(user) {
    /**
     * generate accessToken
     * generate refreshToken
     *
     * return {accessToken, refreshToken}
     */
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    return { accessToken, refreshToken };
}
export async function verifyTokenAndAttachUser(req, res, next) {
    /**
     * extract accessToken from req body.
     *  might be under Authorization header as Bearer Token
     *  might be under cookies.
     *  might be in query param
     *
     * If no token present,
     *  deny entry. return Error.
     *
     * decode the token using jwt.verify()
     * extract the id from the decoded token
     * use id to find user in db.
     *  if no user, return error.
     *
     * attach user obj to req.
     * call next().
     */
    const token =
        req.cookies?.accessToken ||
        req.query?.accessToken ||
        req.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
        console.log(`token not found`);

        return res.status(400).json("Not Authorized.");
    }

    //check if accessToken is in blacklist table
    let decoded;
    try {
        decoded = jwt.verify(token, JWTSecret);
    } catch (err) {
        console.log(`error: ${err}`);
    }

    const [user, error] = await UserService.getOne({
        where: { id: decoded.id },
        include: {
            UserProfiles: true
        }
    });

    if (error) {
        //check the error code and send appropriate response
        console.log(`No user found :Token Invalid error: ${error}`);

        return res.status(400).json(error);
    }

    req.user = user;
    next();
}

export async function AttachUserOrSilentFail(req, res, err) {
    /**
     * extract accessToken from req body.
     *  might be under Authorization header as Bearer Token
     *  might be under cookies.
     *  might be in query param
     *
     * If token present,
     * decode the token using jwt.verify()
     * extract the id from the decoded token
     *
     * attach user obj to req.
     * call next().
     */
    const token =
        req.cookies?.accessToken ||
        req.query?.accessToken ||
        req.get("Authorization")?.replace("Bearer ", "");

    const decoded = jwt.verify(token, "randtoken");
    const [user, error] = await UserService.getOne({
        where: { id: decoded.id },
        include: {
            UserProfiles: true
        }
    });

    if (user) req.user = user;

    next();
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

    const [_, error] = await UserService.updateTokenById(user.id, {
        refreshToken: null
    });

    if (error) {
        console.log(`Failed to Logout error: ${error}`);
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
        .json("Logout Successful");
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
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
        return res.status(400).json("Login again");
    }

    const decoded = jwt.verify(token, "randtoken");
    const [user, error] = await UserService.getOne({
        where: { id: decoded.id },
        omit: { refreshToken: false }
    });
    if (error) {
        console.log(`no user with provided token`);
        return res.status(400).json(error);
    }

    if (user.refreshToken !== token) {
        return res.status(400).json("refreshToken expired. Login again");
    }
    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);
    const cookieOptions = {
        httpOnly: true,
        secure: false
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json("refreshed");
}
