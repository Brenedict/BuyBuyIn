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

export function SupplierFormPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();

    const supplier = useLoaderData<SupplierEntry | null>();

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.catalogue, true);

    if (mode === "edit" && !supplier) {
        return (
            <PopUp title="Supplier Not Found" handleCloseProp={handleClose}>
                <Text>The supplier you are looking for no longer exists in the catalogue.</Text>
            </PopUp>
        );
    }

    return (
        <PopUp title={mode === "add" ? "Add Supplier" : "Edit Supplier"} handleCloseProp={handleClose}>
            <Form method="post" className="flex flex-col gap-4">
                <GeneralInput
                    name="supplierName"
                    type="text"
                    label="Supplier Name"
                    labelVariant="small"
                    defaultValue={supplier?.supplierName}
                    required
                />

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

                <div className="flex gap-2">
                    <Button type="button" onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" size="normal">
                        {mode === "add" ? "Add Supplier" : "Save Changes"}
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
}

export function SupplierDeletePopup() {
    const navigate = useNavigatePage();

    const supplier = useLoaderData<SupplierEntry | null>();

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.catalogue, true);

    if (!supplier) {
        return (
            <PopUp title="Supplier Not Found" handleCloseProp={handleClose}>
                <Text>The supplier you are looking for no longer exists in the catalogue.</Text>
            </PopUp>
        );
    }

    return (
        <PopUp title="Delete Supplier" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <Text>
                    Are you sure you want to delete <b>{supplier.supplierName}</b>? Suppliers that are still linked to
                    products cannot be deleted. This action cannot be undone.
                </Text>

                <Form method="post" className="flex gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1">
                        Delete
                    </Button>
                </Form>
            </section>
        </PopUp>
    );
}
