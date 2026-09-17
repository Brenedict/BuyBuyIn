// General Imports
import { Outlet, useRouteLoaderData } from "react-router";

export function AccessValidator() {
    return (
        // TODO: This div should be a context provider in the future. This should check if the user is authorized.
        <div>
            <Outlet />
        </div>
    );
}
