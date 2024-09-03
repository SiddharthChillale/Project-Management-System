import projects from "../../../test/mock/project.js";
let _projects = projects;

export function getProjects(req, res, err) {
    let body = {};
    if (req.query?.id) {
        if (req.query.id > 5) {
            res.status(404).send({});
            return;
        }
        body = _projects[req.query.id];
    } else body = _projects;
    res.status(200).send(body);
}

export function addProject(req, res, err) {
    const project = req.body.project;
    _projects.push(project);
    const pid = { project_id: _projects.length - 1 };
    res.status(200).send(pid);
}

export function editProject(req, res, err) {
    const pid = req.query.id;
    _projects[pid] = req.body.project;
    res.status(200).send(_projects[pid]);
}

export function deleteProject(req, res, err) {
    const pid = req.query.id;
    res.status(200).send({ id: pid });
}
