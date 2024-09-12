import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {}

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
