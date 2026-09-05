// General Imports
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type RouteObject } from "react-router";

// Static Layout Page
import StaticLayout from "../pages/shared/StaticLayout";

// Static Access Checker before entering any page
import { AccessValidator } from "../pages/shared/AccessValidator";

// Pages
import { BranchWideOffers } from "../pages/branch-manager/BranchWideOffers";
import { Page2 } from "../pages/branch-manager/Page2";

export const protectedRoutes: RouteObject[] = [
    {
        id: "protected",
        path: "/",
        element: <AccessValidator />,
        children: [
            {
                path: "",
                element: <StaticLayout />,
                children: [
                    {
                        path: "/branch-wide-offers",
                        element: <BranchWideOffers />,
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
