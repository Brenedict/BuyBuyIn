// General Imports
import { type RouteObject } from "react-router";

// Routes
import { authRoutes } from "./routes/AuthRoutes";
import { protectedRoutes } from "./routes/ProtectedRoutes";
import { accountVerificationRoutes } from "./routes/RegistrationRoutes";

const routes: RouteObject[] = [
    // Account auth related URLs
    ...authRoutes,

    // Emailed account verification link: /verify-email?token=...
    ...accountVerificationRoutes,

    // Role based URLs: /cashier, /branch-manager, /hq-admin, /super-admin
    ...protectedRoutes,

    // TODO: Add Error Page handling here (preferrably refer to Richard)
    // {
    //     path: "*",
    //     element: <NotFoundPage />,
    // },
];

export default routes;
