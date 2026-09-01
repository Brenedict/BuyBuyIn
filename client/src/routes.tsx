// General Imports
import { type RouteObject } from "react-router";

// Routes
import { protectedRoutes } from "./routes/ProtectedRoutes";

const routes: RouteObject[] = [
    // TODO: Add Auth Routes for login handling here (preferrably refer to Kenneth)
    //   ...authRoutes,

    ...protectedRoutes,

    // TODO: Add Error Page handling here (preferrably refer to Richard)
    // {
    //     path: "*",
    //     element: <NotFoundPage />,
    // },
];

export default routes;
