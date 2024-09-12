import { PrismaClient } from "@prisma/client";
import { goStyleExceptionWrapper } from "../utils/wrapper.utils.js";
const prisma = new PrismaClient();

async function dbGetAllProjects() {
    const goFindAll = goStyleExceptionWrapper(prisma.project.findMany);
    const [response, error] = await goFindAll();
    return [response, error];
}

async function dbGetOneProject(data) {
    const goFindUnique = goStyleExceptionWrapper(prisma.project.findUnique);
    let [response, error] = await goFindUnique({
        where: {
            id: data.id
        }
    });

    if (response == null && !error) {
        //if broken here, it's an error thrown by developer.
        error = Error(`Project of id: ${data.id} does not exist`, {
            cause: { code: "ProjectDoesNotExist" }
        });
    }

    return [response, error];
}

async function dbAddProject(data) {
    // data is a projectObject. validation middleware handles format validation of data object.
    const goCreate = goStyleExceptionWrapper(prisma.project.create);
    const [response, error] = await goCreate({
        select: {
            id: true,
            name: true
        },
        data: data
    });
    return [response, error];
}

async function dbUpdateProject(data) {
    const goUpdate = goStyleExceptionWrapper(prisma.project.update);

    const [response, error] = await goUpdate({
        where: {
            id: data.id
        },
        data: data.project
    });
    return [response, error];
}

async function dbDeleteProject(data) {
    const goDelete = goStyleExceptionWrapper(prisma.project.delete);

    const [response, error] = await goDelete({
        where: {
            id: data.id
        }
    });
    return [response, error];
}

const ProjectService = {
    getOne: dbGetOneProject,
    getAll: dbGetAllProjects,
    addOne: dbAddProject,
    updateOne: dbUpdateProject,
    deleteOne: dbDeleteProject
};

export const getOneProject = dbGetOneProject;
export default ProjectService;
