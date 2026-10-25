import request from "supertest";
import bcrypt from "bcryptjs";
import { beforeEach, afterEach, describe, expect, it, test } from "@jest/globals";

import registrationRouter from "../../src/routes/registration.route";
import prisma from "../../src/config/prisma.config";
import AuthService from "../../src/service/auth.service";
import { app } from "../../jest.integration";

import type { RoleType } from "@buybuyin/shared/prisma/enums";
import {
    mockBranchManager,
    mockBusinessPayload,
    mockCashier,
    mockHqAdmin,
    mockSubscriberPayload,
    mockSuperAdmin,
    type MockUser,
} from "../fixtures/registration.fixture";

const allRoleUsers: MockUser[] = [mockSuperAdmin, mockHqAdmin, mockBranchManager, mockCashier];

async function seedUser(user: MockUser) {
    return prisma.user.create({
        data: {
            username: user.username,
            email: user.email,
            password: await bcrypt.hash(user.password, 10),
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
    });
}

async function accessTokenFor(email: string) {
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    return AuthService.generateTokens(user).accessToken;
}

describe("Registration routes", () => {
    const tokensByRole = new Map<string, string>();

    app.use("/registration", registrationRouter);

    // beforeEach(async () => {
    //     await prisma.business.deleteMany();
    //     await prisma.user.deleteMany();
    //     tokensByRole.clear();

    //     for (const user of allRoleUsers) {
    //         await seedUser(user);
    //         tokensByRole.set(user.role, await accessTokenFor(user.email));
    //     }
    // });

    // afterEach(async () => {
    //     await prisma.business.deleteMany();
    //     await prisma.user.deleteMany();
    // });

    test.todo("POST business entity");

    test.todo("POST branch entity");

    test.todo("POST HQ Admin account");
    test.todo("Check per role if they can access this route");

    test.todo("POST Branch Manager account");
    test.todo("Check per role if they can access this route");

    test.todo("POST Cashier account");
    test.todo("Check per role if they can access this route");
});
