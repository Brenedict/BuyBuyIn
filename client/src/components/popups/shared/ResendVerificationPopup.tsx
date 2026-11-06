// General Imports
import { Form, useLoaderData } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// API Services
import type { RegistrationUserEntry } from "@buybuyin/shared/schema/registration";

export function ResendVerificationPopup({ returnTo }: { returnTo: string }) {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(returnTo, true);

    const account = useLoaderData<RegistrationUserEntry | null>();

    if (!account) {
        return (
            <PopUp title="Account Not Found" handleCloseProp={handleClose}>
                <Text>The account you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const fullName = account.fullName ?? `${account.firstName} ${account.lastName}`;

    return (
        <PopUp
            title="Resend Verification"
            subtitle="Send a new verification link to this account"
            handleCloseProp={handleClose}
        >
            <Form method="post" className="flex flex-col gap-4">
                <input type="hidden" name="redirectTo" value={returnTo} />

                <Text>
                    Are you sure you want to resend the verification email to{" "}
                    <span className="font-bold">{fullName}</span>?
                </Text>

                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1">
                        Resend
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
}