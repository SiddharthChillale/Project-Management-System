/**
 * Ideally, I do not write modules/functions like this. but I have chosen to cut corners on the side tables like
 * courses, departments, score-categories. these require basic CRUDING so I chose to save time for
 * main routes and tables.
 *
 */

import wlogger from "../../../logger/winston.logger.js";
import { prisma } from "./main.services.js";

async function CRUD_course(method, options) {
    let result;
    try {
        switch (method) {
            case "C":
                result = await prisma.course.create({
                    data: options.data
                });
                break;
            case "R":
                result = await prisma.course.findMany({
                    where: options.where,
                    include: options.include
                });
                break;
            case "U":
                result = await prisma.course.update({
                    where: options.where,
                    data: options.data
                });
                break;
            case "D":
                result = await prisma.course.delete({
                    where: options.where
                });
                break;
            default:
                wlogger.error(`error, no method matching : ${method}`);

                break;
        }
        return [result, null];
    } catch (error) {
        wlogger.error(`error in case statement: ${error}`);
        return [null, error];
    }
}
const CourseService = {
    CRUD: CRUD_course
};
export default CourseService;
