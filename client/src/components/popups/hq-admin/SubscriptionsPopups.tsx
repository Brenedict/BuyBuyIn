// General Imports
import { type SubmitEvent } from "react";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";
import PasswordInput from "../../inputs/PasswordInput";
import SelectInput from "../../inputs/SelectInput";

// Hooks & Routes
import useNavigatePage from "../../../hooks/useNavigatePage";
import { ROUTES } from "../../../routes/Routes";

/* -------------------------------------------------------------------------- */
/* 1. Manage Billings Popup                                                   */
/* -------------------------------------------------------------------------- */
export function HQManageBillingPopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.HQ_ADMIN.subscriptions, true);

    const goToNewPaymentMethod = () => navigate(`${ROUTES.HQ_ADMIN.subscriptions}/new-payment`, true);
    const goToChangeSubscription = () => navigate(`${ROUTES.HQ_ADMIN.subscriptions}/change-plan`, true);

    return (
        <PopUp title="Manage Billings" handleCloseProp={handleClose}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                {/* Left Column */}
                <div className="flex flex-col gap-6 border-r-0 md:border-r border-gray-300 md:pr-6">
                    <div className="flex flex-col gap-2">
                        <Text size="mediumBig" weight="extraBold" variant="crimson">Payment Method</Text>
                        <Text size="normal" variant="slate-medium">Visa ending in 4562</Text>
                        <Button variant="main" size="small" className="mt-2 w-max" onClick={goToNewPaymentMethod}>
                            Add New Payment Method
                        </Button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Text size="mediumBig" weight="extraBold" variant="crimson">Subscription Dates</Text>
                        
                        <div>
                            <Text size="normal" weight="bold" variant="crimson">Start Date</Text>
                            <Text size="normal" variant="slate-medium">January 1, 2024</Text>
                        </div>
                        
                        <div>
                            <Text size="normal" weight="bold" variant="crimson">Next Renewal Date</Text>
                            <Text size="normal" variant="slate-medium">January 1, 2028</Text>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="autoRenew" className="w-4 h-4 accent-[#c93a23] cursor-pointer" defaultChecked />
                            <label htmlFor="autoRenew" className="cursor-pointer">
                                <Text size="normal" weight="bold" variant="slate-medium">Enable Auto Renewal</Text>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                    <Text size="mediumBig" weight="extraBold" variant="crimson">Billing Summary Card</Text>

                    <div>
                        <Text size="normal" weight="bold" variant="brown">Current Plan Price</Text>
                        <Text size="normal" variant="slate-medium">8,999 Php</Text>
                    </div>

                    <div>
                        <Text size="normal" weight="bold" variant="brown">Additional Branches</Text>
                        <Text size="normal" variant="slate-medium">999 Php</Text>
                    </div>

                    <div>
                        <Text size="normal" weight="bold" variant="brown">Tax</Text>
                        <Text size="normal" variant="slate-medium">1,000 Php</Text>
                    </div>

                    <div>
                        <Text size="normal" weight="bold" variant="brown">Total</Text>
                        <Text size="normal" variant="slate-medium">10,998 Php</Text>
                    </div>

                    <Button variant="main" size="normal" className="mt-2 w-max" onClick={goToChangeSubscription}>
                        Change Subscription
                    </Button>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-8">
                <Button type="button" onClick={handleClose} variant="secondary" size="normal">
                    Cancel
                </Button>
                <Button type="button" onClick={handleClose} size="normal">
                    Save details
                </Button>
            </div>
        </PopUp>
    );
}

