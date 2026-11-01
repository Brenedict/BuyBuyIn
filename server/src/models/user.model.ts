import type { RoleType, User } from "@buybuyin/shared/prisma/client";
import { type AccountRegistrationSchemaType } from "@buybuyin/shared/schema/registration";
import prisma from "../config/prisma.config";
import type { UserUncheckedUpdateInput } from "@buybuyin/shared/prisma/models";

export default {
    async getById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    async getByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async getByResetToken(resetToken: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                resetToken: resetToken,
            },
        });
    },

    // Fetches a single account including its linked business / branch (used by edit + delete-context popups).
    async getByIdWithRelations(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
            include: {
                business: { select: { id: true, name: true, location: true } },
                branch: { select: { id: true, location: true } },
            },
        });
    },

    async getByRole(role: RoleType, businessId?: number | null): Promise<User[]> {
        return prisma.user.findMany({
            where: {
                role,
                ...(businessId ? { businessId } : {}),
            },
            include: {
                business: { select: { id: true, name: true, location: true } },
                branch: { select: { id: true, location: true } },
            },
            orderBy: { createdAt: "asc" },
        });
    },

    async createUser(user: AccountRegistrationSchemaType, temporaryPassword: string, role: RoleType): Promise<User> {
        return prisma.user.create({
            data: {
                ...user,
                password: temporaryPassword,
                role,
            },
        });
    },

    async updateUser(userId: number, user: UserUncheckedUpdateInput): Promise<User | null> {
        return prisma.user.update({
            where: {
                id: userId,
            },
            data: user,
        });
    },

    // Deletes the account row. Historic transactions reference this user via Transaction.userId,
    // which the DB SET NULLs on delete, so those transactions are preserved (not cascade-deleted).
    async deleteUser(userId: number): Promise<User> {
        return prisma.user.delete({
            where: { id: userId },
        });
    },

    // Counts other HQ ADMIN accounts still linked to the same business (used by the delete-confirmation popup).
    async countOtherSubscribersByBusiness(businessId: number | null, excludeUserId: number): Promise<number> {
        if (!businessId) return 0;

        return prisma.user.count({
            where: {
                role: "HQADMIN",
                businessId,
                id: { not: excludeUserId },
            },
        });
    },

    // Counts other BRANCH MANAGER accounts still linked to the same branch (used by the delete-confirmation popup).
    async countOtherManagersByBranch(branchId: number | null, excludeUserId: number): Promise<number> {
        if (!branchId) return 0;

        return prisma.user.count({
            where: {
                role: "BRANCHMANAGER",
                branchId,
                id: { not: excludeUserId },
            },
        });
    },
};
