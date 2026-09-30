// Components
import { PopUp } from "../../PopUp";
import { Text } from "../../Text";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";
import PasswordInput from "../../inputs/PasswordInput";

// Test Data
import { SAMPLE_BUSINESS_SUBSCRIPTIONS } from "../../../TESTINGDATA/subscriptionsData";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// General Imports
import { useState, type SubmitEvent } from "react";
import { useParams } from "react-router";
import { ROUTES } from "../../../routes/Routes";

// TODO(#42): Fields follow the Figma popup (Business Subscription ID, Username, Password).
// Confirm with the team, since Username/Password look copied from Subscriber Accounts.
interface SubscriptionForm {
    subscriptionId: string;
    username: string;
    password: string;
}

export function SubscriptionFormPopup({ mode }: { mode: "add" | "edit" }) {
    const { id } = useParams();
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.subscriptions, true);

    const existing = SAMPLE_BUSINESS_SUBSCRIPTIONS.find((row) => String(row.id) === String(id));

    const [form, setForm] = useState<SubscriptionForm>({
        subscriptionId: existing?.businessSubscriptionLabel ?? "",
        username: existing?.businessLabel ?? "",
        password: "",
    });

    const setField = (key: keyof SubscriptionForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleClose();
    };

    return (
        <PopUp
            title={mode === "add" ? "Add Business Subscription" : "Edit Business Subscription"}
            handleCloseProp={handleClose}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <GeneralInput
                    id="subscriptionId"
                    name="subscriptionId"
                    type="text"
                    label="Business Subscription ID"
                    placeholder="ABCD-EFGH-123"
                    className="rounded-lg!"
                    value={form.subscriptionId}
                    onChange={setField("subscriptionId")}
                />
                <GeneralInput
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="Maria Santos"
                    className="rounded-lg!"
                    required
                    value={form.username}
                    onChange={setField("username")}
                />
                <PasswordInput
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    className="rounded-lg!"
                    required
                    value={form.password}
                    onChange={setField("password")}
                />

                <div className="flex gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1">
                        {mode === "add" ? "Add" : "Save"}
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

export function DeleteSubscriptionPopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.subscriptions, true);

    return (
        <PopUp title="Delete Business Subscription" handleCloseProp={handleClose}>
            <section className="flex min-h-75 flex-col justify-between gap-8">
                <div className="flex flex-1 items-center justify-center">
                    <Text align="center">Are you sure you want to delete this subscription?</Text>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="main" size="normal" className="flex-1" onClick={handleClose}>
                        Delete
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}
