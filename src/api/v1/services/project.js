import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function dbGetAllProjects() {
    const projects = await prisma.projects.findMany();
    return projects;
}

async function dbGetOneProject(data) {
    const project = await prisma.projects.findUnique({
        where: {
            id: data.id
        }
    });
    return project;
}

async function dbAddProject(data) {
    // data is a projectObject. validation middleware handles format validation of data object.
    const addedProject = await prisma.projects.create({
        select: {
            id: true,
            name: true
        },
        data: data
    });
    return addedProject;
}

async function dbUpdateProject(data) {
    const status = await prisma.projects.update({
        where: {
            id: data.id
        },
        data: data.project
    });
    return status;
}

async function dbDeleteProject(data) {
    const status = await prisma.projects.delete({
        where: {
            id: data.id
        }
    });
    return status;
}
const ProjectDB = {
    add: dbAddProject,
    getAll: dbGetAllProjects,
    get: dbGetOneProject,
    updateOne: dbUpdateProject,
    delete: dbDeleteProject
};

export default ProjectDB;
