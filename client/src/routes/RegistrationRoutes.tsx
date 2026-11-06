// ==============================================================
/**
 * Description: Route registrations for the account / registration flow.
 * (1) Exposes the account verification route: /verify-email?token=...
 */
// ==============================================================

import { type RouteObject } from "react-router";
import { ROUTES } from "./Routes";
import { checkAccountRegistrationToken, completeAccountRegistration } from "../api/registrationService";
import AccountRegistration from "../pages/shared/AccountRegistration";

export const accountVerificationRoutes: RouteObject[] = [
    {
        // Route hit from the emailed verification link: /verify-email?token=...
        path: ROUTES.VERIFY_ACCOUNT,
        element: <AccountRegistration />,
        loader: checkAccountRegistrationToken,
        action: completeAccountRegistration,
    },
];
