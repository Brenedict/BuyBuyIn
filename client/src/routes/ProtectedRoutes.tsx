// General Imports
import { Navigate, type RouteObject } from "react-router";

// Static Layout Page
import StaticLayout from "../pages/shared/StaticLayout";

// Static Access Checker before entering any page
import { AccessValidator } from "../pages/shared/AccessValidator";
import { RoleBoundary } from "../pages/shared/RoleBoundary";
import Forbidden from "../pages/shared/Forbidden";
import { primaryAuthLoader, homeRedirectLoader } from "../api/authService";

// API Services
import {
    createProduct,
    deleteProduct,
    getCatalogueProduct,
    getProduct,
    getProductForm,
    updateProduct,
} from "../api/productService";
import { createSupplier, deleteSupplier, getCataloguePage, getSupplier, updateSupplier } from "../api/supplierService";
import {
    createBranchInventoryItem,
    deleteBranchInventoryItem,
    getBranchInventory,
    getBranchInventoryItem,
    getBranchInventoryOptions,
    restockBranchInventoryItem,
} from "../api/branchInventoryService";

// Global Pages and Popups
import { globalPopups } from "./GlobalPopupRoutes";

// Branch Manager Pages
import BranchManager_BranchWideOffers from "../pages/branch-manager/BranchManager.BranchWideOffers";
import BranchManager_Dashboard from "../pages/branch-manager/BranchManager.Dashboard";
import BranchManager_Inventory from "../pages/branch-manager/BranchManager.Inventory";
import BranchManager_ManageUsers from "../pages/branch-manager/BranchManager.ManageUsers";
import BranchManager_Transactions from "../pages/branch-manager/BranchManager.Transactions";

import {
    InventoryItemRestockPopup,
    InventoryItemDeletePopup,
    InventoryItemAddPopup,
} from "../components/popups/branch-manager/InventoryPopups";

// Cashier Pages
import Cashier_Dashboard from "../pages/cashier/Cashier.Dashboard";
import Cashier_PointOfSale from "../pages/cashier/Cashier.PointOfSale";
import Cashier_Transactions from "../pages/cashier/Cashier.Transactions";
import Cashier_XRead from "../pages/cashier/Cashier.XRead";

// HQ Admin Pages and Popups
import HQ_BranchWideOffers from "../pages/hq-admin/HQ.BranchWideOffers";
import HQ_Dashboard from "../pages/hq-admin/HQ.Dashboard";
import HQ_Catalogue from "../pages/hq-admin/HQ.Catalogue";
import HQ_ManageUsers from "../pages/hq-admin/HQ.ManageUsers";
import HQ_Subscriptions from "../pages/hq-admin/HQ.Subscriptions";

import { SaveConfirmationPopup } from "../components/popups/hq-admin/BranchOffersPopups";
import {
    BranchFormPopup,
    DeleteBranchPopup,
    BranchManagerFormPopup,
} from "../components/popups/hq-admin/ManageUserPopups";
import { ProductFormPopup, ProductDeletePopup } from "../components/popups/hq-admin/CataloguePopups";
import { SupplierFormPopup, SupplierDeletePopup } from "../components/popups/hq-admin/SupplierPopups";

// Super Admin Pages and Popups
import SuperAdmin_Plans from "../pages/super-admin/SuperAdmin.Plans";
import SuperAdmin_Businesses from "../pages/super-admin/SuperAdmin.Businesses";
import SuperAdmin_Subscriptions from "../pages/super-admin/SuperAdmin.Subscriptions";
import SuperAdmin_SubscriberAccounts from "../pages/super-admin/SuperAdmin.SubscriberAccounts";

