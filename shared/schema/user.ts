// General Imports
import { zfd } from "zod-form-data";
import { UserUncheckedCreateInputObjectZodSchema } from "../zod/schemas";
import z from "zod";
import { RoleType } from "../prisma/enums";

export const UserGlobalContextSchema = zfd.formData(
    z.object({
        id: z.number().int().positive(),
        email: z.string().email(),
        firstName: z.string().min(2).max(256),
        lastName: z.string().min(2).max(256),
        role: z.enum(RoleType).default(RoleType.CASHIER),
        businessName: z.string().min(2).max(256).optional(),
        branchName: z.string().min(2).max(256).optional(),
    })
);

export type UserGlobalContextSchemaType = z.infer<typeof UserGlobalContextSchema>;
