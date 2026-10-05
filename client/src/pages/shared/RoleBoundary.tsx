// General Imports
import { Navigate, Outlet, useLocation, useMatches, useRouteLoaderData } from "react-router";

// BuyBuyin Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";
import { hasAccessLevel, type AccessType } from "@buybuyin/shared/schema/access";

// API Services
import { type primaryAuthLoader } from "../../api/authService";

// Routes
import { forbiddenPath, ROUTES } from "../../routes/Routes";

export interface AccessRequirement {
    accessLevel: RoleType;
    accessType?: AccessType;
}

// Handle is gathered from ProtectedRoute's handle property. This function reads the handle and returns an AccessRequirement if it exists.
const readAccessRequirement = (handle: unknown): AccessRequirement | undefined => {
    if (!handle || typeof handle !== "object") return undefined;

    const { accessLevel, accessType } = handle as Partial<AccessRequirement>;

    return accessLevel ? { accessLevel, accessType } : undefined;
};

export function RoleBoundary() {
    const authState = useRouteLoaderData<typeof primaryAuthLoader>("protected");
    const matches = useMatches();
    const location = useLocation();

    // Deepest declaration wins, so a page overrides the group it sits in.
    const requirement = matches
        .map((match) => readAccessRequirement(match.handle))
        .findLast((entry) => entry !== undefined);

    // Group is unguarded, let it through.
    if (!requirement) return <Outlet />;

    const role = authState?.user?.role;

    // In case the role is undefined, the user is not logged in. Redirect to login.
    if (!role) return <Navigate to={ROUTES.AUTH} replace />;

    const isAllowed = hasAccessLevel(role, requirement.accessLevel, requirement.accessType ?? "exclusive");

    if (!isAllowed) return <Navigate to={forbiddenPath(location.pathname)} replace />;

    return <Outlet />;
}

export default RoleBoundary;
