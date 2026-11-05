// General Imports
import type { Request, Response } from "express";

// BuyBuyin Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";
import type { User } from "@buybuyin/shared/prisma/browser";
import {
    SupplierFormCreateSchema,
    SupplierFormUpdateSchema,
    SupplierQuerySchema,
    type SupplierFormCreateType,
    type SupplierFormUpdateType,
    type SupplierQueryType,
} from "@buybuyin/shared/schema/supplier";

// Middlewares
import { jwtAccessAuth } from "../middlewares/passport.middleware";
import { requireAccessLevel } from "../middlewares/authorized.middleware";
import { validateSchema } from "../middlewares/zod.middleware";

// Services
import SupplierService from "../service/supplier.service";

export default {
    getSuppliers: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.HQADMIN),
        validateSchema("query", SupplierQuerySchema),
        async (req: Request, res: Response) => {
            const query = req.query as unknown as SupplierQueryType;
            const suppliers = await SupplierService.getSuppliers(req.user as User, query);

            return res.json(suppliers);
        },
    ],

    getSupplier: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.HQADMIN),
        async (req: Request, res: Response) => {
            const { supplierId } = req.params;

            if (isNaN(Number(supplierId))) return res.status(404).json({ error: "Supplier not found" });

            const supplier = await SupplierService.getSupplier(req.user as User, Number(supplierId));

            return res.json(supplier);
        },
    ],

    createSupplier: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.HQADMIN),
        validateSchema("body", SupplierFormCreateSchema),
        async (req: Request, res: Response) => {
            const input = req.body as unknown as SupplierFormCreateType;
            const supplier = await SupplierService.createSupplier(req.user as User, input);

            return res.status(201).json({ supplier, message: "Supplier created" });
        },
    ],

    updateSupplier: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.HQADMIN),
        validateSchema("body", SupplierFormUpdateSchema),
        async (req: Request, res: Response) => {
            const input = req.body as unknown as SupplierFormUpdateType;
            const supplier = await SupplierService.updateSupplier(
                req.user as User,
                Number(req.params.supplierId),
                input
            );

            return res.json({ supplier, message: "Supplier updated" });
        },
    ],

    deleteSupplier: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.HQADMIN),
        async (req: Request, res: Response) => {
            await SupplierService.deleteSupplier(req.user as User, Number(req.params.supplierId));

            return res.json({ message: "Supplier deleted" });
        },
    ],
};
