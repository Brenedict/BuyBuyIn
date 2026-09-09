const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const pad = (value: number) => value.toString().padStart(2, "0");

// NOTE: Formats the date as "09/01/2026" 
export function formatShortDate(date: Date): string {
    return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
}

// NOTE: Formats the date as "September 1, 2026". 
export function formatFullDate(date: Date): string {
    return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// NOTE: Formats the time as "12:00 PM" (12-hour clock). 
export function formatTime(date: Date): string {
    const hours = date.getHours();
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const period = hours >= 12 ? "PM" : "AM";

    return `${hour12}:${pad(date.getMinutes())} ${period}`;
}

