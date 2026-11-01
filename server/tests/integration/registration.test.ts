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

        const entries = await Promise.all(allRoleUsers.map(async (user) => [user.role, await seedUser(user)] as const));
        roles = Object.fromEntries(entries) as Record<RoleType, User>;

        business = await prisma.business.create({ data: mockBusinessPayload });

        roles[RoleType.HQADMIN] = await prisma.user.update({
            where: { id: roles[RoleType.HQADMIN].id },
            data: { businessId: business.id },
        });

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
        it("creates a branch attached to the HQ admin's own business", async () => {
            setCurrentAuthUser(roles[RoleType.HQADMIN]);

            await request(app)
                .post("/registration/branch-entity")
                .send({ location: "Davao Branch", accountLimit: 5 })
                .expect(201);

            const stored = await prisma.branch.findFirstOrThrow({ where: { location: "Davao Branch" } });

            expect(stored.accountLimit).toBe(5);
            expect(stored.businessId).toBe(business.id);
        });

        it("only allows HQ admins", async () => {
            await expectRoleGate("/registration/branch-entity", RoleType.HQADMIN, {
                location: "Forbidden Branch",
                accountLimit: 5,
            });

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

        it("only allows super admins", async () => {
            await expectRoleGate("/registration/subscriber-account", RoleType.SUPERADMIN, subscriberAccountPayload());
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
            await expectRoleGate("/registration/cashier-account", RoleType.BRANCHMANAGER, cashierAccountPayload());
        });
    });

    describe("GET /registration/businesses", () => {
        it("returns all businesses for a super admin", async () => {
            await prisma.business.create({ data: { name: "BuyBuyIn Cebu", location: "Cebu" } });

            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            const res = await request(app).get("/registration/businesses").expect(200);

            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: mockBusinessPayload.name, location: mockBusinessPayload.location }),
                    expect.objectContaining({ name: "BuyBuyIn Cebu", location: "Cebu" }),
                ])
            );
        });

        it("does not expose the business list to frontline roles", async () => {
            for (const user of allRoleUsers.filter(
                (entry) => entry.role === RoleType.BRANCHMANAGER || entry.role === RoleType.CASHIER
            )) {
                setCurrentAuthUser(roles[user.role]);

                await request(app).get("/registration/businesses").expect(403);
            }
        });
    });

    describe("GET /registration/subscribers", () => {
        it("returns all HQ admin accounts for a super admin", async () => {
            await prisma.user.create({
                data: {
                    email: "new.subscriber@gmail.com",
                    password: passwordHash,
                    firstName: "New",
                    lastName: "Subscriber",
                    role: RoleType.HQADMIN,
                },
            });

            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            const res = await request(app).get("/registration/subscribers").expect(200);

            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ email: mockHqAdmin.email, role: RoleType.HQADMIN }),
                    expect.objectContaining({ email: "new.subscriber@gmail.com", role: RoleType.HQADMIN }),
                ])
            );
        });

        it("only allows super admins", async () => {
            for (const user of allRoleUsers.filter((entry) => entry.role !== RoleType.SUPERADMIN)) {
                setCurrentAuthUser(roles[user.role]);

                await request(app).get("/registration/subscribers").expect(403);
            }
        });
    });

    describe("GET /registration/branches", () => {
        it("returns branches scoped to the requestor's business", async () => {
            await prisma.branch.create({
                data: { location: "Davao Branch", accountLimit: 5, businessId: business.id },
            });

            const branchManager = await prisma.user.update({
                where: { id: roles[RoleType.BRANCHMANAGER].id },
                data: { businessId: business.id },
            });

            setCurrentAuthUser(branchManager);

            const res = await request(app).get("/registration/branches").expect(200);

            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ location: mockBranchPayload.location }),
                    expect.objectContaining({ location: "Davao Branch" }),
                ])
            );
        });

        it("returns an empty list when the requestor has no business", async () => {
            setCurrentAuthUser(roles[RoleType.BRANCHMANAGER]);

            const res = await request(app).get("/registration/branches").expect(200);

            expect(res.body).toEqual([]);
        });
    });

    describe("GET /registration/managers", () => {
        it("returns branch managers scoped to the requestor's business", async () => {
            await prisma.user.create({
                data: {
                    email: "new.manager@gmail.com",
                    password: passwordHash,
                    firstName: "New",
                    lastName: "Manager",
                    role: RoleType.BRANCHMANAGER,
                    businessId: business.id,
                },
            });

            const hqAdmin = await prisma.user.update({
                where: { id: roles[RoleType.HQADMIN].id },
                data: { businessId: business.id },
            });

            setCurrentAuthUser(hqAdmin);

            const res = await request(app).get("/registration/managers").expect(200);

            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ email: "new.manager@gmail.com", role: RoleType.BRANCHMANAGER }),
                ])
            );
        });

        it("only allows HQ admins", async () => {
            for (const user of allRoleUsers.filter((entry) => entry.role !== RoleType.HQADMIN)) {
                setCurrentAuthUser(roles[user.role]);

                await request(app).get("/registration/managers").expect(403);
            }
        });
    });

    describe("GET /registration/cashiers", () => {
        it("returns cashiers scoped to the requestor's business", async () => {
            await prisma.user.create({
                data: {
                    email: "new.cashier@gmail.com",
                    password: passwordHash,
                    firstName: "New",
                    lastName: "Cashier",
                    role: RoleType.CASHIER,
                    businessId: business.id,
                },
            });

            const branchManager = await prisma.user.update({
                where: { id: roles[RoleType.BRANCHMANAGER].id },
                data: { businessId: business.id },
            });

            setCurrentAuthUser(branchManager);

            const res = await request(app).get("/registration/cashiers").expect(200);

            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ email: "new.cashier@gmail.com", role: RoleType.CASHIER }),
                ])
            );
        });

        it("only allows branch managers", async () => {
            for (const user of allRoleUsers.filter((entry) => entry.role !== RoleType.BRANCHMANAGER)) {
                setCurrentAuthUser(roles[user.role]);

                await request(app).get("/registration/cashiers").expect(403);
            }
        });
    });

    describe("GET /registration/verify-email", () => {
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

            const res = await request(app).get("/registration/verify-email").query({ token: RESET_TOKEN }).expect(401);

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
            expect(emailServiceMock.sendAccountRegisteredSuccessEmail).toHaveBeenCalledWith("Reset User", user.email);
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

    describe("GET/PATCH/DELETE /registration/businesses/:businessId", () => {
        it("fetches a single business for a super admin", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            const res = await request(app).get(`/registration/businesses/${business.id}`).expect(200);

            expect(res.body).toEqual(expect.objectContaining({ id: business.id, name: mockBusinessPayload.name }));
        });

        it("updates the business name and location", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            await request(app)
                .patch(`/registration/businesses/${business.id}`)
                .send({ name: "BuyBuyIn Renamed", location: "Cebu" })
                .expect(200);

            const stored = await prisma.business.findUniqueOrThrow({ where: { id: business.id } });

            expect(stored.name).toBe("BuyBuyIn Renamed");
            expect(stored.location).toBe("Cebu");
        });

        it("only allows super admins to update businesses", async () => {
            for (const user of allRoleUsers.filter((entry) => entry.role !== RoleType.SUPERADMIN)) {
                setCurrentAuthUser(roles[user.role]);

                await request(app)
                    .patch(`/registration/businesses/${business.id}`)
                    .send({ name: "Nope", location: "Manila" })
                    .expect(403);
            }
        });

        it("deletes a business but leaves linked rows orphaned", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            await request(app).delete(`/registration/businesses/${business.id}`).expect(200);

            expect(await prisma.business.findUnique({ where: { id: business.id } })).toBeNull();

            // Branch is orphaned (businessId SET NULL), not deleted.
            const orphanedBranch = await prisma.branch.findUniqueOrThrow({ where: { id: branch.id } });
            expect(orphanedBranch.businessId).toBeNull();

            // HQ Admin is orphaned (businessId SET NULL), not deleted.
            const orphanedHq = await prisma.user.findUniqueOrThrow({ where: { id: roles[RoleType.HQADMIN].id } });
            expect(orphanedHq.businessId).toBeNull();
        });
    });

    describe("GET/PATCH/DELETE /registration/subscribers/:userId", () => {
        let subscriber: User;

        beforeEach(async () => {
            subscriber = await prisma.user.create({
                data: {
                    email: "edit.subscriber@gmail.com",
                    password: passwordHash,
                    firstName: "Edit",
                    lastName: "Subscriber",
                    role: RoleType.HQADMIN,
                    businessId: business.id,
                },
            });
        });

        it("fetches a single subscriber", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            const res = await request(app).get(`/registration/subscribers/${subscriber.id}`).expect(200);

            expect(res.body).toEqual(expect.objectContaining({ id: subscriber.id, role: RoleType.HQADMIN }));
        });

        it("updates the FN, LN, email, and business assignment", async () => {
            const otherBusiness = await prisma.business.create({ data: { name: "Other Biz", location: "Manila" } });
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            await request(app)
                .patch(`/registration/subscribers/${subscriber.id}`)
                .send({
                    email: "renamed@email.com",
                    firstName: "Renamed",
                    lastName: "Subscriber",
                    businessId: otherBusiness.id,
                })
                .expect(200);

            const stored = await prisma.user.findUniqueOrThrow({ where: { id: subscriber.id } });

            expect(stored.email).toBe("renamed@email.com");
            expect(stored.firstName).toBe("Renamed");
            expect(stored.businessId).toBe(otherBusiness.id);
        });

        it("returns the number of subscribers left linked to the business on delete-context", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            const res = await request(app).get(`/registration/subscribers/${subscriber.id}/delete-context`).expect(200);

            // The seeded mockHqAdmin shares business.id, so 1 other subscriber remains.
            expect(res.body).toEqual({ account: expect.objectContaining({ id: subscriber.id }), remainingCount: 1 });
        });

        it("deletes a subscriber account", async () => {
            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            await request(app).delete(`/registration/subscribers/${subscriber.id}`).expect(200);

            expect(await prisma.user.findUnique({ where: { id: subscriber.id } })).toBeNull();
        });
    });

    describe("PATCH /registration/managers/:userId", () => {
        it("updates a manager and reassigns its branch", async () => {
            const manager = await prisma.user.create({
                data: {
                    email: "edit.manager@gmail.com",
                    password: passwordHash,
                    firstName: "Edit",
                    lastName: "Manager",
                    role: RoleType.BRANCHMANAGER,
                    businessId: business.id,
                    branchId: branch.id,
                },
            });

            const otherBranch = await prisma.branch.create({
                data: { location: "Tagum Branch", accountLimit: 3, businessId: business.id },
            });

            setCurrentAuthUser(roles[RoleType.HQADMIN]);

            await request(app)
                .patch(`/registration/managers/${manager.id}`)
                .send({
                    email: "edited.manager@gmail.com",
                    firstName: "Edited",
                    lastName: "Manager",
                    branchId: otherBranch.id,
                })
                .expect(200);

            const stored = await prisma.user.findUniqueOrThrow({ where: { id: manager.id } });

            expect(stored.email).toBe("edited.manager@gmail.com");
            expect(stored.branchId).toBe(otherBranch.id);
            expect(stored.businessId).toBe(business.id);
        });
    });

    describe("PATCH /registration/cashiers/:userId", () => {
        let cashier: User;

        beforeEach(async () => {
            cashier = await prisma.user.create({
                data: {
                    email: "edit.cashier@gmail.com",
                    password: passwordHash,
                    firstName: "Edit",
                    lastName: "Cashier",
                    role: RoleType.CASHIER,
                    businessId: business.id,
                    branchId: branch.id,
                },
            });

            await prisma.user.update({
                where: { id: roles[RoleType.BRANCHMANAGER].id },
                data: { businessId: business.id },
            });
        });

        it("updates a cashier within the requestor's business", async () => {
            const branchManager = await prisma.user.findUniqueOrThrow({
                where: { id: roles[RoleType.BRANCHMANAGER].id },
            });
            setCurrentAuthUser(branchManager);

            await request(app)
                .patch(`/registration/cashiers/${cashier.id}`)
                .send({ email: "edited.cashier@gmail.com", firstName: "Edited", lastName: "Cashier" })
                .expect(200);

            const stored = await prisma.user.findUniqueOrThrow({ where: { id: cashier.id } });

            expect(stored.email).toBe("edited.cashier@gmail.com");
        });

        it("deleting a cashier keeps its transactions", async () => {
            await prisma.transaction.create({
                data: {
                    totalPrice: 100,
                    dateofTransaction: new Date(),
                    paymentMethod: "CASH",
                    status: "COMPLETE",
                    discount: 0,
                    branchId: branch.id,
                    userId: cashier.id,
                },
            });

            const branchManager = await prisma.user.findUniqueOrThrow({
                where: { id: roles[RoleType.BRANCHMANAGER].id },
            });
            setCurrentAuthUser(branchManager);

            await request(app).delete(`/registration/cashiers/${cashier.id}`).expect(200);

            expect(await prisma.user.findUnique({ where: { id: cashier.id } })).toBeNull();

            // Transaction survives with userId nulled (SET NULL), not delete-cascaded.
            const transaction = await prisma.transaction.findFirstOrThrow();
            expect(transaction.userId).toBeNull();
        });
    });

    describe("PATCH /registration/account/:userId/status", () => {
        it("deactivates and reactivates an account under its managing role", async () => {
            const subscriber = await prisma.user.create({
                data: {
                    email: "status.subscriber@gmail.com",
                    password: passwordHash,
                    firstName: "Status",
                    lastName: "Subscriber",
                    role: RoleType.HQADMIN,
                    businessId: business.id,
                },
            });

            setCurrentAuthUser(roles[RoleType.SUPERADMIN]);

            await request(app)
                .patch(`/registration/account/${subscriber.id}/status`)
                .send({ action: "deactivate" })
                .expect(200);

            expect((await prisma.user.findUniqueOrThrow({ where: { id: subscriber.id } })).accountStatus).toBe(
                "DEACTIVATED"
            );

            await request(app)
                .patch(`/registration/account/${subscriber.id}/status`)
                .send({ action: "reactivate" })
                .expect(200);

            expect((await prisma.user.findUniqueOrThrow({ where: { id: subscriber.id } })).accountStatus).toBe(
                "ACTIVE"
            );
        });

        it("prevents an admin from managing a role it does not own", async () => {
            // A branch manager cannot manage an HQ admin.
            setCurrentAuthUser(roles[RoleType.BRANCHMANAGER]);

            const res = await request(app)
                .patch(`/registration/account/${roles[RoleType.HQADMIN].id}/status`)
                .send({ action: "deactivate" })
                .expect(403);

            expect(res.body).toEqual({ message: "Forbidden: You cannot manage this account" });
        });
    });

    describe("DELETE /registration/branches/:branchId (cascade)", () => {
        it("cascades: removes inventory + offer junction, orphans users and transactions", async () => {
            const branchB = await prisma.branch.create({
                data: { location: "Cascade Branch", accountLimit: 3, businessId: business.id },
            });

            await prisma.branchInventoryItem.create({
                data: { quantity: 5, reorderThreshold: 1, branchId: branchB.id },
            });

            const offer = await prisma.branchWideOffer.create({
                data: {
                    offerName: "Cascade Sale",
                    description: "delete me",
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 86400000),
                    isExclusive: false,
                    offerStatus: "DRAFT",
                    offerType: "OVERALL",
                    discountType: "PERCENTAGE",
                    overallDiscountValue: 10,
                },
            });

            await prisma.branchWideOfferBranches.create({
                data: { branchId: branchB.id, branchWideOfferId: offer.id },
            });

            const cashier = await prisma.user.create({
                data: {
                    email: "cascade.cashier@gmail.com",
                    password: passwordHash,
                    firstName: "Cascade",
                    lastName: "Cashier",
                    role: RoleType.CASHIER,
                    businessId: business.id,
                    branchId: branchB.id,
                },
            });

            await prisma.transaction.create({
                data: {
                    totalPrice: 200,
                    dateofTransaction: new Date(),
                    paymentMethod: "ECASH",
                    status: "COMPLETE",
                    discount: 5,
                    branchId: branchB.id,
                    userId: cashier.id,
                },
            });

            setCurrentAuthUser(roles[RoleType.HQADMIN]);

            await request(app).delete(`/registration/branches/${branchB.id}`).expect(200);

            expect(await prisma.branch.findUnique({ where: { id: branchB.id } })).toBeNull();
            expect(await prisma.branchInventoryItem.count({ where: { branchId: branchB.id } })).toBe(0);
            expect(await prisma.branchWideOfferBranches.count({ where: { branchId: branchB.id } })).toBe(0);

            // Users + transactions are orphaned (branchId nulled), not deleted.
            expect((await prisma.user.findUniqueOrThrow({ where: { id: cashier.id } })).branchId).toBeNull();
            expect((await prisma.transaction.findFirstOrThrow()).branchId).toBeNull();

            // The offer itself survives.
            expect(await prisma.branchWideOffer.findUnique({ where: { id: offer.id } })).not.toBeNull();
        });
    });
});
