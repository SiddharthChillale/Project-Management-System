import { prisma } from "./main.services.js";

async function CRUD_course(method, options) {
    let result;
    try {
        switch (method) {
            case "C":
                result = await prisma.course.create({
                    data: {
                        name: options.data.name,
                        semester: options.data.semester,
                        year: options.data.year,
                        code: options.data.code
                    }
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
