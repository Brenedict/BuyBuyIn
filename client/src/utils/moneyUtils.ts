const pesoFormatter = new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// NOTE: Formats the amount with thousands separators and always 2 decimals, e.g. 2442.7 -> "2,442.72"
export function formatMoney(value: number): string {
    return pesoFormatter.format(value);
}

// NOTE: Converts a peso amount to whole centavos so amounts can be compared without floating point drift
export function toCents(value: number): number {
    return Math.round(value * 100);
}