import { DeleteSubscriptionPopup, SubscriptionFormPopup } from "../components/popups/super-admin/SubscriptionsPopups";

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

                    // Shown when RoleBoundary rejects the user's role.
                    {
                        path: ROUTES.FORBIDDEN,
                        element: <Forbidden />,
                        children: [...globalPopups],
                    },

                    // Branch Manager Routes: /branch-manager
                    {
                        element: <RoleBoundary />,
                        handle: { accessLevel: RoleType.BRANCHMANAGER },
                        children: [
                            // Adds redirect when users go to ":role/" (no specific page).
                            {
                                path: ROUTES.BRANCH_MANAGER.root,
                                element: <Navigate to={ROLE_HOME[RoleType.BRANCHMANAGER]} replace />,
                            },
                            {
                                path: ROUTES.BRANCH_MANAGER.dashboard,
                                element: <BranchManager_Dashboard />,
                                children: [...globalPopups],
                            },
                            {
                                path: ROUTES.BRANCH_MANAGER.inventory,
                                element: <BranchManager_Inventory />,
                                loader: getBranchInventory,
                                children: [
                                    {
                                        path: "item/add",
                                        element: <InventoryItemAddPopup />,
                                        loader: getBranchInventoryOptions,
                                        action: createBranchInventoryItem,
                                    },
                                    {
                                        path: "item/:id/restock",
                                        element: <InventoryItemRestockPopup />,
                                        loader: getBranchInventoryItem,
                                        action: restockBranchInventoryItem,
                                    },
                                    {
                                        path: "item/:id/delete",
                                        element: <InventoryItemDeletePopup />,
                                        loader: getBranchInventoryItem,
                                        action: deleteBranchInventoryItem,
                                    },
                                    ...globalPopups,
                                ],
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
                        ],
                    },

                    // Cashier Routes: /cashier
                    {
                        element: <RoleBoundary />,
                        handle: { accessLevel: RoleType.CASHIER },
                        children: [
                            {
                                path: ROUTES.CASHIER.root,
                                element: <Navigate to={ROLE_HOME[RoleType.CASHIER]} replace />,
                            },
                            {
                                path: ROUTES.CASHIER.dashboard,
                                element: <Cashier_Dashboard />,
                                children: [...globalPopups],
                            },
                            {
                                path: ROUTES.CASHIER.transactions,
                                element: <Cashier_Transactions />,
                                children: [...globalPopups],
                            },
                            {
                                path: ROUTES.CASHIER.pointOfSale,
                                element: <Cashier_PointOfSale />,
                                children: [...globalPopups],
                            },
                            { path: ROUTES.CASHIER.xRead, element: <Cashier_XRead />, children: [...globalPopups] },
                        ],
                    },

                    // HQ Admin Routes: /hq-admin
                    {
                        element: <RoleBoundary />,
                        handle: { accessLevel: RoleType.HQADMIN },
                        children: [
                            {
                                path: ROUTES.HQ_ADMIN.root,
                                element: <Navigate to={ROLE_HOME[RoleType.HQADMIN]} replace />,
                            },
                            { path: ROUTES.HQ_ADMIN.dashboard, element: <HQ_Dashboard />, children: [...globalPopups] },
                            {
                                path: ROUTES.HQ_ADMIN.catalogue,
                                element: <HQ_Catalogue />,
                                loader: getCataloguePage,
                                children: [
                                    {
                                        path: "product/add",
                                        element: <ProductFormPopup mode="add" />,
                                        loader: getProductForm,
                                        action: createProduct,
                                    },
                                    {
                                        path: "product/:id/edit",
                                        element: <ProductFormPopup mode="edit" />,
                                        loader: getCatalogueProduct,
                                        action: updateProduct,
                                    },
                                    {
                                        path: "product/:id/delete",
                                        element: <ProductDeletePopup />,
                                        loader: getProduct,
                                        action: deleteProduct,
                                    },
                                    {
                                        path: "supplier/add",
                                        element: <SupplierFormPopup mode="add" />,
                                        action: createSupplier,
                                    },
                                    {
                                        path: "supplier/:id/edit",
                                        element: <SupplierFormPopup mode="edit" />,
                                        loader: getSupplier,
                                        action: updateSupplier,
                                    },
                                    {
                                        path: "supplier/:id/delete",
                                        element: <SupplierDeletePopup />,
                                        loader: getSupplier,
                                        action: deleteSupplier,
                                    },
                                    ...globalPopups,
                                ],
                            },
                            {
                                path: ROUTES.HQ_ADMIN.manageUsers,
                                element: <HQ_ManageUsers />,
                                children: [
                                    ...globalPopups,
                                    { path: "branch/add", element: <BranchFormPopup mode="add" /> },
                                    { path: "branch/edit/:id", element: <BranchFormPopup mode="edit" /> },
                                    { path: "branch/delete/:id", element: <DeleteBranchPopup /> },
                                    { path: "manager/add", element: <BranchManagerFormPopup mode="add" /> },
                                    { path: "manager/edit/:id", element: <BranchManagerFormPopup mode="edit" /> },
                                    { path: "manager/view/:id", element: <BranchManagerFormPopup mode="view" /> },
                                ],
                            },
                            {
                                path: ROUTES.HQ_ADMIN.subscriptions,
                                element: <HQ_Subscriptions />,
                                children: [...globalPopups],
                            },
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
                        ],
                    },

                    // Super Admin Routes: /super-admin
                    {
                        element: <RoleBoundary />,
                        handle: { accessLevel: RoleType.SUPERADMIN },
                        children: [
                            {
                                path: ROUTES.SUPER_ADMIN.root,
                                element: <Navigate to={ROLE_HOME[RoleType.SUPERADMIN]} replace />,
                            },
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
        ],
    },
];
