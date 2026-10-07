// General Imports
import type { Request, Response, NextFunction } from "express";

// BuyBuyin Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";
import { hasAccessLevel, type AccessType } from "@buybuyin/shared/schema/access";
import type { User } from "@buybuyin/shared/prisma/browser";

export function requireAccessLevel(minAccessLevel: RoleType, accessType: AccessType = "exclusive") {
    return (req: Request, res: Response, next: NextFunction) => {
        const requestor = req.user as User | undefined;

        if (!requestor) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!hasAccessLevel(requestor.role, minAccessLevel, accessType)) {
            return res.status(403).json({ message: "Forbidden: Insufficient access level" });
        }

        next();
    };
}
