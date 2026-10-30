// Components
import { PopUp } from "../../PopUp";
import { Text } from "../../Text";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";
import SelectInput from "../../inputs/SelectInput";

// Test Data
import { MOCK_BRANCHES, MOCK_BRANCH_MANAGERS } from "../../../TESTINGDATA/hqAdminManageAccountsData";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";
import { useState, type SubmitEvent, type ChangeEvent } from "react";
import { Form, useLoaderData, useParams } from "react-router";
import { ROUTES } from "../../../routes/Routes";

// API Services
import type {
    RegistrationBranchEntry,
    RegistrationBusinessEntry,
} from "@buybuyin/shared/schema/registration";

/* BRANCH POPUPS */
export function BranchFormPopup({ mode }: { mode: "add" | "edit" }) {
    const { id } = useParams();
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.HQ_ADMIN.manageUsers, true);
    const existing = MOCK_BRANCHES.find((row) => String(row.id) === String(id));
    const [form, setForm] = useState({
        location: existing?.location ?? "",
        accountLimit: existing?.accountLimit ? String(existing.accountLimit) : "",
    });

    const businesses = useLoaderData<RegistrationBusinessEntry[]>();

    const businessOptions = Object.fromEntries(businesses.map((business) => [business.name, String(business.id)]));
    const defaultBusinessId = businesses[0] ? String(businesses[0].id) : "";

    const setField = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleClose();
    };

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
                    <SelectInput
                        id="business"
                        name="businessId"
                        label="Business"
                        labelVariant="small"
                        options={businessOptions}
                        defaultValue={defaultBusinessId}
                        className="rounded-2xl border border-black-400 overflow-hidden"
                    />

                    <FormActionButtons mode="add" isReadOnly={false} handleClose={handleClose} />
                </Form>
            </PopUp>
        );
    }

    return (
        <PopUp title="Edit Branch" handleCloseProp={handleClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            </form>
        </PopUp>
    );
}

export function DeleteBranchPopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.HQ_ADMIN.manageUsers, true);

    return (
        <PopUp title="Delete Branch" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <Text align="center">Are you sure you want to delete this branch? This action cannot be undone.</Text>
                <div className="flex gap-2 pt-4">
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

/* BRANCH MANAGER POPUPS */
export function BranchManagerFormPopup({ mode }: { mode: "add" | "edit" | "view" }) {
    const { id } = useParams();
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.HQ_ADMIN.manageUsers, true);
    const existing = MOCK_BRANCH_MANAGERS.find((row) => String(row.id) === String(id));
    const isReadOnly = mode === "view";
    const [form, setForm] = useState({
        firstName: existing?.firstName ?? "",
        lastName: existing?.lastName ?? "",
        username: existing?.username ?? "",
        email: existing?.email ?? "",
        location: existing?.location ?? "Manila North",
    });

    const setField = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleClose();
    };

    if (mode === "add") {
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

                    <BranchAssignmentSelect />

                    <FormActionButtons mode="add" isReadOnly={false} handleClose={handleClose} />
                </Form>
            </PopUp>
        );
    }

    return (
        <PopUp
            title={mode === "edit" ? "Edit Manager" : "View Manager"}
            handleCloseProp={handleClose}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <ManagerFormFields form={form} setField={setField} isReadOnly={isReadOnly} />

                <FormActionButtons mode={mode} isReadOnly={isReadOnly} handleClose={handleClose} />
            </form>
        </PopUp>
    );
}

/* SUB-COMPONENTS */
function ManagerFormFields({ form, setField, isReadOnly }: any) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3">
                <GeneralInput
                    id="firstName"
                    name="firstName"
                    type="text"
                    label="First Name"
                    labelVariant="small"
                    required
                    disabled={isReadOnly}
                    value={form.firstName}
                    onChange={setField("firstName")}
                />
                <GeneralInput
                    id="lastName"
                    name="lastName"
                    type="text"
                    label="Last Name"
                    labelVariant="small"
                    required
                    disabled={isReadOnly}
                    value={form.lastName}
                    onChange={setField("lastName")}
                />
            </div>

            <GeneralInput
                id="username"
                name="username"
                type="text"
                label="Username"
                labelVariant="small"
                required
                disabled={isReadOnly}
                value={form.username}
                onChange={setField("username")}
            />

            <GeneralInput
                id="email"
                name="email"
                type="email"
                label="Email"
                labelVariant="small"
                required
                disabled={isReadOnly}
                value={form.email}
                onChange={setField("email")}
            />

            <GeneralInput
                id="location"
                name="location"
                type="text"
                label="Branch Location"
                labelVariant="small"
                placeholder="Enter branch location"
                required
                disabled={isReadOnly}
                value={form.location}
                onChange={setField("location")}
            />
        </div>
    );
}

function BranchAssignmentSelect() {
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

function FormActionButtons({ mode, isReadOnly, handleClose }: any) {
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
