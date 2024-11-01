import wlogger from "../../../logger/winston.logger.js";
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

export async function dbFindRating(projectId, profileId) {
    const goFindScore = goStyleExceptionWrapper(prisma.ratings.findMany);
    const [response, error] = await goFindScore({
        where: {
            projectId: projectId,
            profileId: profileId
        }
    });
    return [response, error];
}

export async function dbGetRating(projectId) {
    wlogger.debug(`projectId: ${projectId}`);
    const goGetScoreGrouped = goStyleExceptionWrapper(prisma.ratings.groupBy);
    const [response, error] = await goGetScoreGrouped({
        by: ["scoreCategoryId"],
        where: {
            projectId: projectId
        },
        _avg: {
            score: true
        }
    });
    let result =
        await prisma.$queryRaw`SELECT b.name, AVG(a.score) as "score" from "Ratings" a JOIN "ScoreCategory" b ON a."scoreCategoryId"=b.id WHERE a."projectId"=${projectId} GROUP BY b."name";`;

    wlogger.debug(`result: ${JSON.stringify(result)}`);
    for (let ri = 0; ri < result.length; ri++) {
        result[ri].score = Math.round(result[ri].score * 2) / 2;
    }
    return [result, error];
}
