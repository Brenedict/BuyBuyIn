// ==============================================================
/** Author: John Benedict Binas
 * Co-Authors: [Name]
 *
 * Description: Handles the client-side account registration / verification flow.
 * (1) Validates the emailed access token via the account verification loader.
 * (2) Completes the account registration by setting the new password via the action.
 */
// ==============================================================

// General Imports
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { ROUTES } from "../routes/Routes";
import { CompleteAccountRegistrationSchema } from "@buybuyin/shared/schema/registration";

import { apiFetch } from "./httpClient";

const FALLBACK_ERROR = "Something went wrong. Please try again.";

export interface AccountVerificationLoaderData {
    email: string;
    isTokenExpired: boolean;
    message: string;
}

// Validates the emailed access token and returns the masked email of the account being verified.
// This uses the same resetToken attribute from the User table.
export const checkAccountRegistrationToken = async ({ request }: LoaderFunctionArgs) => {
    try {
        // Create URL object for query extraction
        const url = new URL(request.url);

        // Extract the 'token' query parameter
        const token = url.searchParams.get("token") ?? "";

        // Initial check for token length, prevents wasteful query on fake tokens
        if (token.trim().length === 0 || token.trim().length <= 63) {
            throw redirect(ROUTES.AUTH);
        }

        const res = await apiFetch(`/registration/verify-email?token=${token}`, { method: "GET" });

        const result = await res.json().catch(() => null);

        const isTokenExpired = res.status >= 400;

        return {
            email: res.ok ? (result?.email ?? "") : "",
            isTokenExpired,
            message: res.ok ? "" : (result?.message ?? FALLBACK_ERROR),
        };
    } catch {
        throw redirect(ROUTES.AUTH);
    }
};

export interface AccountVerificationActionData {
    error: string;
}

// Completes the account registration by setting the user's chosen password.
export const completeAccountRegistration = async ({ request }: ActionFunctionArgs) => {
    // Create URL object for query extraction
    const url = new URL(request.url);

    // Extract the 'token' query parameter
    const token = url.searchParams.get("token") ?? "";

    if (token.trim().length <= 63) {
        return { error: "Invalid or missing verification link." };
    }

    // Validate the submitted passwords before hitting the server
    const formData = await request.formData();
    const result = CompleteAccountRegistrationSchema.safeParse(formData);

    if (!result.success) {
        const firstIssue = result.error.issues[0];
        return { error: firstIssue?.message ?? "Invalid form submission." };
    }

    const res = await apiFetch(`/registration/complete-account?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(result.data),
    });

    if (res.ok) {
        return redirect(ROUTES.AUTH);
    }

    const apiError = await res.json().catch(() => null);
    const message = apiError?.message ?? apiError?.error ?? FALLBACK_ERROR;

    return { error: typeof message === "string" ? message : FALLBACK_ERROR };
};