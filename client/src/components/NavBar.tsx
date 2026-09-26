// General Imports
import React from "react";
import { NavLink } from "react-router";

//BuyBuyinIcon
import { BuyBuyInWordmark } from "./BuyBuyInWordmark";

// Components
import Icon from "./Icon";
import { Text } from "./Text";

// Material UI Icons
import BuyBuyInIcon from "@mui/icons-material/LocalOffer";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import UsersIcon from "@mui/icons-material/Group";
import TransactionsIcon from "@mui/icons-material/ReceiptLong";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import BranchOfferIcon from "@mui/icons-material/AddBusiness";
import XReadIcon from "@mui/icons-material/Receipt";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LogoutIcon from "@mui/icons-material/Logout";
import { BusinessCenter, ManageAccounts, NextPlanSharp } from "@mui/icons-material";

// Types / Utils
import { ROUTES } from "../routes/Routes";
import type { MaterialIcon } from "../types/common";

export type UserRoles = "superadmin" | "hqadmin" | "branchmanager" | "cashier";

interface NavItem {
    label: string;
    icon: MaterialIcon;
    path: string;
}

interface NavBarProps {
    role: UserRoles;
}

const NavItems: Record<UserRoles, NavItem[]> = {
    superadmin: [
        {
            label: "Plans",
            icon: NextPlanSharp,
            path: ROUTES.SUPER_ADMIN.plans,
        },
        {
            label: "Businesses",
            icon: BusinessCenter,
            path: ROUTES.SUPER_ADMIN.businesses,
        },
        {
            label: "Subscriptions",
            icon: SubscriptionsIcon,
            path: ROUTES.SUPER_ADMIN.subscriptions,
        },
        {
            label: "Subscriber Accounts",
            icon: ManageAccounts,
            path: ROUTES.SUPER_ADMIN.subscriberAccounts,
        },
    ],
    hqadmin: [
        {
            label: "Dashboard",
            icon: DashboardIcon,
            path: ROUTES.HQ_ADMIN.dashboard,
        },
        {
            label: "Inventory",
            icon: InventoryIcon,
            path: ROUTES.HQ_ADMIN.inventory,
        },
        {
            label: "Manage Users",
            icon: UsersIcon,
            path: ROUTES.HQ_ADMIN.manageUsers,
        },
        {
            label: "Subscriptions",
            icon: SubscriptionsIcon,
            path: ROUTES.HQ_ADMIN.subscriptions,
        },
        {
            label: "Branch Wide Offers",
            icon: BranchOfferIcon,
            path: ROUTES.HQ_ADMIN.branchOffers,
        },
    ],

    branchmanager: [
        {
            label: "Dashboard",
            icon: DashboardIcon,
            path: ROUTES.BRANCH_MANAGER.dashboard,
        },
        {
            label: "Inventory",
            icon: InventoryIcon,
            path: ROUTES.BRANCH_MANAGER.inventory,
        },
        {
            label: "Manage Users",
            icon: UsersIcon,
            path: ROUTES.BRANCH_MANAGER.manageUsers,
        },
        {
            label: "Transactions",
            icon: TransactionsIcon,
            path: ROUTES.BRANCH_MANAGER.transactions,
        },
        {
            label: "Branch Wide Offers",
            icon: BranchOfferIcon,
            path: ROUTES.BRANCH_MANAGER.branchOffers,
        },
    ],

    cashier: [
        {
            label: "Dashboard",
            icon: DashboardIcon,
            path: ROUTES.CASHIER.dashboard,
        },
        {
            label: "Transactions",
            icon: TransactionsIcon,
            path: ROUTES.CASHIER.transactions,
        },
        {
            label: "X-Read",
            icon: XReadIcon,
            path: ROUTES.CASHIER.xRead,
        },
        {
            label: "Point of Sale",
            icon: PointOfSaleIcon,
            path: ROUTES.CASHIER.pointOfSale,
        },
    ],
};

export function NavBar({ role }: NavBarProps) {
    const items = NavItems[role];

    const iconSize = `
        text-regular!
        lg:text-medium!!
        xl:text-big!
        2xl:text-bigger!
   `;

    return (
        <nav
            className="
                max-w-full
                duration-200
                group
                z-999
            "
        >
            <div
                className="
                    flex
                    flex-row
                    justify-between
                    items-center

                    h-full
                    w-full

                    p-1
                    md:p-2
                    md:px-3
                    lg:p-3
                    lg:px-4

                    card-glass-effect
                    bg-slate-dark/95
                    hover:bg-slate-dark

                    transition-colors
                    duration-200
                "
            >
                {/* Logo */}
                <Icon icon={BuyBuyInIcon} variant="cream" size="bigger" iconClassName={iconSize} />

                {/* Navigation Items */}
                <div
                    className="
                        flex
                        flex-row
                        justify-between
                        items-center

                        w-[30%]
                        md:gap-3
                        lg:gap-4
                        xl:gap-5
                    "
                >
                    {items.map((item) => (
                        <NavLink key={item.path} to={item.path} className="">
                            {({ isActive }) => (
                                <div className="flex flex-col gap-[0.2rem] justify-center items-center group/icon ">
                                    <Icon
                                        icon={item.icon}
                                        variant="off-white"
                                        size="bigger"
                                        bg={
                                            isActive
                                                ? {
                                                      variant: "slate-medium",
                                                      type: "normal",
                                                      padding: "small",
                                                  }
                                                : undefined
                                        }
                                        className="transition-transform duration-150 hover:scale-110"
                                        iconClassName={`
                                            ${iconSize}
                                            group-hover:text-off-white!
                                        `}
                                    />
                                    <div className="">
                                        <Text
                                            className={`text-[8px]! ${isActive ? "" : "hidden"}  text-center group-hover/icon:block`}
                                            variant="off-white"
                                            weight="bold"
                                            size="smaller"
                                        >
                                            {item.label}
                                        </Text>
                                    </div>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>

                <button
                    type="button"
                    className="
                        group
                        relative
                        hover:cursor-pointer
                        flex
                        flex-col
                        justify-center
                        items-center
                    "
                >
                    <Icon
                        icon={LogoutIcon}
                        variant="crimson"
                        size="bigger"
                        iconClassName={`
                            ${iconSize}
                            group-hover:text-cream!
                        `}
                    />
                </button>
            </div>
        </nav>
    );
}
