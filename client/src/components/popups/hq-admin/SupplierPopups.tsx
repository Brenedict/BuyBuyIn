// General Imports
import { Form, useLoaderData } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// BuyBuyIn Shared Imports
import type { SupplierEntry } from "@buybuyin/shared/schema/supplier";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";

// Material UI Icons
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export function SupplierFormPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();

    const supplier = useLoaderData<SupplierEntry | null>();

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.catalogue, true);

    if (mode === "edit" && !supplier) {
        return (
            <PopUp title="Supplier Not Found" size="md" handleCloseProp={handleClose}>
                <Text>The supplier you are looking for no longer exists in the catalogue.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const formId = "supplierForm";

    return (
        <PopUp
            title={mode === "add" ? "Add supplier" : "Edit supplier"}
            subtitle={mode === "add" ? "Fill in the details to add a supplier" : "Update the supplier's details below"}
            size="md"
            handleCloseProp={handleClose}
        >
            <Form id={formId} method="post" className="flex flex-col gap-4">
                <GeneralInput
                    name="supplierName"
                    type="text"
                    label="Supplier Name"
                    labelVariant="small"
                    defaultValue={supplier?.supplierName}
                    required
                />

                <div className="grid grid-cols-2 gap-3">
                    <GeneralInput
                        name="contactPerson"
                        type="text"
                        label="Contact Person"
                        labelVariant="small"
                        defaultValue={supplier?.contactPerson}
                        required
                    />
                    <GeneralInput
                        name="email"
                        type="email"
                        label="Email"
                        labelVariant="small"
                        defaultValue={supplier?.email}
                        required
                    />
                </div>

                <GeneralInput
                    name="contactNumber"
                    type="text"
                    label="Contact Number"
                    labelVariant="small"
                    defaultValue={supplier?.contactNumber}
                    maxLength={11}
                    inputMode="numeric"
                    required
                />

                <GeneralInput
                    name="address"
                    type="text"
                    label="Address"
                    labelVariant="small"
                    defaultValue={supplier?.address}
                    required
                />
            </Form>
            <div className="flex w-full gap-2 pt-12">
                <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="main" size="normal" className="flex-1" form={formId}>
                    {mode === "add" ? "Save supplier" : "Save changes"}
                </Button>
            </div>
        </PopUp>
    );
}

export function SupplierDeletePopup() {
    const navigate = useNavigatePage();

    const supplier = useLoaderData<SupplierEntry | null>();

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.catalogue, true);

    if (!supplier) {
        return (
            <PopUp title="Supplier Not Found" size="md" handleCloseProp={handleClose}>
                <Text>The supplier you are looking for no longer exists in the catalogue.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const formId = "supplierDeleteForm";

    return (
        <PopUp title="Delete supplier" subtitle="This action cannot be undone" size="md" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <div className="w-fit rounded-full bg-cream px-4 py-1.5">
                        <Text size="normal" weight="bold" variant="brown">
                            {supplier.supplierName}
                        </Text>
                    </div>
                </div>

                <Text>
                    Are you sure you want to delete <span className="font-bold">{supplier.supplierName}</span>?
                    Suppliers that are still linked to products cannot be deleted. This action cannot be undone.
                </Text>

                <div className="flex items-start gap-3 rounded-2xl bg-crimson-muted p-3">
                    <WarningAmberOutlinedIcon className="text-crimson" fontSize="small" />
                    <Text size="description" weight="medium" variant="crimson">
                        This is permanent. Once deleted, this supplier and its data cannot be recovered.
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
