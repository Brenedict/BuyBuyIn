// Popup Component
import { LogoutConfirmationPopup } from "../components/popups/global/AccountPopups";

// API Services
import { logoutAction } from "../api/authService";

export const globalPopups = [
    {
        path: "logout",
        element: <LogoutConfirmationPopup />,
        action: logoutAction,
    },
];
