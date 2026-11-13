// General Imports
import { useState } from "react";
import { Form, useLoaderData } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import ChoiceInput from "../../inputs/ChoiceInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// API Services
import type { RegistrationUserEntry } from "@buybuyin/shared/schema/registration";

const MANAGE_FORM_ID = "manageAccountForm";

export function ManageAccountPopup({
    accountLabel,
    returnTo,
    deleteTo,
}: {
    accountLabel: string;
    returnTo: string;
    deleteTo: (id: string) => string;
}) {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(returnTo, true);

    const account = useLoaderData<RegistrationUserEntry | null>();

    const isDeactivated = account?.accountStatus === "DEACTIVATED";
    const [selected, setSelected] = useState<string>(isDeactivated ? "reactivate" : "deactivate");

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

    const options = isDeactivated
        ? [
              { value: "reactivate", label: "Reactivate Account" },
              { value: "delete", label: "Delete Account" },
          ]
        : [
              { value: "deactivate", label: "Deactivate Account" },
              { value: "delete", label: "Delete Account" },
          ];

    const handleConfirm = () => {
        // Deleting goes through the dedicated delete-confirmation popup instead.
        if (selected === "delete") {
            navigate(deleteTo(String(account.id)));
            return;
        }

        (document.getElementById(MANAGE_FORM_ID) as HTMLFormElement | null)?.requestSubmit();
    };

    return (
        <PopUp
            title={`Manage ${accountLabel}`}
            subtitle="Choose what you want to do with this account"
            handleCloseProp={handleClose}
        >
            <Form id={MANAGE_FORM_ID} method="post" className="flex flex-col gap-3">
                <input type="hidden" name="redirectTo" value={returnTo} />
                <input type="hidden" name="action" value={selected} />

                {options.map((option) => (
                    <ChoiceInput
                        key={option.value}
                        id={option.value}
                        name="manageAction"
                        inputVariant="radio"
                        value={option.value}
                        checked={selected === option.value}
                        onChange={() => setSelected(option.value)}
                    >
                        {option.label}
                    </ChoiceInput>
                ))}
            </Form>

            <div className="flex w-full gap-2 pt-6">
                <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="button" variant="main" size="normal" className="flex-1" onClick={handleConfirm}>
                    Confirm
                </Button>
            </div>
        </PopUp>
    );
}
