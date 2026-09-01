import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@buybuyin/shared/prisma/client";

const connectionString = process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
    errorFormat: "pretty",
    adapter,
    log: [
        {
            emit: "stdout",
            level: "error",
        },
        {
            emit: "stdout",
            level: "warn",
        },
    ],
});

export default prisma;
