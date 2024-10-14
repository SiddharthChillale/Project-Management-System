import { Role } from "@prisma/client";
import EventService from "../services/event.services.js";
import { ProfileService } from "../services/user.services.js";
import ProjectService from "../services/project.services.js";
import { cleanDeep } from "../utils/helper.utils.js";
import wlogger from "../../../logger/winston.logger.js";

export async function createEvent(req, res, err) {
    const { name, startDate, endDate } = req.body;
    const creatorId = req.user.profiles[0].id;
    const { user } = req;
    const { participantIdArray } = req.body;

    let createData = {
        name: name,
        startDate: startDate,
        endDate: endDate,
        creator: {
            connect: { id: creatorId }
        }
    };

    if (participantIdArray && participantIdArray.length != 0) {
        //check if participants exists for all given Ids
        const [result, error] = await ProfileService.findAll({
            select: {
                id: true
            },
            where: {
                id: { in: participantIdArray },
                role: Role.REVIEWER
            }
        });
        if (error) {
            wlogger.error(`error: ${error}`);

            return res.status(500).json(error);
        }

        if (result.length != participantIdArray.length) {
            wlogger.error(
                `participants provided do not have role: ${Role.REVIEWER}`
            );
            return res.status(409).json({
                message: error_message,
                present: result,
                required: participantIdArray
            });
        }

        createData = {
            ...createData,
            participants: {
                connect: participantIdArray
            }
        };
    }

    const [response, error] = await EventService.create(createData);

    if (error) {
        wlogger.error(`error creating events: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).redirect("/api/v1/events");
}

export async function getEvents(req, res, err) {
    const { id } = req.params;
    const { user } = req;
    const { date } = req.query;
    const { includeAdditional = false } = req.query;
    let options = {
        where: {
            id: id,
            startDate: {
                lte: date
            },
            endDate: {
                gte: date
            }
        }
    };
    if (includeAdditional) {
        options = {
            ...options,
            include: {
                projects: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        email: true,
                        userName: true
                    }
                },
                creator: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        };
    }
    // if (id) {
    //     options = { ...options, id: id };
    // }
    // if (date) {
    //     options = {
    //         ...options,
    //         startDate: {
    //             lte: date
    //         },
    //         endDate: {
    //             gte: date
    //         }
    //     };
    // }
    options = cleanDeep(options);
    const [result, error] = await EventService.findMany(options);
    if (error) {
        wlogger.error(`error: ${error}`);
        return res.status(500).json(error);
    }

    if (result.length == 0) {
        return res.status(404).json({ message: "No Events" });
    }
    if (id) {
        return res.status(200).render("events/detail.ejs", {
            event: result[0],
            user: user ? user : undefined
        });
    }

    return res
        .status(200)
        .render("events", { events: result, user: user ? user : undefined });
}

export async function editEvent(req, res, err) {
    const { id } = req.params;
    const { name, startDate, endDate, participantIdArray, projectIdArray } =
        req.body;

    let updateData = {
        name: name,
        startDate: startDate,
        endDate: endDate
    };
    updateData = cleanDeep(updateData);
    // if (name) {
    //     updateData = { name: name, ...updateData };
    // }
    // if (startDate) {
    //     updateData = { startDate: startDate, ...updateData };
    // }
    // if (endDate) {
    //     updateData = { endDate: endDate, ...updateData };
    // }

    if (participantIdArray && participantIdArray.length != 0) {
        //check if participants exists for all given Ids
        const [result, error] = ProfileService.findAll({
            select: {
                id: true
            },
            where: {
                id: { in: participantIdArray },
                role: Role.REVIEWER
            }
        });
        if (error) {
            wlogger.error(`error: ${error}`);

            return res.status(500).json(error);
        }

        if (result.length != participantIdArray.length) {
            const error_message = `participants provided do not have role: ${Role.REVIEWER}`;
            wlogger.error(error_message);
            return res.status(409).json({
                message: error_message,
                present: result,
                required: participantIdArray
            });
        }

        updateData = {
            ...updateData,
            participants: {
                connect: participantIdArray
            }
        };
    }

    if (projectIdArray && projectIdArray != 0) {
        const [response, error] = await ProjectService.getAll({
            select: {
                id: true
            },
            where: {
                id: { in: projectIdArray },
                event: { isEmpty: true }
            }
        });
        if (error || response.length != projectIdArray) {
            wlogger.error(`Event Update error: ${error}`);
            return res.status(450).json({
                message:
                    "Projects selected are already associated to a different event or some other error",
                error: error
            });
        }

        updateData = { ...updateData, projects: { connect: projectIdArray } };
    }
    const [response, error] = await EventService.updateById(id, updateData);

    if (error) {
        wlogger.error(`error updating events: ${error}`);
        return res.status(500).json(error);
    }

    return res
        .status(200)
        .json({ message: "succesful event update", response });
}

export async function deleteEvent(req, res, err) {
    const { id } = req.params;

    const [response, error] = await EventService.delete({
        where: {
            id: id
        }
    });

    if (error) {
        wlogger.error(`error deleting events: ${error}`);
        return res.status(500).json(error);
    }

    return res.redirect(303, "/api/v1/events");
}

export async function getCreateForm(req, res, err) {
    const { user } = req;
    return res.render("events/create", { user });
}

export async function getEditForm(req, res, err) {
    const { user } = req;
    const { id } = req.params;

    const options = {
        where: {
            id: id
        }
    };
    let [event, error] = await EventService.findMany(options);
    if (error) {
        wlogger.error(`error in getEditForm: ${error}`);
        return res.status(500).json(error);
    }
    const a = event[0].startDate;
    const b = event[0].startDate.toISOString().split(".")[0];
    const c = event[0].endDate.toISOString().split(".")[0];

    event[0].startDate = b;
    event[0].endDate = c;

    return res.render("events/edit", { event: event[0], user: user });
}

export async function searchEvents(req, res, err) {
    const { search } = req.query;
    const [response, error] = await EventService.findMany();
    if (error) {
        wlogger.error(`error in searchEvents: ${error}`);
        return res.status(500).json(error);
    }
    return res.render("events/search.ejs", { events: response });
}
