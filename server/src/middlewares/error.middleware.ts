// General Imports
import type { ErrorRequestHandler, Request, Response, NextFunction } from "express";

// Utils
import { HttpError } from "../utils/error.util";

export default {
    notFoundError(_req: Request, res: Response) {
        res.status(404).json({ message: "404 Endpoint Not Found" });
    },
    internalError: function (error: Error, _req: Request, res: Response, _next: NextFunction) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error(error.toString());
        res.status(500).json({ error: error.toString(), message: "500 Internal Server Error" });
    } as ErrorRequestHandler,
};
