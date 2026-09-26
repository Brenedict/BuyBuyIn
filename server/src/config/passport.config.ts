import type { Request } from "express";
import passport from "passport";
import passportJwt from "passport-jwt";
import { Strategy as LocalStrategy, type VerifyFunction } from "passport-local";

import env from "./env.config";
import UserModel from "../models/user.model";
import HashUtil from "../utils/hash.util";

const verifyLocal: VerifyFunction = async (email, password, done) => {
    try {
        const user = await UserModel.getByEmail(email);

        if (!user) return done(null, false, { message: "Invalid email or password" });

        const passwordMatches = await HashUtil.comparePassword(password, user.password);
        if (!passwordMatches) return done(null, false, { message: "Invalid email or password" });

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
};

passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, verifyLocal));

const verifyJwt: passportJwt.VerifyCallback = async (payload, done) => {
    try {
        const userId = Number(payload.sub);
        if (!Number.isInteger(userId)) return done(null, false);

        const user = await UserModel.getById(userId);
        if (!user) return done(null, false);

        return done(null, user);
    } catch (error) {
        return done(error);
    }
};

passport.use(
    "jwt-access",
    new passportJwt.Strategy(
        {
            jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.JWT_ACCESS_SECRET,
        },
        verifyJwt
    )
);

passport.use(
    "jwt-refresh",
    new passportJwt.Strategy(
        {
            jwtFromRequest: (req: Request) => req.cookies?.refreshToken ?? null,
            secretOrKey: env.JWT_REFRESH_SECRET,
        },
        verifyJwt
    )
);

export default passport;
