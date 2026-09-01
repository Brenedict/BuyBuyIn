// General Imports
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import env from "./config/env.config";

// Routes
import authRoutes from "./routes/auth.route";

// Middlewares
import handleShutdown from "./middlewares/shutdown.middleware";
import errorMiddleware from "./middlewares/error.middleware";

// Initializers
const app = express();
const port = env.PORT;

const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// ----------------- SERVER MIDDLEWARES ------------------------------

// Form and Json submission request config

// Make req.query mutable like body
app.use((req, _res, next) => {
    Object.defineProperty(req, "query", {
        ...Object.getOwnPropertyDescriptor(req, "query"),
        value: req.query,
        writable: true,
    });
    next();
});

// Parse HTML Form to Object
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes and origins
app.use(
    cors({
        origin: env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Automatically parses body string to a json
app.use(express.json());

// Middleware logger
app.use(morgan("combined"));

// Middleware for cookies
app.use(cookieParser());

// --------------------- SERVER ROUTES --------------------------------

app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware.notFoundError);
app.use(errorMiddleware.internalError);

// --------------------- SERVER EXIT ----------------------------------

process.on("SIGINT", () => handleShutdown(server, "SIGINT"));
process.on("SIGTERM", () => handleShutdown(server, "SIGTERM"));
