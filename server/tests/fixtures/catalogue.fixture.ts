// BuyBuyin Shared Imports
import type { Branch, Business, Category, Product, Supplier } from "@buybuyin/shared/prisma/client";
import type { ProductUncheckedCreateInput } from "@buybuyin/shared/prisma/models";

// Prisma.config
import prisma from "../../src/config/prisma.config";

// ----------------------------- TYPES -----------------------------------------------------

export type SeededCatalogue = {
    business: Business;
    branch: Branch;
    suppliers: Supplier[];
    categories: Category[];
    products: Product[];
};

// ----------------------------- FIXTURES --------------------------------------------------

export const mockBusiness = {
    name: "BuyBuyIn Test Business",
    location: "Manila, Philippines",
};

export const mockBranch = {
    location: "Quezon City Branch",
    accountLimit: 10,
};

export const mockSupplier = {
    supplierName: "Acme Supplies",
    contactPerson: "Carla Cruz",
    email: "carla@acmesupplies.test",
    contactNumber: "09171234567",
    address: "12 Acme Street, Manila",
};

export const mockCategory = {
    categoryName: "Apparel",
};

export const buildMockProduct = (
    overrides: Partial<ProductUncheckedCreateInput> = {}
): ProductUncheckedCreateInput => ({
    productName: "Alpha Shirt",
    basePrice: 200,
    shelfPrice: 250,
    ...overrides,
});

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

/**
 * Seeds a business, one branch, two suppliers, two categories and five products.
 *
 * Product names are chosen so alphabetical ordering, search and pagination
 * assertions stay stable. Prices are round numbers so totals can be asserted
 * exactly.
 */
export const seedCatalogue = async (): Promise<SeededCatalogue> => {
    const business = await prisma.business.create({ data: mockBusiness });
    const branch = await prisma.branch.create({ data: { ...mockBranch, businessId: business.id } });

    const primarySupplier = await prisma.supplier.create({ data: mockSupplier });
    const secondarySupplier = await prisma.supplier.create({
        data: {
            ...mockSupplier,
            supplierName: "Global Traders",
            contactPerson: "Gina Torres",
            email: "sales@globaltraders.test",
            contactNumber: "09179876543",
            address: "45 Trade Avenue, Pasig",
        },
    });

    const apparelCategory = await prisma.category.create({ data: mockCategory });
    const homewareCategory = await prisma.category.create({ data: { categoryName: "Homeware" } });

    const suppliers = [primarySupplier, secondarySupplier];
    const categories = [apparelCategory, homewareCategory];

    const seeds = [
        { productName: "Alpha Shirt", basePrice: 200, shelfPrice: 250, supplier: 0, category: 0 },
        { productName: "Beta Mug", basePrice: 80, shelfPrice: 100, supplier: 1, category: 1 },
        { productName: "Gamma Pen", basePrice: 15, shelfPrice: 20, supplier: 0, category: 1 },
        { productName: "Delta Bag", basePrice: 400, shelfPrice: 500, supplier: 1, category: 0 },
        { productName: "Epsilon Cap", basePrice: 120, shelfPrice: 150, supplier: 0, category: 0 },
    ];

    const products: Product[] = [];

    for (const seed of seeds) {
        const supplier = suppliers[seed.supplier];
        const category = categories[seed.category];

        const product = await prisma.product.create({
            data: buildMockProduct({
                productName: seed.productName,
                basePrice: seed.basePrice,
                shelfPrice: seed.shelfPrice,
                businessId: business.id,
                supplierId: supplier.id,
            }),
        });

        await prisma.productCategory.create({
            data: { productId: product.id, categoryId: category.id },
        });

        products.push(product);
    }

    return { business, branch, suppliers, categories, products };
};
