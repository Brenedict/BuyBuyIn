// General Imports
import type { Request, Response } from "express";

// BuyBuyin Shared Imports
import { RoleType, type User } from "@buybuyin/shared/prisma/client";
import {
    BusinessEntityRegistrationSchema,
    type BusinessEntityRegistrationSchemaType,
    AccountRegistrationSchema,
    type AccountRegistrationSchemaType,
    BranchEntityRegistrationSchema,
    type BranchEntityRegistrationSchemaType,
} from "@buybuyin/shared/schema/registration";

// Middlewares
import { requireAccessLevel } from "../middlewares/authorized.middleware";
import { validateSchema } from "../middlewares/zod.middleware";
import { jwtAccessAuth } from "../middlewares/passport.middleware";

// Services
import RegistrationService from "../service/registration.service";
import EmailService from "../service/email.service";

// Util
import HashUtil from "../utils/hash.util";

export default {
    businessEntityPost: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        validateSchema("body", BusinessEntityRegistrationSchema),
        async (req: Request, res: Response) => {
            // Payload from the request
            const businessDataPayload: BusinessEntityRegistrationSchemaType = req.body;

            // Result of the service response
            const result = await RegistrationService.createNewBusinessEntity(businessDataPayload);

            return res.status(201).end();
        },
    ],

    branchEntityPost: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        validateSchema("body", BranchEntityRegistrationSchema),
        async (req: Request, res: Response) => {
            // Payload from the request
            const branchDataPayload: BranchEntityRegistrationSchemaType = req.body;

            // Result of the service response
            const result = await RegistrationService.createNewBranchEntity(branchDataPayload);

            return res.status(201).end();
        },
    ],

    // HQ ADMIN account creation route
    subscriberAccountPost: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        validateSchema("body", AccountRegistrationSchema),
        async (req: Request, res: Response) => {
            // Payload from the request
            const accountDataPayload: AccountRegistrationSchemaType = req.body;

            const isRegistered = await RegistrationService.emailAlreadyRegistered(accountDataPayload.email);

            if (isRegistered) {
                return res.status(400).json({ message: "Email already registered" });
            }

            // Result of the service response
            const user = await RegistrationService.createNewAccount(accountDataPayload, RoleType.HQADMIN);

            if (!!user) {
                // Generates hashed token for reset password URL query (e.g. /reset-password?token=209NF903H)
                const hashedToken = HashUtil.generateRandomHashedToken();

                const emailSent = await EmailService.sendRegistrationConfirmationEmal(
                    RoleType.HQADMIN,
                    hashedToken,
                    user.fullName as string,
                    user.email
                );

                if (emailSent) {
                    const result = await RegistrationService.registerResetToken(
                        user.id,
                        hashedToken,
                        process.env.SMTP_EXPIRATION_OFFSET || "5m"
                    );
                }

                return res.status(201).end();
            }

            return res.status(400).end();
        },
    ],

    // Branch Manager account creation route
    managerAccountPost: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "exclusive"),
        validateSchema("body", AccountRegistrationSchema),
        async (req: Request, res: Response) => {
            // Payload from the request
            const accountDataPayload: AccountRegistrationSchemaType = req.body;

            const isRegistered = await RegistrationService.emailAlreadyRegistered(accountDataPayload.email);

            if (isRegistered) {
                return res.status(400).json({ message: "Email already registered" });
            }

            // Result of the service response
            const user = await RegistrationService.createNewAccount(accountDataPayload, RoleType.BRANCHMANAGER);

            if (!!user) {
                // Generates hashed token for reset password URL query (e.g. /reset-password?token=209NF903H)
                const hashedToken = HashUtil.generateRandomHashedToken();

                const emailSent = await EmailService.sendRegistrationConfirmationEmal(
                    RoleType.BRANCHMANAGER,
                    hashedToken,
                    user.fullName as string,
                    user.email
                );

                if (emailSent) {
                    const result = await RegistrationService.registerResetToken(
                        user.id,
                        hashedToken,
                        process.env.SMTP_EXPIRATION_OFFSET || "5m"
                    );
                }

                return res.status(201).end();
            }

            return res.status(400).end();
        },
    ],

    // Cashier account creation route
    cashierAccountPost: [
        jwtAccessAuth,
        requireAccessLevel("BRANCHMANAGER", "exclusive"),
        validateSchema("body", AccountRegistrationSchema),
        async (req: Request, res: Response) => {
            // Payload from the request
            const accountDataPayload: AccountRegistrationSchemaType = req.body;

            const isRegistered = await RegistrationService.emailAlreadyRegistered(accountDataPayload.email);

            if (isRegistered) {
                return res.status(400).json({ message: "Email already registered" });
            }

            // Result of the service response
            const user = await RegistrationService.createNewAccount(accountDataPayload, RoleType.CASHIER);

            if (!!user) {
                // Generates hashed token for reset password URL query (e.g. /reset-password?token=209NF903H)
                const hashedToken = HashUtil.generateRandomHashedToken();

                const emailSent = await EmailService.sendRegistrationConfirmationEmal(
                    RoleType.CASHIER,
                    hashedToken,
                    user.fullName as string,
                    user.email
                );

                if (emailSent) {
                    const result = await RegistrationService.registerResetToken(
                        user.id,
                        hashedToken,
                        process.env.SMTP_EXPIRATION_OFFSET || "5m"
                    );
                }

                return res.status(201).end();
            }

            return res.status(400).end();
        },
    ],
};
