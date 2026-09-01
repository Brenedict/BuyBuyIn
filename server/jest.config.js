/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    clearMocks: true,
    testEnvironment: "node",
    projects: [
        {
            displayName: "unit",
            testMatch: ["<rootDir>/tests/unit/**/*.test.ts"],
            setupFiles: ["dotenv/config"],
            setupFilesAfterEnv: ["<rootDir>/jest.unit.ts"], // Mocked na prisma pag unit
        },

        {
            displayName: "integration",
            testTimeout: 30000,
            testMatch: ["<rootDir>/tests/integration/**/*.test.ts"],
            setupFiles: ["dotenv/config"],
            setupFilesAfterEnv: ["<rootDir>/jest.integration.ts"], // Real passport & prisma pag integration
            moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node", "mjs"],
            transform: {
                "^.+\\.(t|j)sx?$": "babel-jest",
                "^.+\\.mjs$": "babel-jest",
            },
            transformIgnorePatterns: ["node_modules/(?!(@prisma/client|\\.prisma)/)"],
        },
    ],
};

export default config;
