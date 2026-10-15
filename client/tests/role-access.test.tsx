// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createMemoryRouter, matchRoutes, Outlet, RouterProvider, useLocation } from "react-router";
import { RoleType } from "@buybuyin/shared/prisma/enums";
import type { AuthState } from "../src/api/authService";
import { RoleBoundary, type AccessRequirement } from "../src/pages/shared/RoleBoundary";
import routes from "../src/routes";
import { forbiddenPath, ROUTES } from "../src/routes/Routes";

afterEach(() => cleanup());

const protectedPages = [
    ROUTES.BRANCH_MANAGER.dashboard,
    ROUTES.BRANCH_MANAGER.inventory,
    ROUTES.BRANCH_MANAGER.manageUsers,
    ROUTES.BRANCH_MANAGER.branchOffers,
    ROUTES.BRANCH_MANAGER.transactions,
    ROUTES.CASHIER.dashboard,
    ROUTES.CASHIER.transactions,
    ROUTES.CASHIER.pointOfSale,
    ROUTES.CASHIER.xRead,
    ROUTES.HQ_ADMIN.dashboard,
    ROUTES.HQ_ADMIN.inventory,
    ROUTES.HQ_ADMIN.manageUsers,
    ROUTES.HQ_ADMIN.subscriptions,
    ROUTES.HQ_ADMIN.branchOffers,
    ROUTES.SUPER_ADMIN.plans,
    ROUTES.SUPER_ADMIN.businesses,
    ROUTES.SUPER_ADMIN.subscriptions,
    ROUTES.SUPER_ADMIN.subscriberAccounts,
];

function getAccessRequirement(path: string): AccessRequirement {
    const requirement = matchRoutes(routes, path)
        ?.map((match) => match.route.handle as AccessRequirement | undefined)
        .findLast((handle) => handle?.accessLevel !== undefined);

    if (!requirement) throw new Error(`No role access requirement found for ${path}`);

    return requirement;
}

function ForbiddenDestination() {
    const location = useLocation();
    return (
        <output data-testid="forbidden-destination">
            {location.pathname}
            {location.search}
        </output>
    );
}

function renderProtectedPage(role: RoleType, accessRequirement: AccessRequirement) {
    const authState = {
        isAuthenticated: true,
        accessToken: null,
        user: { role },
    } as unknown as AuthState;

    const router = createMemoryRouter(
        [
            {
                id: "protected",
                path: "/",
                loader: () => authState,
                element: <Outlet />,
                children: [
                    { path: ROUTES.FORBIDDEN, element: <ForbiddenDestination /> },
                    {
                        element: <RoleBoundary />,
                        handle: accessRequirement,
                        children: [
                            { path: "test-destination", element: <output data-testid="protected-destination" /> },
                        ],
                    },
                ],
            },
        ],
        { initialEntries: ["/test-destination"] }
    );

    render(<RouterProvider router={router} />);
}

describe("role-based route access", () => {
    it.each(Object.values(RoleType).flatMap((role) => protectedPages.map((path) => [role, path] as const)))(
        "%s access to %s follows its route role requirement",
        async (role, path) => {
            const accessRequirement = getAccessRequirement(path);
            renderProtectedPage(role, accessRequirement);

            if (role === accessRequirement.accessLevel) {
                expect(await screen.findByTestId("protected-destination")).toBeTruthy();
            } else {
                const forbiddenDestination = await screen.findByTestId("forbidden-destination");
                expect(forbiddenDestination.textContent).toBe(forbiddenPath("/test-destination"));
            }
        }
    );
});
