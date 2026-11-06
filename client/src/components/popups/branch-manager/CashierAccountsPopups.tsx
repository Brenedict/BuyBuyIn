// Components
import { PopUp } from "../../PopUp";
import { Text } from "../../Text";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";
import SelectInput from "../../inputs/SelectInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";
import { useState, type ChangeEvent } from "react";

// General Imports
import { Form, useLoaderData } from "react-router";
import { ROUTES } from "../../../routes/Routes";

// API Services
import type { RegistrationBranchEntry } from "@buybuyin/shared/schema/registration";
import type { CashierFormLoaderData } from "../../../api/registrationService";

export function CashierAddEditPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.manageUsers, true);

    // Add route loads branches (array); edit route loads { cashier, branches }.
    const loadData = useLoaderData();
    const isEdit = mode === "edit";

    const branches = isEdit ? (loadData as CashierFormLoaderData).branches : (loadData as RegistrationBranchEntry[]);
    const cashier = isEdit ? (loadData as CashierFormLoaderData).cashier : null;

    const [businessId, setBusinessId] = useState(
        cashier?.branchId ? String(cashier.branchId) : branches[0]?.businessId ? String(branches[0].businessId) : ""
    );

    if (isEdit && !cashier) {
        return (
            <PopUp title="Cashier Not Found" handleCloseProp={handleClose}>
                <Text>The cashier account you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const branchOptions = Object.fromEntries(branches.map((branch) => [branch.location, String(branch.id)]));
    const defaultBranchId = cashier?.branchId ? String(cashier.branchId) : "";

    const handleBranchChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const branch = branches.find((b) => String(b.id) === e.target.value);
        setBusinessId(branch?.businessId ? String(branch.businessId) : "");
    };

    return (
        <PopUp
            title={mode === "add" ? "Add Cashier" : "Edit Cashier"}
            subtitle={mode === "add" ? "Fill in the details to register a cashier" : "Update the cashier's details below"}
            handleCloseProp={handleClose}
        >
            <Form method="post" className="flex flex-col gap-4">
                <GeneralInput
                    name="email"
                    type="email"
                    label="Email"
                    labelVariant="small"
                    placeholder="sample@email.com"
                    defaultValue={cashier?.email}
                    required
                />
                <div className="flex gap-4">
                    <GeneralInput
                        name="firstName"
                        type="text"
                        label="First Name"
                        labelVariant="small"
                        placeholder="Pedro"
                        defaultValue={cashier?.firstName}
                        required
                    />
                    <GeneralInput
                        name="lastName"
                        type="text"
                        label="Last Name"
                        labelVariant="small"
                        placeholder="Santos"
                        defaultValue={cashier?.lastName}
                        required
                    />
                </div>

                {/* Stops PopUp drag handler from hijacking dropdown clicks & matches font */}
                <div
                    className="flex flex-col gap-1 cursor-pointer [&_*]:cursor-pointer [&_*]:font-normal"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    {!isEdit && <input type="hidden" name="businessId" value={businessId} />}
                    <SelectInput
                        id="branch"
                        name="branchId"
                        label="Branch"
                        labelVariant="small"
                        options={branchOptions}
                        defaultValue={defaultBranchId}
                        onChange={handleBranchChange}
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

export function CashierDeletePopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.manageUsers, true);

    const cashier = useLoaderData();
    const formId = "cashierDeleteForm";

    return (
        <PopUp title="Delete Cashier" subtitle="This action cannot be undone" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <div className="w-fit rounded-full bg-cream px-4 py-1.5">
                        <Text size="normal" weight="bold" variant="brown">
                            {(cashier as { fullName?: string | null; firstName?: string; lastName?: string } | null)
                                ?.fullName ?? "this cashier"}
                        </Text>
                    </div>
                </div>

                <Text>
                    Are you sure you want to delete this cashier account? This action cannot be undone.
                </Text>

                <Form id={formId} method="post" />
                <div className="flex gap-2 pt-4">
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
