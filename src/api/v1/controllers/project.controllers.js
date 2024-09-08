import ProjectService from "../services/project.services.js";

export async function getProjects(req, res, err) {
    let body = {};
    let error;
    if (req.params?.id) {
        [body, error] = await ProjectService.getOne({ id: req.params.id });
    } else {
        [body, error] = await ProjectService.getAll();
    }

    if (error) {
        if (error.cause?.code == "ProjectDoesNotExist") {
            res.status(404).json(error);
            return;
        }

        res.status(500).json(error);
        return;
    }

    res.status(200).json(body);
    return;
}

export async function addProject(req, res, err) {
    // should be able to add multiple projects since the URI doesn't specify operation on one particular project
    // TODO: allow insertion of multiple projects.
    const project = req.body.project;
    const [pid, error] = await ProjectService.addOne(project);
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).json(pid);
    return;
}

export async function editProject(req, res, err) {
    const data = {
        id: req.params.id,
        project: req.body.project
    };
    const [status, error] = await ProjectService.updateOne(data);
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).json(status);
    return;
}

export async function deleteProject(req, res, err) {
    const pid = req.params.id;
    const [status, error] = await ProjectService.deleteOne({ id: pid });
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).json(status);
    return;
}
