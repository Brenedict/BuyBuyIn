import React from "react";
import Icon from "./Icon";
import type { MaterialIcon } from "../types/common";
import { NavLink } from "react-router";
import { Text } from "./Text";

import BuyBuyInIcon from '@mui/icons-material/LocalOffer';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import UsersIcon from '@mui/icons-material/Group';
import TransactionsIcon from '@mui/icons-material/ReceiptLong';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import BranchOfferIcon from '@mui/icons-material/AddBusiness';
import XReadIcon from '@mui/icons-material/Receipt';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LogoutIcon from '@mui/icons-material/Logout';


export type UserRoles =
    //| "adminside"
    | "hqadmin"
    | "branchmanager"
    | "cashier";

interface NavItem {
    label: string,
    icon: MaterialIcon,
    path: string
}

interface NavBarProps {
    role: UserRoles;
}

const NavItems : Record<UserRoles, NavItem[]> = {

    // adminside: [

    // ],
    hqadmin: [
        {
            label:"Dashboard",
            icon: DashboardIcon,
            path: "/hq/dashboard"
        },
        {
            label: "Inventory",
            icon: InventoryIcon,
            path: "/hq/inventory"
        },
        {
            label:"Manage Users",
            icon: UsersIcon,
            path: "/hq/manage-users"
        },
        {
            label:"Subscriptions",
            icon: SubscriptionsIcon,
            path: "/hq/subscriptions"
        },
        {
            label:"Branch Wide Offers",
            icon: BranchOfferIcon,
            path: "/hq/branch-offers"
        }
    ],
    branchmanager: [
        {
            label:"Dashboard",
            icon: DashboardIcon,
            path: "/branch/dashboard"
        },
        {
            label:"Inventory",
            icon: InventoryIcon,
            path: "/branch/inventory"
        },
        {
            label: "Manage Users",
            icon: UsersIcon,
            path: "/branch/manage-users"
        },
        {
            label: "Transactions",
            icon: TransactionsIcon,
            path: "/branch/transactions"
        },
        {
            label: "Branch Wide Offers",
            icon: BranchOfferIcon,
            path: "/branch/branch-offers"
        }
    ],
    cashier: [
        {
            label: "Dashboard",
            icon: DashboardIcon,
            path: "/cashier/dashboard"
        },
        {
            label: "Transactions",
            icon: TransactionsIcon,
            path: "/cashier/transactions"
        },
        {
            label: "X-Read",
            icon: XReadIcon,
            path: "/cashier/x-read"
        },
        {
            label: "Point of Sale",
            icon: PointOfSaleIcon,
            path: "/cashier/pos"
        }
    ]
}

export function NavBar ({role}: NavBarProps) {

    const items = NavItems[role];

    return (
        <nav className="min-w-20 min-h-[292px] max-h-[75%] card-drop-shadow card-glass-effect rounded-[10px] hover:min-w-28">
            <div className="flex flex-col justify-between items-center h-full w-full gap-8 p-5 rounded-[10px] card-glass-effect bg-crimson/40 pb-20 hover:bg-crimson/60">
            <div className="flex flex-col gap-5">
                <Icon icon={BuyBuyInIcon} variant="cream" size="larger"></Icon>
                <div className="bg-cream w-full h-px"></div>
            </div>
            
            <div className="flex flex-col justify-center items-center gap-8">
               {items.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className="group relative" //essentially makes it so that the whole element can be toggled as active or inactive
                    > 
                        {({isActive})=> (
                            <a key={item.path} href={item.path}>
                                <Icon icon={item.icon} variant="cream" size="larger" 
                                    bg={isActive ? {variant:"crimson", type:"normal", padding:"small"} : undefined}
                                    iconClassName="hover:text-icon-hero!">
                                </Icon>
                                <div className="
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
                                ">
                                    <Text variant="cream" weight="bold">{item.label}</Text>
                                </div>
                            </a>)}
                    </NavLink>
            ))}
            </div>


            <div className="group relative hover:cursor-pointer">
                <Icon icon={LogoutIcon} variant="crimson" size="larger" iconClassName="hover:text-cream! hover:text-icon-hero!"></Icon>
                <div className="
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
                        ">
                            <Text variant="cream" weight="bold">Log Out</Text>
                </div>
            </div>
            
        </div>
        </nav>
    )
}

