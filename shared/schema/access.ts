// BuyBuyin Shared Imports
import { RoleType } from "../prisma/enums";

/**
 * Numeric rank of each role. Higher outranks lower.
 * Kept here for both frontend and backend usage
 */
export const ROLE_HIERARCHY: Record<RoleType, number> = {
    [RoleType.SUPERADMIN]: 3,
    [RoleType.HQADMIN]: 2,
    [RoleType.BRANCHMANAGER]: 1,
    [RoleType.CASHIER]: 0,
};

/**
 * Exclusive access means the user must have exactly the specified role.
 * Minimum access means the user must have at least the specified role or higher.
 */
export type AccessType = "exclusive" | "minimum";

/**
 * Checks a role against a required access level.
 * Takes a RoleType rather than a User so it stays safe to import in the browser.
 */
export const hasAccessLevel = (
    role: RoleType,
    requiredRole: RoleType,
    accessType: AccessType = "exclusive"
): boolean => {
    if (accessType === "exclusive") {
        return role === requiredRole;
    }

    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole];
};
