import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";
const prisma = new PrismaClient();
const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // 2 seconds

async function waitForDb() {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            await prisma.$connect();
            console.log("Database is ready!");
            return true;
        } catch (error) {
            console.log(
                `Database is unavailable - waiting (${retries + 1}/${MAX_RETRIES})...`
            );
            retries++;
            await new Promise((res) => setTimeout(res, RETRY_DELAY));
        }
    }

    console.error("Database connection failed after maximum retries.");
    return false;
}

async function checkTables() {
    try {
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;

        if (tables.length === 0) {
            console.log("No tables found in the database.");
        } else {
            console.log("Tables found in the database:");
            tables.forEach((table) => console.log(table.table_name));
        }

        const userCount = await prisma.user.count();

        if (userCount === 0) {
            console.log("User table is empty. Running population script...");
            exec(
                "node test/sandbox/db-builder.sandbox.js",
                (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error running script: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`Script error output: ${stderr}`);
                        return;
                    }
                    console.log(`Script output: ${stdout}`);
                }
            );
        } else {
            console.log("User table is already populated.");
        }
    } catch (error) {
        console.error("Error querying tables:", error);
    } finally {
        await prisma.$disconnect();
    }
}

(async () => {
    const dbReady = await waitForDb();
    if (dbReady) {
        await checkTables();
    }
})();
