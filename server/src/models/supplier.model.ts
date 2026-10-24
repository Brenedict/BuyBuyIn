// BuyBuyin Shared Imports
import type {
    SupplierCountArgs,
    SupplierCreateArgs,
    SupplierFindManyArgs,
    SupplierUncheckedUpdateInput,
} from "@buybuyin/shared/prisma/models";

// Prisma.config
import prisma from "../config/prisma.config";

export const SUPPLIER_SELECT = {
    id: true,
    supplierName: true,
    contactPerson: true,
    email: true,
    contactNumber: true,
    address: true,
} as const;

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

export default {
    SUPPLIER_SELECT,

    async getSuppliersForBusiness(businessId: number) {
        return prisma.supplier.findMany({
            where: { businessId },
            orderBy: { supplierName: "asc" },
            select: { id: true, supplierName: true },
        });
    },

    async countForBusiness(businessId: number) {
        return prisma.supplier.count({ where: { businessId } });
    },

    async getSupplierById(id: number) {
        return prisma.supplier.findUnique({ where: { id } });
    },

    async getSuppliers(args?: SupplierFindManyArgs) {
        return prisma.supplier.findMany({ ...args, select: SUPPLIER_SELECT });
    },

    async count(args?: SupplierCountArgs) {
        return prisma.supplier.count(args);
    },

    async getSupplierForBusiness(id: number, businessId: number) {
        return prisma.supplier.findFirst({ where: { id, businessId }, select: SUPPLIER_SELECT });
    },

    async createSupplier(args: SupplierCreateArgs) {
        return prisma.supplier.create({ ...args, select: SUPPLIER_SELECT });
    },

    async updateSupplier(id: number, data: SupplierUncheckedUpdateInput) {
        return prisma.supplier.update({ where: { id }, data, select: SUPPLIER_SELECT });
    },

    async deleteSupplier(id: number) {
        return prisma.supplier.delete({ where: { id }, select: SUPPLIER_SELECT });
    },

    async countProductsForSupplier(supplierId: number) {
        return prisma.product.count({ where: { supplierId } });
    },
};
