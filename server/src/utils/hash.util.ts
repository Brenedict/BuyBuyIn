import bcrypt from "bcryptjs";

export default {
    async comparePassword(plainText: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainText, hash);
    },

    async hashPassword(plainText: string): Promise<string> {
        const saltRounds = parseInt(process.env.HASHSALT || "10", 10);
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(plainText, salt);
    },
};
