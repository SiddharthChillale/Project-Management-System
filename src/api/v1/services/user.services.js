import { PrismaClient } from "@prisma/client";
import { goStyleExceptionWrapper } from "../utils/wrapper.utils.js";

export const prisma = new PrismaClient({
    omit: {
        users: {
            password: true,
            refreshToken: true,
            updatedAt: true
        }
    }
});

// const xprisma = prisma.$extends({
//     name: "tokenizer",
//     model:{
//         user:{
//             async generateAccessToken() {

//             },
//             async generaterefreshToken(){

//             }
//         }
//     }
// })

async function dbGetAllUsers(filterClause) {
    const goGetAll = goStyleExceptionWrapper(prisma.users.findMany);
    const [result, error] = await goGetAll(filterClause);
    return [result, error];
}

async function dbGetOneUser(filterClause) {
    const goGetOne = goStyleExceptionWrapper(prisma.users.findUniqueOrThrow);

    const [result, error] = await goGetOne(filterClause);
    return [result, error];
}
async function dbGetFirstUser(filterClause) {
    const goFindOne = goStyleExceptionWrapper(prisma.users.findFirstOrThrow);

    const [result, error] = await goFindOne(filterClause);
    return [result, error];
}
async function dbAddUser(email, encryptedPassword) {
    const userName = email.split("@")[0];
    const goCreate = goStyleExceptionWrapper(prisma.users.create);

    const [response, error] = await goCreate({
        select: {
            id: true,
            userName: true
        },
        data: {
            email: email,
            userName: userName,
            password: encryptedPassword
        }
    });
    return [response, error];
}

async function dbUpdateUserById(id, data) {
    const goUpdate = goStyleExceptionWrapper(prisma.users.update);

    const [response, error] = await goUpdate({
        where: {
            id: id
        },
        data: data
    });
    return [response, error];
}

async function dbDeleteUserById(id) {
    const goDelete = goStyleExceptionWrapper(prisma.users.delete);

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
    updateOneById: dbUpdateUserById,
    deleteOneById: dbDeleteUserById,
    register: dbAddUser
};

export default UserService;
