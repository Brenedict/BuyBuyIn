import express from "express";
import cookieParser from "cookie-parser";
import prisma from "./src/config/prisma.config";

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

afterAll(async () => {
    await prisma.$disconnect();
});
