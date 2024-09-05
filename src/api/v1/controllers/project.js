import ProjectService from "../services/project.js";

export async function getProjects(req, res, err) {
    let body = {};
    let error;
    if (req.params?.id) {
        [body, error] = await ProjectService.getOne({ id: req.params.id });
    } else {
        [body, error] = await ProjectService.getAll();
    }
    res.status(200).send(body);
}

export async function addProject(req, res, err) {
    const project = req.body.project;
    const [pid, error] = await ProjectService.addOne(project);
    res.status(200).send(pid);
}

export async function editProject(req, res, err) {
    const data = {
        id: req.params.id,
        project: req.body.project
    };
    const [status, error] = await ProjectService.updateOne(data);
    res.status(200).send(status);
}

export async function deleteProject(req, res, err) {
    const pid = req.params.id;
    const [status, error] = await ProjectService.deleteOne({ id: pid });
    res.status(200).send(status);
}
