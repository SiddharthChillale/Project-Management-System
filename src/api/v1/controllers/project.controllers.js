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
    let { page } = req.query;
    page = page ? page - 1 : 0;
    const take = 10;
    const skip = take * page;

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
        },
        skip: skip,
        take: take
    };
    if (id) {
        delete options.skip;
    }
    const clause = cleanDeep(options);

    const [result, error] = await ProjectService.getAll(clause);
    let body = result;
    if (error) {
        if (error.cause?.code == "ProjectDoesNotExist") {
            res.status(404).json(error);
            return;
        }
        wlogger.error(`error: ${error}`);
        return res.status(500).json(error);
    }
    const a = JSON.stringify(body[0]);

    // body[0] = cleanDeep(body[0]);
    // const b = JSON.stringify(body[0]);
    //
    for (let project of body) {
        if (
            project.event &&
            project.event != null &&
            project.event != undefined
        ) {
            project.event.startDate = convertToReadableDate(
                project.event.startDate
            );
            project.event.endDate = convertToReadableDate(
                project.event.endDate
            );
        }
        project.createdAt = convertToReadableDate(project.createdAt);
        project.updatedAt = convertToReadableDate(project.updatedAt);
    }

    if (id) {
        return res.status(200).render("pages/one-project.ejs", {
            project: body[0]
        });
    }
    return res.status(200).render("pages/projects.ejs", { projects: body });
}

function convertToReadableDate(ISOdate) {
    const date = ISOdate;

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const readableDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const readableTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return [readableDate, readableTime];
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
    const { user } = req;
    const { profileId } = user.profiles.find(
        (profile) => profile.role == Role.REVIEWER
    ).id;
    const { projectId } = req.params.id;
    const { score, scoreCategoryId } = req.body;
    const [response, error] = await dbCreateRating(
        profileId,
        projectId,
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
    const { score, ratingId } = req.body;
    const [response, error] = await dbUpdateRating(ratingId, score);
    if (error) {
        wlogger.error(`error updating Rating: ${error}`);
        return res.status(409).json(error);
    }
    return res.status(200).json(response);
}
export async function deleteRating(req, res, err) {
    const { ratingId } = req.body;
    const [response, error] = await dbUpdateRating(ratingId);
    if (error) {
        wlogger.error(`error deleting Rating: ${error}`);
        return res.status(409).json(error);
    }
    return res.status(200).json(response);
}
