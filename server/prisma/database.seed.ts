// BuyBuyin Shared Imports
import prisma from "../src/config/prisma.config";
import HashUtil from "../src/utils/hash.util";

// Seed Types
type SupplierSeed = {
    supplierName: string;
    contactPerson: string;
    email: string;
    contactNumber: string;
    address: string;
};

type ProductSeed = {
    productName: string;
    categoryName: string;
    shelfPrice: number;
    supplierName: string;
};

type InventorySeed = {
    productName: string;
    quantity: number;
    reorderThreshold: number;
};

type UserSeed = {
    email: string;
    role: "SUPERADMIN" | "HQADMIN" | "BRANCHMANAGER" | "CASHIER";
    businessId: number | null;
    branchId: number | null;
};

// Supplier Data
const supplierSeeds: SupplierSeed[] = [
    {
        supplierName: "OfficeWorld PH",
        contactPerson: "John Doe",
        contactNumber: "09817929146",
        email: "restock@officeworldph.net",
        address: "123 Ayala Avenue, Makati City, Metro Manila, 1226",
    },
    {
        supplierName: "Printex PH",
        contactPerson: "Jane Doe",
        contactNumber: "09957222447",
        email: "order@printexph.com",
        address: "45 Quezon Avenue, Diliman, Quezon City, 1101",
    },
    {
        supplierName: "Taytay Garments Co.",
        contactPerson: "Mateo Santos",
        contactNumber: "09175558899",
        email: "b2b@taytaygarments.ph",
        address: "Block 4, Lot 12, Kadalagahan St., Taytay, Rizal, 1920",
    },
    {
        supplierName: "Manila Textile Distributors",
        contactPerson: "Sofia Reyes",
        contactNumber: "09183334455",
        email: "wholesale@manilatextile.com",
        address: "842 Juan Luna St., Binondo, Manila, 1006",
    },
    {
        supplierName: "Vivas Apparel Manufacturing",
        contactPerson: "Carlos Vivas",
        contactNumber: "09227776611",
        email: "factory@vivasapparel.com.ph",
        address: "12 Industrial Highway, Bagumbayan, Taguig City, 1630",
    },
    {
        supplierName: "Island Styles Garments",
        contactPerson: "Mikaela Cruz",
        contactNumber: "09176664422",
        email: "hello@islandstyles.ph",
        address: "22 Sampaguita St., Lucban, Quezon, 4328",
    },
];

// Category Data
const categorySeeds: { categoryName: string }[] = [
    { categoryName: "Printing" },
    { categoryName: "General" },
    { categoryName: "Polo Shirts" },
    { categoryName: "Activewear" },
    { categoryName: "Jackets" },
    { categoryName: "Accessories" },
    { categoryName: "Shorts" },
    { categoryName: "T-Shirts" },
    { categoryName: "Jeans" },
    { categoryName: "Hoodies" },
    { categoryName: "Dresses" },
];

// Product Data
const productSeeds: ProductSeed[] = [
    {
        productName: "Thermal Receipt Paper 80mm",
        categoryName: "Printing",
        shelfPrice: 48.0,
        supplierName: "Printex PH",
    },
    {
        productName: "Ballpen Black (Box/12)",
        categoryName: "General",
        shelfPrice: 72.0,
        supplierName: "OfficeWorld PH",
    },
    {
        productName: "Premium Pique Polo Shirt (Navy - L)",
        categoryName: "Polo Shirts",
        shelfPrice: 599.0,
        supplierName: "Taytay Garments Co.",
    },
    {
        productName: "Performance Jogger Pants (Charcoal - M)",
        categoryName: "Activewear",
        shelfPrice: 799.0,
        supplierName: "Vivas Apparel Manufacturing",
    },
    {
        productName: "Athletic Mesh Gym Shorts (Black - XL)",
        categoryName: "Activewear",
        shelfPrice: 450.0,
        supplierName: "Vivas Apparel Manufacturing",
    },
    {
        productName: "Knitted Crop Cardigan (Beige - FS)",
        categoryName: "Jackets",
        shelfPrice: 699.0,
        supplierName: "Island Styles Garments",
    },
    {
        productName: "Canvas Tote Bag (Eco Cream)",
        categoryName: "Accessories",
        shelfPrice: 250.0,
        supplierName: "Manila Textile Distributors",
    },
    {
        productName: "High-Waisted Denim Shorts (Light Wash - 28)",
        categoryName: "Shorts",
        shelfPrice: 699.0,
        supplierName: "Manila Textile Distributors",
    },
    {
        productName: "Classic Cotton Crewneck (White - L)",
        categoryName: "T-Shirts",
        shelfPrice: 399.0,
        supplierName: "Taytay Garments Co.",
    },
    {
        productName: "Waterproof Windbreaker Jacket (Navy - M)",
        categoryName: "Jackets",
        shelfPrice: 1899.0,
        supplierName: "Vivas Apparel Manufacturing",
    },
    {
        productName: "Classic Cotton Crewneck (Black - M)",
        categoryName: "T-Shirts",
        shelfPrice: 399.0,
        supplierName: "Taytay Garments Co.",
    },
    {
        productName: "Slim Fit Denim Jeans (Dark Wash - 32)",
        categoryName: "Jeans",
        shelfPrice: 1299.0,
        supplierName: "Manila Textile Distributors",
    },
    {
        productName: "Oversized Streetwear Hoodie (Sage - L)",
        categoryName: "Hoodies",
        shelfPrice: 1499.0,
        supplierName: "Vivas Apparel Manufacturing",
    },
    {
        productName: "Floral Summer Midi Dress (Pastel - S)",
        categoryName: "Dresses",
        shelfPrice: 899.0,
        supplierName: "Island Styles Garments",
    },
];

