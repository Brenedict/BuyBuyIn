import {
    type BranchEntityRegistrationSchemaType,
    type BranchEntityUpdateSchemaType,
} from "@buybuyin/shared/schema/registration";

import prisma from "../config/prisma.config";
import type { Branch } from "@buybuyin/shared/prisma/client";

export default {
    async getById(id: number): Promise<Branch | null> {
        return prisma.branch.findUnique({
            where: { id },
        });
    },

    async getByBusinessId(businessId: number): Promise<Branch[]> {
        return prisma.branch.findMany({
            where: { businessId },
            orderBy: { location: "asc" },
        });
    },

    async createBranch(branch: BranchEntityRegistrationSchemaType & { businessId: number }) {
        return prisma.branch.create({
            data: branch,
        });
    },

    async updateBranch(id: number, branch: BranchEntityUpdateSchemaType): Promise<Branch> {
        return prisma.branch.update({
            where: { id },
            data: branch,
        });
    },

    // CASCADE DELETE:
    // The DB only SET NULLs branchId on Users/Transactions/Inventory and RESTRICTs the
    // BranchWideOfferBranches junction, so a raw delete would fail for offer-linked branches.
    // This manually clears every branch referential path before deleting the branch itself:
    // (1) hard-deletes the branch's inventory items and offer-junction rows,
    // (2) orphans transactions + users (their branchId is nulled, history is kept),
    // (3) deletes the branch. Documented in CHANGELOG.md.
    async deleteBranchCascade(id: number): Promise<Branch> {
        return prisma.$transaction(async (tx) => {
            await tx.branchInventoryItem.deleteMany({ where: { branchId: id } });
            await tx.branchWideOfferBranch.deleteMany({ where: { branchId: id } });
            await tx.transaction.updateMany({ where: { branchId: id }, data: { branchId: null } });
            await tx.user.updateMany({ where: { branchId: id }, data: { branchId: null } });

            return tx.branch.delete({ where: { id } });
        });
    },
};
