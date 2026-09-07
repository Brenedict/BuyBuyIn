
import React from "react";
import Icon from "./Icon";
import type { MaterialIcon } from "../types/common";
import { NavLink } from "react-router";
import { Text } from "./Text";

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

export type UserRoles =
    | "hqadmin"
    | "branchmanager"
    | "cashier";

interface NavItem {
    label: string;
    icon: MaterialIcon;
    path: string;
}

interface NavBarProps {
    role: UserRoles;
}

const NavItems: Record<UserRoles, NavItem[]> = {
    hqadmin: [
        {
            label: "Dashboard",
            icon: DashboardIcon,
            path: "/hq/dashboard",
        },
        {
            label: "Inventory",
            icon: InventoryIcon,
            path: "/hq/inventory",
        },
        {
            label: "Manage Users",
            icon: UsersIcon,
            path: "/hq/manage-users",
        },
        {
            label: "Subscriptions",
            icon: SubscriptionsIcon,
            path: "/hq/subscriptions",
        },
        {
            label: "Branch Wide Offers",
            icon: BranchOfferIcon,
            path: "/hq/branch-offers",
        },
    ],

    branchmanager: [
        {
            label: "Dashboard",
            icon: DashboardIcon,
            path: "/branch/dashboard",
        },
        {
            label: "Inventory",
            icon: InventoryIcon,
            path: "/branch/inventory",
        },
        {
            label: "Manage Users",
            icon: UsersIcon,
            path: "/branch/manage-users",
        },
        {
            label: "Transactions",
            icon: TransactionsIcon,
            path: "/branch/transactions",
        },
        {
            label: "Branch Wide Offers",
            icon: BranchOfferIcon,
            path: "/branch/branch-offers",
        },
    ],

    cashier: [
        {
            label: "Dashboard",
            icon: DashboardIcon,
            path: "/cashier/dashboard",
        },
        {
            label: "Transactions",
            icon: TransactionsIcon,
            path: "/cashier/transactions",
        },
        {
            label: "X-Read",
            icon: XReadIcon,
            path: "/cashier/x-read",
        },
        {
            label: "Point of Sale",
            icon: PointOfSaleIcon,
            path: "/cashier/pos",
        },
    ],
};

export function NavBar({ role }: NavBarProps) {
    const items = NavItems[role];

    const iconSize = `
        text-medium!
        lg:text-big!
        xl:text-bigger!
        2xl:text-large!
        hover:text-big!
        hover:lg:text-bigger!
        hover:xl:text-large!
        hover:2xl:text-larger!
    `;

    return (
        <nav
            className="
                min-w-12
                md:min-w-14
                lg:min-w-16
                xl:min-w-18
                2xl:min-w-20

                hover:md:min-w-16
                hover:lg:min-w-18
                hover:xl:min-w-20
                hover:2xl:min-w-22

                min-h-[70%]
                max-h-[85%]

                card-drop-shadow
                card-glass-effect
                rounded-[10px]

                transition-[min-width]
                duration-200
            "
        >
            <div
                className="
                    flex
                    flex-col
                    justify-between
                    items-center

                    h-full
                    w-full

                    p-4
                    md:p-3
                    lg:p-4

                    rounded-[10px]
                    card-glass-effect
                    bg-crimson/40
                    hover:bg-crimson/60

                    transition-colors
                    duration-200
                "
            >
                {/* Logo */}
                <div className="flex flex-col items-center gap-3">
                    <Icon
                        icon={BuyBuyInIcon}
                        variant="cream"
                        size="bigger"
                        className="group"
                        iconClassName={iconSize}
                    />

                    <div className="bg-cream w-full h-px" />
                </div>

                {/* Navigation Items */}
                <div
                    className="
                        flex
                        flex-col
                        justify-center
                        items-center

                        gap-3
                        lg:gap-4
                        xl:gap-5
                    "
                >
                    {items.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="group relative"
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        icon={item.icon}
                                        variant="cream"
                                        size="bigger"
                                        bg={
                                            isActive
                                                ? {
                                                    variant: "crimson",
                                                    type: "normal",
                                                    padding: "small",
                                                }
                                                : undefined
                                        }
                                        className="transition-transform duration-150"
                                        iconClassName={`
                                            ${iconSize}
                                            group-hover:text-cream!
                                        `}
                                    />

                                    {/* Hover Label */}
                                    <div
                                        className="
                                            absolute
                                            left-full
                                            top-1/2
                                            -translate-y-1/2
                                            ml-2

                                            hidden
                                            group-hover:block

                                            whitespace-nowrap

                                            bg-crimson/85
                                            text-cream
                                            font-bold

                                            px-3
                                            py-2

                                            rounded-[10px]

                                            card-glass-effect
                                            card-drop-shadow

                                            z-50
                                        "
                                    >
                                        <Text
                                            variant="cream"
                                            weight="bold"
                                        >
                                            {item.label}
                                        </Text>
                                    </div>
                                </>
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
                    <div
                        className="
                            absolute
                            left-full
                            top-1/2
                            -translate-y-1/2
                            ml-2

                            hidden
                            group-hover:block

                            whitespace-nowrap

                            bg-crimson/85
                            text-cream
                            font-bold

                            px-3
                            py-2

                            rounded-[10px]

                            card-glass-effect
                            card-drop-shadow

                            z-50
                        "
                    >
                        <Text
                            variant="cream"
                            weight="bold"
                        >
                            Log Out
                        </Text>
                    </div>
                </button>
            </div>
        </nav>
    );
}

