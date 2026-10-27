// General Imports
import type { Request, Response } from "express";

// BuyBuyin Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";
import type { User } from "@buybuyin/shared/prisma/browser";
import {
    BranchInventoryFormCreateSchema,
    BranchInventoryFormRestockSchema,
    BranchInventoryQuerySchema,
    type BranchInventoryFormCreateType,
    type BranchInventoryFormRestockType,
    type BranchInventoryQueryType,
} from "@buybuyin/shared/schema/branchInventory";

// Middlewares
import { jwtAccessAuth } from "../middlewares/passport.middleware";
import { requireAccessLevel } from "../middlewares/authorized.middleware";
import { validateSchema } from "../middlewares/zod.middleware";

// Services
import BranchInventoryService from "../service/branchInventory.service";

export default {
    getItems: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER),
        validateSchema("query", BranchInventoryQuerySchema),
        async (req: Request, res: Response) => {
            const query = req.query as unknown as BranchInventoryQueryType;
            const inventory = await BranchInventoryService.getBranchInventory(req.user as User, query);

            return res.json(inventory);
        },
    ],

    getItemOptions: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER),
        async (req: Request, res: Response) => {
            const options = await BranchInventoryService.getBranchInventoryOptions(req.user as User);

            return res.json(options);
        },
    ],

    getItem: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER),
        async (req: Request, res: Response) => {
            const itemId = BranchInventoryService.parseItemId(req, res);
            if (itemId === null) return;

            const item = await BranchInventoryService.getBranchInventoryItem(req.user as User, itemId);

            return res.json(item);
        },
    ],

    createItem: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER),
        validateSchema("body", BranchInventoryFormCreateSchema),
        async (req: Request, res: Response) => {
            const input = req.body as unknown as BranchInventoryFormCreateType;
            const item = await BranchInventoryService.createBranchInventoryItem(req.user as User, input);

            return res.status(201).json({ item, message: "Item added to inventory" });
        },
    ],

    restockItem: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER),
        validateSchema("body", BranchInventoryFormRestockSchema),
        async (req: Request, res: Response) => {
            const itemId = BranchInventoryService.parseItemId(req, res);
            if (itemId === null) return;

            const input = req.body as unknown as BranchInventoryFormRestockType;
            const item = await BranchInventoryService.restockBranchInventoryItem(req.user as User, itemId, input);

            return res.json({ item, message: "Item restocked" });
        },
    ],

    deleteItem: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER),
        async (req: Request, res: Response) => {
            const itemId = BranchInventoryService.parseItemId(req, res);
            if (itemId === null) return;

            await BranchInventoryService.deleteBranchInventoryItem(req.user as User, itemId);

            return res.json({ message: "Item removed from inventory" });
        },
    ],
};
