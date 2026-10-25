import bcrypt from "bcryptjs";
import crypto from "crypto";
import { randomInt } from "node:crypto";

const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*";
const ALL_CHARS = LOWERCASE_CHARS + UPPERCASE_CHARS + NUMBER_CHARS + SYMBOL_CHARS;

const randomChar = (chars: string) => chars[randomInt(chars.length)];

export default {
    async comparePassword(plainText: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainText, hash);
    },

    async hashPassword(plainText: string): Promise<string> {
        const saltRounds = parseInt(process.env.HASHSALT || "10", 10);
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(plainText, salt);
    },

    async generateRandomPassword(length = 24): Promise<string> {
        const password = [
            randomChar(LOWERCASE_CHARS),
            randomChar(UPPERCASE_CHARS),
            randomChar(NUMBER_CHARS),
            randomChar(SYMBOL_CHARS),
        ];

        while (password.length < length) {
            password.push(randomChar(ALL_CHARS));
        }

        for (let i = password.length - 1; i > 0; i--) {
            const swapIndex = randomInt(i + 1);
            [password[i], password[swapIndex]] = [password[swapIndex], password[i]];
        }

        const randomPassword = password.join("");

        return await this.hashPassword(randomPassword);
    },

    generatePlainToken(): string {
        return crypto.randomBytes(32).toString("hex");
    },

    generateRandomHashedToken(): string {
        const plainToken = this.generatePlainToken();
        return crypto.createHash("sha256").update(plainToken).digest("hex");
    },
};
