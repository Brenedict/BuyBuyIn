// General Imports
import { type RouteObject } from "react-router";

// Static Layout Page
import StaticLayout from "../pages/shared/StaticLayout";

// Static Access Checker before entering any page
import { AccessValidator } from "../pages/shared/AccessValidator";

// Pages
import { BranchManager_BranchWideOffers } from "../pages/branch-manager/BranchManager.BranchWideOffers";
import BranchManager_Dashboard from "../pages/branch-manager/BranchManager.Dashboard";
import BranchManager_Inventory from "../pages/branch-manager/BranchManager.Inventory";
import BranchManager_ManageUsers from "../pages/branch-manager/BranchManager.ManageUsers";
import { BranchManager_Transactions } from "../pages/branch-manager/BranchManager.Transactions";
import Cashier_Dashboard from "../pages/cashier/Cashier.Dashboard";
import Cashier_PointOfSale from "../pages/cashier/Cashier.PointOfSale";
import Cashier_Transactions from "../pages/cashier/Cashier.Transactions";
import Cashier_XRead from "../pages/cashier/Cashier.XRead";
import HQ_BranchWideOffers from "../pages/hq-admin/HQ.BranchWideOffers";
import HQ_Dashboard from "../pages/hq-admin/HQ.Dashboard";
import HQ_Inventory from "../pages/hq-admin/HQ.Inventory";
import HQ_ManageUsers from "../pages/hq-admin/HQ.ManageUsers";
import HQ_Subscriptions from "../pages/hq-admin/HQ.Subscriptions";
import { ROUTES } from "./Routes";

// TEMP File
import { Page2 } from "../pages/branch-manager/Page2";

export const protectedRoutes: RouteObject[] = [
    {
        id: "protected",
        path: "/",
        element: <AccessValidator />,
        children: [
            {
                path: "",
                element: <StaticLayout />,
                children: [
                    { path: "", element: <Page2 /> },
                    { path: ROUTES.BRANCH_MANAGER.dashboard, element: <BranchManager_Dashboard /> },
                    { path: ROUTES.BRANCH_MANAGER.inventory, element: <BranchManager_Inventory /> },
                    { path: ROUTES.BRANCH_MANAGER.manageUsers, element: <BranchManager_ManageUsers /> },
                    { path: ROUTES.BRANCH_MANAGER.branchOffers, element: <BranchManager_BranchWideOffers /> },
                    { path: ROUTES.BRANCH_MANAGER.transactions, element: <BranchManager_Transactions /> },
                    { path: ROUTES.CASHIER.dashboard, element: <Cashier_Dashboard /> },
                    { path: ROUTES.CASHIER.transactions, element: <Cashier_Transactions /> },
                    { path: ROUTES.CASHIER.pointOfSale, element: <Cashier_PointOfSale /> },
                    { path: ROUTES.CASHIER.xRead, element: <Cashier_XRead /> },
                    { path: ROUTES.HQ_ADMIN.dashboard, element: <HQ_Dashboard /> },
                    { path: ROUTES.HQ_ADMIN.inventory, element: <HQ_Inventory /> },
                    { path: ROUTES.HQ_ADMIN.manageUsers, element: <HQ_ManageUsers /> },
                    { path: ROUTES.HQ_ADMIN.subscriptions, element: <HQ_Subscriptions /> },
                    { path: ROUTES.HQ_ADMIN.branchOffers, element: <HQ_BranchWideOffers /> },
                ],
            },
        ],
    },
];
