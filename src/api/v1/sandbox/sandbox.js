import { prisma } from "../services/main.services.js";
import { cleanDeep } from "../utils/helper.utils.js";

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
    console.log(error);
}
const a = cleanDeep(body);
const b = await prisma.userProfile.findMany({ where: a });
console.log(`a: ${a}`);
console.log(`b: ${b}`);
