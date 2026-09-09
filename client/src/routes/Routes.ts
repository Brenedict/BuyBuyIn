export const ROUTES = {
    AUTH: "/auth",

    // ALL CASHIER ROUTES: Define all actions here for popup URL's
    CASHIER: (() => {
        const base = "/cashier";
        return {
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
            dashboard: `${base}/dashboard`,
            inventory: `${base}/inventory`,
            manageUsers: `${base}/manage-users`,
            subscriptions: `${base}/subscriptions`,
            branchOffers: `${base}/branch-offers`,
        };
    })(),
} as const;
