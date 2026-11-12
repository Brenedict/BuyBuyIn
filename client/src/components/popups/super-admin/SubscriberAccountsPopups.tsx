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
import type { SubscriberFormLoaderData } from "../../../api/registrationService";
import type { DeleteContextData } from "@buybuyin/shared/schema/registration";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export function SubscriberAddEditPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();

    const loadData = useLoaderData() as RegistrationBusinessEntry[] | SubscriberFormLoaderData;
    const isEdit = mode === "edit";

    const businesses = isEdit ? loadData.businesses : (loadData as RegistrationBusinessEntry[]);
    const subscriber = isEdit ? loadData.subscriber : null;

    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccounts, true);

    if (mode === "edit" && !subscriber) {
        return (
            <PopUp title="Subscriber Not Found" handleCloseProp={handleClose}>
                <Text>The subscriber account you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const businessOptions = Object.fromEntries(businesses.map((business) => [business.name, String(business.id)]));
    const defaultBusinessId = subscriber?.businessId
        ? String(subscriber.businessId)
        : businesses[0]
          ? String(businesses[0].id)
          : "";

    return (
        <PopUp
            title={mode === "add" ? "Add Subscriber" : "Edit Subscriber Details"}
            subtitle={
                mode === "add" ? "Fill in the details to add a subscriber" : "Update the subscriber's details below"
            }
            handleCloseProp={handleClose}
        >
            <Form method="post" className="flex flex-col gap-4">
                <GeneralInput
                    name="email"
                    type="email"
                    label="Email"
                    labelVariant="small"
                    placeholder="sample@email.com"
                    defaultValue={subscriber?.email}
                    required
                />
                <div className="flex gap-4">
                    <GeneralInput
                        name="firstName"
                        type="text"
                        label="First Name"
                        labelVariant="small"
                        placeholder="Pedro"
                        defaultValue={subscriber?.firstName}
                        required
                    />
                    <GeneralInput
                        name="lastName"
                        type="text"
                        label="Last Name"
                        labelVariant="small"
                        placeholder="Santos"
                        defaultValue={subscriber?.lastName}
                        required
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
                        {mode === "add" ? "Add" : "Save"}
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
}

export function SubscriberDeletePopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccounts, true);

    const context = useLoaderData<DeleteContextData>();

    if (!context?.account) {
        return (
            <PopUp title="Subscriber Not Found" handleCloseProp={handleClose}>
                <Text>The subscriber account you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const { account, remainingCount } = context;
    const fullName = account.fullName ?? `${account.firstName} ${account.lastName}`;
    const businessName = account.business?.name ?? "—";
    const formId = "subscriberDeleteForm";

    return (
        <PopUp
            title="Delete Subscriber"
            subtitle="This action cannot be undone"
            size="md"
            handleCloseProp={handleClose}
        >
            <section className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <div className="w-fit rounded-full bg-cream px-4 py-1.5">
                        <Text size="normal" weight="bold" variant="brown">
                            {fullName}
                        </Text>
                    </div>
                </div>

                <Text>
                    Are you sure you want to delete <span className="font-bold">{fullName}</span>?
                </Text>

                {remainingCount > 0 ? (
                    <div className="flex items-start gap-3 rounded-2xl bg-off-white p-3">
                        <Text size="description" weight="medium" variant="brown">
                            After deletion, <span className="font-bold">{remainingCount}</span> other subscriber
                            account(s) will remain linked to <span className="font-bold">{businessName}</span>.
                        </Text>
                    </div>
                ) : (
                    <div className="flex items-start gap-3 rounded-2xl bg-crimson-muted p-3">
                        <WarningAmberOutlinedIcon className="text-crimson" fontSize="small" />
                        <Text size="description" weight="medium" variant="crimson">
                            This is the last subscriber linked to <span className="font-bold">{businessName}</span>.
                            After deletion, no accounts will be linked to this business.
                        </Text>
                    </div>
                )}

                <Form id={formId} method="post" />
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1" form={formId}>
                        Yes, delete
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}
