// General Imports
import type { Request, Response } from "express";

// BuyBuyin Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";
import type { User } from "@buybuyin/shared/prisma/browser";
import {
    BranchWideOfferFormSchema,
    BranchWideOfferQuerySchema,
    type BranchWideOfferFormType,
    type BranchWideOfferQueryType,
} from "@buybuyin/shared/schema/branchWideOffer";

// Middlewares
import { jwtAccessAuth } from "../middlewares/passport.middleware";
import { requireAccessLevel } from "../middlewares/authorized.middleware";
import { validateSchema } from "../middlewares/zod.middleware";

// Services
import BranchWideOfferService from "../service/branchWideOffer.service";

export default {
    getOffers: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        validateSchema("query", BranchWideOfferQuerySchema),
        async (req: Request, res: Response) => {
            const query = req.query as unknown as BranchWideOfferQueryType;
            const offers = await BranchWideOfferService.getOffers(req.user as User, query);

            return res.json(offers);
        },
    ],

    getOptions: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        async (req: Request, res: Response) => {
            const options = await BranchWideOfferService.getOptions(req.user as User);

            return res.json(options);
        },
    ],

    getOffer: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        async (req: Request, res: Response) => {
            const offerId = BranchWideOfferService.parseOfferId(req, res);
            if (offerId === null) return;

            const offer = await BranchWideOfferService.getOffer(req.user as User, offerId);

            return res.json(offer);
        },
    ],

    createOffer: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        validateSchema("body", BranchWideOfferFormSchema),
        async (req: Request, res: Response) => {
            const input = req.body as unknown as BranchWideOfferFormType;
            const offer = await BranchWideOfferService.createOffer(req.user as User, input);

            return res.status(201).json({ offer, message: "Offer created" });
        },
    ],

    updateOffer: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        validateSchema("body", BranchWideOfferFormSchema),
        async (req: Request, res: Response) => {
            const offerId = BranchWideOfferService.parseOfferId(req, res);
            if (offerId === null) return;

            const input = req.body as unknown as BranchWideOfferFormType;
            const offer = await BranchWideOfferService.updateOffer(req.user as User, offerId, input);

            return res.json({ offer, message: "Offer updated" });
        },
    ],

    deleteOffer: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        async (req: Request, res: Response) => {
            const offerId = BranchWideOfferService.parseOfferId(req, res);
            if (offerId === null) return;

            const result = await BranchWideOfferService.deleteOffer(req.user as User, offerId);

            return res.json(result);
        },
    ],
};
