// General Imports
import type { SupplierWhereInput } from "@buybuyin/shared/prisma/models";
import type { User } from "@buybuyin/shared/prisma/browser";
import type {
    SupplierEntry,
    SupplierFormCreateType,
    SupplierFormUpdateType,
    SupplierListResponse,
    SupplierQueryType,
} from "@buybuyin/shared/schema/supplier";

// Models
import SupplierModel from "../models/supplier.model";

// Utils
import { HttpError } from "../utils/error.util";

// ----------------------------- TYPES -----------------------------------------------------

type Requestor = Pick<User, "id" | "role" | "businessId">;

// ----------------------------- PRIVATE FUNCTIONS -----------------------------------------

const resolveBusinessId = (requestor: Requestor): number => {
    if (requestor.businessId === null) {
        throw new HttpError(403, "User is not attached to a business");
    }

    return requestor.businessId;
};

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

export default {
    resolveBusinessId,

    async getSuppliers(requestor: Requestor, query: SupplierQueryType): Promise<SupplierListResponse> {
        const businessId = resolveBusinessId(requestor);
        const { search, page, limit } = query;

        const where: SupplierWhereInput = {
            businessId,
            ...(search && { supplierName: { contains: search, mode: "insensitive" } }),
        };

        const [suppliers, total] = await Promise.all([
            SupplierModel.getSuppliers({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { supplierName: "asc" },
                select: SupplierModel.SUPPLIER_SELECT,
            }),
            SupplierModel.count({ where }),
        ]);

        return {
            suppliers: suppliers.map((supplier): SupplierEntry => ({ ...supplier })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    },

    async getSupplier(requestor: Requestor, supplierId: number): Promise<SupplierEntry> {
        const businessId = resolveBusinessId(requestor);
        const supplier = await SupplierModel.getSupplierForBusiness(supplierId, businessId);

        if (!supplier) {
            throw new HttpError(404, "Supplier not found");
        }

        return supplier;
    },

    async createSupplier(requestor: Requestor, input: SupplierFormCreateType): Promise<SupplierEntry> {
        const businessId = resolveBusinessId(requestor);

        return SupplierModel.createSupplier({
            data: { ...input, businessId },
        });
    },

    async updateSupplier(
        requestor: Requestor,
        supplierId: number,
        input: SupplierFormUpdateType
    ): Promise<SupplierEntry> {
        const businessId = resolveBusinessId(requestor);
        const existing = await SupplierModel.getSupplierForBusiness(supplierId, businessId);

        if (!existing) {
            throw new HttpError(404, "Supplier not found");
        }

        return SupplierModel.updateSupplier(supplierId, input);
    },

    async deleteSupplier(requestor: Requestor, supplierId: number): Promise<void> {
        const businessId = resolveBusinessId(requestor);
        const existing = await SupplierModel.getSupplierForBusiness(supplierId, businessId);

        if (!existing) {
            throw new HttpError(404, "Supplier not found");
        }

        const count = await SupplierModel.countProductsForSupplier(supplierId);

        if (count > 0) {
            throw new HttpError(409, `Supplier is used by ${count} product${count === 1 ? "" : "s"}`);
        }

        await SupplierModel.deleteSupplier(supplierId);
    },
};
