import type { Response } from "express";
import jwt from "jsonwebtoken";
import ms from "ms";

import type { User } from "@buybuyin/shared/prisma/client";

import env from "../config/env.config";

export default {
    generateTokens(user: User) {
        const payload = { sub: user.id.toString(), email: user.email };
        const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
            expiresIn: env.JWT_REFRESH_EXPIRES_IN,
        } as jwt.SignOptions);
        const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
            expiresIn: env.JWT_ACCESS_EXPIRES_IN,
        } as jwt.SignOptions);

        return { accessToken, refreshToken };
    },

    sendRefreshCookie(res: Response, refreshToken: string) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: ms(env.JWT_REFRESH_EXPIRES_IN as ms.StringValue),
        });
    },

    clearRefreshCookie(res: Response) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
        });
    },
};
