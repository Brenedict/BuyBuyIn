// General Imports
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type RouteObject } from "react-router";

// Static Layout Page
import DashboardLayout from "../pages/DashboardLayout";

// Pages
import { AccessValidator } from "../pages/AccessValidator";
import { Page1 } from "../pages/Page1";
import { Page2 } from "../pages/Page2";

export const protectedRoutes: RouteObject[] = [
    {
        id: "protected",
        path: "/",
        element: <AccessValidator />,
        children: [
            {
                path: "",
                element: <DashboardLayout />,
                children: [
                    {
                        path: "/page1",
                        element: <Page1 />,
                    },
                    {
                        path: "/page2",
                        element: <Page2 />,
                    },
                ],
            },
        ],
    },
];
