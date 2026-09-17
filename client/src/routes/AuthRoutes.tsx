// General Imports
import { type RouteObject } from "react-router";

// Pages
import Login from "../pages/shared/Login";

// Predefined Routes
import { ROUTES } from "./Routes";

export const authRoutes: RouteObject[] = [
    {
        // Login Route: /auth
        path: ROUTES.AUTH,
        element: <Login />,
    },
];
