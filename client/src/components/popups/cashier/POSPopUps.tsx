import { useEffect, useState, type ReactNode, type FormEvent } from "react";
import { useOutletContext } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";
import type { BranchInventoryProduct } from "@buybuyin/shared/schema/branchInventory";
import { formatMoney, toCents } from "../../../utils/moneyUtils";
// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";
import { usePos } from "../../../context/PosContext";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";

// Material UI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { MOCK_E_CASH_REFERENCE_NO, MOCK_CARD } from "../../../TESTINGDATA/paymentData";

export function QtyPopUp() {
    const navigate = useNavigatePage();
    const { cart, quantityProduct, searchInventory, setProductQuantity } = usePos();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<BranchInventoryProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<BranchInventoryProduct | null>(
        quantityProduct ?? cart[0]?.product ?? null
    );
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [quantity, setQuantity] = useState(
        String(cart.find((line) => line.product.id === (quantityProduct ?? cart[0]?.product)?.id)?.quantity ?? 1)
    );
    const selectedLine = cart.find((line) => line.product.id === selectedProduct?.id);

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!search.trim()) return;
        setIsSearching(true);
        setSearchError("");
        try {
            setResults(await searchInventory(search.trim()));
        } catch (error) {
            setSearchError(error instanceof Error ? error.message : "Unable to search branch inventory.");
        } finally {
            setIsSearching(false);
        }
    };

    const selectProduct = (product: BranchInventoryProduct) => {
        setSelectedProduct(product);
        setQuantity(String(cart.find((line) => line.product.id === product.id)?.quantity ?? 1));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextQuantity = Number(quantity);
        if (!selectedProduct || !Number.isInteger(nextQuantity) || nextQuantity < 0) return;
        setProductQuantity(selectedProduct, nextQuantity);
        navigate();
    };

    return (
        <PopUp title="Enter Product Quantity">
            <div className="flex flex-col gap-4">
                <form className="flex flex-col gap-3" onSubmit={handleSearch}>
                    <GeneralInput
                        label="Find product by name or ID"
                        type="text"
                        placeholder="Product name, ID, or SKU"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <Button type="submit" size="medium" disabled={!search.trim() || isSearching}>
                        {isSearching ? "Searching..." : "Search"}
                    </Button>
                </form>
                {searchError && (
                    <Text variant="crimson" role="alert">
                        {searchError}
                    </Text>
                )}
                {results.length > 0 && (
                    <div className="max-h-40 overflow-auto rounded border border-brown/30">
                        {results.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                className="flex w-full justify-between border-b border-brown/20 px-3 py-2 text-left text-brown hover:bg-cream"
                                onClick={() => selectProduct(product)}
                            >
                                <span>{product.productName}</span>
                                <span>SKU-{String(product.id).padStart(4, "0")}</span>
                            </button>
                        ))}
                    </div>
                )}
                {selectedProduct && (
                    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                        <Text variant="brown">
                            Selected: {selectedProduct.productName}
                            {selectedLine ? ` (in cart: ${selectedLine.quantity})` : " (not yet in cart)"}
                        </Text>
                        <GeneralInput
                            label="Set quantity"
                            type="number"
                            min={0}
                            step={1}
                            value={quantity}
                            onChange={(event) => setQuantity(event.target.value)}
                            required
                        />
                        <Text size="small" variant="brown">
                            Use 0 to remove this item from the sale.
                        </Text>
                        <Button type="submit" size="medium">
                            Apply quantity
                        </Button>
                    </form>
                )}
                <div className="flex justify-center">
                    <Button type="button" size="medium" variant="grey" onClick={() => navigate()}>
                        Cancel
                    </Button>
                </div>
            </div>
        </PopUp>
    );
}

