// ==============================================================
/** Author: John Benedict Binas
 * Co-Authors: [Name]
 *
 * Description: Sends account related emails.
 * (1) Sends the account registration / activation confirmation email.
 * (2) Sends the account successfully registered success email.
 */
// ==============================================================

// General Imports
import nodemailer from "nodemailer";

// PEDRO SHARED IMPORTS
import type { User } from "@buybuyin/shared/prisma/client";
import { RoleType } from "@buybuyin/shared/prisma/enums";

// Services
import AuthService from "./auth.service";

// Utils
import HashUtil from "../utils/hash.util";
import TemplateUtil from "../utils/htmlTemplate.util";

// TODO: Move this to a dedicated directory that stores types
export type AssignableRole = Exclude<RoleType, "SUPERADMIN">;

const FALLBACK_REGISTRATION_TOKEN_EXPIRATION = "1d";

export default {
    async sendRegistrationConfirmationEmal(
        recipientRole: AssignableRole,
        hashedToken: string,
        fullName: string,
        email: string
    ) {
        try {
            // .env prerequisites
            const smtpSourceEmail = process.env.GMAIL_SMTP_EMAIL;
            const smtpSourcePassword = process.env.GMAIL_SMTP_16_CHAR_PASS;
            const baseUrl = process.env.FRONTEND_URL;

            // '5m' is a fallback here in case the .env is missing the SMTP_ACCOUNT_REGISTRATION_EXPIRATION
            const smtpExpirationOffset =
                process.env.SMTP_ACCOUNT_REGISTRATION_EXPIRATION || FALLBACK_REGISTRATION_TOKEN_EXPIRATION;

            if (!baseUrl || !smtpSourceEmail || !smtpSourcePassword) {
                throw Error;
            }

            const populatedEmailHtml = TemplateUtil.formatAccountCreationTemplate(
                recipientRole,
                baseUrl,
                hashedToken,
                smtpExpirationOffset,
                fullName,
                email
            );
            // Constructs email body
            const mailOptions = {
                from: `"BuyBuyIn - No Reply" <${smtpSourceEmail}>`,
                to: email,
                subject: "Account Registration Confirmation",
                html: populatedEmailHtml,
            };

            // Sends email
            const transporter = nodemailer.createTransport({
                service: "gmail", // Or smtp.gmail.com / smtp-relay.brevo.com
                auth: {
                    user: smtpSourceEmail,
                    pass: smtpSourcePassword,
                },
            });

            await transporter.sendMail(mailOptions);

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },

    async sendAccountRegisteredSuccessEmail(fullName: string, email: string) {
        try {
            // .env prerequisites
            const smtpSourceEmail = process.env.GMAIL_SMTP_EMAIL;
            const smtpSourcePassword = process.env.GMAIL_SMTP_16_CHAR_PASS;
            const baseUrl = process.env.FRONTEND_URL;

            if (!baseUrl || !smtpSourceEmail || !smtpSourcePassword) {
                throw Error;
            }

            const populatedEmailHtml = TemplateUtil.formatAccountRegisteredSuccessTemplate(fullName, email);

            const mailOptions = {
                from: `"BuyBuyIn - No Reply" <${smtpSourceEmail}>`,
                to: email,
                subject: "Account Registered Successfully",
                html: populatedEmailHtml,
            };

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: smtpSourceEmail,
                    pass: smtpSourcePassword,
                },
            });

            await transporter.sendMail(mailOptions);

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },
};
