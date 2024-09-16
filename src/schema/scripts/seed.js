import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// import ProjectDB from "../../api/v1/services/project";
import mock from "../../../test/mock_data/project.mock.js";
import mock_user from "../../../test/mock_data/user.mock.js";
import wlogger from "../../logger/winston.logger.js";

// FILL TABLE-PROJECTS
async function main() {
    wlogger.info("Deleting all previous data");
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    wlogger.info("Filling table projects with mock data");
    prisma.project
        .createManyAndReturn({ data: mock.all })
        .then((results) =>
            results.forEach((result) =>
                wlogger.info(`seeded db with project-id: ${result.id}`)
            )
        )
        .catch((err) => wlogger.error(err));

    prisma.user
        .createManyAndReturn({ data: mock_user.all })
        .then((results) =>
            results.forEach((result) =>
                wlogger.info(`seeded db with user-id: ${result.id}`)
            )
        )
        .catch((err) => wlogger.error(err));
}

main()
    .then(() => {
        wlogger.info("\nSeeding complete");
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