export function AddItemPopUp() {
    //TODO:change the value to the standardized format
    const gap = "gap-[1rem]";
    return (
        <PopUp title="Enter Product">
            <form className={`flex flex-col ${gap}`}>
                <Text size="mediumBig" weight="medium">
                    Product Name/ID
                </Text>
                <GeneralInput placeholder="e.g. Tomato sauce" type="text"></GeneralInput>
                <Text size="mediumBig" weight="medium">
                    Quantity
                </Text>
                <GeneralInput placeholder="e.g. 2,3 10" type="text"></GeneralInput>
                {/*<KeyboardOverlay></KeyboardOverlay>*/}
                <div className="flex flex-row gap-[2rem] justify-center">
                    <Button size="medium">Apply</Button>
                    <Button size="medium" variant="grey">
                        Cancel
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}
export function DiscountPopUp() {
    const navigate = useNavigatePage();
    const { subtotal, discount, seniorDiscountCustomer, setSeniorDiscountCustomer } = usePos();
    const [isEnabled, setIsEnabled] = useState(seniorDiscountCustomer !== null);
    const [customerId, setCustomerId] = useState(seniorDiscountCustomer?.id ?? "");
    const [customerName, setCustomerName] = useState(seniorDiscountCustomer?.name ?? "");
    const [error, setError] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isEnabled) {
            setSeniorDiscountCustomer(null);
            navigate();
            return;
        }

        if (!customerId.trim() || !customerName.trim()) {
            setError("Enter both the PWD/Senior ID and customer name.");
            return;
        }

        setSeniorDiscountCustomer({ id: customerId.trim(), name: customerName.trim() });
        navigate();
    };

    return (
        <PopUp title="Apply Discount">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Text variant="brown">
                    Subtotal: {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(subtotal)}
                </Text>
                <label className="flex items-center gap-3 text-brown">
                    <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(event) => {
                            setIsEnabled(event.target.checked);
                            setError("");
                        }}
                    />
                    Apply PWD/Senior 20% discount
                </label>
                <GeneralInput
                    label="PWD/Senior ID"
                    type="text"
                    value={customerId}
                    onChange={(event) => setCustomerId(event.target.value)}
                    disabled={!isEnabled}
                    required={isEnabled}
                />
                <GeneralInput
                    label="Name"
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    disabled={!isEnabled}
                    required={isEnabled}
                />
                <Text variant="brown">
                    20% discount:{" "}
                    {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
                        Math.round(subtotal * 0.2 * 100) / 100
                    )}
                    Current discount:{" "}
                    {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(discount)}
                </Text>
                {error && (
                    <Text variant="crimson" role="alert">
                        {error}
                    </Text>
                )}
                <div className="flex justify-center gap-4">
                    <Button type="submit" size="medium" disabled={isEnabled && subtotal <= 0}>
                        {isEnabled ? "Apply 20%" : "Remove discount"}
                    </Button>
                    <Button type="button" size="medium" variant="grey" onClick={() => navigate()}>
                        Cancel
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

//export function CheckPricePopUp() {
//    //TODO:change the value to the standardized format
//    const gap = "gap-[1rem]";
//    return (
//        <PopUp title="Check Price">
//            <form className={`flex flex-col ${gap}`}>
//                <Text size="mediumBig" weight="medium">
//                    Product Name/ID
//                </Text>
//                <GeneralInput placeholder="e.g. Tomato sauce" type="text"></GeneralInput>
//                <Text size="mediumBig" weight="medium">
//                    Price
//                </Text>
//                <GeneralInput placeholder="..." disabled type="text"></GeneralInput>
//                {/*<KeyboardOverlay></KeyboardOverlay>*/}
//                <div className="flex flex-row gap-[2rem] justify-center">
//                    <Button size="medium">Apply</Button>
//                    <Button size="medium" variant="grey">
//                        Cancel
//                    </Button>
//                </div>
//            </form>
//        </PopUp>
//    );
//}

export type PaymentOutletContext = {
    amountDue: number;
    transactionNumber: number;
    completePayment: (paymentMethod: "CASH" | "ECASH" | "CARD") => Promise<number>;
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
    const { amountDue, completePayment } = usePaymentContext();
    const [paymentAmount] = useState(amountDue);

    const [amountReceived, setAmountReceived] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [savedTransactionId, setSavedTransactionId] = useState<number | null>(null);

    const handleClose = () => navigate(ROUTES.CASHIER.pointOfSale, true);

    const hasInput = amountReceived !== "";
    const isEnough = hasInput && toCents(Number(amountReceived)) >= toCents(paymentAmount);
    const change = isEnough ? Number(amountReceived) - paymentAmount : 0;

    const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isEnough || isSubmitting) return;

        setIsSubmitting(true);
        setError("");
        try {
            setSavedTransactionId(await completePayment("CASH"));
        } catch (paymentError) {
            setError(paymentError instanceof Error ? paymentError.message : "Unable to save the transaction.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formId = "cashPaymentForm";

    if (savedTransactionId !== null) {
        return (
            <PaymentPopupShell
                title="CASH PAYMENT COMPLETE"
                onClose={handleClose}
                actions={
                    <ActionButton variant="main" onClick={handleClose}>
                        FINISH
                    </ActionButton>
                }
            >
                <PaymentSuccess
                    title="PAYMENT RECEIVED!"
                    details={[
                        ["Transaction No", String(savedTransactionId)],
                        ["Amount", `PHP ${formatMoney(paymentAmount)}`],
                    ]}
                />
            </PaymentPopupShell>
        );
    }

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
                        disabled={!isEnough || isSubmitting}
                    >
                        {isSubmitting ? "SAVING..." : "CONFIRM PAYMENT"}
                    </Button>
                    <ActionButton onClick={handleClose}>CANCEL</ActionButton>
                </>
            }
        >
            <AmountDue amount={paymentAmount} />

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
                {error && (
                    <Text variant="crimson" role="alert">
                        {error}
                    </Text>
                )}
            </form>
        </PaymentPopupShell>
    );
}

