// NOTE: Custom error class with status code and message
// Call niyo gamit throw new HttpError(403, "Example Message");
// For error.middleware.ts siya
export class HttpError extends Error {
    constructor(
        public readonly status: number,
        message: string
    ) {
        super(message);
        this.name = "HttpError";
    }
}
