// API Services
import { apiFetch } from "./httpClient";
import { logoutService } from "./authService";

// GET: Fetches the data of the currently logged-in user. If the user is not authenticated, it will log them out and return null.
export const getUserContextLoader = async (): Promise<any> => {
    try {
        const res = await apiFetch("/user/me", {
            retry: true,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            const error = (await res.json()).error;
            throw new Error(`Failed to get user data ${res.status} => ${error}`);
        }

        return res.json();
    } catch (err) {
        console.error(err);
        await logoutService();
        return null;
    }
};