const E_CASH_STEPS = ["scan", "pending", "received"] as const;

export function ECashPaymentPopup() {
    const navigate = useNavigatePage();
    const { amountDue, completePayment } = usePaymentContext();
    const [paymentAmount] = useState(amountDue);

    const step = useMockPaymentSteps(E_CASH_STEPS);
    const [savedTransactionId, setSavedTransactionId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleClose = () => navigate(ROUTES.CASHIER.pointOfSale, true);

    const handleFinish = async () => {
        if (savedTransactionId !== null) {
            handleClose();
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);
        setError("");
        try {
            setSavedTransactionId(await completePayment("ECASH"));
        } catch (paymentError) {
            setError(paymentError instanceof Error ? paymentError.message : "Unable to save the transaction.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === "received") {
        return (
            <PaymentPopupShell
                title="E-CASH PAYMENT"
                onClose={handleClose}
                actions={
                    <>
                        <ActionButton variant="main" onClick={handleFinish}>
                            {isSubmitting ? "SAVING..." : savedTransactionId === null ? "CONFIRM & SAVE" : "FINISH"}
                        </ActionButton>
                        {/* TODO: Print the receipt once receipts exist */}
                        <ActionButton onClick={() => {}}>PRINT RECEIPT</ActionButton>
                    </>
                }
            >
                <>
                    <PaymentSuccess
                        title="PAYMENT RECEIVED!"
                        details={[
                            ["Reference No", MOCK_E_CASH_REFERENCE_NO],
                            ["Amount", `PHP ${formatMoney(paymentAmount)}`],
                            ...(savedTransactionId === null
                                ? []
                                : [["Transaction No", String(savedTransactionId)] as [string, string]]),
                        ]}
                    />
                    {error && (
                        <Text variant="crimson" role="alert">
                            {error}
                        </Text>
                    )}
                </>
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
                    <AmountDue amount={paymentAmount} />
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
    const { amountDue, completePayment } = usePaymentContext();
    const [paymentAmount] = useState(amountDue);

    const step = useMockPaymentSteps(CARD_STEPS);
    const [savedTransactionId, setSavedTransactionId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleClose = () => navigate(ROUTES.CASHIER.pointOfSale, true);

    const handleFinish = async () => {
        if (savedTransactionId !== null) {
            handleClose();
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);
        setError("");
        try {
            setSavedTransactionId(await completePayment("CARD"));
        } catch (paymentError) {
            setError(paymentError instanceof Error ? paymentError.message : "Unable to save the transaction.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === "approved") {
        return (
            <PaymentPopupShell
                title="CARD PAYMENT"
                onClose={handleClose}
                actions={
                    <>
                        <ActionButton variant="main" onClick={handleFinish}>
                            {isSubmitting ? "SAVING..." : savedTransactionId === null ? "CONFIRM & SAVE" : "FINISH"}
                        </ActionButton>
                        {/* TODO: Print the receipt once receipts exist */}
                        <ActionButton onClick={() => {}}>PRINT RECEIPT</ActionButton>
                    </>
                }
            >
                <>
                    <PaymentSuccess
                        title="PAYMENT APPROVED!"
                        details={[
                            ["Card Type", MOCK_CARD.type],
                            ["Last 4 Digits", `**** ${MOCK_CARD.lastFour}`],
                            ["Auth Code", MOCK_CARD.authCode],
                            ...(savedTransactionId === null
                                ? []
                                : [["Transaction No", String(savedTransactionId)] as [string, string]]),
                        ]}
                    />
                    {error && (
                        <Text variant="crimson" role="alert">
                            {error}
                        </Text>
                    )}
                </>
            </PaymentPopupShell>
        );
    }

    return (
        <PaymentPopupShell
            title="CARD PAYMENT"
            onClose={handleClose}
            actions={<ActionButton onClick={handleClose}>CLOSE</ActionButton>}
        >
            <AmountDue amount={paymentAmount} note="Please tap, insert, or swipe card." />
        </PaymentPopupShell>
    );
}
