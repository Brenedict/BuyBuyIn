// General Imports
import { useSyncExternalStore } from "react";
import { Outlet, useRouteLoaderData } from "react-router";

// API Services
import type { primaryAuthLoader } from "../../api/authService";
import InMemoryStore from "../../api/inMemoryStore";

export function AccessValidator() {
    const data = useRouteLoaderData<typeof primaryAuthLoader>("protected");

    const accessToken = useSyncExternalStore(InMemoryStore.subscribe, InMemoryStore.getAccessToken);

    if (!data?.isAuthenticated || !accessToken) {
        // NOTE: Temporary login access
        // throw new Error("Access token not found");

        console.log("No access token found");
    }

    return <Outlet />;
}

export default AccessValidator;
