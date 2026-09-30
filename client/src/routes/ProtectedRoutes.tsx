// General Imports
import { Navigate, type RouteObject } from "react-router";

// Static Layout Page
import StaticLayout from "../pages/shared/StaticLayout";

// Static Access Checker before entering any page
import { AccessValidator } from "../pages/shared/AccessValidator";
import { primaryAuthLoader, homeRedirectLoader } from "../api/authService";

// Global Pages and Popups
import { globalPopups } from "./GlobalPopupRoutes";

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

// HQ Admin Pages and Popups
import HQ_BranchWideOffers from "../pages/hq-admin/HQ.BranchWideOffers";
import HQ_Dashboard from "../pages/hq-admin/HQ.Dashboard";
import HQ_Inventory from "../pages/hq-admin/HQ.Inventory";
import HQ_ManageUsers from "../pages/hq-admin/HQ.ManageUsers";
import HQ_Subscriptions from "../pages/hq-admin/HQ.Subscriptions";

import { SaveConfirmationPopup } from "../components/popups/hq-admin/BranchOffersPopups";
import { DeleteSubscriptionPopup, SubscriptionFormPopup } from "../components/popups/super-admin/SubscriptionsPopups";

// Super Admin Pages
import SuperAdmin_Plans from "../pages/super-admin/SuperAdmin.Plans";
import SuperAdmin_Businesses from "../pages/super-admin/SuperAdmin.Businesses";
import SuperAdmin_Subscriptions from "../pages/super-admin/SuperAdmin.Subscriptions";
import SuperAdmin_SubscriberAccounts from "../pages/super-admin/SuperAdmin.SubscriberAccounts";

// Predefined Routes
import { ROLE_HOME, ROUTES } from "./Routes";

import { RoleType } from "@buybuyin/shared/prisma/enums";
import { PlansAddEditPopup, PlansDeletePopup } from "../components/popups/super-admin/PlansPopups";

export const protectedRoutes: RouteObject[] = [
    {
        id: "protected",
        path: "/",
        loader: primaryAuthLoader,
        element: <AccessValidator />,
        children: [
            {
                path: "",
                element: <StaticLayout />,
                children: [
                    // Index Route: "/" -> landing page of the user's own role
                    {
                        index: true,
                        loader: homeRedirectLoader,
                    },

                    // Adds redirect when users go to ":role/" (no specific page). Ensures users go to their respective home pages.
                    {
                        path: ROUTES.BRANCH_MANAGER.root,
                        element: <Navigate to={ROLE_HOME[RoleType.BRANCHMANAGER]} replace />,
                    },
                    {
                        path: ROUTES.CASHIER.root,
                        element: <Navigate to={ROLE_HOME[RoleType.CASHIER]} replace />,
                    },
                    {
                        path: ROUTES.HQ_ADMIN.root,
                        element: <Navigate to={ROLE_HOME[RoleType.HQADMIN]} replace />,
                    },
                    {
                        path: ROUTES.SUPER_ADMIN.root,
                        element: <Navigate to={ROLE_HOME[RoleType.SUPERADMIN]} replace />,
                    },

                    // Branch Manager Routes: /branch-manager
                    {
                        path: ROUTES.BRANCH_MANAGER.dashboard,
                        element: <BranchManager_Dashboard />,
                        children: [...globalPopups],
                    },
                    {
                        path: ROUTES.BRANCH_MANAGER.inventory,
                        element: <BranchManager_Inventory />,
                        children: [...globalPopups],
                    },
                    {
                        path: ROUTES.BRANCH_MANAGER.manageUsers,
                        element: <BranchManager_ManageUsers />,
                        children: [...globalPopups],
                    },
                    {
                        path: ROUTES.BRANCH_MANAGER.branchOffers,
                        element: <BranchManager_BranchWideOffers />,
                        children: [...globalPopups],
                    },
                    {
                        path: ROUTES.BRANCH_MANAGER.transactions,
                        element: <BranchManager_Transactions />,
                        children: [...globalPopups],
                    },

                    // Cashier Routes: /cashier
                    { path: ROUTES.CASHIER.dashboard, element: <Cashier_Dashboard />, children: [...globalPopups] },
                    {
                        path: ROUTES.CASHIER.transactions,
                        element: <Cashier_Transactions />,
                        children: [...globalPopups],
                    },
                    { path: ROUTES.CASHIER.pointOfSale, element: <Cashier_PointOfSale />, children: [...globalPopups] },
                    { path: ROUTES.CASHIER.xRead, element: <Cashier_XRead />, children: [...globalPopups] },

                    // HQ Admin Routes: /hq-admin
                    { path: ROUTES.HQ_ADMIN.dashboard, element: <HQ_Dashboard />, children: [...globalPopups] },
                    { path: ROUTES.HQ_ADMIN.inventory, element: <HQ_Inventory />, children: [...globalPopups] },
                    { path: ROUTES.HQ_ADMIN.manageUsers, element: <HQ_ManageUsers />, children: [...globalPopups] },
                    { path: ROUTES.HQ_ADMIN.subscriptions, element: <HQ_Subscriptions />, children: [...globalPopups] },
                    {
                        path: ROUTES.HQ_ADMIN.branchOffers,
                        element: <HQ_BranchWideOffers />,
                        children: [
                            {
                                path: "save",
                                element: <SaveConfirmationPopup />,
                            },
                            ...globalPopups,
                        ],
                    },
                    {
                        path: ROUTES.HQ_ADMIN.branchOffers + "/:id/edit",
                        element: <HQ_BranchWideOffers />,
                        children: [
                            {
                                path: "save",
                                element: <SaveConfirmationPopup />,
                            },
                            ...globalPopups,
                        ],
                    },
                    // Super Admin Routes: /super-admin
                    {
                        path: ROUTES.SUPER_ADMIN.plans,
                        element: <SuperAdmin_Plans />,
                        children: [
                            { path: "add", element: <PlansAddEditPopup mode="add" /> },
                            { path: ":id/edit", element: <PlansAddEditPopup mode="edit" /> },
                            { path: ":id/delete", element: <PlansDeletePopup /> },
                            ...globalPopups,
                        ],
                    },
                    {
                        path: ROUTES.SUPER_ADMIN.businesses,
                        element: <SuperAdmin_Businesses />,
                        children: [...globalPopups],
                    },
                    {
                        path: ROUTES.SUPER_ADMIN.subscriptions,
                        element: <SuperAdmin_Subscriptions />,
                        children: [
                            { path: "add", element: <SubscriptionFormPopup mode="add" /> },
                            { path: ":id/edit", element: <SubscriptionFormPopup mode="edit" /> },
                            { path: ":id/delete", element: <DeleteSubscriptionPopup /> },
                            ...globalPopups,
                        ],
                    },
                    {
                        path: ROUTES.SUPER_ADMIN.subscriberAccounts,
                        element: <SuperAdmin_SubscriberAccounts />,
                        children: [...globalPopups],
                    },
                ],
            },
        ],
    },
];
