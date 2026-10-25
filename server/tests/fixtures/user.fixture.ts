import type { UserUncheckedCreateInput } from "@buybuyin/shared/prisma/models";

export type UserCreate = UserUncheckedCreateInput & { id: number };

export const mockUser: UserCreate = {
    id: 1,
    email: "johndoe@gmail.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    accountStatus: "ACTIVE",
};
