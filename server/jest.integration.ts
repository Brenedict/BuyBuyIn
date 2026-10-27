import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { beforeAll, afterAll, jest } from "@jest/globals";

import type { User } from "@buybuyin/shared/prisma/client";

import prisma from "./src/config/prisma.config";
import "./src/config/passport.config";
import errorMiddleware from "./src/middlewares/error.middleware";

let mockCurrentAuthUser: User | null = null;

export function setCurrentAuthUser(user: User | null) {
    mockCurrentAuthUser = user;
}

jest.mock("./src/middlewares/passport.middleware", () => {
    const attachUser = (req: Request, res: Response, next: NextFunction) => {
        if (!mockCurrentAuthUser) {
            return res.status(401).json({ error: "User is unauthorized" });
        }

        (req as Request & { user?: User | null }).user = mockCurrentAuthUser;
        return next();
    };

    return { localAuth: attachUser, jwtAccessAuth: attachUser, jwtRefreshAuth: attachUser };
});

export const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Make req.query mutable like body
app.use((req, _res, next) => {
    Object.defineProperty(req, "query", {
        ...Object.getOwnPropertyDescriptor(req, "query"),
        value: req.query,
        writable: true,
    });
    next();
});

beforeAll(() => {
    app.use(errorMiddleware.notFoundError);
    app.use(errorMiddleware.internalError);
});

afterAll(async () => {
    await prisma.$disconnect();
});
