import { redirect, type ActionFunctionArgs, type RouteObject } from "react-router";

import { LoginSchema } from "@buybuyin/shared/schema/login";
import Login from "../pages/shared/Login";
import { checkAuthService } from "../api/authService";
import { apiFetch } from "../api/httpClient";
import InMemoryStore from "../api/inMemoryStore";
import { ROUTES } from "./Routes";

const PROTECTED_ROOT = "/";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const result = LoginSchema.safeParse(formData);

    if (!result.success) {
        return null;
    }

    const user = result.data;

    const res = await apiFetch("/auth/login", {
        retry: false,
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: user?.email, password: user?.password }),
    });

    if (res.ok) {
        const payload = (await res.json().catch(() => null)) as { accessToken?: string } | null;

        if (payload?.accessToken) {
            InMemoryStore.setAccessToken(payload.accessToken);
            return redirect(PROTECTED_ROOT);
        }
    }

    if (res.status === 401) {
        InMemoryStore.setAccessToken(null);
        return redirect(ROUTES.AUTH);
    }

    return null;
};

export const authLoader = async () => {
    const isAuthenticated = await checkAuthService();

    if (isAuthenticated) {
        return redirect(PROTECTED_ROOT);
    }

    return null;
};

export const authRoutes: RouteObject[] = [
    {
        // Login Route: /auth
        path: ROUTES.AUTH,
        element: <Login />,
        action: loginAction,
        loader: authLoader,
    },
];
