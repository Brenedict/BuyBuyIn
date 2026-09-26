import { Card } from "../Card";
import { BarChart, LineChart } from "../Charts";
import { Text } from "../Text";
import {
    buildSalesOverviewData,
    buildPerformanceData,
    buildInterBranchData,
    salesOverviewOptions,
    performanceOptions,
    interBranchOptions,
    NumberFormat,
    type ChartColorName,
} from "../../utils/chartConfigs";
import { getChartColor } from "../../utils/chartColors";

// Material UI Icons
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// ------------------------ INTERFACES ----------------------------
interface AnalyticsCardProps {
    title: string;
    symbol?: string;
    value: number;
    percentDifference: number;
}

interface SalesOverviewCardProps {
    title?: string;
    labels: string[];
    data: number[];
    color?: ChartColorName;
}

interface PerformanceCardProps {
    title?: string;
    labels: string[];
    datasets: Array<{ label: string; data: number[]; color: ChartColorName }>;
}

interface InterBranchPerformanceCardProps {
    title?: string;
    labels: string[];
    data: number[];
    color?: ChartColorName;
}

interface BranchLegendCardProps {
    branches?: Array<{ name: string; color: ChartColorName }>;
}

// ------------------------ COMPONENTS ----------------------------
export function SalesOverviewCard({
    title = "Sales Overview",
    labels,
    data,
    color = "brown",
}: SalesOverviewCardProps) {
    const chartData = buildSalesOverviewData(labels, data, "Total Sales", color);
    return (
        <Card className="flex-1 min-w-0">
            <Card.Header>
                <Text variant="crimson" size="bigger" weight="extraBold">
                    {title}
                </Text>
            </Card.Header>
            <Card.Body className="py-4 px-6">
                <BarChart
                    data={chartData}
                    options={salesOverviewOptions}
                    wrapperClassName="relative w-full h-[300px]"
                />
            </Card.Body>
        </Card>
    );
}

export function PerformanceCard({
    title = "Performance",
    labels,
    datasets,
}: PerformanceCardProps) {
    const chartData = buildPerformanceData(labels, datasets);
    return (
        <Card className="flex-1 min-w-0">
            <Card.Header>
                <Text variant="crimson" size="bigger" weight="extraBold">
                    {title}
                </Text>
            </Card.Header>
            <Card.Body className="py-4 px-6">
                <LineChart
                    data={chartData}
                    options={performanceOptions}
                    wrapperClassName="relative w-full h-[300px]"
                />
            </Card.Body>
        </Card>
    );
}

export function InterBranchPerformanceCard({
    title = "Inter-branch Performance",
    labels,
    data,
    color = "crimson",
}: InterBranchPerformanceCardProps) {
    const chartData = buildInterBranchData(labels, data, "Performance", color);
    return (
        <Card className="flex-1 min-w-0">
            <Card.Header>
                <Text variant="crimson" size="bigger" weight="extraBold">
                    {title}
                </Text>
            </Card.Header>
            <Card.Body className="py-4 px-6">
                <BarChart
                    data={chartData}
                    options={interBranchOptions}
                    wrapperClassName="relative w-full h-[300px]"
                />
            </Card.Body>
        </Card>
    );
}

export function BranchLegendCard({ branches }: BranchLegendCardProps) {
    const branchData = branches ?? [
        { name: "Sta. Mesa", color: "sage" },
        { name: "Pasay", color: "burgundy" },
        { name: "San Juan", color: "sky" },
        { name: "Pasig", color: "dusty-rose" },
        { name: "Quezon City", color: "sienna" },
    ];
    return (
        <Card className="w-50 min-w-0">
            <Card.Body className="flex flex-col gap-3 py-4 px-4">
                <Text size="description" weight="bold" variant="slate-dark" className="mb-1">
                    Branches
                </Text>
                {branchData.map((branch) => (
                    <div key={branch.name} className="flex items-center gap-3">
                        <div
                            className="w-5 h-5 rounded ring-1 ring-slate-dark"
                            style={{ backgroundColor: getChartColor(branch.color).bg }}
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