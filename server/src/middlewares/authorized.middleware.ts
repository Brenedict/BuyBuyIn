// General Imports
import type { Request, Response, NextFunction } from "express";

// BuyBuyin Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";
import { hasAccessLevel, type AccessType } from "@buybuyin/shared/schema/access";
import type { User } from "@buybuyin/shared/prisma/browser";
import UserModel from "../models/user.model";

export function requireAccessLevel(minAccessLevel: RoleType, accessType: AccessType = "exclusive") {
    return (req: Request, res: Response, next: NextFunction) => {
        const requestor = req.user as User | undefined;

        console.log(
            `Requestor: ${requestor?.fullName}, Role: ${requestor?.role}, Required Access Level: ${minAccessLevel}, Access Type: ${accessType}`
        );

        if (!requestor) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!hasAccessLevel(requestor.role, minAccessLevel, accessType)) {
            return res.status(403).json({ message: "Forbidden: Insufficient access level" });
        }

        next();
    };
}

export async function requireValidResetToken(req: Request, res: Response, next: NextFunction) {
    try {
        const rawToken = req.query.token;

        if (!rawToken || typeof rawToken !== "string") {
            return res.status(400).json({ message: "Invalid or missing reset link." });
        }

        const requestor = (await UserModel.getByResetToken(rawToken)) as User | null;

        if (!requestor) {
            return res.status(401).json({ message: "Invalid link." });
        }

        const currentTimestampTz = new Date();

        if (requestor.resetTokenExpiresAt && currentTimestampTz >= requestor.resetTokenExpiresAt) {
            // Clears Reset Token to prevent stale data
            const clearedUser = {
                resetToken: null,
                resetTokenExpiresAt: null,
            } as User;

            await UserModel.updateUser(requestor.id, clearedUser);

            return res.status(401).json({ message: "Expired link." });
        }

        req.user = requestor;

        return next();
    } catch (error) {
        console.error("Error verifying reset token:", error);
        return res.status(500).json({ message: "Internal server error during token validation." });
    }
}
