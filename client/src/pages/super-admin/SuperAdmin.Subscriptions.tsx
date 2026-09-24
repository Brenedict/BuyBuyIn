// General Imports
import { useCallback, useEffect, useState, type ReactNode, type SubmitEvent } from "react";
import { createPortal } from "react-dom";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { PageHeader } from "../../components/PageHeader";
import Table from "../../components/Table";
import { EditDeleteButtons } from "../../components/TablePartials";
import GeneralInput from "../../components/inputs/GeneralInput";
import PasswordInput from "../../components/inputs/PasswordInput";

// TODO(#42): Replace with real data once the Business Subscription API/endpoint is available.
// Shape is a guess based on the design (Business Subscription ID, Business, Subscription Status)
// and should be confirmed against the actual Prisma schema / API response before wiring up fetch logic.
interface BusinessSubscriptionRow {
    id: string;
    businessSubscriptionLabel: string;
    businessLabel: string;
    statusLabel: string;
}

const MOCK_SUBSCRIPTIONS: BusinessSubscriptionRow[] = Array.from({ length: 30 }, (_, i) => ({
    id: `mock-${i}`,
    businessSubscriptionLabel: "Santos, Maria",
    businessLabel: "Santos, Maria",
    statusLabel: "Santos, Maria",
}));

// TODO(#42): Fields follow the Figma popup (Business Subscription ID, Username, Password).
// Confirm with the team, since Username/Password look copied from Subscriber Accounts.
interface SubscriptionForm {
    subscriptionId: string;
    username: string;
    password: string;
}

type ModalState =
    | { type: "none" }
    | { type: "add" }
    | { type: "edit"; row: BusinessSubscriptionRow }
    | { type: "delete"; row: BusinessSubscriptionRow };

