import { Role } from "@prisma/client";
import { prisma } from "../services/main.services.js";
import { ProfileService, UserService } from "../services/user.services.js";
import jwt from "jsonwebtoken";
import wlogger from "../../../logger/winston.logger.js";
import { generateAccessAndRefreshTokens } from "../controllers/user.controllers.js";
const JWTSecret = "randtoken";

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
        wlogger.error(`token not found`);

        // return res.status(401).render("pages/login.ejs");
        return res
            .status(401)
            .json({ message: "Athentication token not found" });
    }

    //check if accessToken is in blacklist table
    let decoded;
    try {
        decoded = jwt.verify(token, "randtoken");
    } catch (err) {
        //Token expired
        wlogger.error(`error: ${err}`);
        if (error.name === "TokenExpiredError") {
            // return res.status(401).json({
            //     message:
            //         "Authentication token has expired, please call /refresh-token endpoint for refreshing your access token."
            // });
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
            const user_Id = decoded.id;
            const user = { id: user_Id };
            const { accessToken, refreshToken } =
                await generateAccessAndRefreshTokens(user, profile_id);
            wlogger.info(`Access Token refreshed in verifyTokenAndAttachUser`);

            res.cookie("accessToken", accessToken, options);
            res.cookie("refreshToken", refreshToken, options);
            return res.redirect(req.url);
        }
        return res.status(401).json({ message: "Invalid token" });
    }

    const [user, error] = await UserService.get({
        where: { id: decoded.id },
        include: {
            profiles: true
        }
    });

    if (error) {
        //Token valid but no such user found. Issue a redirect to the register page?
        wlogger.error(`No user found :Token Invalid error: ${error}`);
        return res.status(403).json({ message: "User Not Authorised" });
    }
    if (user.length > 1) {
        wlogger.error(`multiple users found`);
        return res.status(409).json("Multiple users found");
    }

    let userWithProfile = user[0];
    if (decoded.profile_id)
        userWithProfile = {
            ...userWithProfile,
            profile_id: decoded.profile_id
        };
    req.user = userWithProfile;
    next();
}

export async function attachUserOrSilentFail(req, res, next) {
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

    if (token) {
        let decoded;
        try {
            decoded = jwt.verify(token, "randtoken");
        } catch (error) {
            wlogger.error("Error in verifying token", error);
            if (error.name === "TokenExpiredError") {
                // return res.status(401).json({
                //     message:
                //         "Authentication token has expired, please call /refresh-token endpoint for refreshing your access token."
                // });
                const options = {
                    httpOnly: true,
                    secure: false
                };
                const token =
                    req.cookies?.refreshToken || req.body.refreshToken;
                // if (!token) {
                //     // no refreshToken found in cookies or authorization header. redirect to login
                //     return res
                //         .clearCookie("accessToken", options)
                //         .redirect("/api/v1/users/login"); // redirect to login page.
                // }

                if (token) {
                    let decoded = undefined;
                    try {
                        decoded = jwt.verify(token, "randtoken");
                    } catch (err) {
                        wlogger.error(`error: ${err}`);
                        // return res
                        //     .clearCookie("accessToken", options)
                        //     .clearCookie("refreshToken", options)
                        //     .redirect("/api/v1/users/login"); // redirect to login page.
                    }

                    const profile_id = decoded.profile_id;
                    const user_Id = decoded.id;
                    const user = { id: user_Id };
                    const { accessToken, refreshToken } =
                        await generateAccessAndRefreshTokens(user, profile_id);

                    wlogger.info(
                        `Access Token refreshed in attachUserOrSilentFail`
                    );

                    res.cookie("accessToken", accessToken, options);
                    res.cookie("refreshToken", refreshToken, options);
                    return res.redirect(req.url);
                }
            }
        }

        if (decoded) {
            const [user, error] = await UserService.getUnique({
                where: { id: decoded.id },
                include: {
                    profiles: {
                        where: {
                            id: decoded.profile_id
                        }
                    }
                }
            });
            if (error) {
                wlogger.error(`error: ${error}`);
            }
            if (user) {
                let userWithProfile = user;
                if (decoded.profile_id)
                    userWithProfile = {
                        ...userWithProfile,
                        profile_id: decoded.profile_id
                    };
                req.user = userWithProfile;
            }
        }
    }

    next();
}
