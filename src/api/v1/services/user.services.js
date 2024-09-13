import { PrismaClient } from "@prisma/client";
import { goStyleExceptionWrapper } from "../utils/wrapper.utils.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import assert from "node:assert";
export const prisma = new PrismaClient({
    omit: {
        user: {
            password: true,
            refreshToken: true,
            oneTimeToken: true,
            updatedAt: true
        }
    }
});

async function dbGetUsers(filterClause) {
    const goGetAll = goStyleExceptionWrapper(prisma.user.findMany);
    const [result, error] = await goGetAll(filterClause);
    return [result, error];
}

//meant for self-registering users, returns id created
async function dbCreateUser(email, password) {
    const salt = "salt";
    const hashedPassword = crypto
        .scryptSync(password, salt, 12)
        .toString("base64");

    const goCreate = goStyleExceptionWrapper(prisma.user.create);

    let response, error;

    [response, error] = await goCreate({
        select: {
            id: true
        },
        data: {
            email: email,
            salt: salt,
            password: hashedPassword
        }
    });

    return [response, error];
}

//meant for bulk creating users, or creating individual user with oneTimeToken. can create
//TODO
export async function generateOneTimeToken(email) {
    // const JWTSecret = process.env.JWT_TOKEN;
    const JWTSecret = "randtoken";
    let ott;
    try {
        ott = jwt.sign({ email: email }, JWTSecret, {
            expiresIn: "7 days"
        });
    } catch (error) {
        console.log(`${error}`);
    }
    return ott;
}

async function dbCreateUsersForOTToken(dataArray) {
    // dataArray is array of [{email, ...whatever else}]

    let userArray = [];
    for (const data of dataArray) {
        const ott = await generateOneTimeToken(data.email);
        userArray.push({ email: data.email, password: ott, oneTimeToken: ott });
    }

    assert(userArray.length != 0, "email array empty");

    const goCreateMany = goStyleExceptionWrapper(
        prisma.user.createManyAndReturn
    );

    const [response, error] = await goCreateMany({
        select: {
            id: true,
            email: true,
            oneTimeToken: true
        },
        data: userArray
    });

    if (error) {
        console.log(`error in bulk creation: ${error}`);

        return [response, error];
    }
    assert(
        response.length == userArray.length,
        "output length doesn't match input length "
    );

    return [response, error];
    // map tokens to their ids
    // create a UserProfile for each user if role is defined.
    // return token array
}

async function dbUpdateTokenById(id, tokenType, newToken) {
    const goUpdate = goStyleExceptionWrapper(prisma.user.update);

    let response, error;
    if (tokenType === "refreshToken") {
        [response, error] = await goUpdate({
            where: {
                id: id
            },
            data: {
                refreshToken: newToken
            }
        });
    } else if (tokenType === "oneTimeToken") {
        [response, error] = await goUpdate({
            where: {
                id: id
            },
            data: {
                oneTimeToken: newToken
            }
        });
    }
    return [response, error];
}

async function dbDeleteUserById(id) {
    const goDelete = goStyleExceptionWrapper(prisma.user.delete);

    const [response, error] = await goDelete({
        where: {
            id: id
        }
    });
    return [response, error];
}
/** getting a user means getting email, onetimetoken, password, and refreshtoken
 *
 *
 * get users by id/email/refreshToken/onetimeToken (one-finduniqueorthrow) (many-findmany) (with all profiles or a particular profile)
 * dbGetUsers(data:{id/email/tokens}, options:{with-profiles})
 * get one profile by (profile-id)/(profile-id+userId)/role/email (findmany) (with courses/ projects/ events)
 * dbGetProfile(data:{profile-id/ profile-id+userId/ role/ email}, options:{with courses, projects/ events})
 *
 * dbCreateUser(email, password)=>return none.
 * add users by self-register (email+password) - no profile created
 *
 * dbCreateUsersForToken([email,password], role:optional)=>return [onetimetoken]
 * add 1 users by other user (email+password)=>returns onetimetoken.
 * add 1 users by other user with role (email+password+role)=>returns onetimetoken
 * add n users by other user ([email, password])=>([onetimetoken])
 * add n users by other user with role (role + [email, password])=>([onetimetoken])
 *
 * dbUpdateUsers - cannot update fields other than refreshToken and oneTimeToken
 * dbUpdateTokensById(id, tokentype, newtoken) - changes the token provided for user with id:id
 *
 * dbDeleteUserById(id) - deletes user-->cascade delete profiles of user-->cascade delete project-associations of profiles
 *
 *
 * dbCreateProfile(userId, role)=>profile-id - Creates a new Profile and and Connects it to a user with id:userId. returns profile-id
 * dbUpdateProfile(profile-id, data)=>updated-profile - updates a profile. email, userId are not updatedable.
 * dbDeleteProfile(profile-id)=>deletes a profile iff all its children are deleted.
 *
 *
 *
 */

// ProfileService functions

/**
 *
 * Used when a user with id `id` exists and the creator wants to create a new user-profile with the role `role`.
 *
 *
 * */

async function dbCreateProfile(email, id, role) {
    const goUserCreateProfile = goStyleExceptionWrapper(
        prisma.userProfile.create
    );

    const [response, error] = await goUserCreateProfile({
        data: {
            email: email,
            role: role,
            userName: email.split("@")[0],
            user: {
                connect: {
                    id: id
                }
            }
        }
    });

    return [response, error];
}

async function dbFindFirstProfile(filterClause) {
    const goFindOne = goStyleExceptionWrapper(
        prisma.userProfile.findFirstOrThrow
    );

    const [result, error] = await goFindOne(filterClause);
    return [result, error];
}

async function dbUpdateProfileById(profile_id, data) {
    const goUpdate = goStyleExceptionWrapper(prisma.userProfile.update);

    const [response, error] = await goUpdate({
        where: {
            id: profile_id
        },
        data: data
    });
    return [response, error];
}

async function dbDeleteProfileById(profile_id) {
    const goDelete = goStyleExceptionWrapper(prisma.userProfile.delete);

    const [response, error] = await goDelete({
        where: {
            id: profile_id
        }
    });
    return [response, error];
}
/**
 * get one user
 * get a profile of one user
 *
 */
export const UserService = {
    get: dbGetUsers,
    create: dbCreateUser,
    createForToken: dbCreateUsersForOTToken,
    updateTokenById: dbUpdateTokenById,
    deleteById: dbDeleteUserById
};

export const ProfileService = {
    create: dbCreateProfile,
    findOne: dbFindFirstProfile,
    update: dbUpdateProfileById,
    delete: dbDeleteProfileById
};
