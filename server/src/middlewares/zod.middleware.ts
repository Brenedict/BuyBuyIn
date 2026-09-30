import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateSchema =
    (location: "body" | "query", schema: z.ZodType) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[location]);

        if (!result.success) {
            return res.status(400).json({ error: z.prettifyError(result.error) });
        }

        req[location] = result.data;
        return next();
    };
