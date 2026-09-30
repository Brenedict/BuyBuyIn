// Components
import { PopUp } from "../../PopUp";
import { Text } from "../../Text";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";
import PasswordInput from "../../inputs/PasswordInput";

// General Imports
import { useState, type SubmitEvent } from "react";

// TODO(#42): Fields follow the Figma popup (Business Subscription ID, Username, Password).
// Confirm with the team, since Username/Password look copied from Subscriber Accounts.
export interface SubscriptionForm {
    subscriptionId: string;
    username: string;
    password: string;
}

const EMPTY_FORM: SubscriptionForm = { subscriptionId: "", username: "", password: "" };

export function SubscriptionFormPopup({
    mode,
    initial = EMPTY_FORM,
    onClose,
    onSave,
}: {
    mode: "add" | "edit";
    initial?: SubscriptionForm;
    onClose: () => void;
    onSave: (form: SubscriptionForm) => void;
}) {
    const [form, setForm] = useState<SubscriptionForm>(initial);

    const setField = (key: keyof SubscriptionForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <PopUp
            title={mode === "add" ? "Add Business Subscription" : "Edit Business Subscription"}
            handleCloseProp={onClose}
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
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={onClose}>
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

export function DeleteSubscriptionPopup({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
    return (
        <PopUp title="Delete Business Subscription" handleCloseProp={onClose}>
            <section className="flex min-h-[300px] flex-col justify-between gap-8">
                <div className="flex flex-1 items-center justify-center">
                    <Text align="center">Are you sure you want to delete this subscription?</Text>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="normal" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="main" size="normal" className="flex-1" onClick={onConfirm}>
                        Delete
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}
