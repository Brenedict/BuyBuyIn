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
import { AccountStatusType } from "@buybuyin/shared/prisma/enums";

// Components
import { EditManageButtons } from "../../components/partials/TablePartials";

// Icons
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

// Returns true only when the account is unverified and its verification token has actually expired.
// Brand-new accounts (with a live token) and accounts without a token do not get a resend option.
const canResendVerification = (user: RegistrationUserEntry) => {
    if (user.accountStatus !== AccountStatusType.UNVERIFIED) return false;

    if (!user.resetToken || !user.resetTokenExpiresAt) return false;

    return new Date(user.resetTokenExpiresAt) < new Date();
};

export function SuperAdmin_SubscriberAccounts() {
    const navigate = useNavigatePage();

    const subscribers = useLoaderData<RegistrationUserEntry[]>();

    const handleAdd = () => navigate(ROUTES.SUPER_ADMIN.subscriberAccountsAdd, true);
    const handleEdit = (id: string | number) => () =>
        navigate(ROUTES.SUPER_ADMIN.subscriberAccountsEdit(String(id)), true);
    const handleManage = (id: string | number) => () =>
        navigate(ROUTES.SUPER_ADMIN.subscriberAccountsManage(String(id)), true);
    const handleResend = (id: string | number) => () =>
        navigate(ROUTES.SUPER_ADMIN.subscriberAccountsResend(String(id)), true);

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
                                <Table.Header text="Status" />
                                <Table.Header text="Actions" />
                            </Table.Row>

                            {subscribers.map((sub) => (
                                <Table.Row key={sub.id}>
                                    <Table.Data size="normal" text={sub.lastName} />
                                    <Table.Data size="normal" text={sub.firstName} />
                                    <Table.Data size="normal" text={sub.email} />
                                    <Table.Data size="normal" text={sub.business?.name ?? "—"} />
                                    <Table.Data size="normal" text={sub.accountStatus} />
                                    <Table.Data>
                                        <div className="flex justify-center gap-2">
                                            <EditManageButtons
                                                id={sub.id}
                                                handleEdit={handleEdit}
                                                handleManage={handleManage}
                                            />
                                            {canResendVerification(sub) && (
                                                <Button
                                                    variant="main"
                                                    size="smallest"
                                                    leftIcon={SendOutlinedIcon}
                                                    className="rounded-3xl! px-4!"
                                                    onClick={handleResend(sub.id)}
                                                >
                                                    Resend
                                                </Button>
                                            )}
                                        </div>
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
