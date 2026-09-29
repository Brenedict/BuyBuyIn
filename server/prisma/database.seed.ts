import prisma from "../src/config/prisma.config";
import HashUtil from "../src/utils/hash.util";

async function main() {
    // Create a new user
    const user = await prisma.user.createMany({
        data: [
            {
                email: "superadmin@gmail.com",
                password: await HashUtil.hashPassword("password123"),
                role: "SUPERADMIN",
                username: "SUPERADMIN",
                firstName: "John",
                lastName: "Doe",
            },
            {
                email: "hqadmin@gmail.com",
                password: await HashUtil.hashPassword("password123"),
                role: "HQADMIN",
                username: "HQADMIN",
                firstName: "John",
                lastName: "Doe",
            },
            {
                email: "branchmanager@gmail.com",
                password: await HashUtil.hashPassword("password123"),
                role: "BRANCHMANAGER",
                username: "BRANCHMANAGER",
                firstName: "John",
                lastName: "Doe",
            },
            {
                email: "cashier@gmail.com",
                password: await HashUtil.hashPassword("password123"),
                role: "CASHIER",
                username: "CASHIER",
                firstName: "John",
                lastName: "Doe",
            },
        ],
    });
    console.log("Created user:", user);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
