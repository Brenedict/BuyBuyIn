// General Imports
import { useCallback, useState } from "react";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { PageHeader } from "../../components/PageHeader";
import Table from "../../components/Table";
import { EditDeleteButtons } from "../../components/partials/TablePartials";
import {
    DeleteSubscriptionPopup,
    SubscriptionFormPopup,
    type SubscriptionForm,
} from "../../components/popups/super-admin/SubscriptionsPopups";

// Test Data
import { SAMPLE_BUSINESS_SUBSCRIPTIONS } from "../../TESTINGDATA/subscriptionsData";

// TODO(#42): Replace with real data once the Business Subscription API/endpoint is available.
// Shape is a guess based on the design (Business Subscription ID, Business, Subscription Status)
// and should be confirmed against the actual Prisma schema / API response before wiring up fetch logic.
interface BusinessSubscriptionRow {
    id: string | number;
    businessSubscriptionLabel: string;
    businessLabel: string;
    statusLabel: string;
}

type ModalState =
    | { type: "none" }
    | { type: "add" }
    | { type: "edit"; row: BusinessSubscriptionRow }
    | { type: "delete"; row: BusinessSubscriptionRow };

export function SuperAdmin_Subscriptions() {
    const [modal, setModal] = useState<ModalState>({ type: "none" });
    const [rows, setRows] = useState<BusinessSubscriptionRow[]>(SAMPLE_BUSINESS_SUBSCRIPTIONS);
    const closeModal = useCallback(() => setModal({ type: "none" }), []);

    const findRow = (id: string | number) => rows.find((r) => String(r.id) === String(id));

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
        if (modal.type === "edit") {
            const editedId = modal.row.id;
            setRows((prev) =>
                prev.map((r) =>
                    String(r.id) === String(editedId)
                        ? { ...r, businessSubscriptionLabel: form.subscriptionId, businessLabel: form.username }
                        : r
                )
            );
        } else if (modal.type === "add") {
            setRows((prev) => [
                {
                    id: `local-${Date.now()}`,
                    businessSubscriptionLabel: form.subscriptionId,
                    businessLabel: form.username,
                    statusLabel: "Active",
                },
                ...prev,
            ]);
        }
        closeModal();
    };

    const handleConfirmDelete = (id: BusinessSubscriptionRow["id"]) => {
        setRows((prev) => prev.filter((r) => String(r.id) !== String(id)));
        closeModal();
    };

    return (
        <Card className="w-full">
            <Card.Header bordered>
                <PageHeader headerText="Subscriptions" />
            </Card.Header>
            <Card.Body>
                <Card isGlass={false}>
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
                    <Card.Body removePadding bordered={false}>
                        <Table
                            bordered={false}
                            rounded={false}
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

                            {rows.map((row) => (
                                <Table.Row key={row.id}>
                                    <Table.Data size="normal" text={row.businessSubscriptionLabel} />
                                    <Table.Data size="normal" text={row.businessLabel} />
                                    <Table.Data size="normal" text={row.statusLabel} />
                                    <Table.Data>
                                        <EditDeleteButtons
                                            id={row.id}
                                            handleEdit={handleEdit}
                                            handleDelete={handleDelete}
                                        />
                                    </Table.Data>
                                </Table.Row>
                            ))}
                        </Table>
                    </Card.Body>
                </Card>
            </Card.Body>

            {modal.type === "add" && <SubscriptionFormPopup mode="add" onClose={closeModal} onSave={handleSave} />}

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
                <DeleteSubscriptionPopup onClose={closeModal} onConfirm={() => handleConfirmDelete(modal.row.id)} />
            )}
        </Card>
    );
}

export default SuperAdmin_Subscriptions;
