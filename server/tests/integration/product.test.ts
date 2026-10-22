// General Imports
import request from "supertest";
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it } from "@jest/globals";

// BuyBuyin Shared Imports
import {
    DiscountType,
    OfferStatusType,
    OfferType,
    PaymentMethodType,
    TransactionStatusType,
} from "@buybuyin/shared/prisma/enums";
import type {
    CatalogueListResponse,
    CatalogueOptionsResponse,
    CatalogueProduct,
} from "@buybuyin/shared/schema/product";

// Routes
import authRouter from "../../src/routes/auth.route";
import productRouter from "../../src/routes/product.route";

// Prisma.config
import prisma from "../../src/config/prisma.config";
import { app } from "../../jest.integration";

// Helpers
import { resetDatabase } from "../helpers/database.helper";

// Fixtures
import { buildMockProduct, mockBusiness, mockSupplier, seedCatalogue } from "../fixtures/catalogue.fixture";
import type { SeededCatalogue } from "../fixtures/catalogue.fixture";
import { buildMockInventoryItem } from "../fixtures/branchInventory.fixture";
import {
    PASSWORD,
    mockBranchManager,
    mockCashier,
    mockHqAdmin,
    mockHqAdminNoBusiness,
    seedUsers,
} from "../fixtures/user.fixture";

