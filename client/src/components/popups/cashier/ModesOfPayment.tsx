// General Imports
import { useEffect, useState, type ReactNode } from "react";
import { useOutletContext } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";
import { formatMoney, toCents } from "../../../utils/moneyUtils";

// Material UI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { MOCK_E_CASH_REFERENCE_NO, MOCK_CARD } from "../../../TESTINGDATA/paymentData";

export type PaymentOutletContext = {
    amountDue: number;
    transactionNumber: number;
};

const PAYMENT_POPUP_SIZE = "md";

const MOCK_STEP_DELAY_MS = 2500;


// Reads the amount due from the Point of Sale page that renders popups
const usePaymentContext = () => useOutletContext<PaymentOutletContext>();

// To be replaced with real payment status once the endpoints exist.
function useMockPaymentSteps<Step extends string>(steps: readonly Step[]): Step {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index >= steps.length - 1) return;

        const timer = setTimeout(() => setIndex((current) => current + 1), MOCK_STEP_DELAY_MS);

        return () => clearTimeout(timer);
    }, [index, steps.length]);

    return steps[index];
}

function PaymentPopupShell({
    title,
    onClose,
    actions,
    children,
}: {
    title: string;
    onClose: () => void;
    actions: ReactNode;
    children: ReactNode;
}) {
    return (
        <PopUp title={title} size={PAYMENT_POPUP_SIZE} handleCloseProp={onClose}>
            <div className="flex flex-col items-center gap-4 py-2 text-center">{children}</div>
            <div className="flex w-full gap-2 pt-4">{actions}</div>
        </PopUp>
    );
}

function ActionButton({
    onClick,
    variant = "secondary",
    children,
}: {
    onClick: () => void;
    variant?: "main" | "secondary";
    children: ReactNode;
}) {
    return (
        <Button type="button" variant={variant} size="normal" className="flex-1" onClick={onClick}>
            {children}
        </Button>
    );
}

function AmountDue({ amount, note }: { amount: number; note?: string }) {
    return (
        <>
            <div className="flex flex-col items-center">
                <Text size="mediumBig" weight="bold" variant="maroon" align="center">
                    TOTAL AMOUNT DUE
                </Text>
                <Text size="large" weight="extraBold" variant="maroon" align="center">
                    {`PHP ${formatMoney(amount)}`}
                </Text>
            </div>
            {note && (
                <Text size="mediumSmall" font="ligconsolata" weight="medium" variant="maroon" align="center">
                    {note}
                </Text>
            )}
        </>
    );
}

function StatusMessage({ title, note }: { title: string; note: string }) {
    return (
        <div className="flex flex-col items-center gap-2 py-6">
            <Text size="bigger" weight="bold" variant="maroon" align="center">
                {title}
            </Text>
            <Text size="mediumSmall" font="ligconsolata" weight="medium" variant="maroon" align="center">
                {note}
            </Text>
        </div>
    );
}

// Success screen shared by e-cash ("Payment Received!") and card ("Payment Approved!")
function PaymentSuccess({ title, details }: { title: string; details: Array<[label: string, value: string]> }) {
    return (
        <div className="flex flex-col items-center gap-3 py-2">
            <CheckCircleIcon className="text-crimson text-icon-hero!" />
            <Text size="bigger" weight="extraBold" variant="maroon" align="center">
                {title}
            </Text>
            <div className="flex flex-col gap-0.5">
                {details.map(([label, value]) => (
                    <Text key={label} size="mediumSmall" font="ligconsolata" weight="medium" variant="maroon">
                        {`${label}: ${value}`}
                    </Text>
                ))}
            </div>
        </div>
    );
}

