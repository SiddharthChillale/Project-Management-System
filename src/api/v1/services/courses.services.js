/**
 * Ideally, I do not write modules/functions like this. but I have chosen to cut corners on the side tables like
 * courses, departments, score-categories. these require basic CRUDING so I chose to save time for
 * main routes and tables.
 *
 */

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
                console.log(`error, no method matching : ${method}`);

                break;
        }
    } catch (error) {
        console.log(`error in case statement: ${error}`);
    }
    return result;
}
const CourseService = {
    CRUD: CRUD_course
};
export default CourseService;
