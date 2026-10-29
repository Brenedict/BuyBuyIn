// General Import
import { Outlet } from "react-router";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import { EditDeleteButtons } from "../../components/partials/TablePartials";

// Test Data
import { SAMPLE_SUBSCRIBERS_DATA } from "../../TESTINGDATA/subscribersData";

// Hooks & Routes
import useNavigatePage from "../../hooks/useNavigatePage";
import { ROUTES } from "../../routes/Routes";

export function SuperAdmin_SubscriberAccounts() {
    const navigate = useNavigatePage();

    const handleAdd = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccountsAdd, true);
    const handleEdit = (id: string | number) => () =>
        navigate(ROUTES.SUPER_ADMIN.subscriberAccountsEdit(String(id)), true);
    const handleDelete = (id: string | number) => () =>
        navigate(ROUTES.SUPER_ADMIN.subscriberAccountsDelete(String(id)), true);

    return (
        <Card className="w-full">
            <Card.Body className="flex flex-col gap-10">
                <div className="flex flex-col gap-2 border-b border-gray-300 pb-4">
                    <Text weight="extraBold" size="large" variant="crimson">
                        Subscriber Account
                    </Text>
                </div>

                <Card isGlass={false}>
                    <Card.Header
                        toggleRightButton
                        rightButton={
                            <Button
                                variant="main"
                                onClick={handleAdd}
                                className="border-none outline-none ring-0 shadow-none"
                            >
                                Add Subscriber
                            </Button>
                        }
                        bordered={false}
                    >
                        <Text weight="bold" size="bigger" variant="crimson">
                            Subscriber Account
                        </Text>
                    </Card.Header>

                    <Card.Body className="flex flex-col gap-4" removePadding bordered={false}>
                        <Table pagination={{ maxItems: 8 }} rounded={false} bordered={false}>
                            <Table.Row borderedBottom>
                                <Table.Header text="Last Name" />
                                <Table.Header text="First Name" />
                                <Table.Header text="Username" />
                                <Table.Header text="Business Name" />
                                <Table.Header text="Actions" />
                            </Table.Row>

                            {SAMPLE_SUBSCRIBERS_DATA.map((sub) => (
                                <Table.Row key={sub.id}>
                                    <Table.Data size="normal" text={sub.lastName} />
                                    <Table.Data size="normal" text={sub.firstName} />
                                    <Table.Data size="normal" text={sub.username} />
                                    <Table.Data size="normal" text={sub.businessName} />
                                    <Table.Data>
                                        <EditDeleteButtons
                                            id={sub.id}
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

export default SuperAdmin_SubscriberAccounts;