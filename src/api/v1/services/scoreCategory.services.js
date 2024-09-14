import { prisma } from "./main.services.js";

async function CRUD_scoreCategory(method, options) {
    let result;
    try {
        switch (method) {
            case "C":
                result = await prisma.scoreCategory.create({
                    data: {
                        name: options.data.name
                    }
                });
                break;
            case "R":
                result = await prisma.scoreCategory.findMany({
                    where: options.where,
                    include: options.include
                });
                break;
            case "U":
                result = await prisma.scoreCategory.update({
                    where: options.where,
                    data: options.data
                });
                break;
            case "D":
                result = await prisma.scoreCategory.delete({
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

const ScoreCatService = {
    CRUD: CRUD_scoreCategory
};

export default ScoreCatService;
