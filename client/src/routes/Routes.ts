// BuyBuyIn Shared Imports
import type { RoleType } from "@buybuyin/shared/prisma/enums";

export const ROUTES = {
    AUTH: "/auth",

    // ALL CASHIER ROUTES: Define all actions here for popup URL's
    CASHIER: (() => {
        const base = "/cashier";
        return {
            root: `${base}/`,
            dashboard: `${base}/dashboard`,
            transactions: `${base}/transactions`,
            transactionsEdit: (id?: string) => (id ? `${base}/transactions/${id}/edit` : `${base}/transactions/edit`),
            pointOfSale: `${base}/point-of-sale`,
            xRead: `${base}/x-read`,
        };
    })(),

    // ALL BRANCH MANAGER ROUTES: Define all actions here for popup URL's
    BRANCH_MANAGER: (() => {
        const base = "/branch-manager";
        return {
            root: `${base}/`,
            dashboard: `${base}/dashboard`,
            inventory: `${base}/inventory`,
            manageUsers: `${base}/manage-users`,
            branchOffers: `${base}/branch-offers`,
            transactions: `${base}/transactions`,
        };
    })(),

    // ALL HQ ADMIN ROUTES: Define all actions here for popup URL's
    HQ_ADMIN: (() => {
        const base = "/hq-admin";
        return {
            root: `${base}/`,
            dashboard: `${base}/dashboard`,
            inventory: `${base}/inventory`,
            manageUsers: `${base}/manage-users`,
            subscriptions: `${base}/subscriptions`,
            branchOffers: `${base}/branch-offers`,
            branchOffersSave: `${base}/branch-offers/save`,
            branchOffersEdit: (id?: string) => `${base}/branch-offers/${id}/edit`,
            branchOffersEditSave: (id?: string) => `${base}/branch-offers/${id}/edit/save`,
        };
    })(),

    // ALL SUPER ADMIN ROUTES: Define all actions here for popup URL's
    SUPER_ADMIN: (() => {
        const base = "/super-admin";
        return {
            root: `${base}/`,
            plans: `${base}/plans`,
            plansAdd: `${base}/plans/add`,
            plansEdit: (id?: string) => `${base}/plans/${id}/edit`,
            plansDelete: (id?: string) => `${base}/plans/${id}/delete`,
            businesses: `${base}/businesses`,
            subscriptions: `${base}/subscriptions`,
            subscriberAccounts: `${base}/subscriber-accounts`,
        };
    })(),
} as const;

// Where a role lands when it hits "/" (or right after logging in).
// TODO: SUPERADMIN has no dashboard yet, so it lands on plans until one is added.
export const ROLE_HOME: Record<RoleType, string> = {
    CASHIER: ROUTES.CASHIER.dashboard,
    BRANCHMANAGER: ROUTES.BRANCH_MANAGER.dashboard,
    HQADMIN: ROUTES.HQ_ADMIN.dashboard,
    SUPERADMIN: ROUTES.SUPER_ADMIN.plans,
};
