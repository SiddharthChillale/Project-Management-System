import projects from "../../../test/mock/project.js";
import ProjectDB from "../services/project.js";
let _projects = projects;

export async function getProjects(req, res, err) {
    let body = {};
    if (req.query?.id) {
        body = await ProjectDB.get({ id: req.query.id });
    } else {
        body = await ProjectDB.getAll();
    }
    res.status(200).send(body);
}

export async function addProject(req, res, err) {
    const project = req.body.project;
    const pid = await ProjectDB.add(project);
    res.status(200).send(pid);
}

export async function editProject(req, res, err) {
    const data = {
        id: req.query.id,
        project: req.body.project
    };
    const status = await ProjectDB.updateOne(data);
    res.status(200).send(status);
}

export async function deleteProject(req, res, err) {
    const pid = req.query.id;
    const status = await ProjectDB.delete({ id: pid });
    res.status(200).send(status);
}
