import { PrismaClient } from "@prisma/client";
import { goStyleExceptionWrapper } from "../utils/wrapper.utils.js";

export const prisma = new PrismaClient({
    omit: {
        user: {
            password: true,
            refreshToken: true,
            updatedAt: true
        }
    }
});

async function dbGetAllUsers(filterClause) {
    const goGetAll = goStyleExceptionWrapper(prisma.user.findMany);
    const [result, error] = await goGetAll(filterClause);
    return [result, error];
}

async function dbGetOneUser(filterClause) {
    const goGetOne = goStyleExceptionWrapper(prisma.user.findUniqueOrThrow);

    const [result, error] = await goGetOne(filterClause);
    return [result, error];
}
async function dbGetFirstUser(filterClause) {
    const goFindOne = goStyleExceptionWrapper(prisma.user.findFirstOrThrow);

    const [result, error] = await goFindOne(filterClause);
    return [result, error];
}
async function dbAddUser(email, salt, encryptedPassword) {
    const goCreate = goStyleExceptionWrapper(prisma.user.create);

    const [response, error] = await goCreate({
        select: {
            id: true
        },
        data: {
            email: email,
            salt: salt,
            password: encryptedPassword
        }
    });
    return [response, error];
}

async function dbUpdateTokenByUserId(id, data) {
    const goUpdate = goStyleExceptionWrapper(prisma.user.update);

    const [response, error] = await goUpdate({
        where: {
            id: id
        },
        data: data
    });
    return [response, error];
}

async function dbUpdateUserProfileById(id, data) {
    const goUpdate = goStyleExceptionWrapper(prisma.userProfile.update);

    const [response, error] = await goUpdate({
        where: {
            userId: id,
            id: data.profile_id
        },
        data: {
            socialLinks: data.socialLinks,
            userName: data.userName
        }
    });
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

const UserService = {
    getOne: dbGetOneUser,
    getAll: dbGetAllUsers,
    findOne: dbGetFirstUser,
    updateOneById: dbUpdateUserProfileById,
    updateTokenById: dbUpdateTokenByUserId,
    deleteOneById: dbDeleteUserById,
    register: dbAddUser
};

export default UserService;
