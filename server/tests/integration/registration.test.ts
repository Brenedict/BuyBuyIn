import request from "supertest";
import bcrypt from "bcryptjs";
import { beforeEach, afterEach, describe, expect, it } from "@jest/globals";

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

    beforeEach(async () => {
        await prisma.business.deleteMany();
        await prisma.user.deleteMany();
        tokensByRole.clear();

        for (const user of allRoleUsers) {
            await seedUser(user);
            tokensByRole.set(user.role, await accessTokenFor(user.email));
        }
    });

    afterEach(async () => {
        await prisma.business.deleteMany();
        await prisma.user.deleteMany();
    });

    describe.each([
        {
            route: "/registration/business-entity",
            payload: mockBusinessPayload,
            uniqueTo: async () => (await prisma.business.count()) === 1,
        },
        {
            route: "/registration/subscriber-account",
            payload: mockSubscriberPayload,
            uniqueTo: async () => (await prisma.user.count()) === allRoleUsers.length + 1,
        },
    ])("POST $route", ({ route, payload, uniqueTo }) => {
        it("returns 401 when no access token is provided", (done) => {
            request(app).post(route).send(payload).expect(401, done);
        });

        // Both routes are SUPERADMIN only (exclusive), so every other role must be turned away.
        describe("access level checking", () => {
            const expectedStatusByRole: Record<RoleType, 201 | 403> = {
                SUPERADMIN: 201,
                HQADMIN: 403,
                BRANCHMANAGER: 403,
                CASHIER: 403,
            };

            const cases = allRoleUsers.map((user) => ({
                user,
                expectedStatus: expectedStatusByRole[user.role],
            }));

            it.each(cases)(
                "returns $expectedStatus when the requestor is a $user.role",
                async ({ user, expectedStatus }) => {
                    const token = tokensByRole.get(user.role) as string;

                    const res = await request(app)
                        .post(route)
                        .set("Authorization", `Bearer ${token}`)
                        .send(payload)
                        .expect(expectedStatus);

                    if (expectedStatus === 201) {
                        expect(await uniqueTo()).toBe(true);
                    } else {
                        expect(res.body.message).toBe("Forbidden: Insufficient access level");
                        expect(await uniqueTo()).toBe(false);
                    }
                }
            );
        });

        it("returns 400 when the payload is missing required fields", async () => {
            await request(app)
                .post(route)
                .set("Authorization", `Bearer ${tokensByRole.get("SUPERADMIN")}`)
                .send({})
                .expect(400);
        });

        it("returns 400 when the payload contains unknown fields", async () => {
            await request(app)
                .post(route)
                .set("Authorization", `Bearer ${tokensByRole.get("SUPERADMIN")}`)
                .send({ ...payload, id: 99 })
                .expect(400);
        });
    });

    describe("POST /registration/subscriber-account", () => {
        const superAdminToken = () => tokensByRole.get("SUPERADMIN") as string;

        it("returns 400 when the client tries to set the role itself", async () => {
            await request(app)
                .post("/registration/subscriber-account")
                .set("Authorization", `Bearer ${superAdminToken()}`)
                .send({ ...mockSubscriberPayload, role: "SUPERADMIN" })
                .expect(400);
        });

        it("returns 400 when the client tries to set the password itself", async () => {
            await request(app)
                .post("/registration/subscriber-account")
                .set("Authorization", `Bearer ${superAdminToken()}`)
                .send({ ...mockSubscriberPayload, password: "hacked123" })
                .expect(400);
        });

        it("creates the account as HQADMIN regardless of the requestor", async () => {
            await request(app)
                .post("/registration/subscriber-account")
                .set("Authorization", `Bearer ${superAdminToken()}`)
                .send(mockSubscriberPayload)
                .expect(201);

            const created = await prisma.user.findUniqueOrThrow({ where: { email: mockSubscriberPayload.email } });

            expect(created).toMatchObject({ ...mockSubscriberPayload, role: "HQADMIN" });
            expect(created.resetToken).toBeNull();
        });
    });
});
