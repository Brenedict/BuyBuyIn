import request from "supertest";
import bcrypt from "bcryptjs";
import { beforeEach, expect, describe, it } from "@jest/globals";

import authRouter from "../../src/routes/auth.route";
import prisma from "../../src/config/prisma.config";
import { app } from "../../jest.integration";

import { mockUser } from "../fixtures/user.fixture";

describe("Auth routes", () => {
    app.use("/auth", authRouter);

    beforeEach(async () => {
        const hashedUser = { ...mockUser, password: await bcrypt.hash(mockUser.password, 10) };
        await prisma.$transaction([prisma.user.deleteMany(), prisma.user.create({ data: hashedUser })]);
    });

    describe("POST /auth/login", () => {
        it("returns access token & sets refresh cookie", async () => {
            const res = await request(app)
                .post("/auth/login")
                .send({ email: "johndoe@gmail.com", password: "password123" })
                .expect(200)
                .expect("Content-Type", /json/);

            expect(res.body).toHaveProperty("accessToken");
            expect(typeof res.body.accessToken).toBe("string");

            expect(res.headers["set-cookie"]?.[0]).toMatch(/^refreshToken=/);
            expect(res.headers["set-cookie"]?.[0]).toContain("HttpOnly");
        });

        it("returns status 401 on incorrect email", (done) => {
            request(app)
                .post("/auth/login")
                .send({ email: "janedoe@gmail.com", password: "password123" })
                .expect(401, done);
        });

        it("returns status 401 on incorrect password", (done) => {
            request(app)
                .post("/auth/login")
                .send({ email: "johndoe@gmail.com", password: "passworddddd" })
                .expect(401, done);
        });
    });

    describe("POST /auth/refresh", () => {
        it("returns new access token & refresh cookie", async () => {
            const loginRes = await request(app)
                .post("/auth/login")
                .send({ email: "johndoe@gmail.com", password: "password123" })
                .expect(200);

            const refreshCookie = loginRes.headers["set-cookie"]?.[0];
            expect(refreshCookie).toBeDefined();

            const res = await request(app)
                .post("/auth/refresh")
                .set("Cookie", refreshCookie as string)
                .expect(200)
                .expect("Content-Type", /json/);

            expect(res.body).toHaveProperty("accessToken");
            expect(res.headers["set-cookie"]?.[0]).toMatch(/^refreshToken=/);
            expect(res.headers["set-cookie"]?.[0]).toContain("HttpOnly");
        });

        it("returns status 401 when we dont have refresh cookie", (done) => {
            request(app).post("/auth/refresh").expect(401, done);
        });
    });

    describe("POST /auth/logout", () => {
        it("clears the refresh cookie", async () => {
            const loginRes = await request(app)
                .post("/auth/login")
                .send({ email: "johndoe@gmail.com", password: "password123" })
                .expect(200);

            const accessToken = loginRes.body.accessToken;
            const refreshCookie = loginRes.headers["set-cookie"]?.[0];

            const res = await request(app)
                .post("/auth/logout")
                .set("Authorization", `Bearer ${accessToken}`)
                .set("Cookie", refreshCookie as string)
                .expect(200)
                .expect("Content-Type", /json/);

            expect(res.body.message).toBe("Logged out successfully");
            expect(res.headers["set-cookie"]?.[0]).toMatch(/^refreshToken=;/);
        });
    });

    describe("GET /auth/protected", () => {
        it("accepts user when theres access token", async () => {
            const loginRes = await request(app)
                .post("/auth/login")
                .send({ email: "johndoe@gmail.com", password: "password123" })
                .expect(200);

            const accessToken = loginRes.body.accessToken;

            const res = await request(app)
                .get("/auth/protected")
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200)
                .expect("Content-Type", /json/);

            expect(res.body).toEqual({ message: "Authentication passed" });
        });

        it("returns status 401 when we dont have access token", (done) => {
            request(app).get("/auth/protected").expect(401, done);
        });
    });
});