// TODO(#42): Local popup shell (same approach as the Plans page). Replace with the shared popup once the team picks one.
function Popup({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);

        // Lock page scroll while the popup is open
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    // Portal to <body> so parent overflow/transform can't clip or offset the popup
    return createPortal(
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <section
                role="dialog"
                aria-modal="true"
                className="w-[904px] max-w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <Card className="bg-[#FEFCED]!">
                    <Card.Header
                        className="bg-crimson py-6!"
                        toggleRightButton
                        rightButton={
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={onClose}
                                className="self-start rounded-[10px] border border-cream/60 px-2 text-cream hover:cursor-pointer"
                            >
                                ✕
                            </button>
                        }
                    >
                        <span className="font-['Inter',sans-serif] text-[20.99px] font-medium text-cream">{title}</span>
                    </Card.Header>
                    <Card.Body className="px-10! py-8!">{children}</Card.Body>
                </Card>
            </section>
        </div>,
        document.body
    );
}

function SubscriptionFormPopup({
    mode,
    initial,
    onClose,
    onSave,
}: {
    mode: "add" | "edit";
    initial: SubscriptionForm;
    onClose: () => void;
    onSave: (form: SubscriptionForm) => void;
}) {
    const [form, setForm] = useState<SubscriptionForm>(initial);

    const setField = (key: keyof SubscriptionForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <Popup title={mode === "add" ? "Add Business Subscription" : "Edit Business Subscription"} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <GeneralInput
                    id="subscriptionId"
                    type="text"
                    label="Business Subscription ID"
                    placeholder="ABCD-EFGH-123"
                    className="rounded-lg! font-['Inter',sans-serif]! text-[24px]! font-medium!"
                    value={form.subscriptionId}
                    onChange={setField("subscriptionId")}
                />
                <GeneralInput
                    id="username"
                    type="text"
                    label="Username"
                    placeholder="Maria Santos"
                    className="rounded-lg! font-['Inter',sans-serif]! text-[24px]! font-medium!"
                    required
                    value={form.username}
                    onChange={setField("username")}
                />
                <PasswordInput
                    id="password"
                    label="Password"
                    placeholder="Enter password"
                    className="rounded-lg! font-['Inter',sans-serif]! text-[24px]! font-medium!"
                    required
                    value={form.password}
                    onChange={setField("password")}
                />

                <div className="grid grid-cols-2 gap-8 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="w-full" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="w-full">
                        {mode === "add" ? "Add" : "Save"}
                    </Button>
                </div>
            </form>
        </Popup>
    );
}

export function SuperAdmin_Subscriptions() {
    const [modal, setModal] = useState<ModalState>({ type: "none" });
    const closeModal = useCallback(() => setModal({ type: "none" }), []);

    const findRow = (id: string | number) => MOCK_SUBSCRIPTIONS.find((r) => r.id === String(id));

    const handleEdit = (id: string | number) => () => {
        const row = findRow(id);
        if (row) setModal({ type: "edit", row });
    };

    const handleDelete = (id: string | number) => () => {
        const row = findRow(id);
        if (row) setModal({ type: "delete", row });
    };

    // TODO(#42): Call the Business Subscription API here once it exists, then refresh the table.
    const handleSave = (form: SubscriptionForm) => {
        console.log("Save subscription", { ...form, password: "***" });
        closeModal();
    };

    const handleConfirmDelete = (id: string) => {
        console.log("Delete subscription", id);
        closeModal();
    };

    return (
        <Card className="w-full">
            <Card.Header bordered>
                <PageHeader headerText="Subscriptions" />
            </Card.Header>
            <Card.Body>
                <Card isGlass={true}>
                    <Card.Header
                        toggleRightButton
                        rightButton={
                            <Button size="medium" variant="main" onClick={() => setModal({ type: "add" })}>
                                Add Business Subscription
                            </Button>
                        }
                        bordered={false}
                    >
                        <Text size="bigger" weight="extraBold" variant="crimson">
                            Subscriptions
                        </Text>
                    </Card.Header>
                    <Card.Body>
                        <Table
                            bordered
                            rounded
                            shadow
                            pagination={{
                                bgVariant: "cream-muted",
                                borderVariant: "brown",
                                borderedTop: true,
                                maxItems: 6,
                                textSize: "description",
                                textVariant: "crimson",
                                textWeight: "medium",
                            }}
                        >
                            <Table.Row borderedBottom>
                                <Table.Header text="Business Subscription ID" />
                                <Table.Header text="Business" />
                                <Table.Header text="Subscription Status" />
                                <Table.Header text="Actions" />
                            </Table.Row>

                            {MOCK_SUBSCRIPTIONS.map((row) => (
                                <Table.Row key={row.id}>
                                    <Table.Data size="normal" text={row.businessSubscriptionLabel} />
                                    <Table.Data size="normal" text={row.businessLabel} />
                                    <Table.Data size="normal" text={row.statusLabel} />
                                    <Table.Data>
                                        <EditDeleteButtons id={row.id} handleEdit={handleEdit} handleDelete={handleDelete} />
                                    </Table.Data>
                                </Table.Row>
                            ))}
                        </Table>
                    </Card.Body>
                </Card>
            </Card.Body>

            {modal.type === "add" && (
                <SubscriptionFormPopup
                    mode="add"
                    initial={{ subscriptionId: "", username: "", password: "" }}
                    onClose={closeModal}
                    onSave={handleSave}
                />
            )}

            {modal.type === "edit" && (
                <SubscriptionFormPopup
                    mode="edit"
                    initial={{
                        subscriptionId: modal.row.businessSubscriptionLabel,
                        username: modal.row.businessLabel,
                        password: "",
                    }}
                    onClose={closeModal}
                    onSave={handleSave}
                />
            )}

            {modal.type === "delete" && (
                <Popup title="Delete Business Subscription" onClose={closeModal}>
                    <div className="flex min-h-[300px] flex-col justify-between gap-8">
                        <div className="flex flex-1 items-center justify-center text-center">
                            <Text>Are you sure you want to delete this subscription?</Text>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <Button type="button" variant="secondary" size="normal" className="w-full" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="main"
                                size="normal"
                                className="w-full"
                                onClick={() => handleConfirmDelete(modal.row.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </Popup>
            )}
        </Card>
    );
}

export default SuperAdmin_Subscriptions;
