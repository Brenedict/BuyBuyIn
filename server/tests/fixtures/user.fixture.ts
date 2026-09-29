import type { UserCreateInput } from "@buybuyin/shared/prisma/models";

export type UserCreate = UserCreateInput & { id: number };

export const mockUser: UserCreate = {
    id: 1,
    username: "john",
    email: "johndoe@gmail.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
};
