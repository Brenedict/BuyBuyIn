// General Imports
import { useState } from "react";
import { Outlet } from "react-router";

// Components
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { SearchInput, SelectInput } from "../../components/Input"; 
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import Icon from "../../components/Icon";

// Mock Data
import { SAMPLE_TRANSACTIONS } from "../../TESTINGDATA/manageTransactionsData";

// Icons
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

// Utility formatting
export function NumberFormat(value: number, symbol?: string) {
    return `${symbol ?? ""}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// SUB COMPONENTS
interface StatCardsProps {
    transactions: typeof SAMPLE_TRANSACTIONS;
}

function StatCardsSection({ transactions }: StatCardsProps) {
    const revenue = 123456;
    const avgOrderValue = 123456;
    const totalOrders = 4321;
    const totalCustomers = 1234;

    const StatCard = ({
        title,
        value,
        isCurrency = false,
        icon,
    }: {
        title: string;
        value: number;
        isCurrency?: boolean;
        icon: any;
    }) => (
        <Card isGlass={false} className="flex-1 min-w-[230px]">
            <Card.Body className="py-4 flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full">
                        <Text size="description" variant="slate-medium" weight="bold" className="uppercase">
                            {title}
                        </Text>
                        <Icon
                            icon={icon}
                            size="medium"
                            variant="crimson"
                            bg={{ variant: "off-white", type: "circle", padding: "small" }}
                        />
                    </div>
                    <Text size="bigger" variant="crimson" weight="extraBold">
                        {isCurrency ? `₱${value.toLocaleString()}` : value.toLocaleString()}
                    </Text>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center text-[#4CAF50]">
                            <Icon
                                icon={ArrowOutwardIcon}
                                size="small"
                                variant="off-white"
                                className="!text-[#4CAF50]"
                            />
                            <Text size="smaller" weight="bold" className="!text-[#4CAF50]">
                                12.3%
                            </Text>
                        </div>
                        <Text size="smaller" variant="slate-medium">
                            From last day
                        </Text>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <div className="flex flex-wrap gap-4 w-full">
            <StatCard title="Total Revenue" value={revenue} isCurrency icon={PaymentsOutlinedIcon} />
            <StatCard title="Average Order Value" value={avgOrderValue} isCurrency icon={PointOfSaleOutlinedIcon} />
            <StatCard title="Total Orders" value={totalOrders} icon={ShoppingCartOutlinedIcon} />
            <StatCard title="Total Customers" value={totalCustomers} icon={GroupOutlinedIcon} />
        </div>
    );
}

// Controls
interface ControlsProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    timeframeFilter: string;
    setTimeframeFilter: (val: string) => void;
    paymentFilter: string;
    setPaymentFilter: (val: string) => void;
    quantityFilter: string;
    setQuantityFilter: (val: string) => void;
}

function ControlsSection({
    searchQuery,
    setSearchQuery,
    timeframeFilter,
    setTimeframeFilter,
    paymentFilter,
    setPaymentFilter,
    quantityFilter,
    setQuantityFilter,
}: ControlsProps) {
    return (
        <Card isGlass={false} className="overflow-visible! z-20 relative">
            <Card.Body className="flex flex-wrap items-center justify-between gap-6 overflow-visible!">
                <div className="flex-1 min-w-[300px]">
                    <SearchInput
                        placeholder="Search transaction, cashier ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full!"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="w-48">
                        <SelectInput
                            name="paymentFilter"
                            defaultValue={paymentFilter}
                            className="py-1!"
                            onChange={(e) => setPaymentFilter(e.target.value)}
                        >
                            <SelectInput.Option value="All Methods">All Methods</SelectInput.Option>
                            <SelectInput.Option value="Cash">Cash</SelectInput.Option>
                            <SelectInput.Option value="GCash Digital">GCash Digital</SelectInput.Option>
                            <SelectInput.Option value="Card Payment">Card Payment</SelectInput.Option>
                            <SelectInput.Option value="Maya QR">Maya QR</SelectInput.Option>
                        </SelectInput>
                    </div>

                    <div className="w-48">
                        <SelectInput
                            name="quantityFilter"
                            defaultValue={quantityFilter}
                            className="py-1!"
                            onChange={(e) => setQuantityFilter(e.target.value)}
                        >
                            <SelectInput.Option value="All Quantities">All Quantities</SelectInput.Option>
                            <SelectInput.Option value="1 - 5 items">1 - 5 items</SelectInput.Option>
                            <SelectInput.Option value="6 - 10 items">6 - 10 items</SelectInput.Option>
                            <SelectInput.Option value="11+ items">11+ items</SelectInput.Option>
                        </SelectInput>
                    </div>

                    <div className="w-32">
                        <SelectInput
                            name="timeframeFilter"
                            defaultValue={timeframeFilter}
                            className="py-1!"
                            variant="button"
                            onChange={(e) => setTimeframeFilter(e.target.value)}
                        >
                            <SelectInput.Option value="Today">Today</SelectInput.Option>
                            <SelectInput.Option value="Last 7 Days">Last Week</SelectInput.Option>
                            <SelectInput.Option value="Last 30 Days">Last Month</SelectInput.Option>
                            <SelectInput.Option value="All Time">All Time</SelectInput.Option>
                        </SelectInput>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

// Transaction List
interface TransactionListProps {
    transactions: typeof SAMPLE_TRANSACTIONS;
}

function TransactionListSection({ transactions }: TransactionListProps) {
    const handleView = (id: string) => {
        console.log(`View transaction: ${id}`);
    };

    return (
        <Card isGlass={false}>
            <Card.Body>
                <Text weight="bold" size="big" variant="crimson">
                    Transaction History
                </Text>
            </Card.Body>

            <Card.Body className="flex flex-col gap-4" removePadding bordered={false}>
                <Table pagination={{ maxItems: 3 }} rounded={false} bordered={false}>
                    <Table.Row borderedBottom>
                        <Table.Header text="Transaction ID" />
                        <Table.Header text="Cashier ID" />
                        <Table.Header text="Quantity" />
                        <Table.Header text="Price" />
                        <Table.Header text="Date" />
                        <Table.Header text="Payment Method" />
                        <Table.Header text="Action" />
                    </Table.Row>

                    {transactions.map((txn) => (
                        <Table.Row key={txn.id} borderedBottom>
                            <Table.Data>
                                <div className="w-[160px] break-all mx-auto text-center font-medium text-brown leading-tight">
                                    {txn.id}
                                </div>
                            </Table.Data>
                            <Table.Data>
                                <div className="w-[160px] break-all mx-auto text-center font-medium text-brown leading-tight">
                                    {txn.cashierId}
                                </div>
                            </Table.Data>
                            <Table.Data text={txn.quantity.toString()} />
                            <Table.Data text={NumberFormat(txn.price, "₱")} />
                            <Table.Data text={txn.date} />
                            <Table.Data text={txn.paymentMethod} />
                            <Table.Data>
                                <div className="flex justify-center gap-2">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        className="rounded-3xl! px-4!"
                                        onClick={() => handleView(txn.id)}
                                    >
                                        View
                                    </Button>
                                </div>
                            </Table.Data>
                        </Table.Row>
                    ))}
                </Table>
            </Card.Body>
        </Card>
    );
}

// MAIN COMPONENT
export default function BranchManager_Transactions() {
    const [searchQuery, setSearchQuery] = useState("");
    const [timeframeFilter, setTimeframeFilter] = useState("Today");
    const [paymentFilter, setPaymentFilter] = useState("All Methods");
    const [quantityFilter, setQuantityFilter] = useState("All Quantities");

    // filtering logic
    const filteredTransactions = SAMPLE_TRANSACTIONS.filter((txn) => {
        const searchLower = searchQuery.toLowerCase();

        const matchesSearch =
            txn.id.toLowerCase().includes(searchLower) || txn.cashierId.toLowerCase().includes(searchLower);

        const matchesPayment = paymentFilter === "All Methods" ? true : txn.paymentMethod === paymentFilter;

        let matchesQuantity = true;
        if (quantityFilter === "1 - 5 items") {
            matchesQuantity = txn.quantity >= 1 && txn.quantity <= 5;
        } else if (quantityFilter === "6 - 10 items") {
            matchesQuantity = txn.quantity >= 6 && txn.quantity <= 10;
        } else if (quantityFilter === "11+ items") {
            matchesQuantity = txn.quantity >= 11;
        }

        return matchesSearch && matchesPayment && matchesQuantity;
    });

    return (
        <main className="flex flex-col w-full">
            <Card>
                <Card.Body className="py-6 px-10 flex flex-col gap-6">
                    <PageHeader
                        headerText="Transactions"
                        descriptionText="Monitor and review all recent branch transactions"
                    />

                    <StatCardsSection transactions={SAMPLE_TRANSACTIONS} />

                    <ControlsSection
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        timeframeFilter={timeframeFilter}
                        setTimeframeFilter={setTimeframeFilter}
                        paymentFilter={paymentFilter}
                        setPaymentFilter={setPaymentFilter}
                        quantityFilter={quantityFilter}
                        setQuantityFilter={setQuantityFilter}
                    />

                    <TransactionListSection transactions={filteredTransactions} />
                </Card.Body>
            </Card>

            <Outlet />
        </main>
    );
}
