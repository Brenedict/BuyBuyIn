// General Imports
import type { Request, Response } from "express";
import type { BranchInventoryItemWhereInput, ProductWhereInput } from "@buybuyin/shared/prisma/models";
import type { User } from "@buybuyin/shared/prisma/browser";
import type {
    BranchInventoryEntry,
    BranchInventoryFormCreateType,
    BranchInventoryFormRestockType,
    BranchInventoryListResponse,
    BranchInventoryOptionsResponse,
    BranchInventoryProduct,
    BranchInventoryQueryType,
    BranchInventoryStatusType,
    BranchInventorySummary,
} from "@buybuyin/shared/schema/branchInventory";
import type { CatalogueProduct } from "@buybuyin/shared/schema/product";

// Models
import BranchInventoryModel from "../models/branchInventory.model";
import ProductModel from "../models/product.model";

// Utils
import { HttpError } from "../utils/error.util";
import { round2 } from "../utils/math.util";

// ----------------------------- TYPES -----------------------------------------------------

type Requestor = Pick<User, "id" | "role" | "businessId" | "branchId">;
type InventoryRow = NonNullable<Awaited<ReturnType<typeof BranchInventoryModel.getItemById>>>;
type SummaryRow = Awaited<ReturnType<typeof BranchInventoryModel.getBranchSummaryRows>>[number];
type ProductRow = NonNullable<Awaited<ReturnType<typeof ProductModel.getProductById>>>;

// ----------------------------- PRIVATE FUNCTIONS -----------------------------------------

const STATUS_MAP: Record<NonNullable<BranchInventoryQueryType["status"]>, BranchInventoryStatusType> = {
    "in-stock": "IN_STOCK",
    "low-stock": "LOW_STOCK",
    "out-of-stock": "OUT_OF_STOCK",
};

const resolveBranchId = (requestor: Requestor): number => {
    if (requestor.branchId === null) {
        throw new HttpError(403, "User is not attached to a branch");
    }

    return requestor.branchId;
};

const resolveBusinessId = (requestor: Requestor): number => {
    if (requestor.businessId === null) {
        throw new HttpError(403, "User is not attached to a business");
    }

    return requestor.businessId;
};

const getSku = (productId: number): string => `SKU-${String(productId).padStart(4, "0")}`;

const getStatus = (quantity: number, reorderThreshold: number): BranchInventoryStatusType => {
    if (quantity === 0) {
        return "OUT_OF_STOCK";
    }

    return quantity <= reorderThreshold ? "LOW_STOCK" : "IN_STOCK";
};

const mapProduct = (product: ProductRow): CatalogueProduct => ({
    id: product.id,
    productName: product.productName,
    basePrice: product.basePrice,
    shelfPrice: product.shelfPrice,
    category: product.productCategories[0]?.category ?? null,
    supplier: product.supplier,
});

const mapEntry = (row: InventoryRow): BranchInventoryEntry => {
    if (!row.product) {
        throw new HttpError(404, "Inventory item not found");
    }

    const product = row.product;
    const branchProduct: BranchInventoryProduct = {
        id: product.id,
        productName: product.productName,
        basePrice: product.basePrice,
        shelfPrice: product.shelfPrice,
        category: product.productCategories[0]?.category ?? null,
        supplier: product.supplier,
        sku: getSku(product.id),
    };

    return {
        id: row.id,
        product: branchProduct,
        quantity: row.quantity,
        reorderThreshold: row.reorderThreshold,
        unitPrice: product.shelfPrice,
        stockValue: round2(row.quantity * product.shelfPrice),
        status: getStatus(row.quantity, row.reorderThreshold),
    };
};

const buildSummary = (rows: SummaryRow[]): BranchInventorySummary => {
    const categoryIds = new Set<number>();
    let totalStockValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const row of rows) {
        totalStockValue += row.quantity * (row.product?.shelfPrice ?? 0);

        for (const productCategory of row.product?.productCategories ?? []) {
            categoryIds.add(productCategory.category.id);
        }

        if (row.quantity === 0) {
            outOfStockCount += 1;
        } else if (row.quantity <= row.reorderThreshold) {
            lowStockCount += 1;
        }
    }

    return {
        totalItems: rows.length,
        totalCategories: categoryIds.size,
        totalStockValue: round2(totalStockValue),
        lowStockCount,
        outOfStockCount,
    };
};

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

