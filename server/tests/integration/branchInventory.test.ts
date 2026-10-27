// General Imports
import request from "supertest";
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it } from "@jest/globals";

// BuyBuyin Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";
import type { Branch, BranchInventoryItem } from "@buybuyin/shared/prisma/client";
import type {
    BranchInventoryEntry,
    BranchInventoryListResponse,
    BranchInventoryOptionsResponse,
} from "@buybuyin/shared/schema/branchInventory";

// Routes
import authRouter from "../../src/routes/auth.route";
import branchInventoryRouter from "../../src/routes/branchInventory.route";
import productRouter from "../../src/routes/product.route";

// Prisma.config
import prisma from "../../src/config/prisma.config";
import { app, setCurrentAuthUser } from "../../jest.integration";

// Helpers
import { resetDatabase } from "../helpers/database.helper";

// Fixtures
import { buildMockProduct, mockBranch, mockBusiness, mockSupplier, seedCatalogue } from "../fixtures/catalogue.fixture";
import type { SeededCatalogue } from "../fixtures/catalogue.fixture";
import { buildMockInventoryItem } from "../fixtures/branchInventory.fixture";
import { PASSWORD, seedUsers } from "../fixtures/user.fixture";
import type { SeededUsers } from "../fixtures/user.fixture";

describe("Branch inventory routes", () => {
    app.use("/auth", authRouter);
    app.use("/product", productRouter);
    app.use("/branch-inventory", branchInventoryRouter);

    let catalogue: SeededCatalogue;
    let users: SeededUsers;
    let secondBranch: Branch;
    let stock: {
        alpha: BranchInventoryItem;
        beta: BranchInventoryItem;
        gamma: BranchInventoryItem;
        delta: BranchInventoryItem;
        secondBranchEpsilon: BranchInventoryItem;
    };

    // ----------------------------- SETUP -----------------------------------------------------

    beforeEach(async () => {
        await resetDatabase();
        catalogue = await seedCatalogue();

        secondBranch = await prisma.branch.create({
            data: { ...mockBranch, location: "Second Branch", businessId: catalogue.business.id },
        });

        users = await seedUsers(catalogue.business.id, catalogue.branch.id, secondBranch.id);

        const alpha = findProduct("Alpha Shirt");
        const beta = findProduct("Beta Mug");
        const gamma = findProduct("Gamma Pen");
        const delta = findProduct("Delta Bag");
        const epsilon = findProduct("Epsilon Cap");

        stock = {
            alpha: await prisma.branchInventoryItem.create({
                data: buildMockInventoryItem({
                    branchId: catalogue.branch.id,
                    productId: alpha.id,
                    quantity: 10,
                    reorderThreshold: 5,
                }),
            }),
            beta: await prisma.branchInventoryItem.create({
                data: buildMockInventoryItem({
                    branchId: catalogue.branch.id,
                    productId: beta.id,
                    quantity: 3,
                    reorderThreshold: 5,
                }),
            }),
            gamma: await prisma.branchInventoryItem.create({
                data: buildMockInventoryItem({
                    branchId: catalogue.branch.id,
                    productId: gamma.id,
                    quantity: 0,
                    reorderThreshold: 5,
                }),
            }),
            delta: await prisma.branchInventoryItem.create({
                data: buildMockInventoryItem({
                    branchId: catalogue.branch.id,
                    productId: delta.id,
                    quantity: 20,
                    reorderThreshold: 10,
                }),
            }),
            secondBranchEpsilon: await prisma.branchInventoryItem.create({
                data: buildMockInventoryItem({
                    branchId: secondBranch.id,
                    productId: epsilon.id,
                    quantity: 99,
                    reorderThreshold: 5,
                }),
            }),
        };
    });

    function findProduct(productName: string) {
        const product = catalogue.products.find((entry) => entry.productName === productName);

        if (!product) {
            throw new Error(`Missing seeded product ${productName}`);
        }

        return product;
    }

    const findCategory = (categoryName: string) => {
        const category = catalogue.categories.find((entry) => entry.categoryName === categoryName);

        if (!category) {
            throw new Error(`Missing seeded category ${categoryName}`);
        }

        return category;
    };

    const findSupplier = (supplierName: string) => {
        const supplier = catalogue.suppliers.find((entry) => entry.supplierName === supplierName);

        if (!supplier) {
            throw new Error(`Missing seeded supplier ${supplierName}`);
        }

        return supplier;
    };

    const skuFor = (productId: number) => `SKU-${String(productId).padStart(4, "0")}`;

    const seedForeignProduct = async () => {
        const business = await prisma.business.create({
            data: { ...mockBusiness, name: "Foreign Business", location: "Cebu, Philippines" },
        });
        const supplier = await prisma.supplier.create({
            data: {
                ...mockSupplier,
                supplierName: "Foreign Supplier",
                email: "foreign@supplier.test",
                businessId: business.id,
            },
        });
        const category = await prisma.category.create({ data: { categoryName: "Foreign Category" } });

        const product = await prisma.product.create({
            data: buildMockProduct({
                productName: "Foreign Product",
                businessId: business.id,
                supplierId: supplier.id,
            }),
        });

        await prisma.productCategory.create({ data: { productId: product.id, categoryId: category.id } });

        return { business, supplier, category, product };
    };

    // ----------------------------- GET /branch-inventory -------------------------------------

    describe("GET /branch-inventory", () => {
        it("returns the branch stock with a branch-wide summary", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get("/branch-inventory").expect(200);

            const body = res.body as BranchInventoryListResponse;

            expect(body).toHaveProperty("items");
            expect(body).toHaveProperty("summary");
            expect(body).toHaveProperty("pagination");
            expect(body.items.map((item) => item.product.productName)).toEqual([
                "Alpha Shirt",
                "Beta Mug",
                "Delta Bag",
                "Gamma Pen",
            ]);

            expect(body.summary).toEqual({
                totalItems: 4,
                totalCategories: 2,
                totalStockValue: 12800,
                lowStockCount: 1,
                outOfStockCount: 1,
            });

            const alpha = body.items.find((item) => item.product.productName === "Alpha Shirt");

            expect(alpha).toEqual({
                id: stock.alpha.id,
                product: {
                    id: findProduct("Alpha Shirt").id,
                    productName: "Alpha Shirt",
                    basePrice: 200,
                    shelfPrice: 250,
                    category: { id: findCategory("Apparel").id, categoryName: "Apparel" },
                    supplier: { id: findSupplier("Acme Supplies").id, supplierName: "Acme Supplies" },
                    sku: skuFor(findProduct("Alpha Shirt").id),
                },
                quantity: 10,
                reorderThreshold: 5,
                unitPrice: 250,
                stockValue: 2500,
                status: "IN_STOCK",
            });
            expect(Object.keys(alpha as BranchInventoryEntry).sort()).toEqual([
                "id",
                "product",
                "quantity",
                "reorderThreshold",
                "status",
                "stockValue",
                "unitPrice",
            ]);
        });

        it("filters by stock status", async () => {
            setCurrentAuthUser(users.branchManager);

            const inStock = await request(app).get("/branch-inventory?status=in-stock").expect(200);
            expect((inStock.body as BranchInventoryListResponse).items.map((item) => item.product.productName)).toEqual(
                ["Alpha Shirt", "Delta Bag"]
            );

            const lowStock = await request(app).get("/branch-inventory?status=low-stock").expect(200);
            expect(
                (lowStock.body as BranchInventoryListResponse).items.map((item) => item.product.productName)
            ).toEqual(["Beta Mug"]);

            const outOfStock = await request(app).get("/branch-inventory?status=out-of-stock").expect(200);
            expect(
                (outOfStock.body as BranchInventoryListResponse).items.map((item) => item.product.productName)
            ).toEqual(["Gamma Pen"]);
        });

        it("filters by product name while keeping the summary branch-wide", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get("/branch-inventory?search=beta").expect(200);

            const body = res.body as BranchInventoryListResponse;

            expect(body.items).toHaveLength(1);
            expect(body.items[0]?.product.productName).toBe("Beta Mug");
            expect(body.summary.totalItems).toBe(4);
            expect(body.pagination.total).toBe(1);
        });

        it("filters by category and by supplier", async () => {
            setCurrentAuthUser(users.branchManager);

            const byCategory = await request(app)
                .get(`/branch-inventory?categoryId=${findCategory("Apparel").id}`)
                .expect(200);
            expect(
                (byCategory.body as BranchInventoryListResponse).items.map((item) => item.product.productName)
            ).toEqual(["Alpha Shirt", "Delta Bag"]);

            const bySupplier = await request(app)
                .get(`/branch-inventory?supplierId=${findSupplier("Acme Supplies").id}`)
                .expect(200);
            expect(
                (bySupplier.body as BranchInventoryListResponse).items.map((item) => item.product.productName)
            ).toEqual(["Alpha Shirt", "Gamma Pen"]);
        });

        it("paginates the branch stock", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get("/branch-inventory?page=2&limit=2").expect(200);

            const body = res.body as BranchInventoryListResponse;

            expect(body.items.map((item) => item.product.productName)).toEqual(["Delta Bag", "Gamma Pen"]);
            expect(body.pagination).toEqual({ page: 2, limit: 2, total: 4, totalPages: 2 });
        });

        it("never leaks items stocked by another branch", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get("/branch-inventory").expect(200);

            const body = res.body as BranchInventoryListResponse;

            expect(body.items).toHaveLength(4);
            expect(body.items.map((item) => item.id)).not.toContain(stock.secondBranchEpsilon.id);
            expect(body.items.find((item) => item.product.productName === "Epsilon Cap")).toBeUndefined();
        });
    });

    // ----------------------------- GET /branch-inventory/options -----------------------------

    describe("GET /branch-inventory/options", () => {
        it("returns business products that are not stocked in the requestor's branch", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get("/branch-inventory/options").expect(200);

            const body = res.body as BranchInventoryOptionsResponse;

            expect(body.products.map((product) => product.productName)).toEqual(["Epsilon Cap"]);
        });

        it("includes newly created business products and excludes other businesses", async () => {
            await prisma.product.create({
                data: buildMockProduct({
                    productName: "Zeta Jacket",
                    businessId: catalogue.business.id,
                    supplierId: findSupplier("Acme Supplies").id,
                }),
            });

            await seedForeignProduct();

            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get("/branch-inventory/options").expect(200);

            const body = res.body as BranchInventoryOptionsResponse;

            expect(body.products.map((product) => product.productName)).toEqual(["Epsilon Cap", "Zeta Jacket"]);
        });
    });

    // ----------------------------- GET /branch-inventory/:id ---------------------------------

    describe("GET /branch-inventory/:id", () => {
        it("returns a single inventory item", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get(`/branch-inventory/${stock.beta.id}`).expect(200);

            const item = res.body as BranchInventoryEntry;

            expect(item.id).toBe(stock.beta.id);
            expect(item.product.productName).toBe("Beta Mug");
            expect(item.product.sku).toBe(skuFor(findProduct("Beta Mug").id));
            expect(item.quantity).toBe(3);
            expect(item.status).toBe("LOW_STOCK");
        });

        it("returns 404 for an item of another branch", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get(`/branch-inventory/${stock.secondBranchEpsilon.id}`).expect(404);

            expect(res.body).toEqual({ error: "Inventory item not found" });
        });

        it("returns 404 for a non-numeric item id", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get("/branch-inventory/abc").expect(404);

            expect(res.body).toEqual({ error: "Inventory item not found" });
        });
    });

    // ----------------------------- POST /branch-inventory ------------------------------------

    describe("POST /branch-inventory", () => {
        it("adds an unstocked product to the requestor's branch", async () => {
            const epsilon = findProduct("Epsilon Cap");

            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .post("/branch-inventory")
                .send({ productId: epsilon.id, quantity: 5, reorderThreshold: 2 })
                .expect(201);

            expect(res.body.message).toBe("Item added to inventory");
            expect((res.body.item as BranchInventoryEntry).product.productName).toBe("Epsilon Cap");

            const stored = await prisma.branchInventoryItem.findUnique({
                where: { id: (res.body.item as BranchInventoryEntry).id },
            });

            expect(stored?.branchId).toBe(catalogue.branch.id);
            expect(stored?.quantity).toBe(5);
            expect(stored?.reorderThreshold).toBe(2);
        });

        it("returns 409 when the product is already stocked in the branch", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .post("/branch-inventory")
                .send({ productId: findProduct("Alpha Shirt").id, quantity: 1, reorderThreshold: 1 })
                .expect(409);

            expect(res.body).toEqual({ error: "Product is already stocked in this branch" });
        });

        it("returns 400 for a product of another business", async () => {
            const { product } = await seedForeignProduct();

            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .post("/branch-inventory")
                .send({ productId: product.id, quantity: 1, reorderThreshold: 1 })
                .expect(400);

            expect(res.body).toEqual({ error: "Product not found in your business" });
        });

        it("returns 400 for a product without a business", async () => {
            const orphan = await prisma.product.create({
                data: buildMockProduct({ productName: "Orphan Product", businessId: null }),
            });

            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .post("/branch-inventory")
                .send({ productId: orphan.id, quantity: 1, reorderThreshold: 1 })
                .expect(400);

            expect(res.body).toEqual({ error: "Product not found in your business" });
        });

        it("returns 400 for missing and negative quantities", async () => {
            setCurrentAuthUser(users.branchManager);
            const epsilon = findProduct("Epsilon Cap");

            await request(app)
                .post("/branch-inventory")
                .send({ productId: epsilon.id, reorderThreshold: 2 })
                .expect(400);

            await request(app)
                .post("/branch-inventory")
                .send({ productId: epsilon.id, quantity: -1, reorderThreshold: 2 })
                .expect(400);
        });
    });

    // ----------------------------- PATCH /branch-inventory/:id/restock -----------------------

    describe("PATCH /branch-inventory/:id/restock", () => {
        it("increments the quantity", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .patch(`/branch-inventory/${stock.alpha.id}/restock`)
                .send({ quantity: 5 })
                .expect(200);

            const item = res.body.item as BranchInventoryEntry;

            expect(res.body.message).toBe("Item restocked");
            expect(item.quantity).toBe(15);
            expect(item.reorderThreshold).toBe(5);
        });

        it("updates the reorder threshold when provided", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .patch(`/branch-inventory/${stock.alpha.id}/restock`)
                .send({ quantity: 1, reorderThreshold: 12 })
                .expect(200);

            const item = res.body.item as BranchInventoryEntry;

            expect(item.quantity).toBe(11);
            expect(item.reorderThreshold).toBe(12);
        });

        it("returns 404 for an item of another branch", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .patch(`/branch-inventory/${stock.secondBranchEpsilon.id}/restock`)
                .send({ quantity: 1 })
                .expect(404);

            expect(res.body).toEqual({ error: "Inventory item not found" });
        });

        it("rejects a zero quantity", async () => {
            setCurrentAuthUser(users.branchManager);

            await request(app).patch(`/branch-inventory/${stock.alpha.id}/restock`).send({ quantity: 0 }).expect(400);
        });

        it("deducts quantity when action is deduct", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .patch(`/branch-inventory/${stock.alpha.id}/restock`)
                .send({ quantity: 3, action: "deduct" })
                .expect(200);

            const item = res.body.item as BranchInventoryEntry;

            expect(item.quantity).toBe(7);
        });

        it("rejects deducting more than the current stock", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .patch(`/branch-inventory/${stock.alpha.id}/restock`)
                .send({ quantity: 100, action: "deduct" })
                .expect(400);

            expect(res.body).toEqual({ error: "Cannot deduct more than the current stock" });
        });
    });

    // ----------------------------- DELETE /branch-inventory/:id ------------------------------

    describe("DELETE /branch-inventory/:id", () => {
        it("removes only the inventory row and keeps the product", async () => {
            const beta = findProduct("Beta Mug");

            setCurrentAuthUser(users.branchManager);

            const res = await request(app).delete(`/branch-inventory/${stock.beta.id}`).expect(200);

            expect(res.body).toEqual({ message: "Item removed from inventory" });
            expect(await prisma.branchInventoryItem.findUnique({ where: { id: stock.beta.id } })).toBeNull();
            expect(await prisma.product.findUnique({ where: { id: beta.id } })).not.toBeNull();
        });

        it("returns 404 when deleting the same item twice", async () => {
            setCurrentAuthUser(users.branchManager);

            await request(app).delete(`/branch-inventory/${stock.beta.id}`).expect(200);

            const res = await request(app).delete(`/branch-inventory/${stock.beta.id}`).expect(404);

            expect(res.body).toEqual({ error: "Inventory item not found" });
        });
    });

    // ----------------------------- ROLE GATES ------------------------------------------------

    describe("Role gates", () => {
        it("forbids HQ admins, cashiers and anonymous requests from reading inventory", async () => {
            setCurrentAuthUser(users.hqAdmin);

            await request(app).get("/branch-inventory").expect(403);

            setCurrentAuthUser(users.cashier);

            await request(app).get("/branch-inventory").expect(403);

            setCurrentAuthUser(null);

            await request(app).get("/branch-inventory").expect(401);
        });

        it("forbids HQ admins from mutating inventory", async () => {
            setCurrentAuthUser(users.hqAdmin);
            const epsilon = findProduct("Epsilon Cap");

            const mutations = [
                () =>
                    request(app)
                        .post("/branch-inventory")
                        .send({ productId: epsilon.id, quantity: 1, reorderThreshold: 1 }),
                () => request(app).patch(`/branch-inventory/${stock.alpha.id}/restock`).send({ quantity: 1 }),
                () => request(app).delete(`/branch-inventory/${stock.alpha.id}`),
            ];

            for (const mutate of mutations) {
                setCurrentAuthUser(users.hqAdmin);
                await mutate().expect(403);
            }
        });

        it("rejects a branch manager that is not attached to a branch", async () => {
            const createdUser = await prisma.user.create({
                data: {
                    email: "branchmanager.nobranch@test.local",
                    password: await bcrypt.hash(PASSWORD, 10),
                    firstName: "Bella",
                    lastName: "NoBranch",
                    role: RoleType.BRANCHMANAGER,
                    businessId: catalogue.business.id,
                    branchId: null,
                },
            });

            setCurrentAuthUser(createdUser);

            const res = await request(app).get("/branch-inventory").expect(403);

            expect(res.body).toEqual({ error: "User is not attached to a branch" });
        });
    });
});
