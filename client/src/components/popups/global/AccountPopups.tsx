// General Imports
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Form } from "react-router";

// Components
import { Card } from "../../Card";
import { Text } from "../../Text";
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";

// Material UI Icons
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// Query param the login action uses to hand a failure reason back to the login page.
// Codes are used instead of server prose so the URL stays URL-safe and the copy can
// change without breaking the UI.
export const AUTH_ERROR_PARAM = "authError";

export const AUTH_ERRORS = {
    validation_error: {
        title: "Check your details",
        message: "Please enter both your email and password to continue.",
    },
    invalid_credentials: {
        title: "Unable to sign in",
        message: "The email or password you entered is incorrect. Please try again.",
    },
    server_error: {
        title: "Something went wrong",
        message: "We couldn't reach the server. Please try again in a moment.",
    },
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERRORS;

// Narrows an untrusted query string value to a known code
export function isAuthErrorCode(value: string | null): value is AuthErrorCode {
    return value !== null && Object.hasOwn(AUTH_ERRORS, value);
}

export function LogoutConfirmationPopup({}: {}) {
    // Used for redirecting
    const useNavigate = useNavigatePage();

    // When triggered, returns the page to the root (exiting the popup)
    const handleClose = () => useNavigate();

    return (
        <PopUp title="Logout">
            <section className="flex flex-col gap-4">
                <Text>Are you sure you want to log out?</Text>

                <div className="flex gap-2">
                    <Form id="logoutConfirmationForm" method="post"></Form>
                    <Button onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button form="logoutConfirmationForm" className="flex-1" size="normal">
                        Logout
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

// Self-contained dialog for sign in failures. Unlike PopUp it owns its own dismissal
// instead of navigating, so it works on a plain /auth URL with no nested route.
export function AuthErrorDialog({ code, onDismiss }: { code: AuthErrorCode; onDismiss: () => void }) {
    const { title, message } = AUTH_ERRORS[code];

    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onDismiss();
        };

        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [onDismiss]);

    return createPortal(
        <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="authErrorTitle"
            className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-dark/50 px-4"
            onClick={onDismiss}
        >
            <Card className="bg-off-white w-[26.5rem] max-w-full" onClick={(e) => e.stopPropagation()}>
                <Card.Body className="flex flex-col items-center gap-4 py-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-crimson-muted">
                        <ReportProblemOutlinedIcon sx={{ fontSize: 30, color: "#b43320" }} />
                    </div>

                    <div id="authErrorTitle">
                        <Text size="large" weight="bold" variant="crimson" align="center">
                            {title}
                        </Text>
                    </div>

                    <Text size="description" variant="slate-dark" align="center">
                        {message}
                    </Text>

                    <Button type="button" autoFocus onClick={onDismiss} className="mt-2 w-full!">
                        OK
                    </Button>
                </Card.Body>
            </Card>
        </div>,
        document.body
    );
}