describe("Product routes", () => {
    app.use("/auth", authRouter);
    app.use("/product", productRouter);

    let catalogue: SeededCatalogue;

    // ----------------------------- SETUP -----------------------------------------------------

    beforeEach(async () => {
        await resetDatabase();
        catalogue = await seedCatalogue();
        await seedUsers(catalogue.business.id, catalogue.branch.id);
    });

    const loginAs = async (email: string): Promise<string> => {
        const res = await request(app).post("/auth/login").send({ email, password: PASSWORD }).expect(200);

        return res.body.accessToken as string;
    };

    const authHeader = async (email: string) => ({ Authorization: `Bearer ${await loginAs(email)}` });

    const findProduct = (productName: string) => {
        const product = catalogue.products.find((entry) => entry.productName === productName);

        if (!product) {
            throw new Error(`Missing seeded product ${productName}`);
        }

        return product;
    };

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

    const seedForeignProduct = async () => {
        const business = await prisma.business.create({
            data: { ...mockBusiness, name: "Foreign Business", location: "Cebu, Philippines" },
        });
        const supplier = await prisma.supplier.create({
            data: { ...mockSupplier, supplierName: "Foreign Supplier", email: "foreign@supplier.test" },
        });
        const category = await prisma.category.create({ data: { categoryName: "Foreign Category" } });

        const product = await prisma.product.create({
            data: buildMockProduct({
                productName: "Foreign Product",
                businessId: business.id,
                supplierId: supplier.id,
            }),
        });

        await prisma.productCategory.create({
            data: { productId: product.id, categoryId: category.id },
        });

        return { business, supplier, category, product };
    };

    // ----------------------------- GET /product ----------------------------------------------

    describe("GET /product", () => {
        it("returns the catalogue sorted by product name with summary and pagination", async () => {
            const res = await request(app)
                .get("/product")
                .set(await authHeader(mockBranchManager.email))
                .expect(200);

            const body = res.body as CatalogueListResponse;

            expect(Object.keys(body).sort()).toEqual(["pagination", "products", "summary"]);
            expect(body.products.map((product) => product.productName)).toEqual([
                "Alpha Shirt",
                "Beta Mug",
                "Delta Bag",
                "Epsilon Cap",
                "Gamma Pen",
            ]);

            for (const product of body.products) {
                expect(Object.keys(product).sort()).toEqual([
                    "basePrice",
                    "category",
                    "id",
                    "productName",
                    "shelfPrice",
                    "supplier",
                ]);
                expect(product.category).not.toBeNull();
                expect(product.supplier).not.toBeNull();
            }

            expect(body.summary).toEqual({
                totalProducts: 5,
                totalCategories: 2,
                totalSuppliers: 2,
                averageShelfPrice: 204,
            });
            expect(body.pagination).toEqual({ page: 1, limit: 10, total: 5, totalPages: 1 });
        });

        it("filters by search case-insensitively while keeping the summary catalogue-wide", async () => {
            for (const search of ["alpha", "ALPHA"]) {
                const res = await request(app)
                    .get(`/product?search=${search}`)
                    .set(await authHeader(mockBranchManager.email))
                    .expect(200);

                const body = res.body as CatalogueListResponse;

                expect(body.products).toHaveLength(1);
                expect(body.products[0]?.productName).toBe("Alpha Shirt");
                expect(body.summary.totalProducts).toBe(5);
                expect(body.pagination.total).toBe(1);
            }
        });

        it("filters by category and reflects the filter in pagination", async () => {
            const apparel = findCategory("Apparel");

            const res = await request(app)
                .get(`/product?categoryId=${apparel.id}`)
                .set(await authHeader(mockBranchManager.email))
                .expect(200);

            const body = res.body as CatalogueListResponse;

            expect(body.products.map((product) => product.productName)).toEqual([
                "Alpha Shirt",
                "Delta Bag",
                "Epsilon Cap",
            ]);
            expect(body.summary.totalProducts).toBe(5);
            expect(body.pagination.total).toBe(3);
        });

        it("filters by supplier and reflects the filter in pagination", async () => {
            const acme = findSupplier("Acme Supplies");

            const res = await request(app)
                .get(`/product?supplierId=${acme.id}`)
                .set(await authHeader(mockBranchManager.email))
                .expect(200);

            const body = res.body as CatalogueListResponse;

            expect(body.products.map((product) => product.productName)).toEqual([
                "Alpha Shirt",
                "Epsilon Cap",
                "Gamma Pen",
            ]);
            expect(body.pagination.total).toBe(3);
        });

        it("paginates the catalogue", async () => {
            const res = await request(app)
                .get("/product?page=2&limit=2")
                .set(await authHeader(mockBranchManager.email))
                .expect(200);

            const body = res.body as CatalogueListResponse;

            expect(body.products.map((product) => product.productName)).toEqual(["Delta Bag", "Epsilon Cap"]);
            expect(body.pagination).toEqual({ page: 2, limit: 2, total: 5, totalPages: 3 });
        });

        it("rejects an invalid limit", async () => {
            const res = await request(app)
                .get("/product?limit=0")
                .set(await authHeader(mockBranchManager.email))
                .expect(400);

            expect(res.body).toHaveProperty("error");
        });
    });

    // ----------------------------- GET /product/:id -----------------------------------------

    describe("GET /product/:id", () => {
        it("returns a single product with its category and supplier", async () => {
            const alpha = findProduct("Alpha Shirt");
            const apparel = findCategory("Apparel");

            const res = await request(app)
                .get(`/product/${alpha.id}`)
                .set(await authHeader(mockBranchManager.email))
                .expect(200);

            expect(res.body).toEqual({
                id: alpha.id,
                productName: "Alpha Shirt",
                basePrice: 200,
                shelfPrice: 250,
                category: { id: apparel.id, categoryName: "Apparel" },
                supplier: { id: findSupplier("Acme Supplies").id, supplierName: "Acme Supplies" },
            });
        });

        it("returns 404 for a product of another business", async () => {
            const { product } = await seedForeignProduct();

            const res = await request(app)
                .get(`/product/${product.id}`)
                .set(await authHeader(mockBranchManager.email))
                .expect(404);

            expect(res.body).toEqual({ error: "Product not found" });
        });

        it("returns 404 for a non-numeric product id", async () => {
            const res = await request(app)
                .get("/product/abc")
                .set(await authHeader(mockBranchManager.email))
                .expect(404);

            expect(res.body).toEqual({ error: "Product not found" });
        });
    });

    // ----------------------------- GET /product/options -------------------------------------

    describe("GET /product/options", () => {
        it("returns only the suppliers and categories of the requestor's business", async () => {
            const res = await request(app)
                .get("/product/options")
                .set(await authHeader(mockBranchManager.email))
                .expect(200);

            const body = res.body as CatalogueOptionsResponse;

            expect(body.suppliers.map((supplier) => supplier.supplierName)).toEqual([
                "Acme Supplies",
                "Global Traders",
            ]);
            expect(body.categories.map((category) => category.categoryName)).toEqual(["Apparel", "Homeware"]);
        });

        it("does not leak another business' options", async () => {
            await seedForeignProduct();

            const res = await request(app)
                .get("/product/options")
                .set(await authHeader(mockBranchManager.email))
                .expect(200);

            const body = res.body as CatalogueOptionsResponse;

            expect(body.suppliers.map((supplier) => supplier.supplierName)).toEqual([
                "Acme Supplies",
                "Global Traders",
            ]);
            expect(body.categories.map((category) => category.categoryName)).toEqual(["Apparel", "Homeware"]);
        });
    });

    // ----------------------------- POST /product ---------------------------------------------

    describe("POST /product", () => {
        const validPayload = () => ({
            productName: "Zeta Jacket",
            basePrice: 300,
            shelfPrice: 450,
            supplierId: findSupplier("Acme Supplies").id,
            categoryId: findCategory("Apparel").id,
        });

        it("creates a product for the requestor's business", async () => {
            const payload = validPayload();

            const res = await request(app)
                .post("/product")
                .set(await authHeader(mockHqAdmin.email))
                .send(payload)
                .expect(201);

            expect(res.body.message).toBe("Product created");
            expect(res.body.product).toMatchObject({
                productName: "Zeta Jacket",
                basePrice: 300,
                shelfPrice: 450,
                category: { id: payload.categoryId, categoryName: "Apparel" },
                supplier: { id: payload.supplierId, supplierName: "Acme Supplies" },
            });

            const stored = await prisma.product.findFirst({
                where: { productName: "Zeta Jacket" },
                include: { productCategories: true },
            });

            expect(stored).not.toBeNull();
            expect(stored?.businessId).toBe(catalogue.business.id);
            expect(stored?.supplierId).toBe(payload.supplierId);
            expect(stored?.productCategories).toHaveLength(1);
            expect(stored?.productCategories[0]?.categoryId).toBe(payload.categoryId);
        });

        it("rejects missing and invalid fields", async () => {
            const headers = await authHeader(mockHqAdmin.email);
            const payload = validPayload();

            await request(app)
                .post("/product")
                .set(headers)
                .send({
                    basePrice: payload.basePrice,
                    shelfPrice: payload.shelfPrice,
                    supplierId: payload.supplierId,
                    categoryId: payload.categoryId,
                })
                .expect(400);

            await request(app)
                .post("/product")
                .set(headers)
                .send({ ...payload, basePrice: -1 })
                .expect(400);

            await request(app)
                .post("/product")
                .set(headers)
                .send({ ...payload, supplierId: 1.5 })
                .expect(400);
        });

        it("rejects a nonexistent supplier", async () => {
            const res = await request(app)
                .post("/product")
                .set(await authHeader(mockHqAdmin.email))
                .send({ ...validPayload(), supplierId: 999999 })
                .expect(400);

            expect(res.body).toEqual({ error: "Supplier not found" });
        });

        it("rejects a nonexistent category", async () => {
            const res = await request(app)
                .post("/product")
                .set(await authHeader(mockHqAdmin.email))
                .send({ ...validPayload(), categoryId: 999999 })
                .expect(400);

            expect(res.body).toEqual({ error: "Category not found" });
        });
    });

    // ----------------------------- PATCH /product/:id ---------------------------------------

    describe("PATCH /product/:id", () => {
        it("partially updates a product", async () => {
            const alpha = findProduct("Alpha Shirt");

            const res = await request(app)
                .patch(`/product/${alpha.id}`)
                .set(await authHeader(mockHqAdmin.email))
                .send({ shelfPrice: 275 })
                .expect(200);

            const product = res.body.product as CatalogueProduct;

            expect(res.body.message).toBe("Product updated");
            expect(product.productName).toBe("Alpha Shirt");
            expect(product.shelfPrice).toBe(275);
        });

        it("replaces the product category", async () => {
            const alpha = findProduct("Alpha Shirt");
            const homeware = findCategory("Homeware");

            const res = await request(app)
                .patch(`/product/${alpha.id}`)
                .set(await authHeader(mockHqAdmin.email))
                .send({ categoryId: homeware.id })
                .expect(200);

            expect((res.body.product as CatalogueProduct).category).toEqual({
                id: homeware.id,
                categoryName: "Homeware",
            });

            const junctions = await prisma.productCategory.findMany({ where: { productId: alpha.id } });

            expect(junctions).toHaveLength(1);
            expect(junctions[0]?.categoryId).toBe(homeware.id);
        });

        it("returns 404 for a product of another business", async () => {
            const { product } = await seedForeignProduct();

            const res = await request(app)
                .patch(`/product/${product.id}`)
                .set(await authHeader(mockHqAdmin.email))
                .send({ shelfPrice: 1 })
                .expect(404);

            expect(res.body).toEqual({ error: "Product not found" });
        });
    });

    // ----------------------------- DELETE /product/:id --------------------------------------

    describe("DELETE /product/:id", () => {
        it("deletes the product, its category junctions and its inventory rows", async () => {
            const epsilon = findProduct("Epsilon Cap");

            await prisma.branchInventoryItem.create({
                data: buildMockInventoryItem({ branchId: catalogue.branch.id, productId: epsilon.id }),
            });

            const res = await request(app)
                .delete(`/product/${epsilon.id}`)
                .set(await authHeader(mockHqAdmin.email))
                .expect(200);

            expect(res.body).toEqual({ message: "Product deleted" });
            expect(await prisma.product.findUnique({ where: { id: epsilon.id } })).toBeNull();
            expect(await prisma.productCategory.count({ where: { productId: epsilon.id } })).toBe(0);
            expect(await prisma.branchInventoryItem.count({ where: { productId: epsilon.id } })).toBe(0);
        });

        it("returns 404 when deleting the same product twice", async () => {
            const epsilon = findProduct("Epsilon Cap");
            const headers = await authHeader(mockHqAdmin.email);

            await request(app).delete(`/product/${epsilon.id}`).set(headers).expect(200);

            const res = await request(app).delete(`/product/${epsilon.id}`).set(headers).expect(404);

            expect(res.body).toEqual({ error: "Product not found" });
        });

        it("returns 404 for a product of another business", async () => {
            const { product } = await seedForeignProduct();

            const res = await request(app)
                .delete(`/product/${product.id}`)
                .set(await authHeader(mockHqAdmin.email))
                .expect(404);

            expect(res.body).toEqual({ error: "Product not found" });
        });

        it("returns 409 when the product is referenced by a transaction item", async () => {
            const beta = findProduct("Beta Mug");

            const offer = await prisma.branchWideOffer.create({
                data: {
                    offerName: "Bundle Offer",
                    description: "Test bundle",
                    startDate: new Date("2026-01-01T00:00:00.000Z"),
                    endDate: new Date("2026-12-31T00:00:00.000Z"),
                    isExclusive: false,
                    offerStatus: OfferStatusType.ENABLED,
                    offerType: OfferType.INDIVIDUAL,
                    discountType: DiscountType.FIXEDVALUE,
                    overallDiscountValue: 10,
                },
            });

            const transaction = await prisma.transaction.create({
                data: {
                    totalPrice: 100,
                    dateofTransaction: new Date("2026-02-01T00:00:00.000Z"),
                    paymentMethod: PaymentMethodType.CASH,
                    status: TransactionStatusType.COMPLETE,
                    discount: 0,
                    branchId: catalogue.branch.id,
                },
            });

            await prisma.transactionItem.create({
                data: {
                    quantity: 1,
                    currentPrice: 100,
                    isBundle: false,
                    transactionId: transaction.id,
                    branchWideOfferId: offer.id,
                    productId: beta.id,
                },
            });

            await request(app)
                .delete(`/product/${beta.id}`)
                .set(await authHeader(mockHqAdmin.email))
                .expect(409);

            expect(await prisma.product.findUnique({ where: { id: beta.id } })).not.toBeNull();
        });
    });

    // ----------------------------- ROLE GATES ------------------------------------------------

    describe("Role gates", () => {
        it("allows HQ admins and branch managers to read the catalogue", async () => {
            await request(app)
                .get("/product")
                .set(await authHeader(mockHqAdmin.email))
                .expect(200);
            await request(app)
                .get("/product")
                .set(await authHeader(mockBranchManager.email))
                .expect(200);
        });

        it("forbids cashiers and anonymous requests from reading the catalogue", async () => {
            await request(app)
                .get("/product")
                .set(await authHeader(mockCashier.email))
                .expect(403);
            await request(app).get("/product").expect(401);
        });

        it("forbids branch managers and anonymous requests from mutating the catalogue", async () => {
            const alpha = findProduct("Alpha Shirt");
            const headers = await authHeader(mockBranchManager.email);

            const mutations = [
                () => request(app).post("/product").send({}),
                () => request(app).patch(`/product/${alpha.id}`).send({}),
                () => request(app).delete(`/product/${alpha.id}`),
            ];

            for (const mutate of mutations) {
                await mutate().set(headers).expect(403);
                await mutate().expect(401);
            }
        });

        it("rejects an HQ admin that is not attached to a business", async () => {
            await prisma.user.create({
                data: { ...mockHqAdminNoBusiness, password: await bcrypt.hash(PASSWORD, 10) },
            });

            const res = await request(app)
                .get("/product")
                .set(await authHeader(mockHqAdminNoBusiness.email as string))
                .expect(403);

            expect(res.body).toEqual({ error: "User is not attached to a business" });
        });
    });
});
