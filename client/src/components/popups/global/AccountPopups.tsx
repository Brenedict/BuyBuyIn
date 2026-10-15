// General Imports
import { Form } from "react-router";

// Components
import { Text } from "../../Text";
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";

// Material UI Icons

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// Regular popup. No handleClosePop meaning the popup handles closing (redirects back one page when closed)
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

// NOTE: handleCloseProp was only provided here because this popup specifically handles Closing by changing a state variable
export function LoginNotifPopup({ description, handleClose }: { description: string; handleClose: () => void }) {
    return (
        <PopUp title="Warning" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <Text variant="black" size="mediumBig" weight="medium">
                    {description}
                </Text>
                <div>
                    <Text variant="black" size="mediumBig" weight="medium">
                        Use these instead (all have "password123")
                    </Text>
                    <Text>- cashier@gmail.com</Text>
                    <Text>- branchmanager@gmail.com</Text>
                    <Text>- hqadmin@gmail.com</Text>
                    <Text>- superadmin@gmail.com</Text>
                </div>

                <Button onClick={handleClose} className="flex-1" size="normal">
                    Okay
                </Button>
            </section>
        </PopUp>
    );
}
