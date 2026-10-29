import request from "supertest";
import bcrypt from "bcryptjs";
import { jest, beforeAll, beforeEach, afterEach, describe, expect, it } from "@jest/globals";

import { RoleType } from "@buybuyin/shared/prisma/enums";
import type { Branch, Business, User } from "@buybuyin/shared/prisma/client";

import registrationRouter from "../../src/routes/registration.route";
import prisma from "../../src/config/prisma.config";
import EmailService from "../../src/service/email.service";
import { app, setCurrentAuthUser } from "../../jest.integration";

import { resetDatabase } from "../helpers/database.helper";

import {
    mockBranchManager,
    mockBranchPayload,
    mockBusinessPayload,
    mockCashier,
    mockHqAdmin,
    mockSubscriberPayload,
    mockSuperAdmin,
    type MockUser,
} from "../fixtures/registration.fixture";

jest.mock("../../src/service/email.service", () => ({
    __esModule: true,
    default: {
        sendRegistrationConfirmationEmal: jest.fn(),
        sendAccountRegisteredSuccessEmail: jest.fn(),
    },
}));

const emailServiceMock = jest.mocked(EmailService);
const allRoleUsers: MockUser[] = [mockSuperAdmin, mockHqAdmin, mockBranchManager, mockCashier];
const RESET_TOKEN = "registration-reset-token";
const COMPLETION_PASSWORD = "newPassword123";

let passwordHash = "";

async function seedUser(user: MockUser) {
    return prisma.user.create({
        data: {
            email: user.email,
            password: passwordHash,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            accountStatus: "ACTIVE",
        },
    });
}

async function seedResetTokenUser(expiresAt = new Date(Date.now() + 60 * 60 * 1000)) {
    return prisma.user.create({
        data: {
            email: "reset.user@gmail.com",
            password: passwordHash,
            firstName: "Reset",
            lastName: "User",
            role: RoleType.HQADMIN,
            resetToken: RESET_TOKEN,
            resetTokenExpiresAt: expiresAt,
        },
    });
}

