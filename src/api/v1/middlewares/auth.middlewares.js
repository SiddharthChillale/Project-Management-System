import { Role } from "@prisma/client";
import { prisma } from "../services/main.services.js";
import { ProfileService, UserService } from "../services/user.services.js";
import jwt from "jsonwebtoken";
import wlogger from "../../../logger/winston.logger.js";

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

        return res.status(400).json("Not Authorized.");
    }

    //check if accessToken is in blacklist table
    let decoded;
    try {
        decoded = jwt.verify(token, JWTSecret);
    } catch (err) {
        wlogger.error(`error: ${err}`);
    }

    const [user, error] = await UserService.get({
        where: { id: decoded.id },
        include: {
            profiles: true
        }
    });

    if (error) {
        //check the error code and send appropriate response
        wlogger.error(`No user found :Token Invalid error: ${error}`);

        return res.status(400).json(error);
    }

    req.user = user;
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

    const decoded = jwt.verify(token, "randtoken");
    const [user, error] = await UserService.get({
        where: { id: decoded.id },
        include: {
            profiles: true
        }
    });

    if (user) req.user = user;

    next();
}