export default {
    resolveBranchId,
    resolveBusinessId,

    async getBranchInventory(
        requestor: Requestor,
        query: BranchInventoryQueryType
    ): Promise<BranchInventoryListResponse> {
        const branchId = resolveBranchId(requestor);
        const { search, categoryId, supplierId, status, page, limit } = query;

        const productWhere: ProductWhereInput = {
            ...(search && { productName: { contains: search, mode: "insensitive" } }),
            ...(supplierId && { supplierId }),
            ...(categoryId && { productCategories: { some: { categoryId } } }),
        };

        const where: BranchInventoryItemWhereInput = {
            branchId,
            ...(Object.keys(productWhere).length > 0 && { product: productWhere }),
            ...(status && BranchInventoryModel.getStatusWhere(STATUS_MAP[status])),
        };

        const [items, total, summaryRows] = await Promise.all([
            BranchInventoryModel.getItems({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { product: { productName: "asc" } },
            }),
            BranchInventoryModel.count({ where }),
            BranchInventoryModel.getBranchSummaryRows(branchId),
        ]);

        return {
            items: items.map(mapEntry),
            summary: buildSummary(summaryRows),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    },

    async getBranchInventoryItem(requestor: Requestor, itemId: number): Promise<BranchInventoryEntry> {
        const branchId = resolveBranchId(requestor);
        const item = await BranchInventoryModel.getItemForBranch(itemId, branchId);

        if (!item) {
            throw new HttpError(404, "Inventory item not found");
        }

        return mapEntry(item);
    },

    async getBranchInventoryOptions(requestor: Requestor): Promise<BranchInventoryOptionsResponse> {
        const businessId = resolveBusinessId(requestor);
        const branchId = resolveBranchId(requestor);

        const products = await ProductModel.getProductsNotStockedInBranch(businessId, branchId);

        return { products: products.map(mapProduct) };
    },

    async createBranchInventoryItem(
        requestor: Requestor,
        input: BranchInventoryFormCreateType
    ): Promise<BranchInventoryEntry> {
        const businessId = resolveBusinessId(requestor);
        const branchId = resolveBranchId(requestor);
        const { productId, quantity, reorderThreshold } = input;

        const product = await ProductModel.getProductForBusiness(productId, businessId);
        if (!product) {
            throw new HttpError(400, "Product not found in your business");
        }

        const existing = await BranchInventoryModel.getItemByProduct(productId, branchId);
        if (existing) {
            throw new HttpError(409, "Product is already stocked in this branch");
        }

        const item = await BranchInventoryModel.createItem({
            data: { branchId, productId, quantity, reorderThreshold },
        });

        return mapEntry(item);
    },

    async restockBranchInventoryItem(
        requestor: Requestor,
        itemId: number,
        input: BranchInventoryFormRestockType
    ): Promise<BranchInventoryEntry> {
        const branchId = resolveBranchId(requestor);
        const existing = await BranchInventoryModel.getItemForBranch(itemId, branchId);

        if (!existing) {
            throw new HttpError(404, "Inventory item not found");
        }

        const action = input.action ?? "add";
        const delta = action === "deduct" ? -input.quantity : input.quantity;
        const newQuantity = existing.quantity + delta;

        if (newQuantity < 0) {
            throw new HttpError(400, "Cannot deduct more than the current stock");
        }

        const item = await BranchInventoryModel.updateItemById(itemId, {
            quantity: newQuantity,
            ...(input.reorderThreshold !== undefined && { reorderThreshold: input.reorderThreshold }),
        });

        return mapEntry(item);
    },

    async deleteBranchInventoryItem(requestor: Requestor, itemId: number): Promise<void> {
        const branchId = resolveBranchId(requestor);
        const existing = await BranchInventoryModel.getItemForBranch(itemId, branchId);

        if (!existing) {
            throw new HttpError(404, "Inventory item not found");
        }

        await BranchInventoryModel.deleteItemById(itemId);
    },

    parseItemId(req: Request, res: Response): number | null {
        const itemId = Number(req.params.itemId);

        if (Number.isNaN(itemId)) {
            res.status(404).json({ error: "Inventory item not found" });
            return null;
        }

        return itemId;
    },
};
