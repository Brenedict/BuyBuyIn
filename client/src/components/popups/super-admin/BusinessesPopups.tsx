// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// General Imports
import { Form, useLoaderData } from "react-router";
import { ROUTES } from "../../../routes/Routes";

// API Services
import type { RegistrationBusinessEntry } from "@buybuyin/shared/schema/registration";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export function BusinessFormPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.businesses, true);

    const loadData = useLoaderData();
    const business = mode === "edit" ? (loadData as RegistrationBusinessEntry | null) : null;

    if (mode === "edit" && !business) {
        return (
            <PopUp title="Business Not Found" handleCloseProp={handleClose}>
                <Text>The business you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    return (
        <PopUp
            title={mode === "add" ? "Add Business" : "Edit Business"}
            subtitle={mode === "add" ? "Fill in the details to add a business" : "Update the business details below"}
            handleCloseProp={handleClose}
        >
            <Form method="post" className="flex flex-col gap-4">
                <GeneralInput
                    name="name"
                    type="text"
                    label="Business Name"
                    labelVariant="small"
                    placeholder="Santos Fashion Boutique"
                    defaultValue={business?.name}
                    required
                />
                <GeneralInput
                    name="location"
                    type="text"
                    label="Location"
                    labelVariant="small"
                    placeholder="Manila"
                    defaultValue={business?.location}
                    required
                />

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

export function BusinessDeletePopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.businesses, true);

    const business = useLoaderData<RegistrationBusinessEntry | null>();

    if (!business) {
        return (
            <PopUp title="Business Not Found" handleCloseProp={handleClose}>
                <Text>The business you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const formId = "businessDeleteForm";

    return (
        <PopUp title="Delete Business" subtitle="This action cannot be undone" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <div className="w-fit rounded-full bg-cream px-4 py-1.5">
                        <Text size="normal" weight="bold" variant="brown">
                            {business.name}
                        </Text>
                    </div>
                </div>

                <Text>
                    Are you sure you want to delete <span className="font-bold">{business.name}</span>? This action
                    cannot be undone.
                </Text>

                <div className="flex items-start gap-3 rounded-2xl bg-crimson-muted p-3">
                    <WarningAmberOutlinedIcon className="text-crimson" fontSize="small" />
                    <Text size="description" weight="medium" variant="crimson">
                        This deletion does not cascade. Linked branches, subscriber accounts, and products will be left
                        without a business.
                    </Text>
                </div>

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
