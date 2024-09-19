import { goStyleExceptionWrapper } from "../utils/wrapper.utils.js";
import { prisma } from "./main.services.js";

export async function dbCreateEvent(data) {
    const goCreateEvent = goStyleExceptionWrapper(prisma.event.create);
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
    const goFindMany = goStyleExceptionWrapper(prisma.event.findMany);
    const [response, error] = await goFindMany(clause);
    return [response, error];
}

const EventService = {
    findMany: dbFindEvents,
    create: dbCreateEvent,
    updateById: dbUpdateEventById,
    delete: dbDeleteEvent
};

export default EventService;
