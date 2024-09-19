import { PrismaClient } from "@prisma/client";
import { generatefakeData, clearDB } from "./fake.generator.js";
import wlogger from "../../logger/winston.logger.js";
const prisma = new PrismaClient();

const xprisma = prisma.$extends({
    name: "userName generator",
    query: {
        userProfile: {
            async create({ model, operation, args, query }) {
                const email = args.data.email;
                const cargs = args.data;
                const username = email.split("@")[0];

                args.data = { ...args.data, userName: username };
                return query(args);
            },
            async createMany({ model, operation, args, query }) {
                const cargs = args.data;

                args.data.map((dataObj) => {
                    const email = dataObj.email;
                    const username = email.split("@")[0];
                    dataObj = { ...dataObj, userName: username };
                });
                // args.data = { ...args.data, userName: username };
                return query(args);
            }
        }
    }
});
async function main() {
    await clearDB(xprisma);
    wlogger.info("seeding db");

    await generatefakeData(xprisma);
}

main()
    .then(() => {
        wlogger.info("\nSeeding complete");
    })
    .finally(async () => {
        await xprisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await xprisma.$disconnect();
        process.exit(1);
    });
