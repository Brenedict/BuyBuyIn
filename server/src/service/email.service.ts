// ==============================================================
/** Author: John Benedict Binas
 * Co-Authors: [Name]
 *
 * Description: Sends account related emails with failover support.
 * (1) Sends the account registration / activation confirmation email.
 * (2) Sends the account successfully registered success email.
 *
 * SMTP failover: Gmail is tried first, then a backup Gmail account
 * (GMAIL_SMTP_BACKUP_*) is used if the primary is unavailable / hits its
 * daily limit. Set SMTP_SKIP_PRIMARY="true" to skip the primary for testing.
 */
// ==============================================================

// General Imports
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// PEDRO SHARED IMPORTS
import { RoleType } from "@buybuyin/shared/prisma/enums";

// Utils
import TemplateUtil from "../utils/htmlTemplate.util";

// TODO: Move this to a dedicated directory that stores types
export type AssignableRole = Exclude<RoleType, "SUPERADMIN">;

const FALLBACK_REGISTRATION_TOKEN_EXPIRATION = "1d";

type ProviderConfig = {
    name: string;
    from: string;
    transport: Transporter;
};

const buildProviders = (): ProviderConfig[] => {
    const providers: ProviderConfig[] = [];

    // Check if the primary Gmail SMTP should be skipped (for testing purposes)
    const skipPrimary = String(process.env.SMTP_SKIP_PRIMARY).toLowerCase() === "true";

    const gmailEmail = process.env.GMAIL_SMTP_EMAIL;
    const gmailPass = process.env.GMAIL_SMTP_16_CHAR_PASS;

    if (gmailEmail && gmailPass && !skipPrimary) {
        providers.push({
            name: "gmail",
            from: `"BuyBuyIn - No Reply" <${gmailEmail}>`,
            transport: nodemailer.createTransport({
                service: "gmail",
                auth: { user: gmailEmail, pass: gmailPass },
            }),
        });
    }

    const backupEmail = process.env.GMAIL_SMTP_BACKUP_EMAIL;
    const backupPass = process.env.GMAIL_SMTP_BACKUP_PASS;

    if (backupEmail && backupPass) {
        providers.push({
            name: "backup",
            from: `"BuyBuyIn - No Reply" <${backupEmail}>`,
            transport: nodemailer.createTransport({
                service: "gmail",
                auth: { user: backupEmail, pass: backupPass },
            }),
        });
    }

    return providers;
};

const sendWithFailover = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    const providers = buildProviders();

    if (providers.length === 0) {
        console.error("[Email] No SMTP provider configured. Set GMAIL_SMTP_* or GMAIL_SMTP_BACKUP_* env vars.");
        return false;
    }

    for (const { name, from, transport } of providers) {
        try {
            await transport.sendMail({ from, to, subject, html });
            console.log(`[Email] Sent "${subject}" to ${to} via ${name}`);
            return true;
        } catch (err) {
            console.error(`[Email] ${name} failed for ${to}:`, err);
        }
    }

    console.error(`[Email] All SMTP providers failed for ${to}.`);
    return false;
};

export default {
    async sendRegistrationConfirmationEmal(
        recipientRole: AssignableRole,
        hashedToken: string,
        fullName: string,
        email: string
    ) {
        const baseUrl = process.env.FRONTEND_URL;
        const smtpExpirationOffset =
            process.env.SMTP_ACCOUNT_REGISTRATION_EXPIRATION || FALLBACK_REGISTRATION_TOKEN_EXPIRATION;

        if (!baseUrl) {
            console.error("[Email] FRONTEND_URL is not configured.");
            return false;
        }

        const html = TemplateUtil.formatAccountCreationTemplate(
            recipientRole,
            baseUrl,
            hashedToken,
            smtpExpirationOffset,
            fullName,
            email
        );

        return sendWithFailover({
            to: email,
            subject: "Account Registration Confirmation",
            html,
        });
    },

    async sendAccountRegisteredSuccessEmail(fullName: string, email: string) {
        if (!process.env.FRONTEND_URL) {
            console.error("[Email] FRONTEND_URL is not configured.");
            return false;
        }

        const html = TemplateUtil.formatAccountRegisteredSuccessTemplate(fullName, email);

        return sendWithFailover({
            to: email,
            subject: "Account Registered Successfully",
            html,
        });
    },
};
