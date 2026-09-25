// General Imports
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import Table from "../../components/Table";
import {
    TABLE_BRANCHES,
    SALES_OVERVIEW_LABELS,
    PERFORMANCE_LABELS,
    PERFORMANCE_DATA,
    BRANCH_LEGEND,
    TABLE_EMPLOYEES,
    TABLE_TRANSACTIONS,
} from "../../TESTINGDATA/branchData";
import { type ChartColorName } from "../../utils/chartColors";
import SelectInput from "../../components/inputs/SelectInput";
import { ActionButtons } from "../../components/partials/TablePartials";
import { AnalyticsCard, PerformanceCard, SalesOverviewCard } from "../../components/partials/DashboardPartials";
import { useFormSearchParams } from "../../hooks/useFormSearchParams";
import { formatShortDate } from "../../utils/dateUtils";

// Material UI Icons
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";

export function NumberFormat(value: number, symbol?: string) {
    return `${symbol ?? ""} ${value.toLocaleString()}`;
}

export function HQ_Dashboard() {
    const { values, handleChange } = useFormSearchParams({ timeframe: "Today" });

    const salesDataLabels = SALES_OVERVIEW_LABELS;
    const salesData = TABLE_BRANCHES.map((branch) => branch.totalSales);

    const performanceLabels = PERFORMANCE_LABELS;
    const performanceDatasets = PERFORMANCE_DATA.map((branch) => {
        const legendEntry = BRANCH_LEGEND.find((l) => l.name === branch.label);
        return {
            label: branch.label,
            data: branch.data,
            color: (legendEntry?.color ?? "crimson") as ChartColorName,
        };
    });

    const handleView = (id: string | number) => () => {
        alert(`View: ${id}`);
    };

    return (
        <Card>
            <Card.Body className="py-6 px-10 overflow-scroll">
                <Text variant="crimson" size="large" weight="extraBold">
                    DASHBOARD
                </Text>
                <div className="flex items-center gap-8 mb-8">
                    <div className="w-full h-0.5 bg-maroon" />
                    <div className="w-fit">
                        <SelectInput
                            variant="button"
                            name="timeframe"
                            defaultValue={values.timeframe}
                            onChange={handleChange}
                            className="border-0! py-1.5! text-normal! w-max"
                        >
                            <SelectInput.Option value="Today">Today</SelectInput.Option>
                            <SelectInput.Option value="Last Week">Last Week</SelectInput.Option>
                            <SelectInput.Option value="Last Month">Last Month</SelectInput.Option>
                            <SelectInput.Option value="Last 6 Months">Last 6 Months</SelectInput.Option>
                            <SelectInput.Option value="Last Year">Last Year</SelectInput.Option>
                        </SelectInput>
                    </div>
                </div>

                <div className="flex gap-5 mb-12">
                    <AnalyticsCard title="Total Revenue" symbol="₱" value={88650.0} percentDifference={10} />
                    <AnalyticsCard title="Average Order Value" symbol="₱" value={1611.82} percentDifference={12.3} />
                    <AnalyticsCard title="Total Orders" value={55} percentDifference={10} />
                    <AnalyticsCard title="Total Customers" value={55} percentDifference={10} />
                </div>

                <div className="flex gap-5 min-w-0 mb-12">
                    <SalesOverviewCard title="Sales Overview" labels={salesDataLabels} data={salesData} />
                    <PerformanceCard title="Performance" labels={performanceLabels} datasets={performanceDatasets} />
                </div>
                <Card className="mb-12">
                    <Card.Body className="flex flex-col py-6 px-10">
                        <Text variant="crimson" size="bigger" weight="extraBold" className="mb-4">
                            Recent Transactions
                        </Text>

                        <Table
                            bordered
                            pagination={{
                                bgVariant: "cream-muted",
                                borderVariant: "brown",
                                borderedTop: true,
                                maxItems: 6,
                                textSize: "description",
                                textVariant: "crimson",
                                textWeight: "medium",
                            }}
                            pageKey="transaction_page"
                            rounded
                            shadow
                        >
                            <Table.Row borderedBottom>
                                <Table.Header text="Transaction ID" />
                                <Table.Header text="Cashier ID" />
                                <Table.Header text="Quantity" />
                                <Table.Header text="Price" />
                                <Table.Header text="Date" />
                                <Table.Header text="Payment Method" />
                                <Table.Header text="Action" />
                            </Table.Row>
                            {TABLE_TRANSACTIONS.map((transaction, index) => (
                                <Table.Row key={index}>
                                    <Table.Data text={transaction.branchId} wrapWords />
                                    <Table.Data text={transaction.cashierId} wrapWords />
                                    <Table.Data text={NumberFormat(transaction.quantity)} />
                                    <Table.Data text={NumberFormat(transaction.price, "₱")} />
                                    <Table.Data text={formatShortDate(transaction.date)} />
                                    <Table.Data text={transaction.paymentMethod} />

                                    <Table.Data>
                                        <ActionButtons
                                            id={index}
                                            actions={[
                                                {
                                                    text: "Edit",
                                                    variant: "secondary",
                                                    leftIcon: DriveFileRenameOutlineOutlinedIcon,
                                                    handleClick: handleView,
                                                },
                                            ]}
                                        />
                                    </Table.Data>
                                </Table.Row>
                            ))}
                        </Table>
                    </Card.Body>
                </Card>
                <Card className="mb-12">
                    <Card.Body className="flex flex-col py-6 px-10">
                        <Text variant="crimson" size="bigger" weight="extraBold" className="mb-4">
                            Active Employee
                        </Text>

                        <Table
                            bordered
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
                            rounded
                            shadow
                        >
                            <Table.Row borderedBottom>
                                <Table.Header text="User ID" />
                                <Table.Header text="Name" />
                                <Table.Header text="Role Name" />
                                <Table.Header text="Total Sales" />
                            </Table.Row>
                            {TABLE_EMPLOYEES.map((employee, index) => (
                                <Table.Row key={index}>
                                    <Table.Data text={employee.userId} />
                                    <Table.Data text={employee.name} />
                                    <Table.Data text={employee.roleName} />
                                    <Table.Data text={NumberFormat(employee.totalSales, "₱")} />
                                </Table.Row>
                            ))}
                        </Table>
                    </Card.Body>
                </Card>
            </Card.Body>
        </Card>
    );
}

export default HQ_Dashboard;
