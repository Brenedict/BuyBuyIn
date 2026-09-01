// General Imports
import { IncomingMessage, ServerResponse, type Server } from "http";
import prisma from "../config/prisma.config";

// Disconnect prisma on server shutdown
function handleShutdown(server: Server<typeof IncomingMessage, typeof ServerResponse>, signal: string) {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

    // Stop accepting new connections
    server.close(async () => {
        console.log("HTTP server closed.");

        console.log("Cleaning up database pools...");
        await prisma.$disconnect();
        console.log("Cleanup complete. Exiting process.");

        process.exit(0);
    });

    // Forced exit fallback if cleanup hangs longer than 10 seconds
    setTimeout(() => {
        console.error("Forced shutdown due to timeout.");
        process.exit(1);
    }, 10000);
}

export default handleShutdown;
