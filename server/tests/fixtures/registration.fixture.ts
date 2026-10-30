import type { RoleType } from "@buybuyin/shared/prisma/enums";

export type MockUser = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: RoleType;
};

export const mockSuperAdmin: MockUser = {
    email: "superadmin@gmail.com",
    password: "password123",
    firstName: "Super",
    lastName: "Admin",
    role: "SUPERADMIN",
};

export const mockHqAdmin: MockUser = {
    email: "hqadmin@gmail.com",
    password: "password123",
    firstName: "HQ",
    lastName: "Admin",
    role: "HQADMIN",
};

export const mockBranchManager: MockUser = {
    email: "branchmanager@gmail.com",
    password: "password123",
    firstName: "Branch",
    lastName: "Manager",
    role: "BRANCHMANAGER",
};

export const mockCashier: MockUser = {
    email: "cashier@gmail.com",
    password: "password123",
    firstName: "Squidward",
    lastName: "Cashier",
    role: "CASHIER",
};

export const mockBusinessPayload = {
    name: "BuyBuyin HQ",
    location: "Manila",
};

export const mockBranchPayload = {
    location: "Quezon City Branch",
    accountLimit: 10,
};

export const mockSubscriberPayload = {
    email: "subscriber.acc@gmail.com",
    firstName: "Steve",
    lastName: "MC",
};
