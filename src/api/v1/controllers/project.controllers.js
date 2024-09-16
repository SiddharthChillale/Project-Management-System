import wlogger from "../../../logger/winston.logger.js";
import ProjectService from "../services/project.services.js";
import {
    dbCreateRating,
    dbFindRating,
    dbUpdateRating
} from "../services/rating.services.js";
import { cleanDeep } from "../utils/helper.utils.js";

export async function getProjects(req, res, err) {
    const { id } = req.params;

    let options = {
        where: {
            id: id
        },
        include: {
            ratings: true,
            event: true,
            course: true,
            creator: {
                select: {
                    email: true
                }
            },
            _count: {
                select: {
                    projectAssociations: true
                }
            }
        }
    };

    const clause = cleanDeep(options);
    const [body, error] = await ProjectService.getAll(clause);

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

export async function getRating(req, res, err) {
    //doesn't make sense to get individual rating.
    // Get a rating for a project through getting the project
}

export async function addRating(req, res, err) {
    const { user } = req.user;
    const { profile_id } = user.profiles.find(
        (profile) => profile.role == Role.REVIEWER
    ).id;
    const { project_id } = req.params.id;
    const { score, scoreCategoryId } = req.body;
    const [response, error] = await dbCreateRating(
        profile_id,
        project_id,
        score,
        scoreCategoryId
    );

    if (error) {
        wlogger.error(`error creating Rating: ${error}`);
        return res.status(409).json(error);
    }

    return res.status(200).json(response);
}
export async function updateRating(req, res, err) {
    const { score, rating_id } = req.body;
    const [response, error] = await dbUpdateRating(rating_id, score);
    if (error) {
        wlogger.error(`error updating Rating: ${error}`);
        return res.status(409).json(error);
    }
    return res.status(200).json(response);
}
export async function deleteRating(req, res, err) {
    const { rating_id } = req.body;
    const [response, error] = await dbUpdateRating(rating_id);
    if (error) {
        wlogger.error(`error deleting Rating: ${error}`);
        return res.status(409).json(error);
    }
    return res.status(200).json(response);
}
