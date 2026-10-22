// General Imports
import type { Request, Response } from "express";

// BuyBuyin Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";
import type { User } from "@buybuyin/shared/prisma/browser";
import {
    ProductFormCreateSchema,
    ProductFormUpdateSchema,
    ProductQuerySchema,
    type ProductFormCreateType,
    type ProductFormUpdateType,
    type ProductQueryType,
} from "@buybuyin/shared/schema/product";

// Middlewares
import { jwtAccessAuth } from "../middlewares/passport.middleware";
import { requireAccessLevel } from "../middlewares/authorized.middleware";
import { validateSchema } from "../middlewares/zod.middleware";

// Services
import ProductService from "../service/product.service";

export default {
    getProducts: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        validateSchema("query", ProductQuerySchema),
        async (req: Request, res: Response) => {
            const query = req.query as unknown as ProductQueryType;
            const catalogue = await ProductService.getCatalogue(req.user as User, query);

            return res.json(catalogue);
        },
    ],

    getProductOptions: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        async (req: Request, res: Response) => {
            const options = await ProductService.getCatalogueOptions(req.user as User);

            return res.json(options);
        },
    ],

    getProduct: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        async (req: Request, res: Response) => {
            const product = await ProductService.getCatalogueProduct(req.user as User, Number(req.params.productId));

            return res.json(product);
        },
    ],

    createProduct: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.HQADMIN),
        validateSchema("body", ProductFormCreateSchema),
        async (req: Request, res: Response) => {
            const input = req.body as unknown as ProductFormCreateType;
            const product = await ProductService.createCatalogueProduct(req.user as User, input);

            return res.status(201).json({ product, message: "Product created" });
        },
    ],

    updateProduct: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.HQADMIN),
        validateSchema("body", ProductFormUpdateSchema),
        async (req: Request, res: Response) => {
            const input = req.body as unknown as ProductFormUpdateType;
            const product = await ProductService.updateCatalogueProduct(
                req.user as User,
                Number(req.params.productId),
                input
            );

            return res.json({ product, message: "Product updated" });
        },
    ],

    deleteProduct: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.HQADMIN),
        async (req: Request, res: Response) => {
            await ProductService.deleteCatalogueProduct(req.user as User, Number(req.params.productId));

            return res.json({ message: "Product deleted" });
        },
    ],
};
