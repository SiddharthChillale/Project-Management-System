import wlogger from "../../../logger/winston.logger.js";
import { goStyleExceptionWrapper } from "../utils/wrapper.utils.js";
import { prisma } from "./main.services.js";

export async function dbCreateEvent(data) {
    const goCreateEvent = goStyleExceptionWrapper(prisma.event.create);

    let sD = new Date(data.startDate);
    let eD = new Date(data.endDate);

    sD.setSeconds(0);
    eD.setSeconds(0);
    data.startDate = sD.toISOString();
    data.endDate = eD.toISOString();

    const [response, error] = await goCreateEvent({
        data: data
    });
    return [response, error];
}

export async function dbUpdateEventById(eventId, data) {
    const goUpdateEvent = goStyleExceptionWrapper(prisma.event.update);
    const [response, error] = await goUpdateEvent({
        where: {
            id: eventId
        },
        data: data
    });
    return [response, error];
}

export async function dbFindEvents(clause) {
    const goFindMany = goStyleExceptionWrapper(prisma.event.findMany);
    const [response, error] = await goFindMany(clause);
    return [response, error];
}

export async function dbDeleteEvent(clause) {
    const goDelete = goStyleExceptionWrapper(prisma.event.delete);
    const [response, error] = await goDelete(clause);
    return [response, error];
}

const EventService = {
    findMany: dbFindEvents,
    create: dbCreateEvent,
    updateById: dbUpdateEventById,
    delete: dbDeleteEvent
};

export default EventService;
