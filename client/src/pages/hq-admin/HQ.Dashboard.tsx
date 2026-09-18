import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { SelectInput } from "../../components/Input";
import Table from "../../components/Table";
import { BarChart, LineChart } from "../../components/Charts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { PrimarySecondaryText } from "../../components/TablePartials";
import {
    TABLE_BRANCHES,
    SALES_OVERVIEW_LABELS,
    SALES_OVERVIEW_DATA,
    PERFORMANCE_LABELS,
    PERFORMANCE_DATA,
    INTER_BRANCH_PERFORMANCE_LABELS,
    INTER_BRANCH_PERFORMANCE_DATA,
    BRANCH_LEGEND,
} from "../../TESTINGDATA/branchData";

interface AnalyticsCardProps {
    title: string;
    symbol?: string;
    value: number;
    percentDifference: number;
}

interface ChartConfig {
    data: {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor?: string;
            borderWidth?: number;
            borderRadius?: number;
            hoverBackgroundColor?: string;
            tension?: number;
            pointRadius?: number;
            pointHoverRadius?: number;
        }>;
    };
    options: object;
}

const chartFont = { family: "Google Sans Flex" };

export function NumberFormat(value: number, symbol?: string) {
    return `${symbol ?? ""} ${value.toLocaleString()}`;
}

export function AnalyticsCard({ title, value, percentDifference, symbol }: AnalyticsCardProps) {
    const icon = percentDifference > 0 ? TrendingUpIcon : TrendingDownIcon;

    return (
        <Card className="grow">
            <Card.Body>
                <Text className="uppercase mb-2" size="description" variant="slate-dark">
                    {title}
                </Text>
                <Text size="large" weight="extraBold" className="mb-2">
                    {NumberFormat(value, symbol)}
                </Text>
                {percentDifference !== 0 && (
                    <div className="flex gap-2">
                        <Text
                            size="description"
                            svg={{ icon, size: "medium", variant: "crimson", position: "left", gap: "small" }}
                        >
                            {percentDifference}%
                        </Text>

                        <Text size="description" variant="slate-dark">
                            From last day
                        </Text>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

const salesOverviewConfig: ChartConfig = {
    data: {
        labels: SALES_OVERVIEW_LABELS,
        datasets: [
            {
                label: "Total Sales",
                data: SALES_OVERVIEW_DATA,
                backgroundColor: "#442d1d",
                borderColor: "#442d1d",
                borderWidth: 0,
                borderRadius: 8,
                hoverBackgroundColor: "#712f21",
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 125000,
                ticks: {
                    callback: (value: number) => value.toLocaleString(),
                    font: chartFont,
                    color: "#1f2227",
                },
                grid: { color: "#f4ede5" },
            },
            x: {
                ticks: { font: chartFont, color: "#1f2227" },
                grid: { display: false },
            },
        },
    },
};

const performanceConfig: ChartConfig = {
    data: {
        labels: PERFORMANCE_LABELS,
        datasets: PERFORMANCE_DATA.map((ds) => ({
            label: ds.label,
            data: ds.data,
            borderColor: ds.borderColor,
            backgroundColor: ds.backgroundColor,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 2,
        })),
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: {
                position: "top",
                labels: { boxWidth: 8, font: chartFont, padding: 8, color: "#1f2227" },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: number) => `₱${value}`,
                    font: chartFont,
                    color: "#1f2227",
                },
                grid: { color: "#f4ede5" },
            },
            x: {
                ticks: { font: chartFont, color: "#1f2227" },
                grid: { display: false },
            },
        },
    },
};

const interBranchConfig: ChartConfig = {
    data: {
        labels: INTER_BRANCH_PERFORMANCE_LABELS,
        datasets: [
            {
                label: "Performance",
                data: INTER_BRANCH_PERFORMANCE_DATA,
                backgroundColor: "#c83a24",
                borderColor: "#c83a24",
                borderWidth: 0,
                borderRadius: 8,
                hoverBackgroundColor: "#712f21",
            },
        ],
    },
    options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: (value: number) => `₱${value.toLocaleString()}`,
                    font: chartFont,
                    color: "#1f2227",
                },
                grid: { color: "#f4ede5" },
            },
            y: {
                ticks: { font: chartFont, color: "#1f2227" },
                grid: { display: false },
            },
        },
    },
};

function SalesOverviewCard() {
    return (
        <Card className="flex-1 min-w-0">
            <Card.Header>
                <Text variant="crimson" size="bigger" weight="extraBold">
                    Sales Overview
                </Text>
            </Card.Header>
            <Card.Body className="py-4 px-6">
                <BarChart
                    data={salesOverviewConfig.data}
                    options={salesOverviewConfig.options}
                    wrapperClassName="relative w-full h-[300px]"
                />
            </Card.Body>
        </Card>
    );
}

function PerformanceCard() {
    return (
        <Card className="flex-1 min-w-0">
            <Card.Header>
                <Text variant="crimson" size="bigger" weight="extraBold">
                    Performance
                </Text>
            </Card.Header>
            <Card.Body className="py-4 px-6">
                <LineChart
                    data={performanceConfig.data}
                    options={performanceConfig.options}
                    wrapperClassName="relative w-full h-[300px]"
                />
            </Card.Body>
        </Card>
    );
}

function InterBranchPerformanceCard() {
    return (
        <Card className="flex-1 min-w-0">
            <Card.Header>
                <Text variant="crimson" size="bigger" weight="extraBold">
                    Inter-branch Performance
                </Text>
            </Card.Header>
            <Card.Body className="py-4 px-6">
                <BarChart
                    data={interBranchConfig.data}
                    options={interBranchConfig.options}
                    wrapperClassName="relative w-full h-[300px]"
                />
            </Card.Body>
        </Card>
    );
}

function BranchLegendCard() {
    return (
        <Card className="w-[200px] min-w-0">
            <Card.Body className="flex flex-col gap-3 py-4 px-4">
                <Text size="description" weight="bold" variant="slate-dark" className="mb-1">
                    Branches
                </Text>
                {BRANCH_LEGEND.map((branch) => (
                    <div key={branch.name} className="flex items-center gap-3">
                        <div
                            className="w-5 h-5 rounded ring-1 ring-slate-dark"
                            style={{ backgroundColor: branch.color }}
                        />
                        <Text size="normal" variant="slate-dark">
                            {branch.name}
                        </Text>
                    </div>
                ))}
            </Card.Body>
        </Card>
    );
}

export function HQ_Dashboard() {
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
                            name="roles"
                            defaultValue="Today"
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
                        <SalesOverviewCard />
                        <PerformanceCard />
                    </div>
                    <div className="flex gap-5 min-w-0">
                        <BranchLegendCard />
                        <InterBranchPerformanceCard />
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
