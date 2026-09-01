// General Imports
import type { Request, Response } from "express";

export default {
    loginPost: [
        async (_req: Request, res: Response) => {
            res.json({ message: "Login successful" });
        },
    ],

    logoutPost: [
        async (_req: Request, res: Response) => {
            return res.json({ message: "Logged out successfully" });
        },
    ],

    protectedGet: [
        (_req: Request, res: Response) => {
            return res.json({ message: "Authentication passed" });
        },
    ],
};
