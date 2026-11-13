import prisma from "../src/config/prisma.config";

const BUSINESS_NAME = "BuyBuyIn Trading Corp.";
const BRANCH_LOCATION = "Main Branch — Quezon City";

const testProducts = [
    { name: "[POS TEST] Bottled Water 500ml", category: "General", price: 25, supplier: "OfficeWorld PH" },
    { name: "[POS TEST] Potato Chips 100g", category: "General", price: 45, supplier: "OfficeWorld PH" },
    { name: "[POS TEST] A5 Notebook", category: "General", price: 65, supplier: "OfficeWorld PH" },
    { name: "[POS TEST] USB-C Cable 1m", category: "Accessories", price: 199, supplier: "OfficeWorld PH" },
];

async function main() {
    const business = await prisma.business.findFirst({ where: { name: BUSINESS_NAME } });
    if (!business) {
        throw new Error(`Business "${BUSINESS_NAME}" was not found. Run the development seed first.`);
    }

    const branch = await prisma.branch.findFirst({
        where: { businessId: business.id, location: BRANCH_LOCATION },
    });
    if (!branch) {
        throw new Error(`Branch "${BRANCH_LOCATION}" was not found. Run the development seed first.`);
    }

    for (const fixture of testProducts) {
        let supplier = await prisma.supplier.findFirst({
            where: { businessId: business.id, supplierName: fixture.supplier },
        });
        if (!supplier) {
            supplier = await prisma.supplier.create({
                data: {
                    supplierName: fixture.supplier,
                    contactPerson: "POS Test Supplier",
                    email: "pos-test@example.invalid",
                    contactNumber: "09000000000",
                    address: "Development test data",
                    businessId: business.id,
                },
            });
        }

        let category = await prisma.category.findFirst({ where: { categoryName: fixture.category } });
        if (!category) {
            category = await prisma.category.create({ data: { categoryName: fixture.category } });
        }

        let product = await prisma.product.findFirst({
            where: { businessId: business.id, productName: fixture.name },
        });
        if (!product) {
            product = await prisma.product.create({
                data: {
                    productName: fixture.name,
                    basePrice: Math.round(fixture.price * 0.6 * 100) / 100,
                    shelfPrice: fixture.price,
                    businessId: business.id,
                    supplierId: supplier.id,
                },
            });
        }

        const productCategory = await prisma.productCategory.findFirst({
            where: { categoryId: category.id, productId: product.id },
        });
        if (!productCategory) {
            await prisma.productCategory.create({
                data: { categoryId: category.id, productId: product.id },
            });
        }

        const inventory = await prisma.branchInventoryItem.findFirst({
            where: { branchId: branch.id, productId: product.id },
        });
        if (inventory) {
            await prisma.branchInventoryItem.update({
                where: { id: inventory.id },
                data: { quantity: 50, reorderThreshold: 10 },
            });
        } else {
            await prisma.branchInventoryItem.create({
                data: {
                    branchId: branch.id,
                    productId: product.id,
                    quantity: 50,
                    reorderThreshold: 10,
                },
            });
        }
    }

    console.log(`Seeded ${testProducts.length} POS test products into ${BRANCH_LOCATION}.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error: unknown) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
