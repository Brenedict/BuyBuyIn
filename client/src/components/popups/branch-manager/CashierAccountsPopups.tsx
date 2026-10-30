// Components
import { PopUp } from "../../PopUp";
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

export function CashierAddPopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.manageUsers, true);

    const branches = useLoaderData<RegistrationBranchEntry[]>();

    const branchOptions = Object.fromEntries(branches.map((branch) => [branch.location, String(branch.id)]));
    const defaultBranchId = branches[0] ? String(branches[0].id) : "";
    const defaultBusinessId = branches[0]?.businessId ? String(branches[0].businessId) : "";
    const [businessId, setBusinessId] = useState(defaultBusinessId);

    const handleBranchChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const branch = branches.find((b) => String(b.id) === e.target.value);
        setBusinessId(branch?.businessId ? String(branch.businessId) : "");
    };

    return (
        <PopUp title="Add Cashier" handleCloseProp={handleClose}>
            <Form method="post" className="flex flex-col gap-4">
                <GeneralInput
                    name="email"
                    type="email"
                    label="Email"
                    labelVariant="small"
                    placeholder="sample@email.com"
                    required
                />
                <div className="flex gap-4">
                    <GeneralInput
                        name="firstName"
                        type="text"
                        label="First Name"
                        labelVariant="small"
                        placeholder="Pedro"
                        required
                    />
                    <GeneralInput
                        name="lastName"
                        type="text"
                        label="Last Name"
                        labelVariant="small"
                        placeholder="Santos"
                        required
                    />
                </div>

                {/* Stops PopUp drag handler from hijacking dropdown clicks & matches font */}
                <div
                    className="flex flex-col gap-1 cursor-pointer [&_*]:cursor-pointer [&_*]:font-normal"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <input type="hidden" name="businessId" value={businessId} />
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
                        Add
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
}