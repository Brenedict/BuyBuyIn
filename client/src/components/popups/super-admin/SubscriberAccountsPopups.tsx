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
import { useState, type SubmitEvent } from "react";
import { useParams } from "react-router";
import { ROUTES } from "../../../routes/Routes";

interface SubscriberForm {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export function SubscriberAddEditPopup({ mode }: { mode: "add" | "edit" }) {
    const { id } = useParams();
    const navigate = useNavigatePage();

    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccounts, true);
    const goToReset = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccountsReset(String(id)), true);
    const goToRenew = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccountsRenew(String(id)), true);

    const existing = SAMPLE_SUBSCRIBERS_DATA.find((sub) => String(sub.id) === String(id));

    const [form, setForm] = useState<SubscriberForm>({
        firstName: existing?.firstName ?? "",
        lastName: existing?.lastName ?? "",
        username: existing?.username ?? "",
        password: "",
    });

    const setField = (key: keyof SubscriberForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleClose();
    };

    // Removed the empty string option to prevent the custom dropdown from crashing
    const businessOptions = {
        "Santos Fashion Boutique": "Santos Fashion Boutique",
        "Reyes Hardware Supply": "Reyes Hardware Supply",
        "GlowUp Beauty Studio": "GlowUp Beauty Studio"
    };

    return (
        <PopUp
            title={mode === "add" ? "Add Subscriber" : "Edit Subscriber Details"}
            handleCloseProp={handleClose}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <GeneralInput
                    name="firstName"
                    type="text"
                    label="First Name"
                    labelVariant="small"
                    placeholder="Pedro"
                    required
                    value={form.firstName}
                    onChange={setField("firstName")}
                />
                <GeneralInput
                    name="lastName"
                    type="text"
                    label="Last Name"
                    labelVariant="small"
                    placeholder="Santos"
                    required
                    value={form.lastName}
                    onChange={setField("lastName")}
                />
                
                {/* FIXED: Replicating the small label manually, and setting SelectInput label to "" */}
                <div className="flex flex-col gap-1">
                    <label className="text-[13px] text-[#2b1a16] pl-1 font-medium">
                        {mode === "add" ? "Business " : "Change Business "}
                        <span className="text-[#c93a23]">*</span>
                    </label>
                    <SelectInput
                        id="business"
                        name="business"
                        label=""
                        options={businessOptions}
                        defaultValue={existing?.businessName || "Santos Fashion Boutique"}
                    />
                </div>
                
                <GeneralInput
                    name="username"
                    type="text"
                    label="Username"
                    labelVariant="small"
                    placeholder="Iloveyou123"
                    required
                    value={form.username}
                    onChange={setField("username")}
                />
                
                <PasswordInput
                    name="password"
                    label="Password"
                    labelVariant="small"
                    placeholder="Iloveyou123"
                    required
                    value={form.password}
                    onChange={setField("password")}
                />
                    
                {mode === "edit" && (
                    <div className="flex items-center justify-between pt-1">
                        <Button type="button" variant="main" size="normal" onClick={goToRenew}>
                            Renew Subscription
                        </Button>
                        
                        <div className="flex items-center gap-2">
                            <Text size="small" variant="crimson">Forgot password?</Text>
                            <Button type="button" variant="secondary" size="small" onClick={goToReset}>
                                Reset Password
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 pt-2">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1">
                        Add
                    </Button>
                </div>
            </form>
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
                <GeneralInput name="firstName" type="text" label="First Name" labelVariant="small" defaultValue={existing?.firstName} required />
                <GeneralInput name="lastName" type="text" label="Last Name" labelVariant="small" defaultValue={existing?.lastName} required />
                
                <div className="flex flex-col gap-1">
                    <label className="text-[13px] text-[#2b1a16] pl-1 font-medium">
                        Business <span className="text-[#c93a23]">*</span>
                    </label>
                    <SelectInput 
                        id="business" 
                        name="business" 
                        label="" 
                        options={renewBusinessOption}
                        defaultValue={currentBusinessName} 
                    />
                </div>
                
                <GeneralInput name="username" type="text" label="Username" labelVariant="small" defaultValue={existing?.username} required />
                <PasswordInput name="password" label="Password" labelVariant="small" required />

                <div className="flex flex-col gap-2 pt-4">
                    <Text align="center" size="small" variant="crimson">
                        This will update the information of the subscribed account
                    </Text>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
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