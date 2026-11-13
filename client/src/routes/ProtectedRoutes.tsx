// General Imports
import { Navigate, type RouteObject } from "react-router";

// BuyBuyIn Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";

// Static Layout Page
import StaticLayout from "../pages/shared/StaticLayout";

// Static Access Checker before entering any page
import { AccessValidator } from "../pages/shared/AccessValidator";
import { RoleBoundary } from "../pages/shared/RoleBoundary";
import Forbidden from "../pages/shared/Forbidden";

// API Services
import { primaryAuthLoader, homeRedirectLoader } from "../api/authService";
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

import {
    createHQBranchWideOffer,
    deleteHQBranchWideOffer,
    getBranchWideOffer,
    getBranchWideOffersPage,
    getHQBranchWideOffer,
    getHQBranchWideOfferEditPage,
    getHQBranchWideOffersPage,
    updateBranchWideOfferStatus,
    updateHQBranchWideOffer,
} from "../api/branchWideOfferService";

import {
    createBranchEntity,
    createBranchManagerAccount,
    createBusinessEntity,
    createCashierAccount,
    createUserHqAdmin,
    deleteBranch,
    deleteBusiness,
    deleteCashier,
    deleteManager,
    deleteSubscriber,
    getBranch,
    getBranches,
    getBusiness,
    getBusinesses,
    getCashier,
    getCashierForm,
    getCashiers,
    getManageUsersPage,
    getManager,
    getManagerDeleteContext,
    getManagerForm,
    getSubscriber,
    getSubscriberDeleteContext,
    getSubscriberForm,
    getSubscribers,
    manageAccountStatus,
    resendVerification,
    updateBranch,
    updateBusiness,
    updateCashier,
    updateManager,
    updateSubscriber,
} from "../api/registrationService";

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
import { CashierAddEditPopup, CashierDeletePopup } from "../components/popups/branch-manager/CashierAccountsPopups";
import { BranchOfferViewPopup } from "../components/popups/branch-manager/BranchOffersPopups";

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

import { BranchOfferDeletePopup } from "../components/popups/hq-admin/BranchOffersPopups";
import {
    BranchFormPopup,
    DeleteBranchPopup,
    BranchManagerFormPopup,
    ManagerDeletePopup,
} from "../components/popups/hq-admin/BranchManagerAccountsPopups";
import { ProductFormPopup, ProductDeletePopup } from "../components/popups/hq-admin/CataloguePopups";
import { SupplierFormPopup, SupplierDeletePopup } from "../components/popups/hq-admin/SupplierPopups";
import { ManageAccountPopup } from "../components/popups/shared/ManageAccountPopup";
import { ResendVerificationPopup } from "../components/popups/shared/ResendVerificationPopup";

// Super Admin Pages and Popups
import SuperAdmin_Plans from "../pages/super-admin/SuperAdmin.Plans";
import SuperAdmin_Businesses from "../pages/super-admin/SuperAdmin.Businesses";
import SuperAdmin_Subscriptions from "../pages/super-admin/SuperAdmin.Subscriptions";
import SuperAdmin_SubscriberAccounts from "../pages/super-admin/SuperAdmin.SubscriberAccounts";

import { DeleteSubscriptionPopup, SubscriptionFormPopup } from "../components/popups/super-admin/SubscriptionsPopups";
import { BusinessFormPopup, BusinessDeletePopup } from "../components/popups/super-admin/BusinessesPopups";
import { PlansAddEditPopup, PlansDeletePopup } from "../components/popups/super-admin/PlansPopups";
import {
    SubscriberAddEditPopup,
    SubscriberDeletePopup,
} from "../components/popups/super-admin/SubscriberAccountsPopups";

