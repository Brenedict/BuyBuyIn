// General Imports
import { Outlet, useLoaderData } from "react-router";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { PageHeader } from "../../components/PageHeader";
import Table from "../../components/Table";
import { EditDeleteButtons } from "../../components/partials/TablePartials";

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
    const handleEdit = (id: string | number) => () => navigate(ROUTES.SUPER_ADMIN.businessesEdit(String(id)), true);
    const handleDelete = (id: string | number) => () => navigate(ROUTES.SUPER_ADMIN.businessesDelete(String(id)), true);

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
                                <Table.Header text="Actions" />
                            </Table.Row>

                            {businesses.map((business) => (
                                <Table.Row key={business.id}>
                                    <Table.Data size="normal" text={String(business.id)} />
                                    <Table.Data size="normal" text={business.name} />
                                    <Table.Data size="normal" text={business.location} />
                                    <Table.Data>
                                        <EditDeleteButtons
                                            id={business.id}
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

export default SuperAdmin_Businesses;