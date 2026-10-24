// General Imports
import type {
    ProductUncheckedUpdateInput,
    ProductUpdateInput,
    ProductWhereInput,
} from "@buybuyin/shared/prisma/models";
import type { User } from "@buybuyin/shared/prisma/browser";
import type {
    CatalogueListResponse,
    CatalogueOptionsResponse,
    CatalogueProduct,
    ProductFormCreateType,
    ProductFormUpdateType,
    ProductQueryType,
} from "@buybuyin/shared/schema/product";

// Models
import ProductModel, { PRODUCT_SELECT } from "../models/product.model";
import SupplierModel from "../models/supplier.model";
import CategoryModel from "../models/category.model";

// Utils
import { HttpError } from "../utils/error.util";

// ----------------------------- TYPES -----------------------------------------------------

type Requestor = Pick<User, "id" | "role" | "businessId">;
type ProductRow = NonNullable<Awaited<ReturnType<typeof ProductModel.getProductById>>>;

// ----------------------------- PRIVATE FUNCTIONS -----------------------------------------

const resolveBusinessId = (requestor: Requestor): number => {
    if (requestor.businessId === null) {
        throw new HttpError(403, "User is not attached to a business");
    }

    return requestor.businessId;
};

const mapProduct = (product: ProductRow): CatalogueProduct => ({
    id: product.id,
    productName: product.productName,
    basePrice: product.basePrice,
    shelfPrice: product.shelfPrice,
    category: product.productCategories[0]?.category ?? null,
    supplier: product.supplier,
});

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

export default {
    resolveBusinessId,

    async getCatalogue(requestor: Requestor, query: ProductQueryType): Promise<CatalogueListResponse> {
        const businessId = resolveBusinessId(requestor);
        const { search, categoryId, supplierId, page, limit } = query;

        const where: ProductWhereInput = {
            businessId,
            ...(search && { productName: { contains: search, mode: "insensitive" } }),
            ...(supplierId && { supplierId }),
            ...(categoryId && { productCategories: { some: { categoryId } } }),
        };

        const summaryWhere: ProductWhereInput = { businessId };

        const [products, total, summaryTotal, aggregate, totalSuppliers, totalCategories] = await Promise.all([
            ProductModel.getProducts({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { productName: "asc" },
                select: PRODUCT_SELECT,
            }),
            ProductModel.count({ where }),
            ProductModel.count({ where: summaryWhere }),
            ProductModel.aggregate({ where: summaryWhere, _avg: { shelfPrice: true } }),
            SupplierModel.countForBusiness(businessId),
            CategoryModel.countForBusiness(businessId),
        ]);

        return {
            products: products.map(mapProduct),
            summary: {
                totalProducts: summaryTotal,
                totalCategories,
                totalSuppliers,
                averageShelfPrice: Math.round((aggregate._avg?.shelfPrice ?? 0) * 100) / 100,
            },
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    },

    async getCatalogueProduct(requestor: Requestor, productId: number): Promise<CatalogueProduct> {
        const businessId = resolveBusinessId(requestor);
        const product = await ProductModel.getProductForBusiness(productId, businessId);

        if (!product) {
            throw new HttpError(404, "Product not found");
        }

        return mapProduct(product);
    },

    async getCatalogueOptions(requestor: Requestor): Promise<CatalogueOptionsResponse> {
        const businessId = resolveBusinessId(requestor);

        const [suppliers, categories] = await Promise.all([
            SupplierModel.getSuppliersForBusiness(businessId),
            CategoryModel.getCategoriesForBusiness(businessId),
        ]);

        return { suppliers, categories };
    },

    async createCatalogueProduct(requestor: Requestor, input: ProductFormCreateType): Promise<CatalogueProduct> {
        const businessId = resolveBusinessId(requestor);
        const { productName, basePrice, shelfPrice, supplierId, categoryId } = input;

        const supplier = await SupplierModel.getSupplierById(supplierId);
        if (!supplier) {
            throw new HttpError(400, "Supplier not found");
        }

        const category = await CategoryModel.getCategoryById(categoryId);
        if (!category) {
            throw new HttpError(400, "Category not found");
        }

        const product = await ProductModel.createProduct({
            data: {
                productName,
                basePrice,
                shelfPrice,
                businessId,
                supplierId,
                productCategories: { create: { categoryId } },
            },
            select: PRODUCT_SELECT,
        });

        return mapProduct(product);
    },

    async updateCatalogueProduct(
        requestor: Requestor,
        productId: number,
        input: ProductFormUpdateType
    ): Promise<CatalogueProduct> {
        const businessId = resolveBusinessId(requestor);
        const existing = await ProductModel.getProductForBusiness(productId, businessId);

        if (!existing) {
            throw new HttpError(404, "Product not found");
        }

        const { supplierId, categoryId, ...fields } = input;

        if (supplierId !== undefined) {
            const supplier = await SupplierModel.getSupplierById(supplierId);
            if (!supplier) {
                throw new HttpError(400, "Supplier not found");
            }
        }

        if (categoryId !== undefined) {
            const category = await CategoryModel.getCategoryById(categoryId);
            if (!category) {
                throw new HttpError(400, "Category not found");
            }
        }

        const data: ProductUpdateInput = {
            ...fields,
            ...(supplierId !== undefined && { supplierId }),
            ...(categoryId !== undefined && { productCategories: { deleteMany: {}, create: { categoryId } } }),
        };

        const product = await ProductModel.updateProductById(productId, data as ProductUncheckedUpdateInput);

        return mapProduct(product);
    },

    async deleteCatalogueProduct(requestor: Requestor, productId: number): Promise<void> {
        const businessId = resolveBusinessId(requestor);
        const existing = await ProductModel.getProductForBusiness(productId, businessId);

        if (!existing) {
            throw new HttpError(404, "Product not found");
        }

        const state = await ProductModel.getProductDeleteState(productId);

        if ((state?._count.transactionItems ?? 0) > 0) {
            throw new HttpError(409, "Product is already used in transactions");
        }

        await ProductModel.deleteProductCascade(productId);
    },
};
