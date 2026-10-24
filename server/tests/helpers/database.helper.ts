// Prisma.config
import prisma from "../../src/config/prisma.config";

export const resetDatabase = async (): Promise<void> => {
    await prisma.$transaction([
        prisma.branchInventoryItem.deleteMany(),
        prisma.transactionItem.deleteMany(),
        prisma.transaction.deleteMany(),
        prisma.branchWideOfferBranches.deleteMany(),
        prisma.branchWideOfferProduct.deleteMany(),
        prisma.branchWideOffer.deleteMany(),
        prisma.productCategory.deleteMany(),
        prisma.product.deleteMany(),
        prisma.businessSubscription.deleteMany(),
        prisma.subscription.deleteMany(),
        prisma.user.deleteMany(),
        prisma.branch.deleteMany(),
        prisma.business.deleteMany(),
        prisma.supplier.deleteMany(),
        prisma.category.deleteMany(),
    ]);
};
