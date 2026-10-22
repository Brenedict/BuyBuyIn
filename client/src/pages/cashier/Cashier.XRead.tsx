import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import GeneralInput from "../../components/inputs/GeneralInput";
import { Outlet } from "react-router";
import { SearchInput } from "../../components/Input";
import SelectInput from "../../components/inputs/SelectInput";
import Table from "../../components/Table";

//Mock Data
import { TABLE_XREAD } from "../../TESTINGDATA/xreadData";

import { TableFilterWrapper } from "../../components/partials/TablePartials";

function Date_Section() {
    const paymentMethods = { option1: "Cash", option2: "Card", option3: "E-Cash" };

    return (
        <TableFilterWrapper>
            {/* Top Row: Date Range */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto] gap-6 items-end">
                <GeneralInput label="Date Range" type="date" />

                <div className="flex items-center justify-center pb-3 px-2">
                    <Text size="medium" weight="medium">
                        TO
                    </Text>
                </div>

                <GeneralInput type="date" label=" " />

                <Button variant="secondary" size="medium" className="min-w-[140px]">
                    VIEW
                </Button>
            </div>

            {/* Bottom Row: Search & Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto] gap-6 items-end">
                <SearchInput label="Search" className="bg-cream" />

                <div className="invisible hidden lg:block px-2">
                    <Text size="medium">TO</Text>
                </div>

                <SelectInput
                    label="Payment Methods"
                    name="paymentMethods"
                    options={paymentMethods}
                    defaultValue={paymentMethods.option1}
                />

                <Button size="medium" className="min-w-[140px]">
                    Print
                </Button>
            </div>
        </TableFilterWrapper>
    );
}

function XREAD_Table() {
    return (
        <Card>
            <Card.Header>
                <Text size="big" variant="crimson" weight="extraBold">
                    Reference Table
                </Text>
            </Card.Header>
            <Card.Body removePadding bordered={false}>
                <Table
                    bordered={false}
                    pagination={{
                        bgVariant: "cream-muted",
                        borderVariant: "brown",
                        borderedTop: true,
                        maxItems: 6,
                        textSize: "description",
                        textVariant: "crimson",
                        textWeight: "medium",
                    }}
                    pageKey="employee_page"
                    rounded={false}
                    shadow
                >
                    <Table.Row borderedBottom>
                        <Table.Header text="Date" />
                        <Table.Header text="Time" />
                        <Table.Header text="Receipt No." />
                        <Table.Header text="Reference No." />
                        <Table.Header text="Payment Method" />
                        <Table.Header text="Amount" />
                    </Table.Row>
                    {TABLE_XREAD.map((entry, index) => (
                        <Table.Row key={index}>
                            <Table.Data text={entry.date} />
                            <Table.Data text={entry.time} />
                            <Table.Data text={entry.receiptNo} />
                            <Table.Data text={entry.refNo} />
                            <Table.Data text={entry.paymentMethod} />

                            <Table.Data text={"₱ " + entry.amount} />
                        </Table.Row>
                    ))}
                </Table>
            </Card.Body>
        </Card>
    );
}

export function Cashier_XRead() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <div className="flex flex-row justify-between items-center">
                    <Text size="bigger" variant="crimson" weight="bold">
                        X-Read
                    </Text>
                    <Button variant="main" size="medium">
                        End Shift
                    </Button>
                </div>
            </Card.Body>
            <Card.Body className="flex flex-col gap-[2.7rem]">
                <Date_Section></Date_Section>
                <XREAD_Table></XREAD_Table>
            </Card.Body>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </Card>
    );
}

export default Cashier_XRead;