describe("Registration routes", () => {
    app.use("/registration", registrationRouter);

    let roles: Record<RoleType, User>;
    let business: Business;
    let branch: Branch;

    beforeAll(async () => {
        passwordHash = await bcrypt.hash(mockSuperAdmin.password, 10);
    });

    beforeEach(async () => {
        await resetDatabase();
        setCurrentAuthUser(null);

        const entries = await Promise.all(
            allRoleUsers.map(async (user) => [user.role, await seedUser(user)] as const)
        );
        roles = Object.fromEntries(entries) as Record<RoleType, User>;

        business = await prisma.business.create({ data: mockBusinessPayload });
        branch = await prisma.branch.create({
            data: { ...mockBranchPayload, businessId: business.id },
        });

        emailServiceMock.sendRegistrationConfirmationEmal.mockResolvedValue(true);
        emailServiceMock.sendAccountRegisteredSuccessEmail.mockResolvedValue(true);
    });

    afterEach(() => {
        setCurrentAuthUser(null);
    });

    const subscriberAccountPayload = () => ({ ...mockSubscriberPayload, businessId: business.id });

    const managerAccountPayload = () => ({
        email: "new.manager@gmail.com",
        firstName: "New",
        lastName: "Manager",
        businessId: business.id,
        branchId: branch.id,
    });

    const cashierAccountPayload = () => ({
        email: "new.cashier@gmail.com",
        firstName: "New",
        lastName: "Cashier",
        businessId: business.id,
        branchId: branch.id,
    });

    const expectRoleGate = async (path: string, allowedRole: RoleType, payload: Record<string, unknown>) => {
        for (const user of allRoleUsers.filter((entry) => entry.role !== allowedRole)) {
            setCurrentAuthUser(roles[user.role]);

            const res = await request(app).post(path).send(payload).expect(403);

            expect(res.body).toEqual({ message: "Forbidden: Insufficient access level" });
        }

        setCurrentAuthUser(null);

        await request(app).post(path).send(payload).expect(401);
    };

    const expectAccountCreated = async (email: string, role: RoleType, fullName: string) => {
        const stored = await prisma.user.findUniqueOrThrow({ where: { email } });

        expect(stored.role).toBe(role);
        expect(stored.accountStatus).toBe("UNVERIFIED");
        expect(stored.password).toMatch(/^\$2[aby]\$/);
        expect(stored.resetToken).not.toBeNull();
        expect(stored.resetTokenExpiresAt).not.toBeNull();
        expect((stored.resetTokenExpiresAt as Date).getTime()).toBeGreaterThan(Date.now());

        expect(emailServiceMock.sendRegistrationConfirmationEmal).toHaveBeenCalledWith(
            role,
            stored.resetToken,
            fullName,
            email
        );

        return stored;
    };

    describe("POST /registration/business-entity", () => {
        it("creates a business as a super admin", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            await request(app)
                .post("/registration/business-entity")
                .send({ name: "BuyBuyIn Cebu", location: "Cebu" })
                .expect(201);

            const stored = await prisma.business.findFirstOrThrow({ where: { name: "BuyBuyIn Cebu" } });

            expect(stored.location).toBe("Cebu");
        });

        it("rejects a payload with missing fields", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            const res = await request(app)
                .post("/registration/business-entity")
                .send({ name: "BuyBuyIn Cebu" })
                .expect(400);

            expect(res.body).toHaveProperty("error");
        });

        it("only allows super admins", async () => {
            for (const user of allRoleUsers.filter((entry) => entry.role !== RoleType.SUPERADMIN)) {
                setCurrentAuthUser(roles[user.role]);

                await request(app)
                    .post("/registration/business-entity")
                    .send({ name: "Forbidden Business", location: "Manila" })
                    .expect(403);
            }

            setCurrentAuthUser(null);

            await request(app)
                .post("/registration/business-entity")
                .send({ name: "Forbidden Business", location: "Manila" })
                .expect(401);

            expect(await prisma.business.count({ where: { name: "Forbidden Business" } })).toBe(0);
        });
    });

    describe("POST /registration/branch-entity", () => {
        it("creates a branch attached to a business as a super admin", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            await request(app)
                .post("/registration/branch-entity")
                .send({ location: "Davao Branch", accountLimit: 5, businessId: business.id })
                .expect(201);

            const stored = await prisma.branch.findFirstOrThrow({ where: { location: "Davao Branch" } });

            expect(stored.accountLimit).toBe(5);
            expect(stored.businessId).toBe(business.id);
        });

        it("rejects a payload with missing fields", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            const res = await request(app)
                .post("/registration/branch-entity")
                .send({ location: "Davao Branch" })
                .expect(400);

            expect(res.body).toHaveProperty("error");
        });

        it("only allows super admins", async () => {
            for (const user of allRoleUsers.filter((entry) => entry.role !== RoleType.SUPERADMIN)) {
                setCurrentAuthUser(roles[user.role]);

                await request(app)
                    .post("/registration/branch-entity")
                    .send({ location: "Forbidden Branch", accountLimit: 5, businessId: business.id })
                    .expect(403);
            }

            setCurrentAuthUser(null);

            await request(app)
                .post("/registration/branch-entity")
                .send({ location: "Forbidden Branch", accountLimit: 5, businessId: business.id })
                .expect(401);

            expect(await prisma.branch.count({ where: { location: "Forbidden Branch" } })).toBe(0);
        });
    });

    describe("POST /registration/subscriber-account", () => {
        it("creates an unverified HQ admin and sends a registration email", async () => {
            const payload = subscriberAccountPayload();

            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            await request(app).post("/registration/subscriber-account").send(payload).expect(201);

            await expectAccountCreated(payload.email, RoleType.HQADMIN, "Steve MC");
        });

        it("rejects an email that is already registered", async () => {
            const payload = subscriberAccountPayload();

            await prisma.user.create({
                data: {
                    email: payload.email,
                    password: passwordHash,
                    firstName: "Existing",
                    lastName: "User",
                    role: RoleType.CASHIER,
                },
            });

            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            const res = await request(app).post("/registration/subscriber-account").send(payload).expect(400);

            expect(res.body).toEqual({ message: "Email already registered" });
            expect(await prisma.user.count({ where: { email: payload.email } })).toBe(1);
        });

        it("does not register a reset token when the email fails to send", async () => {
            const payload = subscriberAccountPayload();

            emailServiceMock.sendRegistrationConfirmationEmal.mockResolvedValueOnce(false);
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            await request(app).post("/registration/subscriber-account").send(payload).expect(201);

            const stored = await prisma.user.findUniqueOrThrow({ where: { email: payload.email } });

            expect(stored.role).toBe(RoleType.HQADMIN);
            expect(stored.resetToken).toBeNull();
            expect(stored.resetTokenExpiresAt).toBeNull();
        });

        it("rejects an invalid payload", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            const res = await request(app)
                .post("/registration/subscriber-account")
                .send({ email: "invalid@gmail.com", firstName: "", lastName: "User" })
                .expect(400);

            expect(res.body).toHaveProperty("error");
        });

        it("only allows super admins", async () => {
            await expectRoleGate(
                "/registration/subscriber-account",
                RoleType.SUPERADMIN,
                subscriberAccountPayload()
            );
        });
    });

    describe("POST /registration/manager-account", () => {
        it("creates an unverified branch manager and sends a registration email", async () => {
            const payload = managerAccountPayload();

            setCurrentAuthUser(roles[RoleType.HQADMIN]);

            await request(app).post("/registration/manager-account").send(payload).expect(201);

            await expectAccountCreated(payload.email, RoleType.BRANCHMANAGER, "New Manager");
        });

        it("rejects an email that is already registered", async () => {
            const payload = managerAccountPayload();

            await prisma.user.create({
                data: {
                    email: payload.email,
                    password: passwordHash,
                    firstName: "Existing",
                    lastName: "User",
                    role: RoleType.CASHIER,
                },
            });

            setCurrentAuthUser(roles[RoleType.HQADMIN]);

            const res = await request(app).post("/registration/manager-account").send(payload).expect(400);

            expect(res.body).toEqual({ message: "Email already registered" });
        });

        it("rejects an invalid payload", async () => {
            setCurrentAuthUser(roles[RoleType.HQADMIN]);

            const res = await request(app)
                .post("/registration/manager-account")
                .send({ email: "invalid@gmail.com", firstName: "New", lastName: "" })
                .expect(400);

            expect(res.body).toHaveProperty("error");
        });

        it("only allows HQ admins", async () => {
            await expectRoleGate("/registration/manager-account", RoleType.HQADMIN, managerAccountPayload());
        });
    });

    describe("POST /registration/cashier-account", () => {
        it("creates an unverified cashier and sends a registration email", async () => {
            const payload = cashierAccountPayload();

            setCurrentAuthUser(roles[RoleType.BRANCHMANAGER]);

            await request(app).post("/registration/cashier-account").send(payload).expect(201);

            await expectAccountCreated(payload.email, RoleType.CASHIER, "New Cashier");
        });

        it("rejects an email that is already registered", async () => {
            const payload = cashierAccountPayload();

            await prisma.user.create({
                data: {
                    email: payload.email,
                    password: passwordHash,
                    firstName: "Existing",
                    lastName: "User",
                    role: RoleType.CASHIER,
                },
            });

            setCurrentAuthUser(roles[RoleType.BRANCHMANAGER]);

            const res = await request(app).post("/registration/cashier-account").send(payload).expect(400);

            expect(res.body).toEqual({ message: "Email already registered" });
        });

        it("rejects an invalid payload", async () => {
            setCurrentAuthUser(roles[RoleType.BRANCHMANAGER]);

            const res = await request(app)
                .post("/registration/cashier-account")
                .send({ email: "invalid@gmail.com", firstName: "New", lastName: "" })
                .expect(400);

            expect(res.body).toHaveProperty("error");
        });

        it("only allows branch managers", async () => {
            await expectRoleGate(
                "/registration/cashier-account",
                RoleType.BRANCHMANAGER,
                cashierAccountPayload()
            );
        });
    });

    describe("GET /registration/verify-email", () => {
        it("returns a masked email for a valid reset token", async () => {
            await seedResetTokenUser();

            const res = await request(app)
                .get("/registration/verify-email")
                .query({ token: RESET_TOKEN })
                .expect(200);

            expect(res.body).toEqual({ email: "r****r@gmail.com", isTokenExpired: false });
        });

        it("rejects a missing token", async () => {
            const res = await request(app).get("/registration/verify-email").expect(400);

            expect(res.body).toEqual({ message: "Invalid or missing reset link." });
        });

        it("rejects an unknown token", async () => {
            const res = await request(app)
                .get("/registration/verify-email")
                .query({ token: "unknown-token" })
                .expect(401);

            expect(res.body).toEqual({ message: "Invalid link." });
        });

        it("rejects an expired token and clears it", async () => {
            await seedResetTokenUser(new Date(Date.now() - 60 * 1000));

            const res = await request(app)
                .get("/registration/verify-email")
                .query({ token: RESET_TOKEN })
                .expect(401);

            expect(res.body).toEqual({ message: "Expired link." });

            const stored = await prisma.user.findFirstOrThrow({ where: { email: "reset.user@gmail.com" } });

            expect(stored.resetToken).toBeNull();
            expect(stored.resetTokenExpiresAt).toBeNull();
        });
    });

    describe("POST /registration/complete-account", () => {
        it("sets the password and activates the account", async () => {
            const user = await seedResetTokenUser();

            const res = await request(app)
                .post("/registration/complete-account")
                .query({ token: RESET_TOKEN })
                .send({ password: COMPLETION_PASSWORD, confirmPassword: COMPLETION_PASSWORD })
                .expect(200);

            expect(res.body).toEqual({ message: "Account verified successfully." });

            const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });

            expect(stored.accountStatus).toBe("ACTIVE");
            expect(await bcrypt.compare(COMPLETION_PASSWORD, stored.password)).toBe(true);
            expect(emailServiceMock.sendAccountRegisteredSuccessEmail).toHaveBeenCalledWith(
                "Reset User",
                user.email
            );
        });

        it("rejects mismatched passwords without updating the account", async () => {
            const user = await seedResetTokenUser();

            const res = await request(app)
                .post("/registration/complete-account")
                .query({ token: RESET_TOKEN })
                .send({ password: COMPLETION_PASSWORD, confirmPassword: "differentPassword123" })
                .expect(400);

            expect(res.body).toHaveProperty("error");

            const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });

            expect(stored.accountStatus).toBe("UNVERIFIED");
            expect(await bcrypt.compare(COMPLETION_PASSWORD, stored.password)).toBe(false);
        });

        it("rejects a password shorter than eight characters", async () => {
            await seedResetTokenUser();

            const res = await request(app)
                .post("/registration/complete-account")
                .query({ token: RESET_TOKEN })
                .send({ password: "short", confirmPassword: "short" })
                .expect(400);

            expect(res.body).toHaveProperty("error");
        });

        it("rejects an unknown token", async () => {
            const res = await request(app)
                .post("/registration/complete-account")
                .query({ token: "unknown-token" })
                .send({ password: COMPLETION_PASSWORD, confirmPassword: COMPLETION_PASSWORD })
                .expect(401);

            expect(res.body).toEqual({ message: "Invalid link." });
        });

        it("rejects an expired token and clears it", async () => {
            const user = await seedResetTokenUser(new Date(Date.now() - 60 * 1000));

            const res = await request(app)
                .post("/registration/complete-account")
                .query({ token: RESET_TOKEN })
                .send({ password: COMPLETION_PASSWORD, confirmPassword: COMPLETION_PASSWORD })
                .expect(401);

            expect(res.body).toEqual({ message: "Expired link." });

            const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });

            expect(stored.resetToken).toBeNull();
            expect(stored.resetTokenExpiresAt).toBeNull();
            expect(stored.accountStatus).toBe("UNVERIFIED");
        });
    });
});
