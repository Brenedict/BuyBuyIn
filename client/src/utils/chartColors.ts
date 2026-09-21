export const CHART_COLORS = {
    black: { bg: "#000000", border: "#000000" },
    "slate-dark": { bg: "#1f2227", border: "#1f2227" },
    "slate-medium": { bg: "#393534", border: "#393534" },
    "slate-light": { bg: "#6a7282", border: "#6a7282" },
    brown: { bg: "#442d1d", border: "#442d1d" },
    maroon: { bg: "#712f21", border: "#712f21" },
    crimson: { bg: "#c83a24", border: "#c83a24" },
    "crimson-muted": { bg: "#c83a244f", border: "#c83a244f" },
    coral: { bg: "#fe7470", border: "#fe7470" },
    "off-white": { bg: "#fefced", border: "#fefced" },
    cream: { bg: "#f4ede5", border: "#f4ede5" },
    "cream-muted": { bg: "#f4ede533", border: "#f4ede533" },
    sage: { bg: "#8a9a7b", border: "#8a9a7b" },
    burgundy: { bg: "#7a1f2b", border: "#7a1f2b" },
    sky: { bg: "#5a9bc4", border: "#5a9bc4" },
    "dusty-rose": { bg: "#d4a9a9", border: "#d4a9a9" },
    sienna: { bg: "#a0522d", border: "#a0522d" },
} as const;

export type ChartColorName = keyof typeof CHART_COLORS;

export function getChartColor(name: ChartColorName) {
    return CHART_COLORS[name];
}

export function getChartColorPalette() {
    return CHART_COLORS;
}
