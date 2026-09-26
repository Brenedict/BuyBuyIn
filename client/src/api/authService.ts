// General Imports
import { redirect } from "react-router";

// API Services
import { apiFetch } from "./httpClient";
import InMemoryStore from "./inMemoryStore";
import { ROUTES } from "../routes/Routes";

// TODO: Temporary (wala pang /user/me)
export type AuthState = {
    isAuthenticated: true;
    accessToken: string | null;
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

export const primaryAuthLoader = async (): Promise<AuthState> => {
    const isAuthenticated = await checkAuthService();

    if (!isAuthenticated) {
        InMemoryStore.setAccessToken(null);
        throw redirect(ROUTES.AUTH);
    }

    return { isAuthenticated: true, accessToken: InMemoryStore.getAccessToken() };
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
    }
};

export const logoutAction = async () => {
    const success = await logoutService();

    if (success) {
        return redirect(ROUTES.AUTH);
    }

    return null;
};
