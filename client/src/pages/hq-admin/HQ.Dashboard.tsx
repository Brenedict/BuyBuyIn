// General Imports
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import Table from "../../components/Table";
import {
    TABLE_BRANCHES,
    SALES_OVERVIEW_LABELS,
    PERFORMANCE_LABELS,
    INTER_BRANCH_PERFORMANCE_LABELS,
    PERFORMANCE_DATA,
    INTER_BRANCH_PERFORMANCE_DATA,
    BRANCH_LEGEND,
} from "../../TESTINGDATA/branchData";
import { type ChartColorName } from "../../utils/chartColors";
import SelectInput from "../../components/inputs/SelectInput";
import { PrimarySecondaryText } from "../../components/partials/TablePartials";
import {
    AnalyticsCard,
    BranchLegendCard,
    InterBranchPerformanceCard,
    PerformanceCard,
    SalesOverviewCard,
} from "../../components/partials/DashboardPartials";
import { useFormSearchParams } from "../../hooks/useFormSearchParams";

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

    const interBranchLabels = INTER_BRANCH_PERFORMANCE_LABELS;
    const interBranchData = INTER_BRANCH_PERFORMANCE_DATA;

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
                    <AnalyticsCard title="Total Revenue" symbol="₱" value={384250.0} percentDifference={10} />
                    <AnalyticsCard title="Average Order Value" symbol="₱" value={1568.37} percentDifference={12.3} />
                    <AnalyticsCard title="Total Orders" value={4321} percentDifference={10} />
                    <AnalyticsCard title="Total Customers" value={1234} percentDifference={10} />
                </div>
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex gap-5 min-w-0">
                        <SalesOverviewCard title="Sales Overview" labels={salesDataLabels} data={salesData} />
                        <PerformanceCard
                            title="Performance"
                            labels={performanceLabels}
                            datasets={performanceDatasets}
                        />
                    </div>
                    <div className="flex gap-5 min-w-0">
                        <BranchLegendCard branches={BRANCH_LEGEND} />
                        <InterBranchPerformanceCard
                            title="Inter-branch Performance"
                            labels={interBranchLabels}
                            data={interBranchData}
                        />
                    </div>
                </div>
                <Card className="mb-12">
                    <Card.Body className="flex flex-col py-6 px-10">
                        <Text variant="crimson" size="bigger" weight="extraBold" className="mb-4">
                            Branches
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
                            rounded
                            shadow
                        >
                            <Table.Row borderedBottom>
                                <Table.Header text="Branch ID" />
                                <Table.Header text="Location" />
                                <Table.Header text="No. of Employees" />
                                <Table.Header text="Total Sales" />
                            </Table.Row>
                            {TABLE_BRANCHES.map((branch, index) => (
                                <Table.Row key={index}>
                                    <Table.Data text={branch.branchId} />
                                    <Table.Data>
                                        <PrimarySecondaryText
                                            primary={branch.location}
                                            secondary={branch.subLocation}
                                        />
                                    </Table.Data>
                                    <Table.Data text={String(branch.employees)} />
                                    <Table.Data text={NumberFormat(branch.totalSales, "₱")} />
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
