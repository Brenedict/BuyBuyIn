// General Imports
import { z } from "zod";

export const queryNumber = (schema: z.ZodNumber) =>
    z.preprocess(
        (value) => (value === "" || value === null || value === undefined ? undefined : value),
        z.coerce.number().pipe(schema).optional()
    );

export const queryNumberWithFallback = (schema: z.ZodNumber, fallback: number) =>
    z.preprocess(
        (value) => (value === "" || value === null || value === undefined ? fallback : value),
        z.coerce.number().pipe(schema)
    );
