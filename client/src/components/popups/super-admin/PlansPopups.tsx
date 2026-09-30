// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";
import TextAreaInput from "../../inputs/TextAreaInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";
import { useParams } from "react-router";
import { Text } from "../../Text";
import { ROUTES } from "../../../routes/Routes";

// TEST DATA
import { MOCK_PLANS } from "../../../TESTINGDATA/subscriptionPlans";
import { useMemo } from "react";

// TODO: All types defined here are temporary and will be replaced with ZOD
/* ---------- Types ---------- */

export type Plan = {
    id: number;
    name: string;
    description: string;
    price: number;
    durationDays: number;
    branches: number;
    hqAdmins: number;
    cashiers: number;
    branchManagers: number;
};

// Form fields are strings so inputs stay controlled and can be empty.
export type PlanForm = {
    name: string;
    description: string;
    price: string;
    durationDays: string;
    cashiers: string;
    branchManagers: string;
    hqAdmins: string;
    branches: string;
};

function planToForm(p: Plan): PlanForm {
    return {
        name: p.name,
        description: p.description,
        price: String(p.price),
        durationDays: String(p.durationDays),
        cashiers: String(p.cashiers),
        branchManagers: String(p.branchManagers),
        hqAdmins: String(p.hqAdmins),
        branches: String(p.branches),
    };
}

export function PlansAddEditPopup({ mode = "add" }: { mode: "add" | "edit" }) {
    // Extracts the Branch Wide Offer Id from the URL Param
    const { id } = useParams();

    // Used for redirecting
    const useNavigate = useNavigatePage();

    // Extracting the test data. The 'useMemo' is for caching.
    const testPlan = useMemo(() => MOCK_PLANS.find((plan) => String(plan.id) == id), [id]);

    // When triggered, returns the page to the root (exiting the popup)
    const handleClose = () => useNavigate(ROUTES.SUPER_ADMIN.plans);

    return (
        <PopUp title={`${mode === "add" ? "Add New" : "Edit"} Plan`} handleCloseProp={handleClose}>
            <section className="flex flex-col gap-3">
                <GeneralInput
                    name="packageName"
                    type="text"
                    label="Package Name"
                    labelVariant="small"
                    placeholder="Enter Plan Name"
                    defaultValue={testPlan?.name}
                    required
                />
                <TextAreaInput
                    name="description"
                    label="Description"
                    labelVariant="small"
                    placeholder="Short description about the plan"
                    defaultValue={testPlan?.description}
                    required
                />

                <div className="grid grid-cols-2 gap-3">
                    <GeneralInput
                        label="Price"
                        labelVariant="small"
                        type="number"
                        min={0}
                        placeholder="₱0.00"
                        required
                        defaultValue={testPlan?.price}
                    />
                    <GeneralInput
                        label="Duration"
                        labelVariant="small"
                        type="number"
                        min={1}
                        placeholder="Number of days"
                        required
                        defaultValue={testPlan?.durationDays}
                    />
                </div>

                <GeneralInput
                    label="Base Account Limit"
                    labelVariant="small"
                    required
                    type="number"
                    min={0}
                    placeholder="100"
                />

                <GeneralInput
                    label="Number of Branches"
                    labelVariant="small"
                    required
                    type="number"
                    min={0}
                    placeholder="5"
                />

                <div className="flex gap-2">
                    <Button onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button className="flex-1" size="normal">
                        Save
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

export function PlansDeletePopup() {
    // Used for redirecting
    const useNavigate = useNavigatePage();

    // When triggered, returns the page to the root (exiting the popup)
    const handleClose = () => useNavigate(ROUTES.SUPER_ADMIN.plans);

    return (
        <PopUp title="Delete Offer" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <Text>Are you sure you want to delete this subscription plan?</Text>
                <div className="flex gap-2">
                    <Button onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button className="flex-1" size="normal">
                        Delete
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}
