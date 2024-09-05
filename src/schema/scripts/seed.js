import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// import ProjectDB from "../../api/v1/services/project";
import mock from "../../../test/mock_data/project.js";

// FILL TABLE-PROJECTS
async function main() {
    console.log("Deleting all previous data");
    await prisma.projects.deleteMany();

    console.log("Filling table projects with mock data");
    prisma.projects
        .createManyAndReturn({ data: mock.all })
        .then((results) =>
            results.forEach((result) =>
                console.log(`seeded db with project-id: ${result.id}`)
            )
        )
        .catch((err) => console.log(err));
}

main()
    .then(() => {
        console.log("\nSeeding complete");
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
