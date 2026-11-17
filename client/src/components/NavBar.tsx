// General Imports
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NavLink, useLocation } from "react-router";

// BuyBuyIn Shared Imports
import type { RoleType } from "@buybuyin/shared/prisma/enums";

// API / Context
import InMemoryStore from "../api/inMemoryStore";

// Components
import Icon from "./Icon";
import { Text } from "./Text";

// Material UI Icons
import BuyBuyInIcon from "@mui/icons-material/LocalOffer";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import UsersIcon from "@mui/icons-material/Group";
import TransactionsIcon from "@mui/icons-material/ReceiptLong";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import BranchOfferIcon from "@mui/icons-material/AddBusiness";
import XReadIcon from "@mui/icons-material/Receipt";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LogoutIcon from "@mui/icons-material/Logout";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { BusinessCenter, ManageAccounts, NextPlanSharp } from "@mui/icons-material";

// Types / Utils
import { ROUTES } from "../routes/Routes";
import type { MaterialIcon } from "../types/common";
import useNavigatePage from "../hooks/useNavigatePage";

interface NavItem {
    label: string;
    icon: MaterialIcon;
    path: string;
}

interface NavBarProps {
    role: RoleType;
}

const NavItems: Record<RoleType, NavItem[]> = {
    HQADMIN: [
        {
            label: "Dashboard",
            icon: DashboardIcon,
            path: ROUTES.HQ_ADMIN.dashboard,
        },
        {
            label: "Catalogue",
            icon: CategoryOutlinedIcon,
            path: ROUTES.HQ_ADMIN.catalogue,
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

    BRANCHMANAGER: [
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

    CASHIER: [
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

    // TODO: Add superadmin stuff here from the nav PR feat/#58
    SUPERADMIN: [
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
};

const RoleLabels: Record<RoleType, string> = {
    HQADMIN: "HQ Admin",
    BRANCHMANAGER: "Branch Manager",
    CASHIER: "Cashier",
    SUPERADMIN: "Super Admin",
};

// MAIN COMPONENT
export function NavBar({ role }: NavBarProps) {
    const navigate = useNavigatePage();
    const location = useLocation();
    const user = useSyncExternalStore(InMemoryStore.subscribe, InMemoryStore.getUserContext);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const logoutPath = `${location.pathname.replace(/\/$/, "")}/logout`;

    useEffect(() => {
        const interval = setInterval(() => setCurrentDateTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        navigate(logoutPath);
    };

    return (
        <nav className="relative z-999 max-w-full duration-200 group">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center min-h-16 h-full w-full gap-3 p-2 md:px-3 lg:py-2 lg:px-4 card-glass-effect bg-slate-dark/95 hover:bg-slate-dark transition-colors duration-200">
                <BrandSection />
                <NavigationSection items={NavItems[role]} />
                <div className="flex flex-row items-center justify-end gap-3 min-w-0">
                    <DateTimeDisplay currentDateTime={currentDateTime} />
                    <div className="h-9 w-px bg-slate-light/40 shrink-0" />
                    <UserProfileMenu roleLabel={RoleLabels[role]} />
                    <LogoutButton onLogout={handleLogout} />
                </div>
            </div>
        </nav>
    );
}

// SUB-COMPONENTS
// Logo and Branch Information
function BrandSection() {
    const iconSize = "text-regular! lg:text-medium!! xl:text-big! 2xl:text-bigger!";

    return (
        <div className="flex flex-row items-center gap-3 shrink-0">
            <Icon icon={BuyBuyInIcon} variant="cream" size="bigger" iconClassName={iconSize} />
            <div className="h-9 w-px bg-slate-light/40" />
            <div className="flex flex-row items-center gap-2 rounded-full bg-slate-medium/70 px-4 py-2 whitespace-nowrap">
                <LocationOnIcon className="text-off-white! text-lg!" />
                <Text variant="off-white" weight="bold" size="small">
                    Sta. Mesa Branch
                </Text>
            </div>
        </div>
    );
}

// Role-Based Navigation Items
function NavigationSection({ items }: { items: NavItem[] }) {
    const iconSize = "text-regular! lg:text-medium!! xl:text-big! 2xl:text-bigger!";

    return (
        <div className="flex flex-row justify-center items-center min-w-0 gap-1 md:gap-2 lg:gap-3 xl:gap-4">
            {items.map((item) => (
                <NavLink key={item.path} to={item.path} className="shrink-0">
                    {({ isActive }) => (
                        <div
                            className={`flex flex-col gap-1 justify-center items-center rounded-2xl px-2 py-2 lg:px-3 lg:py-2 transition-all duration-200 ${isActive ? "bg-crimson/70" : "hover:bg-slate-medium/60"}`}
                        >
                            <Icon icon={item.icon} variant="off-white" size="bigger" iconClassName={iconSize} />
                            <Text
                                className="text-[10px]! text-center whitespace-nowrap"
                                variant="off-white"
                                weight="bold"
                                size="smaller"
                            >
                                {item.label}
                            </Text>
                        </div>
                    )}
                </NavLink>
            ))}
        </div>
    );
}

// Date and Time
function DateTimeDisplay({ currentDateTime }: { currentDateTime: Date }) {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(currentDateTime);

    const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(currentDateTime);

    return (
        <div className="flex flex-row items-center shrink-0">
            <Text variant="off-white" weight="medium" size="small" className="whitespace-nowrap">
                {formattedDate} · {formattedTime}
            </Text>
        </div>
    );
}

// User Profile and Dropdown
function UserProfileMenu({ roleLabel }: { roleLabel: string }) {
    const user = useSyncExternalStore(InMemoryStore.subscribe, InMemoryStore.getUserContext);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    const firstName = user?.firstName ?? "";
    const lastName = user?.lastName ?? "";
    const fullName = `${firstName} ${lastName}`.trim() || "User";
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setProfileDropdownOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div ref={profileDropdownRef} className="relative flex flex-row items-center shrink-0">
            <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                className="flex flex-row items-center gap-2 hover:cursor-pointer rounded-xl p-1 transition-colors hover:bg-slate-medium/50"
            >
                {/* User Initials */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-crimson text-off-white font-bold text-sm shrink-0">
                    {initials}
                </div>

                {/* User Name and Role */}
                <div className="flex flex-col items-start min-w-0">
                    <Text variant="off-white" weight="bold" size="small" className="whitespace-nowrap">
                        {fullName}
                    </Text>
                    <Text variant="off-white" weight="regular" size="small" className="whitespace-nowrap">
                        {roleLabel}
                    </Text>
                </div>

                <KeyboardArrowRightIcon
                    className={`text-off-white! transition-transform duration-200 ${profileDropdownOpen ? "rotate-90" : ""}`}
                />
            </button>

            {profileDropdownOpen && (
                <ProfileDropdown fullName={fullName} email={user?.email ?? ""} roleLabel={roleLabel} />
            )}
        </div>
    );
}

// Profile Dropdown Content
function ProfileDropdown({ fullName, email, roleLabel }: { fullName: string; email: string; roleLabel: string }) {
    return (
        <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-slate-dark/20 bg-off-white shadow-xl z-1000">
            {/* Profile Details */}
            <div className="flex flex-col gap-1 p-4 border-b border-slate-dark/15">
                <Text variant="slate-dark" weight="bold" size="normal">
                    {fullName}
                </Text>
                <Text variant="slate-dark" weight="regular" size="small">
                    {email}
                </Text>
                <Text variant="brown" weight="medium" size="small">
                    {roleLabel}
                </Text>
            </div>

            {/* Account Management Options */}
            <div className="flex flex-col p-2">
                <button
                    type="button"
                    className="flex flex-row items-center gap-3 w-full rounded-lg px-3 py-3 text-slate-dark hover:bg-slate-dark/10 transition-colors text-left"
                >
                    <ManageAccounts className="text-slate-dark!" />
                    <Text variant="slate-dark" weight="medium" size="small">
                        Change Profile
                    </Text>
                </button>

                <button
                    type="button"
                    className="flex flex-row items-center gap-3 w-full rounded-lg px-3 py-3 text-slate-dark hover:bg-slate-dark/10 transition-colors text-left"
                >
                    <LockOutlinedIcon className="text-slate-dark!" />
                    <Text variant="slate-dark" weight="medium" size="small">
                        Change Password
                    </Text>
                </button>
            </div>
        </div>
    );
}

// Standalone Logout Button
function LogoutButton({ onLogout }: { onLogout: () => void }) {
    const iconSize = "text-regular! lg:text-medium!! xl:text-big! 2xl:text-bigger!";

    return (
        <button
            type="button"
            className="group relative hover:cursor-pointer flex flex-col justify-center items-center shrink-0 rounded-xl p-2 transition-colors hover:bg-slate-medium/60"
            onClick={onLogout}
            aria-label="Logout"
            title="Logout"
        >
            <Icon icon={LogoutIcon} variant="crimson" size="bigger" iconClassName={iconSize} />
        </button>
    );
}