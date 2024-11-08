import { name } from "ejs";
import wlogger from "../../../logger/winston.logger.js";
import ProjectService from "../services/project.services.js";
import {
    dbCreateRating,
    dbFindRating,
    dbGetRating,
    dbUpdateRating
} from "../services/rating.services.js";
import { cleanDeep } from "../utils/helper.utils.js";
import { Role } from "@prisma/client";

export async function getProjects(req, res, err) {
    const { user } = req;
    // let ids = ;
    let id = parseInt(req.params.id);

    let { page, sort, order } = req.query;
    page = page ? page - 1 : 0;
    const take = 10;
    const skip = take * page;
    sort = sort ? sort : "createdAt";
    order = order ? order : "desc";
    let orderBy = [];
    let orderByObj = {};
    orderByObj[sort] = order;
    orderBy.push(orderByObj);
    let options = {
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
                    projectAssociations: {
                        where: {
                            userRole: Role.DEVELOPER
                        }
                    }
                }
            }
        },
        skip: skip,
        take: take,
        orderBy: orderBy
    };
    if (id) {
        options = { ...options, where: { id: id } };
        delete options.skip;
    }

    const clause = cleanDeep(options);

    const [result, total, error] = await ProjectService.getAll(clause);

    let body = result;
    if (error) {
        wlogger.error(`error: ${error}`);
        if (error.cause?.code == "ProjectDoesNotExist") {
            return res.status(404).json(error);
        }

        return res.status(500).json(error);
    }

    let templateName = "details/public.ejs";
    let path = "projects/item.ejs";
    let obj = { templateName: templateName };
    // projects/item.ejs, {templateName (role-specific path), project}
    // projects, {templateName: details/public, projects}
    if (id) {
        if (user) {
            switch (user.profiles[0].role) {
                case "DEVELOPER":
                    obj.templateName = "details/developer.ejs";
                    break;
                case "PROJECT_MANAGER":
                    obj.templateName = "details/project_manager.ejs";
                    break;
                case "REVIEWER":
                    obj.templateName = "details/reviewer.ejs";
                    break;
                case "ADMIN":
                    obj.templateName = "details/admin.ejs";
                    break;
                default:
                    obj.templateName = "details/public.ejs";
                    break;
            }
        }
        obj = { ...obj, project: body[0] };
    } else {
        path = "projects";
        obj = {
            ...obj,
            projects: body,
            total: Math.ceil(total / take),
            curPage: page + 1
        };
    }
    obj = { ...obj, user: user };

    return res.status(200).render(path, obj);
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
    const { id } = req.user;
    // const { eventId } = req.body;
    const eventId = projectDetails.eventId;
    const courseId = projectDetails.courseId;
    let privateAttachments = { url: [] };
    let publicAttachments = { url: [] };
    if (projectDetails.attachments) {
        for (const link of projectDetails.attachments.url) {
            if (link.name && link.address) {
                if (link.visibility == "private") {
                    privateAttachments.url.push(link);
                } else {
                    publicAttachments.url.push(link);
                }
            }
        }
    }
    //
    delete projectDetails.attachments;
    delete projectDetails.eventId;
    delete projectDetails.courseId;
    //

    projectDetails = {
        ...projectDetails,
        privateAttachments: privateAttachments,
        publicAttachments: publicAttachments,
        creator: { connect: { id: id } }
    };

    if (eventId) {
        projectDetails = {
            ...projectDetails,
            event: { connect: { id: eventId } }
        };
    }
    if (courseId) {
        projectDetails = {
            ...projectDetails,
            event: { connect: { id: courseId } }
        };
    }
    const details = cleanDeep(projectDetails);

    const [result, error] = await ProjectService.addOne(details);
    if (error) {
        wlogger.error(`error creating project: ${error}`);
        return res.status(400).json(error);
    }
    return res.redirect(`/api/v1/projects/${result.id}`);
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
    const projectId = req.params.id;
    wlogger.debug(`delete projectId: ${projectId}`);
    const [status, error] = await ProjectService.deleteOne(projectId);
    if (error) {
        if (error.cause?.code == "ProjectDoesNotExist") {
            res.status(404).json(error);
            return;
        }

        wlogger.error(`error deleting project: ${error}`);
        res.status(500).json(error);
        return;
    }
    res.redirect(303, "/api/v1/projects");
    return;
}

export async function getRating(req, res, err) {
    //doesn't make sense to get individual rating.
    // Get a rating for a project through getting the project
    const projectId = req.params.id;
    const [response, error] = await dbGetRating(projectId);
    if (error) {
        wlogger.error(`error in getRating: ${error}`);
        return res.status(500).json(error);
    }
    const ratings = response;
    wlogger.debug(`ratings: ${JSON.stringify(ratings)}`);
    return res.render("partials2/ratings.ejs", { ratings: ratings });
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

export async function getCreateProjectPage(req, res, err) {
    const { user } = req;
    return res.status(200).render("projects/create.ejs", { user: user });
}
export async function getProjectLinksForm(req, res, err) {
    const { index } = req.params;
    return res.status(200).render("partials2/forms/project.links.ejs", {
        index: index
    });
}

export async function getEditProjectForm(req, res, err) {
    const projectId = req.params.id;
    const [project, total, error] = await ProjectService.getAll({
        where: {
            id: projectId
        }
    });
    if (error) {
        wlogger.error(`error in getEditProjectForm: ${error}`);
        return res.status(500).json(error);
    }
    return res.status(200).render("projects/edit.ejs", {
        project: project[0]
    });
}