// Branch Inventory Data
const inventorySeeds: InventorySeed[] = [
    { productName: "Thermal Receipt Paper 80mm", quantity: 144, reorderThreshold: 30 },
    { productName: "Ballpen Black (Box/12)", quantity: 0, reorderThreshold: 10 },
    { productName: "Premium Pique Polo Shirt (Navy - L)", quantity: 18, reorderThreshold: 25 },
    { productName: "Performance Jogger Pants (Charcoal - M)", quantity: 85, reorderThreshold: 20 },
    { productName: "Athletic Mesh Gym Shorts (Black - XL)", quantity: 12, reorderThreshold: 30 },
    { productName: "Knitted Crop Cardigan (Beige - FS)", quantity: 62, reorderThreshold: 15 },
    { productName: "Canvas Tote Bag (Eco Cream)", quantity: 110, reorderThreshold: 40 },
    { productName: "High-Waisted Denim Shorts (Light Wash - 28)", quantity: 40, reorderThreshold: 20 },
    { productName: "Classic Cotton Crewneck (White - L)", quantity: 120, reorderThreshold: 50 },
    { productName: "Waterproof Windbreaker Jacket (Navy - M)", quantity: 5, reorderThreshold: 15 },
    { productName: "Classic Cotton Crewneck (Black - M)", quantity: 0, reorderThreshold: 50 },
    { productName: "Slim Fit Denim Jeans (Dark Wash - 32)", quantity: 0, reorderThreshold: 20 },
    { productName: "Oversized Streetwear Hoodie (Sage - L)", quantity: 0, reorderThreshold: 15 },
    { productName: "Floral Summer Midi Dress (Pastel - S)", quantity: 0, reorderThreshold: 15 },
];

// Seed Runner
async function main() {
    await prisma.transactionItem.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.branchInventoryItem.deleteMany();
    await prisma.branchWideOfferProduct.deleteMany();
    await prisma.branchWideOfferBranches.deleteMany();
    await prisma.branchWideOffer.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.user.deleteMany();
    await prisma.branch.deleteMany();
    await prisma.businessSubscription.deleteMany();
    await prisma.business.deleteMany();
    await prisma.subscription.deleteMany();

    // Business and its main branch
    const business = await prisma.business.create({
        data: {
            name: "BuyBuyIn Trading Corp.",
            location: "Quezon City, Metro Manila",
        },
    });

    const branch = await prisma.branch.create({
        data: {
            location: "Main Branch — Quezon City",
            accountLimit: 20,
            businessId: business.id,
        },
    });

    // Suppliers
    const suppliers = await prisma.supplier.createManyAndReturn({
        data: supplierSeeds.map((supplier) => ({ ...supplier, businessId: business.id })),
    });
    const supplierIdByName = new Map(suppliers.map((supplier) => [supplier.supplierName, supplier.id]));

    // Categories
    const categories = await prisma.category.createManyAndReturn({
        data: categorySeeds,
    });
    const categoryIdByName = new Map(categories.map((category) => [category.categoryName, category.id]));

    // Products
    const products = await prisma.product.createManyAndReturn({
        data: productSeeds.map((product) => ({
            productName: product.productName,
            basePrice: Math.round(product.shelfPrice * 0.6 * 100) / 100,
            shelfPrice: product.shelfPrice,
            businessId: business.id,
            supplierId: supplierIdByName.get(product.supplierName)!,
        })),
    });
    const productIdByName = new Map(products.map((product) => [product.productName, product.id]));

    // Product-category junction
    await prisma.productCategory.createMany({
        data: productSeeds.map((product) => ({
            categoryId: categoryIdByName.get(product.categoryName)!,
            productId: productIdByName.get(product.productName)!,
        })),
    });

    // Branch inventory
    await prisma.branchInventoryItem.createMany({
        data: inventorySeeds.map((item) => ({
            branchId: branch.id,
            productId: productIdByName.get(item.productName)!,
            quantity: item.quantity,
            reorderThreshold: item.reorderThreshold,
        })),
    });

    // Users
    const hashedPassword = await HashUtil.hashPassword("password123");
    const userSeeds: UserSeed[] = [
        {
            email: "superadmin@gmail.com",
            role: "SUPERADMIN",
            businessId: null,
            branchId: null,
        },
        {
            email: "hqadmin@gmail.com",
            role: "HQADMIN",
            businessId: business.id,
            branchId: null,
        },
        {
            email: "branchmanager@gmail.com",
            role: "BRANCHMANAGER",
            businessId: business.id,
            branchId: branch.id,
        },
        {
            email: "cashier@gmail.com",
            role: "CASHIER",
            businessId: business.id,
            branchId: branch.id,
        },
    ];

    await prisma.user.createMany({
        data: userSeeds.map((user) => ({
            email: user.email,
            password: hashedPassword,
            firstName: "John",
            lastName: "Doe",
            role: user.role,
            businessId: user.businessId,
            branchId: user.branchId,
        })),
    });

    // Summary
    const [
        businesses,
        branches,
        suppliersCount,
        categoriesCount,
        productsCount,
        productCategories,
        branchInventoryItems,
        users,
    ] = await Promise.all([
        prisma.business.count(),
        prisma.branch.count(),
        prisma.supplier.count(),
        prisma.category.count(),
        prisma.product.count(),
        prisma.productCategory.count(),
        prisma.branchInventoryItem.count(),
        prisma.user.count(),
    ]);

    console.log("Seed complete:", {
        businesses,
        branches,
        suppliers: suppliersCount,
        categories: categoriesCount,
        products: productsCount,
        productCategories,
        branchInventoryItems,
        users,
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
