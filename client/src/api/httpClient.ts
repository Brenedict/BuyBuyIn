// API Services
import InMemoryStore from "./inMemoryStore";

const FALLBACK_API_URL = "http://localhost:3000/api/v1";

export type FetchOptions = RequestInit & { retry?: boolean };

export const getApiUrl = (route: string): string => {
    const api: string = import.meta.env.VITE_API_URL || FALLBACK_API_URL;
    const trimmed = route.trim();
    const cleanRoute = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${api.replace(/\/+$/, "")}${cleanRoute}`;
};

const addAuthHeader = (headers?: HeadersInit): Headers => {
    const merged = new Headers(headers);
    const token = InMemoryStore.getAccessToken();

    if (token) {
        merged.set("Authorization", `Bearer ${token}`);
    }

    return merged;
};

export const apiFetch = async (route: string, options: FetchOptions = {}): Promise<Response> => {
    const { retry = true, ...rest } = options;
    const headers = addAuthHeader(rest.headers as HeadersInit);
    const res = await fetch(getApiUrl(route), {
        ...rest,
        headers,
        credentials: "include",
    });

    // If we got 401 and haven't retried yet, try refreshing the token
    if (res.status === 401 && retry) {
        const refreshRes = await fetch(getApiUrl("/auth/refresh"), {
            method: "POST",
            credentials: "include",
        });

        if (refreshRes.ok) {
            const { accessToken } = await refreshRes.json();
            InMemoryStore.setAccessToken(accessToken);
            // retry original request with new token
            return await apiFetch(route, { ...rest, retry: false });
        }
    }

    return res;
};
