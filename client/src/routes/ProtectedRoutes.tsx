// General Imports
import { type RouteObject } from "react-router";

// Static Layout Page
import StaticLayout from "../pages/shared/StaticLayout";

// Static Access Checker before entering any page
import { AccessValidator } from "../pages/shared/AccessValidator";

// Branch Manager Pages
import BranchManager_BranchWideOffers from "../pages/branch-manager/BranchManager.BranchWideOffers";
import BranchManager_Dashboard from "../pages/branch-manager/BranchManager.Dashboard";
import BranchManager_Inventory from "../pages/branch-manager/BranchManager.Inventory";
import BranchManager_ManageUsers from "../pages/branch-manager/BranchManager.ManageUsers";
import BranchManager_Transactions from "../pages/branch-manager/BranchManager.Transactions";

// Cashier Pages
import Cashier_Dashboard from "../pages/cashier/Cashier.Dashboard";
import Cashier_PointOfSale from "../pages/cashier/Cashier.PointOfSale";
import Cashier_Transactions from "../pages/cashier/Cashier.Transactions";
import Cashier_XRead from "../pages/cashier/Cashier.XRead";

// HQ Admin Pages
import HQ_BranchWideOffers from "../pages/hq-admin/HQ.BranchWideOffers";
import HQ_Dashboard from "../pages/hq-admin/HQ.Dashboard";
import HQ_Inventory from "../pages/hq-admin/HQ.Inventory";
import HQ_ManageUsers from "../pages/hq-admin/HQ.ManageUsers";
import HQ_Subscriptions from "../pages/hq-admin/HQ.Subscriptions";

// Super Admin Pages
import SuperAdmin_Plans from "../pages/super-admin/SuperAdmin.Plans";
import SuperAdmin_Businesses from "../pages/super-admin/SuperAdmin.Businesses";
import SuperAdmin_Subscriptions from "../pages/super-admin/SuperAdmin.Subscriptions";
import SuperAdmin_SubscriberAccounts from "../pages/super-admin/SuperAdmin.SubscriberAccounts";

// Predefined Routes
import { ROUTES } from "./Routes";

// TEMP File
import { Page2 } from "../pages/branch-manager/Page2";
import { PopUp } from "../components/PopUp";

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

                    // Branch Manager Routes: /branch-manager
                    { path: ROUTES.BRANCH_MANAGER.dashboard, element: <BranchManager_Dashboard /> },
                    { path: ROUTES.BRANCH_MANAGER.inventory, element: <BranchManager_Inventory /> },
                    { path: ROUTES.BRANCH_MANAGER.manageUsers, element: <BranchManager_ManageUsers /> },
                    { path: ROUTES.BRANCH_MANAGER.branchOffers, element: <BranchManager_BranchWideOffers /> },
                    { path: ROUTES.BRANCH_MANAGER.transactions, element: <BranchManager_Transactions /> },

                    // Cashier Routes: /cashier
                    { path: ROUTES.CASHIER.dashboard, element: <Cashier_Dashboard /> },
                    { path: ROUTES.CASHIER.transactions, element: <Cashier_Transactions /> },
                    { path: ROUTES.CASHIER.pointOfSale, element: <Cashier_PointOfSale /> },
                    { path: ROUTES.CASHIER.xRead, element: <Cashier_XRead /> },

                    // HQ Admin Routes: /hq-admin
                    { path: ROUTES.HQ_ADMIN.dashboard, element: <HQ_Dashboard /> },
                    { path: ROUTES.HQ_ADMIN.inventory, element: <HQ_Inventory /> },
                    { path: ROUTES.HQ_ADMIN.manageUsers, element: <HQ_ManageUsers /> },
                    { path: ROUTES.HQ_ADMIN.subscriptions, element: <HQ_Subscriptions /> },
                    {
                        path: ROUTES.HQ_ADMIN.branchOffers,
                        element: <HQ_BranchWideOffers />,
                        children: [
                            {
                                path: ":id/edit",
                                element: <HQ_BranchWideOffers />,
                            },
                            {
                                path: "save",
                                element: <PopUp onClose={} />,
                            },
                        ],
                    },

                    // Super Admin Routes: /super-admin
                    { path: ROUTES.SUPER_ADMIN.plans, element: <SuperAdmin_Plans /> },
                    { path: ROUTES.SUPER_ADMIN.businesses, element: <SuperAdmin_Businesses /> },
                    { path: ROUTES.SUPER_ADMIN.subscriptions, element: <SuperAdmin_Subscriptions /> },
                    { path: ROUTES.SUPER_ADMIN.subscriberAccounts, element: <SuperAdmin_SubscriberAccounts /> },
                ],
            },
        ],
    },
];
