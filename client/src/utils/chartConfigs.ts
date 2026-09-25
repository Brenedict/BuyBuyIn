import { getChartColor, type ChartColorName } from "./chartColors";

export type { ChartColorName };

const chartFont = { family: "Google Sans Flex" };

export interface ChartDataset {
    label: string;
    data: number[];
    color: ChartColorName;
}

export function NumberFormat(value: number, symbol?: string) {
    return `${symbol ?? ""} ${value.toLocaleString()}`;
}

// ------------------------ SALES OVERVIEW ------------------------
export function buildSalesOverviewData(
    labels: string[],
    data: number[],
    datasetLabel: string = "Total Sales",
    color: ChartColorName = "brown"
) {
    const chartColor = getChartColor(color);
    return {
        labels,
        datasets: [
            {
                label: datasetLabel,
                data,
                backgroundColor: chartColor.bg,
                borderColor: chartColor.border,
                borderWidth: 0,
                borderRadius: 8,
                hoverBackgroundColor: chartColor.border,
            },
        ],
    };
}

export const salesOverviewOptions: object = {
    plugins: {
        legend: { display: false },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: (value: string | number) => value.toLocaleString(),
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
};

// ------------------------ PERFORMANCE ------------------------
export function buildPerformanceData(labels: string[], datasets: ChartDataset[]) {
    return {
        labels,
        datasets: datasets.map((ds) => {
            const chartColor = getChartColor(ds.color);
            return {
                label: ds.label,
                data: ds.data,
                borderColor: chartColor.border,
                backgroundColor: chartColor.bg,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
                borderWidth: 2,
            };
        }),
    };
}

export const performanceOptions: object = {
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
};

// ------------------------ INTER-BRANCH PERFORMANCE ------------------------
export function buildInterBranchData(
    labels: string[],
    data: number[],
    datasetLabel: string = "Performance",
    color: ChartColorName = "crimson"
) {
    const chartColor = getChartColor(color);
    return {
        labels,
        datasets: [
            {
                label: datasetLabel,
                data,
                backgroundColor: chartColor.bg,
                borderColor: chartColor.border,
                borderWidth: 0,
                borderRadius: 8,
                hoverBackgroundColor: chartColor.border,
            },
        ],
    };
}

export const interBranchOptions: object = {
    indexAxis: "y",
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
};
