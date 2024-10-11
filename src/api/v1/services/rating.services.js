import { goStyleExceptionWrapper } from "../utils/wrapper.utils.js";
import { prisma } from "./main.services.js";

export async function dbCreateRating(
    profileId,
    projectId,
    score,
    scoreCategoryId
) {
    const goScore = goStyleExceptionWrapper(prisma.ratings.create);
    const [response, error] = await goScore({
        data: {
            score: score
        },
        connect: {
            userProfile: {
                id: profileId
            },
            project: {
                id: projectId
            },
            scoreCategory: {
                id: scoreCategoryId
            }
        }
    });

    return [response, error];
}

export async function dbUpdateRating(ratingId, newScore) {
    const goUpdateScore = goStyleExceptionWrapper(prisma.ratings.update);
    const [response, error] = await goUpdateScore({
        where: {
            id: ratingId
        },
        data: {
            score: newScore
        }
    });

    return [response, error];
}

export async function dbDeleteRating(ratingId) {
    const goDelScore = goStyleExceptionWrapper(prisma.ratings.delete);
    const [response, error] = await goDelScore({
        where: {
            id: ratingId
        }
    });

    return [response, error];
}

export async function dbFindRating(projectId) {
    const goFindScore = goStyleExceptionWrapper(prisma.ratings.findMany);
    const [response, error] = await goFindScore({
        where: { projectId: projectId }
    });
    return [response, error];
}
