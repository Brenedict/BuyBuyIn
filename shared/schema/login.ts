import { z } from "zod";
import { zfd } from "zod-form-data";

export const LoginSchema = zfd.formData({
    email: z.email().trim().min(1, "Email cannot be empty"),
    password: z.string().trim().min(1, "Password cannot be empty"),
});
