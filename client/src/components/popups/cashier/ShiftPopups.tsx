// General Imports
import { useState, type ChangeEvent } from "react";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// Temporary mock data (replace once the backend is connected)
import {
    TABLE_CASH_DENOMINATIONS,
    MOCK_SHIFT_SUMMARY,
    type CashDenomination,
    type ShiftSummary,
} from "../../../TESTINGDATA/cashierShiftData";

type DenominationPopupProps = {
    mode: "start" | "end";
};

// Rows of the End Shift summary panel, in the order they appear in the design (left column, then right column)
const SUMMARY_LEFT: [string, keyof ShiftSummary][] = [
    ["Net Amount", "netAmount"],
    ["Others Payment", "othersPayment"],
    ["Total Refund", "totalRefund"],
    ["Total Return", "totalReturn"],
    ["Total Void", "totalVoid"],
    ["Charge Amount", "chargeAmount"],
    ["Reg Disc Amount", "regDiscAmount"],
];

const SUMMARY_RIGHT: [string, keyof ShiftSummary][] = [
    ["Total Cash In", "totalCashIn"],
    ["Points Redeem", "pointsRedeem"],
    ["Cash Sales", "cashSales"],
    ["Opening Refund", "openingRefund"],
    ["Total Cash Out", "totalCashOut"],
    ["Total Cash", "totalCash"],
];

const formatAmount = (amount: number) =>
    amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Small quantity box from the design: compact, centered number, and no browser spinner arrows
const QUANTITY_BOX_CLASS =
    "px-2! py-1.5! rounded-lg! text-center! [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

// One bill/coin: its picture, its name, and the box where the cashier types how many were counted
function DenominationField({
    denomination,
    quantity,
    onChange,
}: {
    denomination: CashDenomination;
    quantity: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="grid grid-cols-[4rem_1fr_4.5rem] items-center gap-2">
            {denomination.imageSrc ? (
                <img src={denomination.imageSrc} alt="" className="h-10 w-16 object-contain" />
            ) : (
                <div className="h-10 w-16 rounded-md bg-cream" />
            )}
            <div className="text-right">
                <Text size="description" weight="bold" variant="brown">
                    {denomination.label}
                </Text>
            </div>
            <GeneralInput
                id={denomination.id}
                name={denomination.id}
                type="number"
                min={0}
                step={1}
                placeholder="0"
                aria-label={`Quantity of ${denomination.label}`}
                className={QUANTITY_BOX_CLASS}
                // An empty box reads better than "0" while counting
                value={quantity === 0 ? "" : quantity}
                onChange={onChange}
            />
        </div>
    );
}

// One "Label: value" line of the summary panel. Kept on a single line so long amounts do not wrap
function SummaryRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between gap-2 whitespace-nowrap">
            <Text size="description" weight="bold" variant="crimson">
                {label}:
            </Text>
            <Text size="description" weight="bold" variant="brown">
                {formatAmount(value)}
            </Text>
        </div>
    );
}

