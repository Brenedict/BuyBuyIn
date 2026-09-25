import type { NextFunction, Request, Response } from "express";
import type { User } from "@buybuyin/shared/prisma/client";
import passport from "../config/passport.config";

type PassportError = Error | null;
type PassportUser = User | false;
type PassportInfo = { message: string } | undefined;

export const localAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", { session: false }, (error: PassportError, user: PassportUser, info: PassportInfo) => {
        if (error) return res.status(500).json({ error: "Internal server error" });
        if (!user) return res.status(401).json({ message: info?.message ?? "Invalid email or password" });

        req.user = user;
        return next();
    })(req, res, next);
};

const jwtAuth = (type: "access" | "refresh") => (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(`jwt-${type}`, { session: false }, (error: PassportError, user: PassportUser) => {
        if (error) return res.status(500).json({ error: "Internal server error" });
        if (!user) return res.status(401).json({ error: "User is unauthorized" });

        req.user = user;
        return next();
    })(req, res, next);
};

export const jwtAccessAuth = jwtAuth("access");
export const jwtRefreshAuth = jwtAuth("refresh");
