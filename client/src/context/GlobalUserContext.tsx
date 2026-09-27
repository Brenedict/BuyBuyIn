// General Imports
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouteLoaderData } from "react-router";

// BuyBuyIn Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";

// API Services
import { logoutService, primaryAuthLoader } from "../api/authService";
import InMemoryStore from "../api/inMemoryStore";
import { getUserContextLoader } from "../api/userService";

interface UserGlobalContextType {
    role: RoleType;
}

export const UserGlobalContext = createContext<UserGlobalContextType | null>(null);

// TODO: Global context should provide all necessary user details not only the role
export const GlobalUserContextProvider = async ({ children }: { children: ReactNode }) => {
    const data = useRouteLoaderData<typeof primaryAuthLoader>("protected");

    const [role, setRole] = useState<RoleType>(RoleType.CASHIER);

    if (!data?.isAuthenticated) {
        const userContext: UserGlobalContextType = await getUserContextLoader();
        setRole(userContext.role);
    }

    return <UserGlobalContext value={{ role: role }}>{children}</UserGlobalContext>;
};

/**
 * FROM: Benedict; To: Kenneth
 *  TODO: Currently finorce ko muna na mag query sa /me para makuha role, idk pano mo ginawa yung sa InMemoryStore
 */
/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => {
    const ctx = useContext(UserGlobalContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    const user = useSyncExternalStore(InMemoryStore.subscribe, InMemoryStore.getAccessToken);

    return { ...ctx, user };
};
