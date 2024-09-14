import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    omit: {
        user: {
            password: true,
            refreshToken: true,
            oneTimeToken: true,
            updatedAt: true
        }
    }
});
