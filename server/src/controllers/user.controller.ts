// General Imports
import type { Request, Response } from "express";

// BUYBUYIN Shared Imports
import type { User } from "@buybuyin/shared/prisma/browser";
import { type UserGlobalContextSchemaType } from "@buybuyin/shared/schema/user";
// Middlewares
import { jwtAccessAuth } from "../middlewares/passport.middleware";

// Services
import BranchService from "../service/branch.service";
import BusinessService from "../service/business.service";

export default {
    getCurrentUser: [
        jwtAccessAuth,
        // TODO: requireAccessLevel(AccessLevel.FRONTLINE),
        async (req: Request, res: Response) => {
            const user = req.user as User;

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            let businessName: string | null = "unknown",
                branchLocation: string | null = "unknown";

            if (user.businessId) {
                businessName = await BusinessService.getBusinessNameById(user.businessId);
            }

            if (user.branchId) {
                branchLocation = await BranchService.getBranchLocationById(user.branchId);
            }

            const userContextPayload: UserGlobalContextSchemaType = {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                businessName: businessName as string,
                branchName: branchLocation as string,
            };

            return res.json(userContextPayload);
        },
    ],
};
