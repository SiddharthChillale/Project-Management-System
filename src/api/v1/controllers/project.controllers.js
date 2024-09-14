import ProjectService from "../services/project.services.js";
import { cleanDeep } from "../utils/helper.utils.js";

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
    let projectDetails = req.body.project;
    const { id } = req.user.id;
    const { eventId } = req.body;
    projectDetails = {
        ...projectDetails,
        creator: { connect: { id: id } },
        event: { connect: { id: eventId } }
    };
    details = cleanDeep(projectDetails);
    // if (eventId) {
    //     projectDetails = {
    //         ...projectDetails,
    //         event: { connect: { id: eventId } }
    //     };
    // }
    const [pid, error] = await ProjectService.addOne(details);
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).json(pid);
    return;
}

export async function editProject(req, res, err) {
    let projectDetails = req.body.project;
    let data = {
        id: req.params.id
    };

    const { eventId } = req.body;

    if (eventId) {
        projectDetails = {
            ...projectDetails,
            event: { connect: { id: eventId } }
        };
    }

    data = { ...data, project: projectDetails };
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
