export default {
    NODE_ENV: process.env.NODE_ENV || "development",
    PAYMENT_API_URL: process.env.PAYMENT_API_URL || `http://localhost:${process.env.PORT || 3000}`,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    PORT: process.env.PORT || 3000,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "access",
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
};
