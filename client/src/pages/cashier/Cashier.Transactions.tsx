import { useState } from "react";

import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import GeneralInput from "../../components/inputs/GeneralInput";
import SelectInput from "../../components/inputs/SelectInput";
import { TABLE_CASHIER_TRANSACTIONS } from "../../TESTINGDATA/cashierTransactionData";
import { Outlet } from "react-router";

export function Cashier_Transactions() {
    const auditTotals = {
        totalSales: "125,430.00",
        totalTransactions: "248",
        totalDiscounts: "4,250.20",
        netSales: "121,180.00",
    };

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [summaryBy, setSummaryBy] = useState("closing-shift");

    const summaryCards = [
        { label: "Total Sales", value: `₱ ${auditTotals.totalSales}` },
        { label: "Total Transactions", value: auditTotals.totalTransactions },
        { label: "Total Discounts", value: `₱ ${auditTotals.totalDiscounts}` },
        { label: "Net Sales", value: `₱ ${auditTotals.netSales}` },
    ];

    const filterOptions = {
        "Closing Shift": "closing-shift",
        Day: "day",
        Cashier: "cashier",
    };

    const handleView = () => {
        console.log("View clicked", { dateFrom, dateTo, summaryBy });
    };

    return (
        <div className="flex flex-col gap-6">
            <Card className="p-6 !overflow-visible relative z-50">
                <Card.Header className="flex flex-col gap-1">
                    <Text weight="extraBold" size="bigger" variant="crimson">
                        Sales Summary
                    </Text>
                    <Text weight="regular" size="medium" variant="black">
                        View total sales at any point in time.
                    </Text>
                </Card.Header>

                <Card.Body className="!overflow-visible">
                    <Card className="p-6 bg-off-white !overflow-visible" isGlass={false} dropShadow={false}>
                        <Card.Body className="flex flex-col gap-4 !overflow-visible">
                            <div className="flex flex-col gap-2">
                                <Text weight="bold" size="medium" variant="black">
                                    Date Range
                                </Text>
                                <div className="flex flex-row items-center gap-4">
                                    <div className="flex-1 min-w-0 flex [&>*]:flex-1 [&>*]:w-full [&>*]:overflow-hidden">
                                        <GeneralInput
                                            type="date"
                                            placeholder="MM/DD/YYYY"
                                            defaultValue={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                        />
                                    </div>
                                    <Text weight="regular" size="medium" variant="black">
                                        to
                                    </Text>
                                    <div className="flex-1 min-w-0 flex [&>*]:flex-1 [&>*]:w-full [&>*]:overflow-hidden">
                                        <GeneralInput
                                            type="date"
                                            placeholder="MM/DD/YYYY"
                                            defaultValue={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Text weight="bold" size="medium" variant="black">
                                    Summary By
                                </Text>
                                <div className="flex flex-row items-center gap-4">
                                    <div className="flex-1 min-w-0 flex [&>*]:flex-1 [&>*]:w-full">
                                        <SelectInput
                                            id="summaryBy"
                                            options={filterOptions}
                                            name="summaryBy"
                                            label=""
                                            disabled={false}
                                            hidden={false}
                                            defaultValue={summaryBy}
                                            onChange={(e) => setSummaryBy(e.target.value)}
                                        ></SelectInput>
                                    </div>
                                    <Button variant="main" onClick={handleView} className="shrink-0">
                                        VIEW
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Card.Body>
            </Card>

            <Card className="p-6 relative z-10">
                <Card.Header className="flex flex-col gap-1">
                    <Text weight="extraBold" size="bigger" variant="crimson">
                        Audit Summary
                    </Text>
                    <Text weight="regular" size="medium" variant="black">
                        Summary of Totals
                    </Text>
                </Card.Header>

                <Card.Body>
                    <div className="flex flex-row gap-4 justify-between">
                        {summaryCards.map((card) => (
                            <Card
                                key={card.label}
                                className="p-4 bg-off-white flex-1"
                                isGlass={false}
                                dropShadow={false}
                            >
                                <Card.Body className="flex flex-col items-center gap-2">
                                    <Text weight="regular" size="medium" variant="crimson">
                                        {card.label}
                                    </Text>
                                    <Text weight="extraBold" size="bigger" variant="crimson">
                                        {card.value}
                                    </Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Card.Body>

                <Card.Body>
                    <Table
                        pagination={{
                            maxItems: 6,
                        }}
                    >
                        <Table.Row borderedBottom>
                            <Table.Header text="Date" />
                            <Table.Header text="Transactions" />
                            <Table.Header text="Total Sales" />
                            <Table.Header text="Discounts" />
                            <Table.Header text="Net Sales" />
                        </Table.Row>

                        {TABLE_CASHIER_TRANSACTIONS.map((row) => (
                            <Table.Row key={row.date}>
                                <Table.Data text={row.date} />
                                <Table.Data text={String(row.transactions)} />
                                <Table.Data text={`₱ ${row.totalSales}`} />
                                <Table.Data text={`₱ ${row.discounts}`} />
                                <Table.Data text={`₱ ${row.netSales}`} />
                            </Table.Row>
                        ))}
                    </Table>
                </Card.Body>
                {
                    // Displays all global and page popups
                    <Outlet />
                }
            </Card>
        </div>
    );
}

export default Cashier_Transactions;
