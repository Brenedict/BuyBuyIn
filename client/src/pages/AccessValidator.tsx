// General Imports
import { Outlet, useRouteLoaderData } from "react-router";

export function AccessValidator() {
    return (
        // This div should be a context provider in the future
        <div>
            <Outlet />
        </div>
    );
}
