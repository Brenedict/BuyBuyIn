// General Imports
import type { ComponentProps } from "react";
import { Bar, Doughnut, Line, Pie, Scatter } from "react-chartjs-2";

// Chart JS specific import
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    ArcElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    ArcElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

type BarChartProps = ComponentProps<typeof Bar> & { wrapperClassName?: string };
export function BarChart({
    options,
    data,
    wrapperClassName = "relative w-full h-full min-h-[250px]",
    ...props
}: BarChartProps) {
    const responsiveOptions = {
        ...(options as object),
        maintainAspectRatio: false,
    };

    return (
        <div className={wrapperClassName}>
            <Bar options={responsiveOptions} data={data} {...props} />
        </div>
    );
}

type DoughnutChartProps = ComponentProps<typeof Doughnut> & { wrapperClassName?: string };
export function DoughnutChart({
    options,
    data,
    wrapperClassName = "relative w-full h-full min-h-[250px]",
    ...props
}: DoughnutChartProps) {
    const responsiveOptions = {
        ...(options as object),
        maintainAspectRatio: false,
    };

    return (
        <div className={wrapperClassName}>
            <Doughnut options={responsiveOptions} data={data} {...props} />
        </div>
    );
}

type LineChartProps = ComponentProps<typeof Line> & { wrapperClassName?: string };
export function LineChart({
    options,
    data,
    wrapperClassName = "relative w-full h-full min-h-[250px]",
    ...props
}: LineChartProps) {
    const responsiveOptions = {
        ...(options as object),
        maintainAspectRatio: false,
    };

    return (
        <div className={wrapperClassName}>
            <Line options={responsiveOptions} data={data} {...props} />
        </div>
    );
}

type PieChartProps = ComponentProps<typeof Pie> & { wrapperClassName?: string };
export function PieChart({
    options,
    data,
    wrapperClassName = "relative w-full h-full min-h-[250px]",
    ...props
}: PieChartProps) {
    const responsiveOptions = {
        ...(options as object),
        maintainAspectRatio: false,
    };
    return (
        <div className={wrapperClassName}>
            <Pie options={responsiveOptions} data={data} {...props} />
        </div>
    );
}

type ScatterChartProps = ComponentProps<typeof Scatter> & { wrapperClassName?: string };
export function ScatterChart({
    options,
    data,
    wrapperClassName = "relative w-full h-full min-h-[250px]",
    ...props
}: ScatterChartProps) {
    const responsiveOptions = {
        ...(options as object),
        maintainAspectRatio: false,
    };

    return (
        <div className={wrapperClassName}>
            <Scatter options={responsiveOptions} data={data} {...props} />
        </div>
    );
}
