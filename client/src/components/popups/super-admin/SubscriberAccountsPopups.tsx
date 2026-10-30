// Components
import { PopUp } from "../../PopUp";
import { Text } from "../../Text";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";
import PasswordInput from "../../inputs/PasswordInput";
import SelectInput from "../../inputs/SelectInput";

// Test Data
import { SAMPLE_SUBSCRIBERS_DATA } from "../../../TESTINGDATA/subscribersData";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// General Imports
import { Form, useLoaderData, useParams } from "react-router";
import { ROUTES } from "../../../routes/Routes";

// API Services
import type { RegistrationBusinessEntry } from "@buybuyin/shared/schema/registration";

export function SubscriberAddEditPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();

    const businesses = useLoaderData<RegistrationBusinessEntry[]>();

    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccounts, true);

    const businessOptions = Object.fromEntries(businesses.map((business) => [business.name, String(business.id)]));
    const defaultBusinessId = businesses[0] ? String(businesses[0].id) : "";

    return (
        <PopUp title={mode === "add" ? "Add Subscriber" : "Edit Subscriber Details"} handleCloseProp={handleClose}>
            <Form method="post" className="flex flex-col gap-4">
                <GeneralInput
                    name="email"
                    type="email"
                    label="Email"
                    labelVariant="small"
                    placeholder="sample@email.com"
                    required
                    // value={form.email}
                />
                <div className="flex gap-4">
                    <GeneralInput
                        name="firstName"
                        type="text"
                        label="First Name"
                        labelVariant="small"
                        placeholder="Pedro"
                        required
                        // value={form.firstName}
                    />
                    <GeneralInput
                        name="lastName"
                        type="text"
                        label="Last Name"
                        labelVariant="small"
                        placeholder="Santos"
                        required
                        // value={form.lastName}
                    />
                </div>

                {/* Stops PopUp drag handler from hijacking dropdown clicks & matches font */}
                <div
                    className="flex flex-col gap-1 cursor-pointer [&_*]:cursor-pointer [&_*]:font-normal"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <SelectInput
                        id="business"
                        name="businessId"
                        label={mode === "add" ? "Business " : "Change Business "}
                        labelVariant="small"
                        options={businessOptions}
                        defaultValue={defaultBusinessId}
                        className="rounded-2xl border border-black-400 overflow-hidden"
                    />
                </div>

                <div className="flex gap-2 pt-2">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1">
                        Add
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
}

export function SubscriberRenewPopup() {
    const { id } = useParams();
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccountsEdit(String(id)), true);

    const existing = SAMPLE_SUBSCRIBERS_DATA.find((sub) => String(sub.id) === String(id));
    const currentBusinessName = existing?.businessName || "Santos Fashion Boutique";
    const renewBusinessOption = { [currentBusinessName]: currentBusinessName };

    return (
        <PopUp title="Renew Subscription" handleCloseProp={handleClose}>
            <form className="flex flex-col gap-4">
                <GeneralInput
                    name="firstName"
                    type="text"
                    label="First Name"
                    labelVariant="small"
                    defaultValue={existing?.firstName}
                    required
                />
                <GeneralInput
                    name="lastName"
                    type="text"
                    label="Last Name"
                    labelVariant="small"
                    defaultValue={existing?.lastName}
                    required
                />

                <div
                    className="flex flex-col gap-1 cursor-pointer [&_*]:cursor-pointer [&_*]:font-normal"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <Text size="normal" weight="light" variant="slate">
                        Business <span className="text-[#c93a23]">*</span>
                    </Text>
                    <SelectInput
                        id="business"
                        name="business"
                        label=""
                        options={renewBusinessOption}
                        defaultValue={currentBusinessName}
                        className="rounded-2xl border border-black-400 overflow-hidden"
                    />
                </div>

                <GeneralInput
                    name="username"
                    type="text"
                    label="Username"
                    labelVariant="small"
                    defaultValue={existing?.username}
                    required
                />
                <PasswordInput name="password" label="Password" labelVariant="small" required />

                <div className="flex flex-col gap-2 pt-4">
                    <Text align="center" size="small" variant="crimson">
                        This will update the information of the subscribed account
                    </Text>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="normal"
                            className="flex-1"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button type="button" variant="main" size="normal" className="flex-1" onClick={handleClose}>
                            Add
                        </Button>
                    </div>
                </div>
            </form>
        </PopUp>
    );
}

export function SubscriberResetPasswordPopup() {
    const { id } = useParams();
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccountsEdit(String(id)), true);

    return (
        <PopUp title="Reset Password" handleCloseProp={handleClose}>
            <section className="flex min-h-[150px] flex-col justify-between gap-8">
                <div className="flex flex-1 items-center justify-center pt-4">
                    <Text align="center">Are you sure you want to reset the password?</Text>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="main" size="normal" className="flex-1" onClick={handleClose}>
                        Reset Password
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

export function SubscriberDeletePopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccounts, true);

    return (
        <PopUp title="Delete Subscriber" handleCloseProp={handleClose}>
            <section className="flex min-h-[150px] flex-col justify-between gap-8">
                <div className="flex flex-1 items-center justify-center pt-4">
                    <Text align="center">Are you sure you want to delete this subscriber account?</Text>
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
