import wlogger from "../../../logger/winston.logger.js";
import { prisma } from "./main.services.js";

async function CRUD_department(method, options) {
    let result;
    try {
        switch (method) {
            case "C":
                let dataC = {
                    name: options.data.name
                };
                if (options.data.courses) {
                    dataC = {
                        ...dataC,
                        courses: {
                            createMany: {
                                data: options.data.courses
                            }
                        }
                    };
                }
                result = await prisma.department.create({
                    data: dataC
                });
                break;
            case "R":
                result = await prisma.department.findMany({
                    where: options.where,
                    include: options.include
                });
                break;
            case "U":
                result = await prisma.department.update({
                    where: options.where,
                    data: options.newData
                });
                break;
            case "D":
                result = await prisma.department.delete({
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

const DepartmentService = {
    CRUD: CRUD_department
};

export default DepartmentService;
