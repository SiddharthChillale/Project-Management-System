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
                    data: options.data
                });
                break;
            case "D":
                result = await prisma.department.delete({
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

const DepartmentService = {
    CRUD: CRUD_department
};

export default DepartmentService;
