// General Imports
import { Outlet, useLoaderData } from "react-router";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { PageHeader } from "../../components/PageHeader";
import Table from "../../components/Table";

// Routes
import { ROUTES } from "../../routes/Routes";

// Hooks
import useNavigatePage from "../../hooks/useNavigatePage";

// API Services
import type { RegistrationBusinessEntry } from "@buybuyin/shared/schema/registration";

export function SuperAdmin_Businesses() {
    // Used for redirecting
    const navigate = useNavigatePage();

    const businesses = useLoaderData<RegistrationBusinessEntry[]>();

    const handleAdd = () => navigate(ROUTES.SUPER_ADMIN.businessesAdd, true);

    return (
        <Card className="w-full">
            <Card.Header bordered>
                <PageHeader headerText="Businesses" />
            </Card.Header>
            <Card.Body>
                <Card isGlass={false}>
                    <Card.Header
                        toggleRightButton
                        rightButton={
                            <Button size="medium" variant="main" onClick={handleAdd}>
                                Add Business
                            </Button>
                        }
                        bordered={false}
                    >
                        <Text size="bigger" weight="extraBold" variant="crimson">
                            Businesses
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
                                <Table.Header text="Business ID" />
                                <Table.Header text="Name" />
                                <Table.Header text="Location" />
                            </Table.Row>

                            {businesses.map((business) => (
                                <Table.Row key={business.id}>
                                    <Table.Data size="normal" text={String(business.id)} />
                                    <Table.Data size="normal" text={business.name} />
                                    <Table.Data size="normal" text={business.location} />
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

export default SuperAdmin_Businesses;