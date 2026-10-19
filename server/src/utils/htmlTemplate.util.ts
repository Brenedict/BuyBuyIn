// General Imports
import fs from "fs";
import path from "path";

// Utils
import DateUtil from "./date.util";
import type { AssignableRole } from "../service/email.service";

export default {
    formatAccountCreationTemplate(
        recipientRole: AssignableRole,
        baseUrl: string,
        hashedToken: string,
        smtpExpirationOffset: string,
        fullName: string,
        email: string
    ) {
        // TODO: Email templates should vary per role.
        const roleHtmlTemplates: Record<AssignableRole, string> = {
            // TODO: Make it personalized. Add more details about the role.
            HQADMIN: "hqadmin-account-creation.html",

            // TODO: Copy pasted from hqadmin. Make a personalized version.
            BRANCHMANAGER: "branchmanager-account-creation.html",

            // TODO: Copy pasted from hqadmin. Make a personalized version.
            CASHIER: "cashier-account-creation.html",
        };

        // Retrieves HTML template sent in the email
        const templatePath = path.join(process.cwd(), "src", "html_templates", roleHtmlTemplates[recipientRole]);
        const htmlTemplate = fs.readFileSync(templatePath, "utf-8");

        // Replaces link in the HTML template
        let populatedHtml = htmlTemplate;

        // Formats email sent
        const confirmationLink = `${baseUrl}/verify-account?token=${hashedToken}`;
        populatedHtml = htmlTemplate.replaceAll("${resetLink}", () => confirmationLink);

        const linkDuration = DateUtil.formatResetLinkDurationEmail(smtpExpirationOffset);
        populatedHtml = populatedHtml.replaceAll("${linkDuration}", () => linkDuration);

        populatedHtml = populatedHtml.replaceAll("${fullName}", () => fullName);
        populatedHtml = populatedHtml.replaceAll("${email}", () => email);

        return populatedHtml;
    },
};
