import express from "express";
import cookieParser from "cookie-parser";
import { beforeAll, afterAll } from "@jest/globals";

import prisma from "./src/config/prisma.config";
import "./src/config/passport.config";
import errorMiddleware from "./src/middlewares/error.middleware";

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
