// General Imports
import type { Request, Response } from "express";

// BUYBUYIN Shared Imports
import type { User } from "@buybuyin/shared/prisma/browser";
import { type UserGlobalContextSchemaType } from "@buybuyin/shared/schema/user";
// Middlewares
import { jwtAccessAuth } from "../middlewares/passport.middleware";

export default {
    getCurrentUser: [
        jwtAccessAuth,
        // TODO: requireAccessLevel(AccessLevel.FRONTLINE),
        async (req: Request, res: Response) => {
            const user = req.user as User;

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const userContextPayload: UserGlobalContextSchemaType = {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            };

            return res.json(userContextPayload);
        },
    ],
};
