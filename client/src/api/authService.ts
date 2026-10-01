// General Imports
import { redirect } from "react-router";

// BuyBuyIn Shared Imports
import { type UserGlobalContextSchemaType } from "@buybuyin/shared/schema/user";

// API Services
import { apiFetch } from "./httpClient";
import InMemoryStore from "./inMemoryStore";
import { ROLE_HOME, ROUTES } from "../routes/Routes";
import { getUserContextLoader } from "./userService";

// TODO: Temporary (wala pang /user/me)
export type AuthState = {
    isAuthenticated: true;
    accessToken: string | null;
    user: UserGlobalContextSchemaType | null;
};

export const checkAuthService = async (): Promise<boolean> => {
    try {
        const res = await apiFetch("/auth/protected", {
            method: "GET",
            headers: { Accept: "application/json" },
        });

        return res.ok;
    } catch {
        return false;
    }
};

let inflightAuthState: Promise<AuthState | null> | null = null;

// Handles missing authstate
const resolveAuthState = async (): Promise<AuthState | null> => {
    const cachedUser = InMemoryStore.getUserContext();
    if (cachedUser) {
        return { isAuthenticated: true, accessToken: InMemoryStore.getAccessToken(), user: cachedUser };
    }

    if (!inflightAuthState) {
        inflightAuthState = (async (): Promise<AuthState | null> => {
            const isAuthenticated = await checkAuthService();
            if (!isAuthenticated) {
                InMemoryStore.setAccessToken(null);
                return null;
            }

            const user = await getUserContextLoader();
            InMemoryStore.setUserContext(user);

            return { isAuthenticated: true, accessToken: InMemoryStore.getAccessToken(), user };
        })().finally(() => {
            inflightAuthState = null;
        });
    }

    return inflightAuthState;
};

export const primaryAuthLoader = async (): Promise<AuthState> => {
    const authState = await resolveAuthState();
    if (!authState) {
        throw redirect(ROUTES.AUTH);
    }

    return authState;
};

// Sends the user from "/" straight to the landing page of their own role.
export const homeRedirectLoader = async () => {
    const authState = await resolveAuthState();
    const role = authState?.user?.role;
    if (!role) {
        throw redirect(ROUTES.AUTH);
    }

    return redirect(ROLE_HOME[role]);
};

export const logoutService = async (): Promise<boolean> => {
    try {
        const res = await apiFetch("/auth/logout", {
            retry: false,
            method: "POST",
            headers: { Accept: "application/json" },
        });

        return res.ok;
    } catch {
        return false;
    } finally {
        InMemoryStore.setAccessToken(null);
        InMemoryStore.setUserContext(null);
    }
};

export const logoutAction = async () => {
    const success = await logoutService();

    if (success) {
        return redirect(ROUTES.AUTH);
    }

    return null;
};