// Shared body of the Start Shift and End Shift popups. Both screens count the same bills and coins,
// the End Shift screen additionally shows the shift summary and a variance
function DenominationPopup({ mode }: DenominationPopupProps) {
    const navigate = useNavigatePage();
    const isEnd = mode === "end";

    // Date and time the popup was opened, shown in the header
    const [now] = useState(() => new Date());
    const dateText = now.toLocaleDateString("en-GB");
    const timeText = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    // Quantity entered for each denomination, keyed by the denomination id
    const [counts, setCounts] = useState<Record<string, number>>({});

    // When triggered, returns to the point of sale page (exiting the popup)
    const handleClose = () => navigate();

    // TODO: save the counted cash (and post the shift when ending) once the backend endpoint is available
    const handleConfirm = () => handleClose();

    // TODO: print the denomination count once printing is set up
    const handlePrint = () => {};

    // Updates one denomination. Only whole numbers from 0 up are accepted
    const setCount = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const quantity = Math.max(0, Math.floor(Number(e.target.value) || 0));
        setCounts((prev) => ({ ...prev, [id]: quantity }));
    };

    const total = TABLE_CASH_DENOMINATIONS.reduce(
        (sum, denomination) => sum + denomination.value * (counts[denomination.id] ?? 0),
        0
    );

    // Coins and the smaller bills go in the left column, the larger bills in the right (as in the design).
    // The list is stored from largest to smallest, the design reads from smallest to largest
    const smallDenominations = TABLE_CASH_DENOMINATIONS.filter((denomination) => denomination.value < 100).reverse();
    const largeDenominations = TABLE_CASH_DENOMINATIONS.filter((denomination) => denomination.value >= 100).reverse();

    const renderField = (denomination: CashDenomination) => (
        <DenominationField
            key={denomination.id}
            denomination={denomination}
            quantity={counts[denomination.id] ?? 0}
            onChange={setCount(denomination.id)}
        />
    );

    // Difference between the cash counted and the cash the system expects
    const variance = total - MOCK_SHIFT_SUMMARY.totalCash;

    const dateAndTime = (
        <div className="flex justify-end gap-6">
            {[
                ["Date", dateText],
                ["Time", timeText],
            ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-2">
                    <Text size="description" weight="bold" variant="crimson">
                        {label}:
                    </Text>
                    <div className="rounded-lg border border-crimson px-3 py-1">
                        <Text size="description" weight="bold" variant="crimson">
                            {value}
                        </Text>
                    </div>
                </div>
            ))}
        </div>
    );

    const countPanel = (
        <section className="flex flex-col gap-4 rounded-3xl border border-cream bg-off-white p-4">
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <div className="flex flex-col gap-2">{smallDenominations.map(renderField)}</div>
                <div className="flex flex-col gap-2">{largeDenominations.map(renderField)}</div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <Text size="normal" weight="bold" variant="brown">
                    {isEnd ? "TOTAL CASH COUNT:" : "TOTAL CASH BALANCE:"}
                </Text>
                <Text size="larger" weight="extraBold" variant="brown">
                    {formatAmount(total)}
                </Text>
            </div>
        </section>
    );

    // Start Shift: buttons sit at the bottom right. End Shift: they fill the width under the summary
    const actions = (
        <div className={`flex gap-2 ${isEnd ? "w-full" : "justify-end"}`}>
            <Button
                type="button"
                variant="secondary"
                size="normal"
                className={isEnd ? "flex-1" : "w-40"}
                onClick={handleClose}
            >
                Close
            </Button>
            <Button
                type="button"
                variant="main"
                size="normal"
                className={isEnd ? "flex-1" : "w-40"}
                onClick={handleConfirm}
            >
                {isEnd ? "Post" : "Enter"}
            </Button>
        </div>
    );

    const summaryColumn = (
        <section className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-x-6 rounded-3xl border border-cream bg-off-white p-4">
                <div className="flex flex-col gap-2">
                    {SUMMARY_LEFT.map(([label, key]) => (
                        <SummaryRow key={key} label={label} value={MOCK_SHIFT_SUMMARY[key]} />
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    {SUMMARY_RIGHT.map(([label, key]) => (
                        <SummaryRow key={key} label={label} value={MOCK_SHIFT_SUMMARY[key]} />
                    ))}
                    <SummaryRow label="Variance" value={variance} />
                </div>
            </div>

            <Button type="button" variant="secondary" size="normal" onClick={handlePrint}>
                Print Denomination
            </Button>
            {actions}
        </section>
    );

    return (
        <PopUp
            title="Cash Denomination"
            subtitle={isEnd ? "End Shift" : "Start Shift"}
            // The End Shift screen has two panels side by side, so it is wider than the largest preset size
            size="lg"
            className={isEnd ? "max-w-[1040px]!" : undefined}
            handleCloseProp={handleClose}
        >
            {/* The popup has no scrolling of its own, so cap the height to keep the buttons on screen */}
            <div data-no-drag className="flex max-h-[75vh] flex-col gap-4 overflow-y-auto">
                {dateAndTime}

                {isEnd ? (
                    <div className="grid grid-cols-2 items-start gap-4">
                        {countPanel}
                        {summaryColumn}
                    </div>
                ) : (
                    <>
                        {countPanel}
                        {actions}
                    </>
                )}
            </div>
        </PopUp>
    );
}

export function StartShiftPopup() {
    return <DenominationPopup mode="start" />;
}

export function EndShiftPopup() {
    return <DenominationPopup mode="end" />;
}
