// General Imports
import { zfd } from "zod-form-data";
import { UserUncheckedCreateInputObjectZodSchema } from "../zod/schemas";
import z from "zod";

export const UserGlobalContextSchema = zfd.formData(
    UserUncheckedCreateInputObjectZodSchema.omit({
        password: true,
    })
);

export type UserGlobalContextSchemaType = z.infer<typeof UserGlobalContextSchema>;
