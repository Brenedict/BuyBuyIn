import type { RoleType } from "@buybuyin/shared/prisma/enums";

export type MockUser = {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: RoleType;
};

export const mockSuperAdmin: MockUser = {
    username: "Xx_superadmin_xX",
    email: "superadmin@gmail.com",
    password: "password123",
    firstName: "Super",
    lastName: "Admin",
    role: "SUPERADMIN",
};

export const mockHqAdmin: MockUser = {
    username: "TheHQAdmin",
    email: "hqadmin@gmail.com",
    password: "password123",
    firstName: "HQ",
    lastName: "Admin",
    role: "HQADMIN",
};

export const mockBranchManager: MockUser = {
    username: "LocalManager029",
    email: "branchmanager@gmail.com",
    password: "password123",
    firstName: "Branch",
    lastName: "Manager",
    role: "BRANCHMANAGER",
};

export const mockCashier: MockUser = {
    username: "SquidwardCashier",
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

export const mockSubscriberPayload = {
    username: "SomeSubscriber",
    email: "subscriber.acc@gmail.com",
    firstName: "Steve",
    lastName: "MC",
};
