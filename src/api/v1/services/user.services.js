import { PrismaClient } from "@prisma/client";
import { goStyleExceptionWrapper } from "../utils/wrapper.utils.js";

const prisma = new PrismaClient();

async function dbGetAllUsers(data) {
    const goGetAll = goStyleExceptionWrapper(prisma.users.findMany);
    const [result, error] = await goGetAll();
    return [result, error];
}

async function dbGetOneUser(data) {
    const goGetOne = goStyleExceptionWrapper(prisma.users.findUnique);
    let [result, error] = await goGetOne({
        where: { id: data.id }
    });
    if (result == null && !error) {
        error = Error(`User of id:${data.id} does not exists`, {
            cause: { code: "UserDoesNotExist" }
        });
    }
    return [result, error];
}

async function dbAddUser(data) {
    // data is a userObject. validation middleware handles format validation of data object.
    const goCreate = goStyleExceptionWrapper(prisma.users.create);
    const [response, error] = await goCreate({
        select: {
            id: true,
            userName: true
        },
        data: data
    });
    return [response, error];
}

async function dbUpdateUser(data) {
    const goUpdate = goStyleExceptionWrapper(prisma.users.update);

    const [response, error] = await goUpdate({
        where: {
            id: data.id
        },
        data: data.user
    });
    return [response, error];
}

async function dbDeleteUser(data) {
    const goDelete = goStyleExceptionWrapper(prisma.users.delete);

    const [response, error] = await goDelete({
        where: {
            id: data.id
        }
    });
    return [response, error];
}

const UserService = {
    getOne: dbGetOneUser,
    getAll: dbGetAllUsers,
    addOne: dbAddUser,
    updateOne: dbUpdateUser,
    deleteOne: dbDeleteUser
};

export default UserService;
