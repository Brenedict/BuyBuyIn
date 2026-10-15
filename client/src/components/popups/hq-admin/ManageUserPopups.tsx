// Components
import { PopUp } from "../../PopUp";
import { Text } from "../../Text";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";

// Test Data
import { MOCK_BRANCHES, MOCK_BRANCH_MANAGERS } from "../../../TESTINGDATA/hqAdminManageAccountsData";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";
import { useState, type SubmitEvent, type ChangeEvent } from "react";
import { useParams } from "react-router";
import { ROUTES } from "../../../routes/Routes";

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

    const setField = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleClose();
    };

    return (
        <PopUp title={mode === "add" ? "Add Branch" : "Edit Branch"} handleCloseProp={handleClose}>
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

                <FormActionButtons mode={mode} isReadOnly={false} handleClose={handleClose} />
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

    return (
        <PopUp
            title={mode === "add" ? "Add Manager" : mode === "edit" ? "Edit Manager" : "View Manager"}
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
