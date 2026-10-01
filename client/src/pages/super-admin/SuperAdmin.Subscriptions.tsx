// General Imports
import { Outlet } from "react-router";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { PageHeader } from "../../components/PageHeader";
import Table from "../../components/Table";
import { EditDeleteButtons } from "../../components/partials/TablePartials";

// Test Data
import { SAMPLE_BUSINESS_SUBSCRIPTIONS } from "../../TESTINGDATA/subscriptionsData";

// Routes
import { ROUTES } from "../../routes/Routes";

// Hooks
import useNavigatePage from "../../hooks/useNavigatePage";

export function SuperAdmin_Subscriptions() {
    // Used for redirecting
    const navigate = useNavigatePage();

    const handleAdd = () => navigate(ROUTES.SUPER_ADMIN.subscriptionsAdd, true);

    const handleEdit = (id: string | number) => () => navigate(ROUTES.SUPER_ADMIN.subscriptionsEdit(String(id)), true);

    const handleDelete = (id: string | number) => () =>
        navigate(ROUTES.SUPER_ADMIN.subscriptionsDelete(String(id)), true);

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
                            <Button size="medium" variant="main" onClick={handleAdd}>
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

                            {SAMPLE_BUSINESS_SUBSCRIPTIONS.map((row) => (
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

            <Outlet />
        </Card>
    );
}

export default SuperAdmin_Subscriptions;
