// General Imports
import { useSyncExternalStore } from "react";
import { Navigate, Outlet, useRouteLoaderData } from "react-router";

// API Services
import { type primaryAuthLoader } from "../../api/authService";
import InMemoryStore from "../../api/inMemoryStore";
import { ROUTES } from "../../routes/Routes";

export function AccessValidator() {
    const data = useRouteLoaderData<typeof primaryAuthLoader>("protected");
    const accessToken = useSyncExternalStore(InMemoryStore.subscribe, InMemoryStore.getAccessToken);

    // TODO: Temporary force log out logic
    if (!data?.isAuthenticated || !accessToken) {
        InMemoryStore.setAccessToken(null);
        InMemoryStore.setUserContext(null);
        return <Navigate to={ROUTES.AUTH} replace />;
    }

    return <Outlet />;
}

export default AccessValidator;

// TODO:: Add more here in the future for additional global context not limited to the user
export const useGlobalContext = () => {
    const user = useSyncExternalStore(InMemoryStore.subscribe, InMemoryStore.getUserContext);

    return { user };
};
