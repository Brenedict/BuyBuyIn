// General Import
import { Outlet, useLoaderData } from "react-router";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";

// Hooks & Routes
import useNavigatePage from "../../hooks/useNavigatePage";
import { ROUTES } from "../../routes/Routes";

// API Services
import type { RegistrationUserEntry } from "@buybuyin/shared/schema/registration";

export function SuperAdmin_SubscriberAccounts() {
    const navigate = useNavigatePage();

    const subscribers = useLoaderData<RegistrationUserEntry[]>();

    const handleAdd = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccountsAdd, true);

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
                                <Table.Header text="Email" />
                                <Table.Header text="Business Name" />
                            </Table.Row>

                            {subscribers.map((sub) => (
                                <Table.Row key={sub.id}>
                                    <Table.Data size="normal" text={sub.lastName} />
                                    <Table.Data size="normal" text={sub.firstName} />
                                    <Table.Data size="normal" text={sub.email} />
                                    <Table.Data size="normal" text={sub.business?.name ?? "—"} />
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