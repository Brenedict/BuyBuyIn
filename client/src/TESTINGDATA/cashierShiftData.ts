// Pictures of the bills and coins (client/src/assets/cash)
import bill1000 from "../assets/cash/bill-1000.png";
import bill500 from "../assets/cash/bill-500.png";
import bill200 from "../assets/cash/bill-200.png";
import bill100 from "../assets/cash/bill-100.png";
import bill50 from "../assets/cash/bill-50.png";
import bill20 from "../assets/cash/bill-20.png";
import coin10 from "../assets/cash/coin-10.png";
import coin5 from "../assets/cash/coin-5.png";
import coin1 from "../assets/cash/coin-1.png";
import coin25c from "../assets/cash/coin-25c.png";

export type CashDenomination = {
    id: string;
    label: string;
    value: number;
    // Picture of the bill/coin shown beside the quantity box. Optional so a missing picture does not break the popup
    imageSrc?: string;
};

// Bills and coins counted when starting and ending a shift
export const TABLE_CASH_DENOMINATIONS: CashDenomination[] = [
    { id: "bill-1000", label: "1,000 PESOS", value: 1000, imageSrc: bill1000 },
    { id: "bill-500", label: "500 PESOS", value: 500, imageSrc: bill500 },
    { id: "bill-200", label: "200 PESOS", value: 200, imageSrc: bill200 },
    { id: "bill-100", label: "100 PESOS", value: 100, imageSrc: bill100 },
    { id: "bill-50", label: "50 PESOS", value: 50, imageSrc: bill50 },
    { id: "bill-20", label: "20 PESOS", value: 20, imageSrc: bill20 },
    { id: "coin-10", label: "10 PESOS", value: 10, imageSrc: coin10 },
    { id: "coin-5", label: "5 PESOS", value: 5, imageSrc: coin5 },
    { id: "coin-1", label: "1 PESO", value: 1, imageSrc: coin1 },
    { id: "coin-0.25", label: "25 CENTS", value: 0.25, imageSrc: coin25c },
];

// Figures shown in the End Shift summary panel (the backend will supply these)
export type ShiftSummary = {
    netAmount: number;
    othersPayment: number;
    totalRefund: number;
    totalReturn: number;
    totalVoid: number;
    chargeAmount: number;
    regDiscAmount: number;
    totalCashIn: number;
    pointsRedeem: number;
    cashSales: number;
    openingRefund: number;
    totalCashOut: number;
    totalCash: number;
};

export const MOCK_SHIFT_SUMMARY: ShiftSummary = {
    netAmount: 12450.5,
    othersPayment: 1800,
    totalRefund: 250,
    totalReturn: 120,
    totalVoid: 75,
    chargeAmount: 0,
    regDiscAmount: 340.25,
    totalCashIn: 5000,
    pointsRedeem: 150,
    cashSales: 10650.5,
    openingRefund: 0,
    totalCashOut: 800,
    totalCash: 14850.5,
};