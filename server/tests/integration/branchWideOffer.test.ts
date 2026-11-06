// General Imports
import request from "supertest";
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it } from "@jest/globals";

// BuyBuyin Shared Imports
import type { Branch, Business, Product } from "@buybuyin/shared/prisma/client";
import type {
    BranchWideOfferEntry,
    BranchWideOfferFormType,
    BranchWideOfferListResponse,
    BranchWideOfferOptionsResponse,
} from "@buybuyin/shared/schema/branchWideOffer";

// Routes
import branchWideOfferRouter from "../../src/routes/branchWideOffer.route";

// Prisma.config
import prisma from "../../src/config/prisma.config";
import { app, setCurrentAuthUser } from "../../jest.integration";

// Helpers
import { resetDatabase } from "../helpers/database.helper";

// Fixtures
import { buildMockProduct, mockBranch, mockBusiness, seedCatalogue } from "../fixtures/catalogue.fixture";
import type { SeededCatalogue } from "../fixtures/catalogue.fixture";
import { buildMockOffer } from "../fixtures/branchWideOffer.fixture";
import type { SeededOfferSet } from "../fixtures/branchWideOffer.fixture";
import { PASSWORD, mockBranchManager, mockHqAdminNoBusiness, seedUsers } from "../fixtures/user.fixture";
import type { SeededUsers } from "../fixtures/user.fixture";

type OfferProductPayload = BranchWideOfferFormType["products"][number];