/* -------------------------------------------------------------------------- */
/* 2. New Payment Method Popup                                                */
/* -------------------------------------------------------------------------- */
export function HQNewPaymentMethodPopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(`${ROUTES.HQ_ADMIN.subscriptions}/manage-billing`, true);

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleClose();
    };

    return (
        <PopUp title="New Payment Method" handleCloseProp={handleClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
                <GeneralInput name="cardHolder" type="text" label="Card Holder Name" labelVariant="small" placeholder="Bennymer Gabfiel Yap" required />
                <GeneralInput name="cardNumber" type="text" label="Card Number" labelVariant="small" placeholder="4532 •••• •••• 8821" required />
                
                <div className="grid grid-cols-2 gap-4">
                    <GeneralInput name="expiry" type="text" label="Expiration Date" labelVariant="small" placeholder="08/30" required />
                    <PasswordInput name="cvv" label="CVV" labelVariant="small" placeholder="•••" required />
                </div>
                
                <GeneralInput name="billingEmail" type="text" label="Billing Email" labelVariant="small" placeholder="bennymer@gmail.com" required />

                <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="defaultPayment" className="w-4 h-4 accent-[#c93a23] cursor-pointer" />
                    <label htmlFor="defaultPayment" className="cursor-pointer">
                        <Text size="normal" weight="regular" variant="slate-medium">Set as default payment method</Text>
                    </label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" onClick={handleClose} variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button type="submit" size="normal">
                        Save Details
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

/* -------------------------------------------------------------------------- */
/* 3. Change Subscription Popup                                               */
/* -------------------------------------------------------------------------- */
export function HQChangeSubscriptionPopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(`${ROUTES.HQ_ADMIN.subscriptions}/manage-billing`, true);

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleClose();
    };

    const planOptions = {
        "Enterprise": "Enterprise",
        "Pro": "Pro",
        "Basic": "Basic"
    };

    const dateOptions = {
        "Apply Immediately": "Apply Immediately",
        "Apply on next renewal date": "Apply on next renewal date"
    };

    return (
        <PopUp title="Change Subscription" handleCloseProp={handleClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">
                
                {/* Standardized Select Input for Plan Selection */}
                <div
                    className="flex flex-col gap-1 cursor-pointer [&_*]:cursor-pointer [&_*]:font-normal"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <Text size="normal" weight="bold" variant="crimson" className="pb-2">
                        Select a subscription plan for your organization.
                    </Text>
                    <SelectInput
                        id="planSelection"
                        name="planSelection"
                        label=""
                        options={planOptions}
                        defaultValue="Enterprise"
                        className="rounded-2xl border border-gray-400 overflow-hidden"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Text size="normal" weight="bold" variant="crimson">Billing Impact</Text>
                    <Text size="normal" variant="slate-medium">Current Cost: ₱4,999/month</Text>
                    <Text size="normal" variant="slate-medium">New Cost: ₱9,999/month</Text>
                    <Text size="normal" variant="slate-medium">Difference: +₱5,000/month</Text>
                </div>

                {/* Standardized Select Input for Effective Date */}
                <div
                    className="flex flex-col gap-1 cursor-pointer [&_*]:cursor-pointer [&_*]:font-normal"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <Text size="normal" weight="bold" variant="crimson">
                        Effective Date
                    </Text>
                    <SelectInput
                        id="effectiveDate"
                        name="effectiveDate"
                        label=""
                        options={dateOptions}
                        defaultValue="Apply on next renewal date"
                        className="rounded-2xl border border-gray-400 overflow-hidden"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" onClick={handleClose} variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button type="submit" size="normal">
                        Submit
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

/* -------------------------------------------------------------------------- */
/* 4. Add Branch Popup                                                        */
/* -------------------------------------------------------------------------- */
export function HQAddBranchPopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.HQ_ADMIN.subscriptions, true);

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleClose();
    };

    return (
        <PopUp title="Add Branch" handleCloseProp={handleClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
                <GeneralInput name="address" type="text" label="Complete Address" labelVariant="small" placeholder="Level 2, Greenbelt 5, Legazpi Street, Ayala Center, Makati City" required />
                
                <div className="grid grid-cols-2 gap-4">
                    <GeneralInput name="branchEmail" type="text" label="Branch Email" labelVariant="small" placeholder="makati.branch@gmail.com" required />
                    <GeneralInput name="region" type="text" label="Region" labelVariant="small" placeholder="National Capital Region" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <GeneralInput name="manager" type="text" label="Branch Manager" labelVariant="small" placeholder="Maria Osiana Buenas Dabocol" required />
                    <GeneralInput name="city" type="text" label="City/Municipality" labelVariant="small" placeholder="Makati City" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <GeneralInput name="branchCode" type="text" label="Branch Code" labelVariant="small" placeholder="a1b2c3d4e5f6..." required />
                    <GeneralInput name="zipCode" type="text" label="Zip Code" labelVariant="small" placeholder="1228" required />
                </div>

                <div className="flex items-center justify-between pt-4">
                    <Text size="smaller" variant="slate">** Please double check the informations before submitting.</Text>
                    <div className="flex gap-2">
                        <Button type="button" onClick={handleClose} variant="secondary" size="normal">
                            Cancel
                        </Button>
                        <Button type="submit" size="normal">
                            Register
                        </Button>
                    </div>
                </div>
            </form>
        </PopUp>
    );
}