import prisma from "../src/config/prisma.config";
import HashUtil from "../src/utils/hash.util";

async function main() {
    // Create a new user
    const user = await prisma.user.create({
        data: {
            email: "johndoe@gmail.com",
            password: await HashUtil.hashPassword("password123"),
            username: "johndoe",
            firstName: "John",
            lastName: "Doe",
        },
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
