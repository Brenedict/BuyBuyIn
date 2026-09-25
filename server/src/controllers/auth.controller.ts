// General Imports
import type { Request, Response } from "express";

import type { User } from "@buybuyin/shared/prisma/browser";
import { LoginSchema } from "@buybuyin/shared/schema/login";
import { jwtAccessAuth, jwtRefreshAuth, localAuth } from "../middlewares/passport.middleware";
import { validateSchema } from "../middlewares/zod.middleware";
import AuthService from "../service/auth.service";

export default {
    loginPost: [
        validateSchema("body", LoginSchema),
        localAuth,
        async (req: Request, res: Response) => {
            const user = req.user as User;
            const { accessToken, refreshToken } = AuthService.generateTokens(user);
            AuthService.sendRefreshCookie(res, refreshToken);

            res.json({ message: "Login successful", accessToken });
        },
    ],

    refreshPost: [
        jwtRefreshAuth,
        async (req: Request, res: Response) => {
            const user = req.user as User;
            const { accessToken, refreshToken } = AuthService.generateTokens(user);
            AuthService.sendRefreshCookie(res, refreshToken);
            res.json({ message: "Refresh successful", accessToken });
        },
    ],

    logoutPost: [
        jwtAccessAuth,
        async (_req: Request, res: Response) => {
            AuthService.clearRefreshCookie(res);
            return res.json({ message: "Logged out successfully" });
        },
    ],

    protectedGet: [
        jwtAccessAuth,
        (_req: Request, res: Response) => {
            return res.json({ message: "Authentication passed" });
        },
    ],
};