// Predefined Routes
import { ROLE_HOME, ROUTES } from "./Routes";

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

                    // ============= Branch Manager Routes: /branch-manager =============
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
                                loader: getCashiers,
                                children: [
                                    {
                                        path: "cashier/add",
                                        element: <CashierAddEditPopup mode="add" />,
                                        loader: getBranches,
                                        action: createCashierAccount,
                                    },
                                    {
                                        path: "cashier/:id/edit",
                                        element: <CashierAddEditPopup mode="edit" />,
                                        loader: getCashierForm,
                                        action: updateCashier,
                                    },
                                    {
                                        path: "cashier/:id/manage",
                                        element: (
                                            <ManageAccountPopup
                                                accountLabel="Cashier"
                                                returnTo={ROUTES.BRANCH_MANAGER.manageUsers}
                                                deleteTo={(id) => ROUTES.BRANCH_MANAGER.manageUsersDeleteCashier(id)}
                                            />
                                        ),
                                        loader: getCashier,
                                        action: manageAccountStatus,
                                    },
                                    {
                                        path: "cashier/:id/delete",
                                        element: <CashierDeletePopup />,
                                        loader: getCashier,
                                        action: deleteCashier,
                                    },
                                    {
                                        path: "cashier/:id/resend",
                                        element: (
                                            <ResendVerificationPopup returnTo={ROUTES.BRANCH_MANAGER.manageUsers} />
                                        ),
                                        loader: getCashier,
                                        action: resendVerification,
                                    },
                                    ...globalPopups,
                                ],
                            },
                            {
                                path: ROUTES.BRANCH_MANAGER.branchOffers,
                                element: <BranchManager_BranchWideOffers />,
                                loader: getBranchWideOffersPage,
                                children: [
                                    {
                                        path: ":id/view",
                                        element: <BranchOfferViewPopup />,
                                        loader: getBranchWideOffer,
                                    },
                                    {
                                        path: ":id/status",
                                        action: updateBranchWideOfferStatus,
                                    },
                                    ...globalPopups,
                                ],
                            },
                            {
                                path: ROUTES.BRANCH_MANAGER.transactions,
                                element: <BranchManager_Transactions />,
                                children: [...globalPopups],
                            },
                        ],
                    },

                    // ============= Cashier Routes: /cashier =============
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
                            {
                                path: ROUTES.CASHIER.xRead,
                                element: <Cashier_XRead />,
                                children: [...globalPopups],
                            },
                        ],
                    },

                    // ============= HQ Admin Routes: /hq-admin =============
                    {
                        element: <RoleBoundary />,
                        handle: { accessLevel: RoleType.HQADMIN },
                        children: [
                            {
                                path: ROUTES.HQ_ADMIN.root,
                                element: <Navigate to={ROLE_HOME[RoleType.HQADMIN]} replace />,
                            },
                            {
                                path: ROUTES.HQ_ADMIN.dashboard,
                                element: <HQ_Dashboard />,
                                children: [...globalPopups],
                            },
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
                                loader: getManageUsersPage,
                                children: [
                                    ...globalPopups,
                                    {
                                        path: "branch/add",
                                        element: <BranchFormPopup mode="add" />,
                                        action: createBranchEntity,
                                    },
                                    {
                                        path: "branch/edit/:id",
                                        element: <BranchFormPopup mode="edit" />,
                                        loader: getBranch,
                                        action: updateBranch,
                                    },
                                    {
                                        path: "branch/delete/:id",
                                        element: <DeleteBranchPopup />,
                                        loader: getBranch,
                                        action: deleteBranch,
                                    },
                                    {
                                        path: "manager/add",
                                        element: <BranchManagerFormPopup mode="add" />,
                                        loader: getBranches,
                                        action: createBranchManagerAccount,
                                    },
                                    {
                                        path: "manager/:id/edit",
                                        element: <BranchManagerFormPopup mode="edit" />,
                                        loader: getManagerForm,
                                        action: updateManager,
                                    },
                                    {
                                        path: "manager/:id/manage",
                                        element: (
                                            <ManageAccountPopup
                                                accountLabel="Branch Manager"
                                                returnTo={ROUTES.HQ_ADMIN.manageUsers}
                                                deleteTo={(id) => ROUTES.HQ_ADMIN.manageUsersManagerDelete(id)}
                                            />
                                        ),
                                        loader: getManager,
                                        action: manageAccountStatus,
                                    },
                                    {
                                        path: "manager/:id/delete",
                                        element: <ManagerDeletePopup />,
                                        loader: getManagerDeleteContext,
                                        action: deleteManager,
                                    },
                                    {
                                        path: "manager/:id/resend",
                                        element: <ResendVerificationPopup returnTo={ROUTES.HQ_ADMIN.manageUsers} />,
                                        loader: getManager,
                                        action: resendVerification,
                                    },
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
                                loader: getHQBranchWideOffersPage,
                                children: [
                                    {
                                        path: "save",
                                        action: createHQBranchWideOffer,
                                    },
                                    {
                                        path: ":id/delete",
                                        element: <BranchOfferDeletePopup />,
                                        loader: getHQBranchWideOffer,
                                        action: deleteHQBranchWideOffer,
                                    },
                                    ...globalPopups,
                                ],
                            },
                            {
                                path: ROUTES.HQ_ADMIN.branchOffers + "/:id/edit",
                                element: <HQ_BranchWideOffers />,
                                loader: getHQBranchWideOfferEditPage,
                                children: [
                                    {
                                        path: "save",
                                        action: updateHQBranchWideOffer,
                                    },
                                    ...globalPopups,
                                ],
                            },
                        ],
                    },

                    // ============= Super Admin Routes: /super-admin =============
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
                                    {
                                        path: "add",
                                        element: <PlansAddEditPopup mode="add" />,
                                    },
                                    {
                                        path: ":id/edit",
                                        element: <PlansAddEditPopup mode="edit" />,
                                    },
                                    {
                                        path: ":id/delete",
                                        element: <PlansDeletePopup />,
                                    },
                                    ...globalPopups,
                                ],
                            },
                            {
                                path: ROUTES.SUPER_ADMIN.businesses,
                                element: <SuperAdmin_Businesses />,
                                loader: getBusinesses,
                                children: [
                                    {
                                        path: "add",
                                        element: <BusinessFormPopup mode="add" />,
                                        action: createBusinessEntity,
                                    },
                                    {
                                        path: ":id/edit",
                                        element: <BusinessFormPopup mode="edit" />,
                                        loader: getBusiness,
                                        action: updateBusiness,
                                    },
                                    {
                                        path: ":id/delete",
                                        element: <BusinessDeletePopup />,
                                        loader: getBusiness,
                                        action: deleteBusiness,
                                    },
                                    ...globalPopups,
                                ],
                            },
                            {
                                path: ROUTES.SUPER_ADMIN.subscriptions,
                                element: <SuperAdmin_Subscriptions />,
                                children: [
                                    {
                                        path: "add",
                                        element: <SubscriptionFormPopup mode="add" />,
                                    },
                                    {
                                        path: ":id/edit",
                                        element: <SubscriptionFormPopup mode="edit" />,
                                    },
                                    {
                                        path: ":id/delete",
                                        element: <DeleteSubscriptionPopup />,
                                    },
                                    ...globalPopups,
                                ],
                            },
                            {
                                path: ROUTES.SUPER_ADMIN.subscriberAccounts,
                                element: <SuperAdmin_SubscriberAccounts />,
                                loader: getSubscribers,
                                children: [
                                    {
                                        path: "add",
                                        element: <SubscriberAddEditPopup mode="add" />,
                                        loader: getBusinesses,
                                        action: createUserHqAdmin,
                                    },
                                    {
                                        path: ":id/edit",
                                        element: <SubscriberAddEditPopup mode="edit" />,
                                        loader: getSubscriberForm,
                                        action: updateSubscriber,
                                    },
                                    {
                                        path: ":id/manage",
                                        element: (
                                            <ManageAccountPopup
                                                accountLabel="Subscriber"
                                                returnTo={ROUTES.SUPER_ADMIN.subscriberAccounts}
                                                deleteTo={(id) => ROUTES.SUPER_ADMIN.subscriberAccountsDelete(id)}
                                            />
                                        ),
                                        loader: getSubscriber,
                                        action: manageAccountStatus,
                                    },
                                    {
                                        path: ":id/delete",
                                        element: <SubscriberDeletePopup />,
                                        loader: getSubscriberDeleteContext,
                                        action: deleteSubscriber,
                                    },
                                    {
                                        path: ":id/resend",
                                        element: (
                                            <ResendVerificationPopup returnTo={ROUTES.SUPER_ADMIN.subscriberAccounts} />
                                        ),
                                        loader: getSubscriber,
                                        action: resendVerification,
                                    },
                                    ...globalPopups,
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
