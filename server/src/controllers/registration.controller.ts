// General Imports
import type { Request, Response } from "express";

// BuyBuyin Shared Imports
import { RoleType, type User } from "@buybuyin/shared/prisma/client";
import {
    BusinessEntityRegistrationSchema,
    type BusinessEntityRegistrationSchemaType,
    AccountRegistrationSchema,
    type AccountRegistrationSchemaType,
} from "@buybuyin/shared/schema/registration";

// Middlewares
import { requireAccessLevel } from "../middlewares/authorized.middleware";
import { validateSchema } from "../middlewares/zod.middleware";
import { jwtAccessAuth } from "../middlewares/passport.middleware";

// Services
import RegistrationService from "../service/registration.service";

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

    subscriberAccountPost: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        validateSchema("body", AccountRegistrationSchema),
        async (req: Request, res: Response) => {
            // Payload from the request
            const accountDataPayload: AccountRegistrationSchemaType = req.body;

            // Result of the service response
            const result = await RegistrationService.createNewAccount(accountDataPayload, RoleType.HQADMIN);

            return res.status(201).end();
        },
    ],

    // branchEntityPost: [
    //     validateSchema("body", LoginSchema),
    //     async (req: Request, res: Response) => {
    //         const user = req.user as User;
    //     },
    // ],

    // managerAccountPost: [
    //     validateSchema("body", LoginSchema),
    //     async (req: Request, res: Response) => {
    //         const user = req.user as User;
    //     },
    // ],

    // cashierAccountPost: [
    //     validateSchema("body", LoginSchema),
    //     async (req: Request, res: Response) => {
    //         const user = req.user as User;
    //     },
    // ],
};
