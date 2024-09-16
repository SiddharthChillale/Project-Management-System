import { prisma } from "../../src/api/v1/services/main.services.js";
import { cleanDeep } from "../../src/api/v1/utils/helper.utils.js";
import wlogger from "../../src/logger/winston.logger.js";

const id = undefined;
const date = undefined;
let body;
try {
    body = {
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
} catch (error) {
    wlogger.error(`${error}`);
}
const a = cleanDeep(body);
const b = await prisma.userProfile.findMany({ where: a });
wlogger.info(`a: ${a}`);
wlogger.info(`b: ${b}`);
