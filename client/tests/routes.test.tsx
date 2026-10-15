import { describe, expect, it } from "vitest";
import { matchRoutes } from "react-router";
import routes from "../src/routes";
import { ROUTES } from "../src/routes/Routes";

const routePaths = [
    ROUTES.AUTH,
    "/",
    ROUTES.FORBIDDEN,
    `${ROUTES.FORBIDDEN}/logout`,
    ROUTES.BRANCH_MANAGER.root,
    ROUTES.BRANCH_MANAGER.dashboard,
    `${ROUTES.BRANCH_MANAGER.dashboard}/logout`,
    ROUTES.BRANCH_MANAGER.inventory,
    `${ROUTES.BRANCH_MANAGER.inventory}/logout`,
    ROUTES.BRANCH_MANAGER.manageUsers,
    `${ROUTES.BRANCH_MANAGER.manageUsers}/logout`,
    ROUTES.BRANCH_MANAGER.branchOffers,
    `${ROUTES.BRANCH_MANAGER.branchOffers}/logout`,
    ROUTES.BRANCH_MANAGER.transactions,
    `${ROUTES.BRANCH_MANAGER.transactions}/logout`,
    ROUTES.CASHIER.root,
    ROUTES.CASHIER.dashboard,
    `${ROUTES.CASHIER.dashboard}/logout`,
    ROUTES.CASHIER.transactions,
    `${ROUTES.CASHIER.transactions}/logout`,
    ROUTES.CASHIER.pointOfSale,
    `${ROUTES.CASHIER.pointOfSale}/logout`,
    ROUTES.CASHIER.xRead,
    `${ROUTES.CASHIER.xRead}/logout`,
    ROUTES.HQ_ADMIN.root,
    ROUTES.HQ_ADMIN.dashboard,
    `${ROUTES.HQ_ADMIN.dashboard}/logout`,
    ROUTES.HQ_ADMIN.inventory,
    `${ROUTES.HQ_ADMIN.inventory}/logout`,
    ROUTES.HQ_ADMIN.manageUsers,
    `${ROUTES.HQ_ADMIN.manageUsers}/logout`,
    ROUTES.HQ_ADMIN.subscriptions,
    `${ROUTES.HQ_ADMIN.subscriptions}/logout`,
    ROUTES.HQ_ADMIN.branchOffers,
    `${ROUTES.HQ_ADMIN.branchOffers}/logout`,
    ROUTES.HQ_ADMIN.branchOffersSave,
    ROUTES.HQ_ADMIN.branchOffersEdit("offer-1"),
    ROUTES.HQ_ADMIN.branchOffersEditSave("offer-1"),
    `${ROUTES.HQ_ADMIN.branchOffersEdit("offer-1")}/logout`,
    ROUTES.SUPER_ADMIN.root,
    ROUTES.SUPER_ADMIN.plans,
    `${ROUTES.SUPER_ADMIN.plans}/logout`,
    ROUTES.SUPER_ADMIN.plansAdd,
    ROUTES.SUPER_ADMIN.plansEdit("plan-1"),
    ROUTES.SUPER_ADMIN.plansDelete("plan-1"),
    ROUTES.SUPER_ADMIN.businesses,
    `${ROUTES.SUPER_ADMIN.businesses}/logout`,
    ROUTES.SUPER_ADMIN.subscriptions,
    `${ROUTES.SUPER_ADMIN.subscriptions}/logout`,
    ROUTES.SUPER_ADMIN.subscriptionsAdd,
    ROUTES.SUPER_ADMIN.subscriptionsEdit("subscription-1"),
    ROUTES.SUPER_ADMIN.subscriptionsDelete("subscription-1"),
    ROUTES.SUPER_ADMIN.subscriberAccounts,
    `${ROUTES.SUPER_ADMIN.subscriberAccounts}/logout`,
];

describe("application routes", () => {
    it.each(routePaths)("matches %s", (path) => {
        expect(matchRoutes(routes, path)).not.toBeNull();
    });

    it("does not match an unregistered path", () => {
        expect(matchRoutes(routes, "/not-a-real-page")).toBeNull();
    });
});
