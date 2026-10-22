// General Imports
import bcrypt from "bcryptjs";

// BuyBuyin Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";
import type { User } from "@buybuyin/shared/prisma/client";
import type { UserUncheckedCreateInput } from "@buybuyin/shared/prisma/models";

// Prisma.config
import prisma from "../../src/config/prisma.config";

// ----------------------------- TYPES -----------------------------------------------------

export type UserCreate = UserUncheckedCreateInput;

export type SeededUsers = {
    hqAdmin: User;
    branchManager: User;
    cashier: User;
    secondBranchManager: User;
};

// ----------------------------- FIXTURES --------------------------------------------------

export const PASSWORD = "password123";

export const mockUser: UserCreate = {
    email: "johndoe@gmail.com",
    password: PASSWORD,
    firstName: "John",
    lastName: "Doe",
};

export const mockHqAdmin: UserCreate = {
    email: "hqadmin@test.local",
    password: PASSWORD,
    firstName: "Hana",
    lastName: "Admin",
    role: RoleType.HQADMIN,
    businessId: 1,
};

export const mockBranchManager: UserCreate = {
    email: "branchmanager@test.local",
    password: PASSWORD,
    firstName: "Berto",
    lastName: "Manager",
    role: RoleType.BRANCHMANAGER,
    businessId: 1,
    branchId: 1,
};

export const mockCashier: UserCreate = {
    email: "cashier@test.local",
    password: PASSWORD,
    firstName: "Cara",
    lastName: "Cashier",
    role: RoleType.CASHIER,
    businessId: 1,
    branchId: 1,
};

export const mockSecondBranchManager: UserCreate = {
    email: "branchmanager2@test.local",
    password: PASSWORD,
    firstName: "Bruno",
    lastName: "Manager",
    role: RoleType.BRANCHMANAGER,
    businessId: 1,
    branchId: 2,
};

export const mockHqAdminNoBusiness: UserCreate = {
    email: "hqadmin.nobusiness@test.local",
    password: PASSWORD,
    firstName: "Nora",
    lastName: "NoBusiness",
    role: RoleType.HQADMIN,
    businessId: null,
};

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

/**
 * Creates the catalogue users for a business/branch pair.
 *
 * `branchId` is the primary branch used by the HQ admin (none), branch manager
 * and cashier. The second branch manager joins `secondBranchId` when a suite
 * seeds a second branch, otherwise it falls back to the primary branch.
 */
export const seedUsers = async (
    businessId: number,
    branchId: number,
    secondBranchId: number = branchId
): Promise<SeededUsers> => {
    const password = await bcrypt.hash(PASSWORD, 10);

    const [hqAdmin, branchManager, cashier, secondBranchManager] = await prisma.$transaction([
        prisma.user.create({ data: { ...mockHqAdmin, password, businessId, branchId: null } }),
        prisma.user.create({ data: { ...mockBranchManager, password, businessId, branchId } }),
        prisma.user.create({ data: { ...mockCashier, password, businessId, branchId } }),
        prisma.user.create({ data: { ...mockSecondBranchManager, password, businessId, branchId: secondBranchId } }),
    ]);

    return { hqAdmin, branchManager, cashier, secondBranchManager };
};
