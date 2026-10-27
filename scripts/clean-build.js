import readline from "node:readline";
import fs from "node:fs";
import crypto from "node:crypto";
import { execSync } from "node:child_process";

const INSTALL_STAMP = "node_modules/.clean-build-install-stamp";

function getLockHash() {
    return crypto.createHash("sha256").update(fs.readFileSync("package-lock.json")).digest("hex");
}

function needsInstall() {
    if (!fs.existsSync("node_modules") || !fs.existsSync("package-lock.json")) return true;
    if (!fs.existsSync(INSTALL_STAMP)) return true;
    return fs.readFileSync(INSTALL_STAMP, "utf8").trim() !== getLockHash();
}

// ANSI Color helper codes
const c = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
};

// Clear the terminal screen
console.clear();

console.log(`${c.bright}${c.cyan} CLEAN BUILD-INSTALL TASKS:${c.reset}`);
console.log(`  ${c.yellow}• Installing dependencies:${c.reset} Runs \`npm install\` if needed, skips if up to date.`);
console.log(`  ${c.yellow}• Reset & Clear Database:${c.reset} Runs \`npm run res:prisma\` (Clears database data).`);
console.log(`  ${c.yellow}• Generate Prisma Prereqs:${c.reset} Runs \`npm run gen:prisma\` (Generates Prisma types).`);
console.log(`  ${c.yellow}• Seed Database:${c.reset} Runs \`npm run seed:prisma\` (Populates dummy data).\n`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question(`  ${c.bright}Are you sure you want to proceed? (y/N) ${c.reset} ${c.blue}> `, (answer) => {
    rl.close();

    if (!/^([yY])$/.test(answer)) {
        console.log(`   ${c.red}\nAborted.${c.reset}`);
        process.exit(0);
    }

    const results = {};

    // Clear the terminal screen
    console.clear();

    if (needsInstall()) {
        console.log(
            `${c.blue}[Installing dependencies]${c.reset} Dependencies changed or missing. Running npm install...`
        );
        execSync("npm install", { stdio: "inherit" });
        fs.writeFileSync(INSTALL_STAMP, getLockHash());
        results.install = "DONE";
    } else {
        console.log(`${c.green}[Installing dependencies]${c.reset} Dependencies up to date. Skipping npm install.`);
        results.install = "SKIPPED";
    }

    // Clear the terminal screen
    console.clear();

    console.log(`${c.blue}[Reset & Clear Database]${c.reset} Running prisma reset...`);
    execSync("npm run res:prisma -w server/ -- --force", { stdio: "inherit" });
    results.reset = "DONE";

    // Clear the terminal screen
    console.clear();

    console.log(`${c.blue}[Generate Prisma Prereqs]${c.reset} Running prisma generate...`);
    execSync("npm run gen:prisma", { stdio: "inherit" });
    results.generate = "DONE";

    // Clear the terminal screen
    console.clear();

    console.log(`${c.blue}[Seed Database]${c.reset} Running prisma seed...`);
    execSync("npm run seed:prisma", { stdio: "inherit" });
    results.seed = "DONE";

    // Clear the terminal screen
    console.clear();

    const checklist = [
        ["Installing dependencies", results.install, "Runs `npm install` if needed, skips if up to date."],
        ["Reset & Clear Database", results.reset, "Runs `npm run res:prisma` (Clears database data)."],
        ["Generate Prisma Prereqs", results.generate, "Runs `npm run gen:prisma` (Generates Prisma types)."],
        ["Seed Database", results.seed, "Runs `npm run seed:prisma` (Populates dummy data)."],
    ];

    console.log(`${c.bright}${c.cyan} CLEAN BUILD-INSTALL CHECKLIST:${c.reset}`);
    for (const [label, status, description] of checklist) {
        const color = status === "SKIPPED" ? c.yellow : c.green;
        console.log(`  ${color}${`[${status}]`.padEnd(10)}${c.reset} ${label}: ${description}`);
    }

    console.log(`\n${c.green}${c.bright}✔ Clean build-install tasks completed successfully!${c.reset}`);
});