describe("Branch wide offer routes", () => {
    app.use("/branch-wide-offers", branchWideOfferRouter);

    let catalogue: SeededCatalogue;
    let users: SeededUsers;
    let secondBranch: Branch;
    let foreignBusiness: Business;
    let foreignBranch: Branch;
    let foreignProduct: Product;
    let offers: SeededOfferSet;

    const findProduct = (productName: string) => {
        const product = catalogue.products.find((entry) => entry.productName === productName);

        if (!product) {
            throw new Error(`Missing seeded product ${productName}`);
        }

        return product;
    };

    const offerProduct = (productId: number, overrides: Partial<OfferProductPayload> = {}): OfferProductPayload => ({
        productId,
        unitDiscountValue: 10,
        requiredQuantity: 1,
        discountType: "PERCENTAGE",
        ...overrides,
    });

    const buildOverallPayload = (overrides: Partial<BranchWideOfferFormType> = {}): BranchWideOfferFormType => ({
        offerName: "New Offer",
        description: "New offer description",
        startDate: "2026-11-01",
        endDate: "2026-11-30",
        offerStatus: "ENABLED",
        offerType: "OVERALL",
        isExclusive: false,
        discountType: "PERCENTAGE",
        overallDiscountValue: 10,
        products: [],
        branchIds: [],
        ...overrides,
    });

    const buildIndividualPayload = (
        products: OfferProductPayload[],
        overrides: Partial<BranchWideOfferFormType> = {}
    ): BranchWideOfferFormType => ({
        ...buildOverallPayload(),
        offerType: "INDIVIDUAL",
        discountType: undefined,
        overallDiscountValue: undefined,
        products,
        ...overrides,
    });

    // ----------------------------- SETUP -----------------------------------------------------

    beforeEach(async () => {
        await resetDatabase();
        catalogue = await seedCatalogue();

        secondBranch = await prisma.branch.create({
            data: { ...mockBranch, location: "Second Branch", businessId: catalogue.business.id },
        });

        users = await seedUsers(catalogue.business.id, catalogue.branch.id, secondBranch.id);

        foreignBusiness = await prisma.business.create({
            data: { ...mockBusiness, name: "Foreign Business", location: "Cebu, Philippines" },
        });
        foreignBranch = await prisma.branch.create({
            data: { ...mockBranch, location: "Foreign Branch", businessId: foreignBusiness.id },
        });
        foreignProduct = await prisma.product.create({
            data: buildMockProduct({ productName: "Foreign Product", businessId: foreignBusiness.id }),
        });

        const alpha = findProduct("Alpha Shirt");

        offers = {
            allBranch: await prisma.branchWideOffer.create({
                data: buildMockOffer({
                    offerName: "All Branch Sale",
                    description: "Available everywhere",
                    businessId: catalogue.business.id,
                    isExclusive: false,
                }),
            }),
            branchOneExclusive: await prisma.branchWideOffer.create({
                data: buildMockOffer({
                    offerName: "Branch One Exclusive",
                    description: "Manager special",
                    businessId: catalogue.business.id,
                    isExclusive: true,
                    offerType: "INDIVIDUAL",
                    discountType: null,
                    overallDiscountValue: null,
                    branchWideOfferBranches: { create: [{ branchId: catalogue.branch.id }] },
                    branchWideOfferProducts: { create: [offerProduct(alpha.id)] },
                }),
            }),
            branchTwoExclusive: await prisma.branchWideOffer.create({
                data: buildMockOffer({
                    offerName: "Branch Two Exclusive",
                    description: "Second branch only",
                    businessId: catalogue.business.id,
                    isExclusive: true,
                    branchWideOfferBranches: { create: [{ branchId: secondBranch.id }] },
                }),
            }),
            foreignOffer: await prisma.branchWideOffer.create({
                data: buildMockOffer({
                    offerName: "Foreign Offer",
                    description: "Foreign business offer",
                    businessId: foreignBusiness.id,
                    isExclusive: true,
                    branchWideOfferBranches: { create: [{ branchId: foreignBranch.id }] },
                }),
            }),
        };
    });

    // ----------------------------- HQ ADMIN SCOPE --------------------------------------------

    describe("HQ admin scope", () => {
        it("lists every offer in the business and excludes other businesses", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app).get("/branch-wide-offers").expect(200);

            const body = res.body as BranchWideOfferListResponse;

            expect(body.items).toHaveLength(3);
            expect(body.items.map((offer) => offer.offerName)).toEqual([
                "Branch Two Exclusive",
                "Branch One Exclusive",
                "All Branch Sale",
            ]);
            expect(body.items.map((offer) => offer.id)).not.toContain(offers.foreignOffer.id);
            expect(body.summary.totalOffers).toBe(3);
            expect(body.summary.totalBranches).toBe(2);
            expect(body.summary.activeOffers + body.summary.inactiveOffers).toBe(3);
            expect(body.pagination).toEqual({ page: 1, limit: 10, total: 3, totalPages: 1 });
        });

        it("filters by offer name and description while keeping the business-wide summary", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const byDescription = await request(app)
                .get("/branch-wide-offers")
                .query({ search: "EVERYWHERE" })
                .expect(200);

            const descriptionBody = byDescription.body as BranchWideOfferListResponse;

            expect(descriptionBody.items.map((offer) => offer.offerName)).toEqual(["All Branch Sale"]);
            expect(descriptionBody.summary.totalOffers).toBe(3);
            expect(descriptionBody.summary.totalBranches).toBe(2);
            expect(descriptionBody.pagination.total).toBe(1);

            const byName = await request(app).get("/branch-wide-offers").query({ search: "branch two" }).expect(200);

            const nameBody = byName.body as BranchWideOfferListResponse;

            expect(nameBody.items.map((offer) => offer.offerName)).toEqual(["Branch Two Exclusive"]);
            expect(nameBody.summary.totalOffers).toBe(3);
            expect(nameBody.summary.totalBranches).toBe(2);
        });

        it("returns an exclusive offer of another branch and hides foreign or invalid offers", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const own = await request(app).get(`/branch-wide-offers/${offers.branchTwoExclusive.id}`).expect(200);

            expect((own.body as BranchWideOfferEntry).id).toBe(offers.branchTwoExclusive.id);

            const foreign = await request(app).get(`/branch-wide-offers/${offers.foreignOffer.id}`).expect(404);

            expect(foreign.body).toEqual({ error: "Offer not found" });

            const invalid = await request(app).get("/branch-wide-offers/abc").expect(404);

            expect(invalid.body).toEqual({ error: "Offer not found" });
        });

        it("returns all business branches ordered by location and all business products", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app).get("/branch-wide-offers/options").expect(200);

            const body = res.body as BranchWideOfferOptionsResponse;

            expect(body.branches).toEqual([
                { branchId: catalogue.branch.id, location: "Quezon City Branch" },
                { branchId: secondBranch.id, location: "Second Branch" },
            ]);
            expect(body.products.map((product) => product.productName)).toEqual([
                "Alpha Shirt",
                "Beta Mug",
                "Delta Bag",
                "Epsilon Cap",
                "Gamma Pen",
            ]);
            expect(body.products.map((product) => product.id)).not.toContain(foreignProduct.id);
        });

        it("creates an all-branch offer and ignores supplied branch ids", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app)
                .post("/branch-wide-offers")
                .send(
                    buildOverallPayload({
                        isExclusive: false,
                        branchIds: [catalogue.branch.id, secondBranch.id],
                    })
                )
                .expect(201);

            expect(res.body.message).toBe("Offer created");

            const offer = res.body.offer as BranchWideOfferEntry;

            expect(offer.isExclusive).toBe(false);
            expect(offer.branches).toEqual([]);

            const stored = await prisma.branchWideOffer.findUnique({ where: { id: offer.id } });

            expect(stored?.isExclusive).toBe(false);
            expect(await prisma.branchWideOfferBranch.count({ where: { branchWideOfferId: offer.id } })).toBe(0);
        });

        it("creates an exclusive offer for exactly the selected branches", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app)
                .post("/branch-wide-offers")
                .send(
                    buildOverallPayload({
                        isExclusive: true,
                        branchIds: [catalogue.branch.id, secondBranch.id],
                    })
                )
                .expect(201);

            const offer = res.body.offer as BranchWideOfferEntry;

            expect(offer.isExclusive).toBe(true);
            expect(offer.branches.map((branch) => branch.branchId)).toEqual([catalogue.branch.id, secondBranch.id]);
            expect(await prisma.branchWideOfferBranch.count({ where: { branchWideOfferId: offer.id } })).toBe(2);
        });

        it("rejects an exclusive offer without branches", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app)
                .post("/branch-wide-offers")
                .send(buildOverallPayload({ isExclusive: true, branchIds: [] }))
                .expect(400);

            expect(res.body).toEqual({ error: "Select at least one branch" });
        });

        it("rejects a branch from another business", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app)
                .post("/branch-wide-offers")
                .send(buildOverallPayload({ isExclusive: true, branchIds: [foreignBranch.id] }))
                .expect(400);

            expect(res.body).toEqual({ error: "Branch not found in your business" });
        });

        it("rejects a product from another business", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app)
                .post("/branch-wide-offers")
                .send(buildIndividualPayload([offerProduct(foreignProduct.id)]))
                .expect(400);

            expect(res.body).toEqual({ error: "Product not found in your business" });
        });

        it("converts between all-branch and selected-branch offers and replaces products", async () => {
            const alpha = findProduct("Alpha Shirt");
            const beta = findProduct("Beta Mug");
            const gamma = findProduct("Gamma Pen");

            const convertible = await prisma.branchWideOffer.create({
                data: buildMockOffer({
                    offerName: "Convertible Offer",
                    description: "Convertible offer",
                    businessId: catalogue.business.id,
                    isExclusive: false,
                    offerType: "INDIVIDUAL",
                    discountType: null,
                    overallDiscountValue: null,
                    branchWideOfferProducts: { create: [offerProduct(alpha.id)] },
                }),
            });

            setCurrentAuthUser(users.hqAdmin);

            const exclusiveRes = await request(app)
                .patch(`/branch-wide-offers/${convertible.id}`)
                .send(
                    buildIndividualPayload([offerProduct(beta.id), offerProduct(gamma.id)], {
                        offerName: "Converted Exclusive",
                        isExclusive: true,
                        branchIds: [catalogue.branch.id, secondBranch.id],
                    })
                )
                .expect(200);

            const exclusiveOffer = exclusiveRes.body.offer as BranchWideOfferEntry;

            expect(exclusiveRes.body.message).toBe("Offer updated");
            expect(exclusiveOffer.isExclusive).toBe(true);
            expect(exclusiveOffer.branches.map((branch) => branch.branchId)).toEqual([
                catalogue.branch.id,
                secondBranch.id,
            ]);
            expect(exclusiveOffer.products.map((product) => product.productId)).toEqual([beta.id, gamma.id]);
            expect(await prisma.branchWideOfferBranch.count({ where: { branchWideOfferId: convertible.id } })).toBe(2);
            expect(await prisma.branchWideOfferProduct.count({ where: { branchWideOfferId: convertible.id } })).toBe(2);

            const allBranchRes = await request(app)
                .patch(`/branch-wide-offers/${convertible.id}`)
                .send(
                    buildIndividualPayload([offerProduct(alpha.id)], {
                        offerName: "Converted All Branch",
                        isExclusive: false,
                        branchIds: [catalogue.branch.id, secondBranch.id],
                    })
                )
                .expect(200);

            const allBranchOffer = allBranchRes.body.offer as BranchWideOfferEntry;

            expect(allBranchOffer.isExclusive).toBe(false);
            expect(allBranchOffer.branches).toEqual([]);
            expect(allBranchOffer.products.map((product) => product.productId)).toEqual([alpha.id]);
            expect(await prisma.branchWideOfferBranch.count({ where: { branchWideOfferId: convertible.id } })).toBe(0);
            expect(await prisma.branchWideOfferProduct.count({ where: { branchWideOfferId: convertible.id } })).toBe(1);
        });

        it("hard-deletes an offer without transaction history", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app).delete(`/branch-wide-offers/${offers.branchOneExclusive.id}`).expect(200);

            expect(res.body).toEqual({ message: "Offer deleted", deleted: true, archived: false });
            expect(await prisma.branchWideOffer.findUnique({ where: { id: offers.branchOneExclusive.id } })).toBeNull();
            expect(
                await prisma.branchWideOfferBranch.count({ where: { branchWideOfferId: offers.branchOneExclusive.id } })
            ).toBe(0);
            expect(
                await prisma.branchWideOfferProduct.count({
                    where: { branchWideOfferId: offers.branchOneExclusive.id },
                })
            ).toBe(0);
        });

        it("archives an offer referenced by a transaction item", async () => {
            const beta = findProduct("Beta Mug");

            const transaction = await prisma.transaction.create({
                data: {
                    totalPrice: 100,
                    dateofTransaction: new Date("2026-11-05T10:00:00.000Z"),
                    paymentMethod: "CASH",
                    status: "COMPLETE",
                    discount: 0,
                    branchId: catalogue.branch.id,
                    userId: users.branchManager.id,
                },
            });

            await prisma.transactionItem.create({
                data: {
                    quantity: 1,
                    currentPrice: 100,
                    isBundle: false,
                    productId: beta.id,
                    branchWideOfferId: offers.branchOneExclusive.id,
                    transactionId: transaction.id,
                },
            });

            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app).delete(`/branch-wide-offers/${offers.branchOneExclusive.id}`).expect(200);

            expect(res.body).toEqual({ message: "Offer archived", deleted: false, archived: true });

            const archived = await prisma.branchWideOffer.findUnique({ where: { id: offers.branchOneExclusive.id } });

            expect(archived?.offerStatus).toBe("DISABLED");
            expect(archived?.isExclusive).toBe(true);
            expect(
                await prisma.branchWideOfferBranch.count({ where: { branchWideOfferId: offers.branchOneExclusive.id } })
            ).toBe(0);
        });
    });

    // ----------------------------- BRANCH MANAGER SCOPE --------------------------------------

    describe("Branch manager scope", () => {
        it("lists all-branch offers and exclusives for the manager's branch only", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get("/branch-wide-offers").expect(200);

            const body = res.body as BranchWideOfferListResponse;

            expect(body.items.map((offer) => offer.offerName)).toEqual(["Branch One Exclusive", "All Branch Sale"]);
            expect(body.items.map((offer) => offer.id)).not.toContain(offers.branchTwoExclusive.id);
            expect(body.items.map((offer) => offer.id)).not.toContain(offers.foreignOffer.id);
            expect(body.summary.totalOffers).toBe(2);
            expect(body.summary.totalBranches).toBe(2);
            expect(body.summary.activeOffers + body.summary.inactiveOffers).toBe(2);
            expect(body.pagination.total).toBe(2);
        });

        it("returns an all-branch offer and their own exclusive but hides another branch's exclusive", async () => {
            setCurrentAuthUser(users.branchManager);

            await request(app).get(`/branch-wide-offers/${offers.allBranch.id}`).expect(200);
            await request(app).get(`/branch-wide-offers/${offers.branchOneExclusive.id}`).expect(200);

            const res = await request(app).get(`/branch-wide-offers/${offers.branchTwoExclusive.id}`).expect(404);

            expect(res.body).toEqual({ error: "Offer not found" });
        });

        it("returns only the requestor's branch and all business products in options", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).get("/branch-wide-offers/options").expect(200);

            const body = res.body as BranchWideOfferOptionsResponse;

            expect(body.branches).toEqual([{ branchId: catalogue.branch.id, location: "Quezon City Branch" }]);
            expect(body.products.map((product) => product.productName)).toEqual([
                "Alpha Shirt",
                "Beta Mug",
                "Delta Bag",
                "Epsilon Cap",
                "Gamma Pen",
            ]);
            expect(body.products.map((product) => product.id)).not.toContain(foreignProduct.id);
        });

        it("always creates a branch-exclusive offer for the requestor's branch", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .post("/branch-wide-offers")
                .send(
                    buildOverallPayload({
                        isExclusive: false,
                        branchIds: [secondBranch.id, catalogue.branch.id],
                    })
                )
                .expect(201);

            const offer = res.body.offer as BranchWideOfferEntry;

            expect(offer.isExclusive).toBe(true);
            expect(offer.branches.map((branch) => branch.branchId)).toEqual([catalogue.branch.id]);
            expect(await prisma.branchWideOfferBranch.count({ where: { branchWideOfferId: offer.id } })).toBe(1);
        });

        it("rejects a product from another business", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .post("/branch-wide-offers")
                .send(buildIndividualPayload([offerProduct(foreignProduct.id)]))
                .expect(400);

            expect(res.body).toEqual({ error: "Product not found in your business" });
        });

        it("updates their own exclusive offer and keeps the branch association", async () => {
            const beta = findProduct("Beta Mug");

            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .patch(`/branch-wide-offers/${offers.branchOneExclusive.id}`)
                .send(
                    buildIndividualPayload([offerProduct(beta.id)], {
                        offerName: "Updated Branch One Exclusive",
                        description: "Updated description",
                        startDate: "2026-11-02",
                        endDate: "2026-11-29",
                        isExclusive: true,
                        branchIds: [secondBranch.id],
                    })
                )
                .expect(200);

            const offer = res.body.offer as BranchWideOfferEntry;

            expect(offer.offerName).toBe("Updated Branch One Exclusive");
            expect(offer.description).toBe("Updated description");
            expect(offer.startDate).toBe("2026-11-02");
            expect(offer.endDate).toBe("2026-11-29");
            expect(offer.products.map((product) => product.productId)).toEqual([beta.id]);
            expect(offer.branches.map((branch) => branch.branchId)).toEqual([catalogue.branch.id]);
            expect(
                await prisma.branchWideOfferBranch.count({ where: { branchWideOfferId: offers.branchOneExclusive.id } })
            ).toBe(1);
        });

        it("rejects updating an all-branch offer", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .patch(`/branch-wide-offers/${offers.allBranch.id}`)
                .send(buildOverallPayload({ isExclusive: true, branchIds: [catalogue.branch.id] }))
                .expect(403);

            expect(res.body).toEqual({ error: "You can only update offers exclusive to your branch" });
        });

        it("hides another branch's exclusive offer when updating", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app)
                .patch(`/branch-wide-offers/${offers.branchTwoExclusive.id}`)
                .send(buildOverallPayload({ isExclusive: true, branchIds: [secondBranch.id] }))
                .expect(404);

            expect(res.body).toEqual({ error: "Offer not found" });
        });

        it("hard-deletes their own exclusive offer when it is the only branch", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).delete(`/branch-wide-offers/${offers.branchOneExclusive.id}`).expect(200);

            expect(res.body).toEqual({ message: "Offer deleted", deleted: true, archived: false });
            expect(await prisma.branchWideOffer.findUnique({ where: { id: offers.branchOneExclusive.id } })).toBeNull();
        });

        it("detaches their branch from an exclusive offer shared with another branch", async () => {
            const shared = await prisma.branchWideOffer.create({
                data: buildMockOffer({
                    offerName: "Shared Exclusive",
                    description: "Shared exclusive",
                    businessId: catalogue.business.id,
                    isExclusive: true,
                    branchWideOfferBranches: {
                        create: [{ branchId: catalogue.branch.id }, { branchId: secondBranch.id }],
                    },
                }),
            });

            setCurrentAuthUser(users.branchManager);

            const res = await request(app).delete(`/branch-wide-offers/${shared.id}`).expect(200);

            expect(res.body).toEqual({
                message: "Offer removed from this branch",
                deleted: false,
                archived: false,
            });
            expect(await prisma.branchWideOffer.findUnique({ where: { id: shared.id } })).not.toBeNull();

            const remainingBranches = await prisma.branchWideOfferBranch.findMany({
                where: { branchWideOfferId: shared.id },
                select: { branchId: true },
            });

            expect(remainingBranches).toEqual([{ branchId: secondBranch.id }]);
        });

        it("rejects deleting an all-branch offer from a branch", async () => {
            setCurrentAuthUser(users.branchManager);

            const res = await request(app).delete(`/branch-wide-offers/${offers.allBranch.id}`).expect(403);

            expect(res.body).toEqual({ error: "All-branch offers cannot be modified from a branch" });
        });
    });

    // ----------------------------- VALIDATION AND ACCESS -------------------------------------

    describe("Validation and access", () => {
        it("rejects an overall offer without discount fields", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app)
                .post("/branch-wide-offers")
                .send(buildOverallPayload({ discountType: undefined, overallDiscountValue: undefined }))
                .expect(400);

            expect(res.body).toHaveProperty("error");
        });

        it("rejects an offer whose end date is before its start date", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app)
                .post("/branch-wide-offers")
                .send(buildOverallPayload({ startDate: "2026-11-30", endDate: "2026-11-01" }))
                .expect(400);

            expect(res.body).toHaveProperty("error");
        });

        it("rejects an individual offer without products", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app).post("/branch-wide-offers").send(buildIndividualPayload([])).expect(400);

            expect(res.body).toHaveProperty("error");
        });

        it("rejects duplicate branch ids", async () => {
            setCurrentAuthUser(users.hqAdmin);

            const res = await request(app)
                .post("/branch-wide-offers")
                .send(
                    buildOverallPayload({
                        isExclusive: true,
                        branchIds: [catalogue.branch.id, catalogue.branch.id],
                    })
                )
                .expect(400);

            expect(res.body).toHaveProperty("error");
        });

        it("forbids cashiers and anonymous requests from reading offers", async () => {
            setCurrentAuthUser(users.cashier);

            await request(app).get("/branch-wide-offers").expect(403);

            setCurrentAuthUser(null);

            await request(app).get("/branch-wide-offers").expect(401);
        });

        it("rejects an HQ admin without a business", async () => {
            const user = await prisma.user.create({
                data: { ...mockHqAdminNoBusiness, password: await bcrypt.hash(PASSWORD, 10) },
            });

            setCurrentAuthUser(user);

            const res = await request(app).get("/branch-wide-offers").expect(403);

            expect(res.body).toEqual({ error: "User is not attached to a business" });
        });

        it("rejects a branch manager without a branch", async () => {
            const user = await prisma.user.create({
                data: {
                    ...mockBranchManager,
                    email: "branchmanager.nobranch@test.local",
                    password: await bcrypt.hash(PASSWORD, 10),
                    businessId: catalogue.business.id,
                    branchId: null,
                },
            });

            setCurrentAuthUser(user);

            const res = await request(app).get("/branch-wide-offers").expect(403);

            expect(res.body).toEqual({ error: "User is not attached to a branch" });
        });
    });
});
