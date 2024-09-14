import { Role } from "@prisma/client";
import EventService from "../services/event.services.js";
import { ProfileService } from "../services/user.services.js";
import ProjectService from "../services/project.services.js";
import { cleanDeep } from "../utils/helper.utils.js";

export async function createEvent(req, res, err) {
    const { name, startDate, endDate } = req.body;
    const creatorId = req.user.id;
    const participantIdArray = req.body;

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
            console.log(`error: ${error}`);

            return res.status(500).json(error);
        }

        if (result.length != participantIdArray.length) {
            const error_message = `participants provided do not have role: ${Role.REVIEWER}`;
            console.log(error_message);
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
        console.log(`error creating events: ${error}`);
        return res.status(500).json(error);
    }

    return res
        .status(200)
        .json({ message: "succesful event creation", response });
}

export async function getEvents(req, res, err) {
    const { id } = req.params;
    const { date } = req.query;

    let options = {
        where: {
            id: id,
            startDate: {
                lte: date
            },
            endDate: {
                gte: data
            }
        }
    };
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
    const [result, error] = await EventService.findMany({ where: options });

    if (error) {
        console.log(`error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(result);
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
            console.log(`error: ${error}`);

            return res.status(500).json(error);
        }

        if (result.length != participantIdArray.length) {
            const error_message = `participants provided do not have role: ${Role.REVIEWER}`;
            console.log(error_message);
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
            console.log(`Event Update error: ${error}`);
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
        console.log(`error updating events: ${error}`);
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
        console.log(`error deleting events: ${error}`);
        return res.status(500).json(error);
    }

    return res
        .status(200)
        .json({ message: "succesful event deletion", response });
}
