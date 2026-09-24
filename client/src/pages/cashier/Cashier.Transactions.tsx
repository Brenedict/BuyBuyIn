import { useState } from "react";

import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import GeneralInput from "../../components/inputs/GeneralInput";
import SelectInput from "../../components/inputs/SelectInput";

export function Cashier_Transactions() {
    const auditTotals = {
        totalSales: "125,430.00",
        totalTransactions: "248",
        totalDiscounts: "4,250.20",
        netSales: "121,180.00",
    };

    const auditRows = [
        { date: "May 01, 2025", transactions: 45, totalSales: "18,250.20", discounts: "650.00", netSales: "17,600.23" },
        { date: "May 02, 2025", transactions: 67, totalSales: "21,300.43", discounts: "788.00", netSales: "20,550.45" },
        { date: "May 03, 2025", transactions: 87, totalSales: "30,366.83", discounts: "950.00", netSales: "42,658.98" },
        {
            date: "May 04, 2025",
            transactions: 90,
            totalSales: "48,687.95",
            discounts: "1050.00",
            netSales: "20,550.43",
        },
    ];

    const rowTotal = { transactions: 258, totalSales: "125,430.00", discounts: "4,250.20", netSales: "121,180.00" };

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // issue with the selecinput, its sizing seems to be responding to its ontent, so when the field is empty by default the field looks broken/thin.
    // fix: initialized it with a valid state so its neer empty/
    const [summaryBy, setSummaryBy] = useState("closing-shift");

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    const summaryCards = [
        { label: "Total Sales", value: `₱ ${auditTotals.totalSales}` },
        { label: "Total Transactions", value: auditTotals.totalTransactions },
        { label: "Total Discounts", value: `₱ ${auditTotals.totalDiscounts}` },
        { label: "Net Sales", value: `₱ ${auditTotals.netSales}` },
    ];

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
                                            name="summaryBy"
                                            label=""
                                            disabled={false}
                                            hidden={false}
                                            defaultValue={summaryBy}
                                            onChange={(e) => setSummaryBy(e.target.value)}
                                        >
                                            <SelectInput.Option value="closing-shift">Closing Shift</SelectInput.Option>
                                            <SelectInput.Option value="day">Day</SelectInput.Option>
                                            <SelectInput.Option value="cashier">Cashier</SelectInput.Option>
                                        </SelectInput>
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
                    <Table>
                        <Table.Row borderedBottom>
                            <Table.Header text="Date" />
                            <Table.Header text="Transactions" />
                            <Table.Header text="Total Sales" />
                            <Table.Header text="Discounts" />
                            <Table.Header text="Net Sales" />
                        </Table.Row>

                        {auditRows.map((row) => (
                            <Table.Row key={row.date}>
                                <Table.Data text={row.date} />
                                <Table.Data text={String(row.transactions)} />
                                <Table.Data text={`₱ ${row.totalSales}`} />
                                <Table.Data text={`₱ ${row.discounts}`} />
                                <Table.Data text={`₱ ${row.netSales}`} />
                            </Table.Row>
                        ))}

                        <Table.Row>
                            <Table.Data weight="extraBold" size="medium" text="TOTAL" />
                            <Table.Data weight="extraBold" size="medium" text={String(rowTotal.transactions)} />
                            <Table.Data weight="extraBold" size="medium" text={`₱ ${rowTotal.totalSales}`} />
                            <Table.Data weight="extraBold" size="medium" text={`₱ ${rowTotal.discounts}`} />
                            <Table.Data weight="extraBold" size="medium" text={`₱ ${rowTotal.netSales}`} />
                        </Table.Row>
                    </Table>

                    <div className="flex flex-row justify-between items-center pt-4">
                        <Text weight="regular" size="small" variant="brown">
                            Showing 1 to 6 of 42 Sales
                        </Text>

                        <div className="flex flex-row gap-2 items-center">
                            <Button
                                variant="main"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === currentPage ? "main" : "secondary"}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}

                            <Button variant="main" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                                Next
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Cashier_Transactions;