export function CashPaymentPopup() {
    const navigate = useNavigatePage();
    const { amountDue } = usePaymentContext();

    const [amountReceived, setAmountReceived] = useState("");

    const handleClose = () => navigate(ROUTES.CASHIER.pointOfSale, true);

    const hasInput = amountReceived !== "";
    const isEnough = hasInput && toCents(Number(amountReceived)) >= toCents(amountDue);
    const change = isEnough ? Number(amountReceived) - amountDue : 0;

    const handleConfirm = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isEnough) return;

        // Saves the transaction through the backend before closing, once the transaction endpoint exists
        handleClose();
    };

    const formId = "cashPaymentForm";

    return (
        <PaymentPopupShell
            title="CASH PAYMENT"
            onClose={handleClose}
            actions={
                <>
                    <Button
                        type="submit"
                        form={formId}
                        variant="main"
                        size="normal"
                        className="flex-1 disabled:pointer-events-none disabled:opacity-50"
                        disabled={!isEnough}
                    >
                        CONFIRM PAYMENT
                    </Button>
                    <ActionButton onClick={handleClose}>CANCEL</ActionButton>
                </>
            }
        >
            <AmountDue amount={amountDue} />

            <form id={formId} onSubmit={handleConfirm} className="flex w-full flex-col gap-3 text-left">
                <div>
                    <label
                        htmlFor="amountReceived"
                        className="mb-1 block font-ligconsolata text-medium-small font-bold text-maroon"
                    >
                        AMOUNT RECEIVED:
                    </label>
                    <GeneralInput
                        id="amountReceived"
                        name="amountReceived"
                        type="number"
                        min={0}
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0.00"
                        className="font-ligconsolata"
                        value={amountReceived}
                        onChange={(event) => setAmountReceived(event.target.value)}
                        error={hasInput && !isEnough ? "Amount received is less than the amount due" : undefined}
                        autoFocus
                        required
                    />
                </div>

                <div className="flex items-baseline gap-3">
                    <Text size="mediumSmall" font="ligconsolata" weight="bold" variant="maroon">
                        CHANGE:
                    </Text>
                    <Text size="mediumSmall" font="ligconsolata" weight="medium" variant="maroon">
                        {formatMoney(change)}
                    </Text>
                </div>
            </form>
        </PaymentPopupShell>
    );
}

const E_CASH_STEPS = ["scan", "pending", "received"] as const;

export function ECashPaymentPopup() {
    const navigate = useNavigatePage();
    const { amountDue } = usePaymentContext();

    const step = useMockPaymentSteps(E_CASH_STEPS);

    const handleClose = () => navigate(ROUTES.CASHIER.pointOfSale, true);

    // Resets the transaction (clear the cart) once the transaction endpoint exists
    const handleFinish = handleClose;

    if (step === "received") {
        return (
            <PaymentPopupShell
                title="E-CASH PAYMENT"
                onClose={handleFinish}
                actions={
                    <>
                        <ActionButton variant="main" onClick={handleFinish}>
                            FINISH
                        </ActionButton>
                        {/* TODO: Print the receipt once receipts exist */}
                        <ActionButton onClick={() => {}}>PRINT RECEIPT</ActionButton>
                    </>
                }
            >
                <PaymentSuccess
                    title="PAYMENT RECEIVED!"
                    details={[
                        ["Reference No", MOCK_E_CASH_REFERENCE_NO],
                        ["Amount", `PHP ${formatMoney(amountDue)}`],
                    ]}
                />
            </PaymentPopupShell>
        );
    }

    return (
        <PaymentPopupShell
            title="E-CASH PAYMENT"
            onClose={handleClose}
            actions={<ActionButton onClick={handleClose}>CLOSE</ActionButton>}
        >
            {step === "scan" ? (
                <>
                    <AmountDue amount={amountDue} />
                    <Text size="mediumSmall" font="ligconsolata" weight="medium" variant="maroon" align="center">
                        [ SCAN QR CODE ]
                    </Text>
                </>
            ) : (
                <StatusMessage title="Status: Pending" note="[ Waiting for payment... ]" />
            )}
        </PaymentPopupShell>
    );
}


const CARD_STEPS = ["waiting", "approved"] as const;

export function CardPaymentPopup() {
    const navigate = useNavigatePage();
    const { amountDue } = usePaymentContext();

    const step = useMockPaymentSteps(CARD_STEPS);

    const handleClose = () => navigate(ROUTES.CASHIER.pointOfSale, true);

    // Resets the transaction (clear the cart) once the transaction endpoint exists
    const handleFinish = handleClose;

    if (step === "approved") {
        return (
            <PaymentPopupShell
                title="CARD PAYMENT"
                onClose={handleFinish}
                actions={
                    <>
                        <ActionButton variant="main" onClick={handleFinish}>
                            FINISH
                        </ActionButton>
                        {/* TODO: Print the receipt once receipts exist */}
                        <ActionButton onClick={() => {}}>PRINT RECEIPT</ActionButton>
                    </>
                }
            >
                <PaymentSuccess
                    title="PAYMENT APPROVED!"
                    details={[
                        ["Card Type", MOCK_CARD.type],
                        ["Last 4 Digits", `**** ${MOCK_CARD.lastFour}`],
                        ["Auth Code", MOCK_CARD.authCode],
                    ]}
                />
            </PaymentPopupShell>
        );
    }

    return (
        <PaymentPopupShell
            title="CARD PAYMENT"
            onClose={handleClose}
            actions={<ActionButton onClick={handleClose}>CLOSE</ActionButton>}
        >
            <AmountDue amount={amountDue} note="Please tap, insert, or swipe card." />
        </PaymentPopupShell>
    );
}