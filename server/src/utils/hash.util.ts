import bcrypt from "bcryptjs";

export default {
    async comparePassword(plainText: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainText, hash);
    },
};
