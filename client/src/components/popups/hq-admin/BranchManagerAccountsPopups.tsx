// Components
import { PopUp } from "../../PopUp";
import { Text } from "../../Text";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";
import SelectInput from "../../inputs/SelectInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";
import { useState, type ChangeEvent } from "react";
import { Form, useLoaderData } from "react-router";
import { ROUTES } from "../../../routes/Routes";

// API Services
import type { RegistrationBranchEntry, DeleteContextData } from "@buybuyin/shared/schema/registration";
import type { ManagerFormLoaderData } from "../../../api/registrationService";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

/* BRANCH POPUPS */
export function BranchFormPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.HQ_ADMIN.manageUsers, true);

    const loadData = useLoaderData();
    const branch = mode === "edit" ? (loadData as RegistrationBranchEntry | null) : null;
    const [form, setForm] = useState({
        location: branch?.location ?? "",
        accountLimit: branch?.accountLimit ? String(branch.accountLimit) : "",
    });

    const setField = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    if (mode === "edit" && !branch) {
        return (
            <PopUp title="Branch Not Found" handleCloseProp={handleClose}>
                <Text>The branch you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    if (mode === "add") {
        return (
            <PopUp title="Add Branch" handleCloseProp={handleClose}>
                <Form method="post" className="flex flex-col gap-4">
                    <GeneralInput
                        id="location"
                        name="location"
                        type="text"
                        label="Location"
                        labelVariant="small"
                        placeholder="Enter branch location"
                        required
                    />
                    <GeneralInput
                        id="accountLimit"
                        name="accountLimit"
                        type="number"
                        min={1}
                        label="Account Limit"
                        labelVariant="small"
                        placeholder="Enter account limit"
                        required
                    />

                    <FormActionButtons mode="add" isReadOnly={false} handleClose={handleClose} />
                </Form>
            </PopUp>
        );
    }

    return (
        <PopUp title="Edit Branch" subtitle="Update the branch details below" handleCloseProp={handleClose}>
            <Form method="post" className="flex flex-col gap-4">
                <GeneralInput
                    id="location"
                    name="location"
                    type="text"
                    label="Location"
                    labelVariant="small"
                    placeholder="Enter branch location"
                    required
                    value={form.location}
                    onChange={setField("location")}
                />
                <GeneralInput
                    id="accountLimit"
                    name="accountLimit"
                    type="number"
                    min={1}
                    label="Account Limit"
                    labelVariant="small"
                    placeholder="Enter account limit"
                    required
                    value={form.accountLimit}
                    onChange={setField("accountLimit")}
                />

                <FormActionButtons mode="edit" isReadOnly={false} handleClose={handleClose} />
            </Form>
        </PopUp>
    );
}

export function DeleteBranchPopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.HQ_ADMIN.manageUsers, true);

    const branch = useLoaderData<RegistrationBranchEntry | null>();
    const branchLocation = branch?.location ?? "this branch";
    const formId = "branchDeleteForm";

    return (
        <PopUp title="Delete Branch" subtitle="This action cannot be undone" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <div className="w-fit rounded-full bg-cream px-4 py-1.5">
                        <Text size="normal" weight="bold" variant="brown">
                            {branchLocation}
                        </Text>
                    </div>
                </div>

                <Text>
                    Are you sure you want to delete <span className="font-bold">{branchLocation}</span>? This action
                    cannot be undone.
                </Text>

                <div className="flex items-start gap-3 rounded-2xl bg-crimson-muted p-3">
                    <WarningAmberOutlinedIcon className="text-crimson" fontSize="small" />
                    <Text size="description" weight="medium" variant="crimson">
                        The branch's inventory and its linked offers will also be deleted. Users and transactions
                        attached to this branch will be kept but will no longer be assigned to it.
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

/* BRANCH MANAGER POPUPS */
export function BranchManagerFormPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.HQ_ADMIN.manageUsers, true);

    // Add route loads branches (array); edit route loads { manager, branches }.
    const loadData = useLoaderData();

    if (mode === "add") {
        const branches = loadData as RegistrationBranchEntry[];

        return (
            <PopUp title="Add Manager" handleCloseProp={handleClose}>
                <Form method="post" className="flex flex-col gap-4">
                    <div className="flex gap-3">
                        <GeneralInput
                            id="firstName"
                            name="firstName"
                            type="text"
                            label="First Name"
                            labelVariant="small"
                            required
                        />
                        <GeneralInput
                            id="lastName"
                            name="lastName"
                            type="text"
                            label="Last Name"
                            labelVariant="small"
                            required
                        />
                    </div>

                    <GeneralInput
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        labelVariant="small"
                        required
                    />

                    <BranchAssignmentSelect branches={branches} />

                    <FormActionButtons mode="add" isReadOnly={false} handleClose={handleClose} />
                </Form>
            </PopUp>
        );
    }

    const { manager, branches } = loadData as ManagerFormLoaderData;

    if (!manager) {
        return (
            <PopUp title="Manager Not Found" handleCloseProp={handleClose}>
                <Text>The manager account you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const branchOptions = Object.fromEntries(branches.map((branch) => [branch.location, String(branch.id)]));
    const defaultBranchId = manager?.branchId ? String(manager.branchId) : "";

    return (
        <PopUp title="Edit Manager" subtitle="Update the manager's details below" handleCloseProp={handleClose}>
            <Form method="post" className="flex flex-col gap-4">
                <div className="flex gap-3">
                    <GeneralInput
                        id="firstName"
                        name="firstName"
                        type="text"
                        label="First Name"
                        labelVariant="small"
                        defaultValue={manager.firstName}
                        required
                    />
                    <GeneralInput
                        id="lastName"
                        name="lastName"
                        type="text"
                        label="Last Name"
                        labelVariant="small"
                        defaultValue={manager.lastName}
                        required
                    />
                </div>

                <GeneralInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    labelVariant="small"
                    defaultValue={manager.email}
                    required
                />

                <div
                    className="flex flex-col gap-1 cursor-pointer [&_*]:cursor-pointer [&_*]:font-normal"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <SelectInput
                        id="branch"
                        name="branchId"
                        label="Branch"
                        labelVariant="small"
                        options={branchOptions}
                        defaultValue={defaultBranchId}
                        className="rounded-2xl border border-black-400 overflow-hidden"
                    />
                </div>

                <FormActionButtons mode="edit" isReadOnly={false} handleClose={handleClose} />
            </Form>
        </PopUp>
    );
}

export function ManagerDeletePopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.HQ_ADMIN.manageUsers, true);

    const context = useLoaderData<DeleteContextData>();

    if (!context?.account) {
        return (
            <PopUp title="Manager Not Found" handleCloseProp={handleClose}>
                <Text>The manager account you are looking for no longer exists.</Text>
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
    const branchLocation = account.branch?.location ?? "the branch";
    const formId = "managerDeleteForm";

    return (
        <PopUp title="Delete Manager" subtitle="This action cannot be undone" size="md" handleCloseProp={handleClose}>
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
                            After deletion, <span className="font-bold">{remainingCount}</span> other manager
                            account(s) will remain linked to <span className="font-bold">{branchLocation}</span>.
                        </Text>
                    </div>
                ) : (
                    <div className="flex items-start gap-3 rounded-2xl bg-crimson-muted p-3">
                        <WarningAmberOutlinedIcon className="text-crimson" fontSize="small" />
                        <Text size="description" weight="medium" variant="crimson">
                            This is the last manager linked to <span className="font-bold">{branchLocation}</span>.
                            After deletion, no accounts will be linked to this branch.
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

/* SUB-COMPONENTS */
function BranchAssignmentSelect({ branches }: { branches: RegistrationBranchEntry[] }) {
    const branchOptions = Object.fromEntries(branches.map((branch) => [branch.location, String(branch.id)]));
    const defaultBranchId = branches[0] ? String(branches[0].id) : "";
    const defaultBusinessId = branches[0]?.businessId ? String(branches[0].businessId) : "";
    const [businessId, setBusinessId] = useState(defaultBusinessId);

    const handleBranchChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const branch = branches.find((b) => String(b.id) === e.target.value);
        setBusinessId(branch?.businessId ? String(branch.businessId) : "");
    };

    return (
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
    );
}

function FormActionButtons({
    mode,
    isReadOnly,
    handleClose,
}: {
    mode: "add" | "edit";
    isReadOnly: boolean;
    handleClose: () => void;
}) {
    return (
        <div className="flex gap-2 pt-4">
            <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                {isReadOnly ? "Close" : "Cancel"}
            </Button>
            {!isReadOnly && (
                <Button type="submit" variant="main" size="normal" className="flex-1">
                    {mode === "add" ? "Add" : "Save"}
                </Button>
            )}
        </div>
    );
}
