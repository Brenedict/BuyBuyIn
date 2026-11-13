// General Imports
import { Outlet } from "react-router";
import { useState, useEffect } from "react";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import Icon from "../../components/Icon";
import useNavigatePage from "../../hooks/useNavigatePage";
import type { BranchInventoryProduct } from "@buybuyin/shared/schema/branchInventory";
import { createPosTransaction, searchPosInventory } from "../../api/posService";
import {
    PosProvider,
    type PosCartLine,
    type SeniorDiscountCustomer,
    type SuspendedPosSale,
} from "../../context/PosContext";

// Material UI Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AccessTime, Add, CalendarMonth, Remove } from "@mui/icons-material";

type PaymentMethod = "CASH" | "ECASH" | "CARD";

const SUSPENDED_SALES_STORAGE_KEY = "buybuyin.cashier.suspended-sales";

const isStoredProduct = (value: unknown): value is BranchInventoryProduct => {
    if (!value || typeof value !== "object") return false;
    const product = value as Partial<BranchInventoryProduct>;
    return (
        Number.isInteger(product.id) &&
        typeof product.productName === "string" &&
        typeof product.basePrice === "number" &&
        Number.isFinite(product.basePrice) &&
        typeof product.shelfPrice === "number" &&
        Number.isFinite(product.shelfPrice) &&
        typeof product.sku === "string"
    );
};

const readSuspendedSales = (): SuspendedPosSale[] => {
    try {
        const stored = window.localStorage.getItem(SUSPENDED_SALES_STORAGE_KEY);
        if (!stored) return [];

        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((sale): sale is SuspendedPosSale => {
            if (!sale || typeof sale !== "object") return false;
            const candidate = sale as Partial<SuspendedPosSale>;
            const customer = candidate.seniorDiscountCustomer;
            const validCustomer =
                customer === null ||
                (typeof customer === "object" && typeof customer.id === "string" && typeof customer.name === "string");

            return (
                typeof candidate.id === "string" &&
                typeof candidate.createdAt === "string" &&
                typeof candidate.amountDue === "number" &&
                Number.isFinite(candidate.amountDue) &&
                candidate.amountDue >= 0 &&
                validCustomer &&
                Array.isArray(candidate.cart) &&
                candidate.cart.length > 0 &&
                candidate.cart.every(
                    (line) =>
                        line && Number.isInteger(line.quantity) && line.quantity > 0 && isStoredProduct(line.product)
                )
            );
        });
    } catch {
        return [];
    }
};

const saveSuspendedSales = (sales: SuspendedPosSale[]): boolean => {
    try {
        window.localStorage.setItem(SUSPENDED_SALES_STORAGE_KEY, JSON.stringify(sales));
        return true;
    } catch {
        return false;
    }
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);

function SideBar({ isRetail, onToggleRetail }: { isRetail: boolean; onToggleRetail: () => void }) {
    const navigate = useNavigatePage();

    return (
        <nav className="flex flex-col justify-center p-[1.25rem] gap-[1.5rem] rounded-[10px] bg-cream/40 card-glass-effect card-drop-shadow">
            {/*TODO: Remove this button I think because its redundant*/}
            <Button variant="grey" size="medium" onClick={() => navigate("quantity")}>
                QTY
            </Button>
            <Button variant="grey" size="medium" onClick={() => navigate("search")}>
                SEARCH ITEM
            </Button>
            <Button variant="grey" size="medium" onClick={() => navigate("discount")}>
                DISC
            </Button>
            <Button variant="grey" size="medium" onClick={() => navigate("checkprice")}>
                CHK PRC
            </Button>
            <Button variant={isRetail ? "main" : "secondary"} size="medium" onClick={onToggleRetail}>
                {isRetail ? "Retail" : "Wholesale"}
            </Button>
            <Button variant="grey" size="medium" onClick={() => navigate("reprint")}>
                REPRINT
            </Button>
            {/*TODO: Remove this button I think because its redundant*/}
            <Button variant="grey" size="medium" onClick={() => navigate("suspended")}>
                SUSPENDED
            </Button>
            <Button variant="grey" size="medium">
                CASHOUT
            </Button>
            <Button variant="main" size="medium">
                SUBTOTAL
            </Button>
        </nav>
    );
}
export function Cashier_PointOfSale() {
    //TODO: Temporary search workaround to be changed once pop ups are approved
    const navigate = useNavigatePage();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [isRetail, setIsRetail] = useState(true);
    const [cart, setCart] = useState<PosCartLine[]>([]);
    const [quantityProduct, setQuantityProduct] = useState<BranchInventoryProduct | null>(null);
    const [suspendedSales, setSuspendedSales] = useState<SuspendedPosSale[]>(readSuspendedSales);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");
    const [lastTransactionId, setLastTransactionId] = useState<number | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        // Clean up the timer when the component unmounts
        return () => clearInterval(timer);
    }, []);

    const date = new Date();
    const current = date.toDateString();

    const terminalNumber: number = 1;
    const cashierNum: number = 1;
    const getPrice = (product: BranchInventoryProduct) => (isRetail ? product.shelfPrice : product.basePrice);
    const itemCount = cart.reduce((total, line) => total + line.quantity, 0);
    const subtotal = cart.reduce((total, line) => total + getPrice(line.product) * line.quantity, 0);
    const [seniorDiscountCustomer, setSeniorDiscountCustomer] = useState<SeniorDiscountCustomer | null>(null);
    const appliedDiscount = seniorDiscountCustomer ? Math.round(subtotal * 0.2 * 100) / 100 : 0;
    const total = Math.max(0, subtotal - appliedDiscount);
    const vatAmount = Math.round(((total * 12) / 112) * 100) / 100;

    const addProduct = (product: BranchInventoryProduct) => {
        setCart((currentCart) => {
            const existing = currentCart.find((line) => line.product.id === product.id);
            if (existing) {
                return currentCart.map((line) =>
                    line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line
                );
            }

            return [...currentCart, { product, quantity: 1 }];
        });
        setLastTransactionId(null);
        setCheckoutError("");
    };

    const changeQuantity = (productId: number, amount: number) => {
        setCart((currentCart) =>
            currentCart
                .map((line) => (line.product.id === productId ? { ...line, quantity: line.quantity + amount } : line))
                .filter((line) => line.quantity > 0)
        );
        setLastTransactionId(null);
    };

    const setProductQuantity = (product: BranchInventoryProduct, quantity: number) => {
        setCart((currentCart) => {
            if (quantity === 0) {
                return currentCart.filter((line) => line.product.id !== product.id);
            }

            const alreadyInCart = currentCart.some((line) => line.product.id === product.id);
            if (!alreadyInCart) return [...currentCart, { product, quantity }];

            return currentCart.map((line) => (line.product.id === product.id ? { ...line, quantity } : line));
        });
        setLastTransactionId(null);
    };

    const openQuantityPopup = (product: BranchInventoryProduct) => {
        setQuantityProduct(product);
        navigate("quantity");
    };

    const suspendCurrentSale = () => {
        if (!cart.length) return;
        const sale: SuspendedPosSale = {
            id: `S-${Date.now()}`,
            cart: cart.map((line) => ({ ...line })),
            seniorDiscountCustomer,
            createdAt: new Date().toISOString(),
            amountDue: total,
        };
        const nextSuspendedSales = [sale, ...suspendedSales];
        setSuspendedSales(nextSuspendedSales);
        if (!saveSuspendedSales(nextSuspendedSales)) {
            setCheckoutError("Suspended sale is temporary because browser storage is unavailable.");
        }
        setCart([]);
        setSeniorDiscountCustomer(null);
    };

    const resumeSuspendedSale = (saleId: string) => {
        const sale = suspendedSales.find((candidate) => candidate.id === saleId);
        if (!sale) return;

        let nextSuspendedSales: SuspendedPosSale[];
        if (cart.length) {
            const currentSale: SuspendedPosSale = {
                id: `S-${Date.now()}`,
                cart: cart.map((line) => ({ ...line })),
                seniorDiscountCustomer,
                createdAt: new Date().toISOString(),
                amountDue: total,
            };
            nextSuspendedSales = [currentSale, ...suspendedSales.filter((candidate) => candidate.id !== saleId)];
        } else {
            nextSuspendedSales = suspendedSales.filter((candidate) => candidate.id !== saleId);
        }

        setSuspendedSales(nextSuspendedSales);
        if (!saveSuspendedSales(nextSuspendedSales)) {
            setCheckoutError("Suspended sales could not be updated in browser storage.");
        }

        setCart(sale.cart);
        setSeniorDiscountCustomer(sale.seniorDiscountCustomer);
        setLastTransactionId(null);
    };

    const voidCurrentSale = () => {
        setCart([]);
        setSeniorDiscountCustomer(null);
        setCheckoutError("");
        setLastTransactionId(null);
    };

    const voidProduct = (productId: number) => {
        setCart((currentCart) => currentCart.filter((line) => line.product.id !== productId));
        if (cart.length === 1 && cart[0]?.product.id === productId) {
            setSeniorDiscountCustomer(null);
        }
        setCheckoutError("");
        setLastTransactionId(null);
    };

    const completePayment = async (method: PaymentMethod): Promise<number> => {
        if (!cart.length || isSubmitting) throw new Error("There are no items to pay for.");

        setIsSubmitting(true);
        setCheckoutError("");
        try {
            const result = await createPosTransaction({
                paymentMethod: method,
                discount: appliedDiscount,
                items: cart.map((line) => ({
                    productId: line.product.id,
                    quantity: line.quantity,
                    currentPrice: getPrice(line.product),
                    isBundle: false,
                })),
            });
            setLastTransactionId(result.transaction.id);
            setCart([]);
            setSeniorDiscountCustomer(null);
            return result.transaction.id;
        } catch (error) {
            setCheckoutError(error instanceof Error ? error.message : "Unable to complete this transaction.");
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const openPaymentPopup = () => {
        if (!cart.length || isSubmitting) return;
        navigate(`payment/${paymentMethod.toLowerCase()}`);
    };

    const buttonSize = "min-w-[125px] flex-1";
    const spacing = "p-2 gap-3 m-2";

    return (
        <PosProvider
            value={{
                cart,
                quantityProduct,
                subtotal,
                discount: appliedDiscount,
                seniorDiscountCustomer,
                searchInventory: searchPosInventory,
                addProduct,
                setQuantityProduct,
                setProductQuantity,
                setSeniorDiscountCustomer,
                suspendedSales,
                suspendCurrentSale,
                resumeSuspendedSale,
                voidProduct,
                voidCurrentSale,
            }}
        >
            <div className="flex flex-col h-full">
                <section className={`flex flex-col h-full ${spacing}`}>
                    {/* top section */}
                    <div className="flex flex-row justify-end w-full">
                        <div className="flex flex-row">
                            <Icon icon={AccountCircleIcon} size="large" variant="cream" />
                            <Text size="bigger" variant="cream" weight="extraBold">
                                Cashier {cashierNum}
                            </Text>
                        </div>
                    </div>

                    {/* calendar and time */}
                    <div className={`flex flex-col h-full mt-3 relative`}>
                        <div className="flex flex-row gap-7 items-center justify-center">
                            <Text size="big" variant="crimson" weight="bold">
                                Cashier POS
                            </Text>
                            <div className="flex flex-row">
                                <Icon icon={CalendarMonth} size="bigger" variant="crimson"></Icon>
                                {/*TODO make the date and time actually track current date and time*/}
                                <Text size="big" variant="crimson" weight="bold">
                                    {current}
                                </Text>
                            </div>

                            <div className="flex flex-row">
                                <Icon icon={AccessTime} size="bigger" variant="crimson"></Icon>
                                <Text size="big" variant="crimson" weight="bold">
                                    {currentTime}
                                </Text>
                            </div>

                            {/*Separator line*/}
                            <div className="h-[2px] w-[20%] flex-1 bg-brown"></div>
                            <Text size="big" variant="crimson" weight="bold">
                                POS Terminal {terminalNumber}
                            </Text>
                        </div>
                        {/* Amount Due Display */}
                        <div className={`flex flex-row w-full h-full px-0! ${spacing}`}>
                            <div className={`flex flex-col flex-1 gap-2 h-full`}>
                                <Card isGlass={false} dropShadow className="flex-1 h-fit! bg-off-white">
                                    <Card.Body>
                                        <Text variant="crimson" weight="bold" size="big">
                                            TOTAL AMOUNT DUE
                                        </Text>
                                        <Text variant="crimson" weight="extraBold" size="large">
                                            {formatCurrency(total)}
                                        </Text>
                                        <div className="flex flex-row items-center justify-between">
                                            <Text variant="crimson" weight="medium" size="normal">
                                                Transaction #: {lastTransactionId ?? "Not saved"}
                                            </Text>
                                            <Text variant="crimson" weight="medium" size="small">
                                                Discount: {formatCurrency(appliedDiscount)}
                                            </Text>
                                            <Text variant="crimson" weight="medium" size="small">
                                                VAT 12%: {formatCurrency(vatAmount)}
                                            </Text>
                                            <Text variant="crimson" weight="medium" size="small">
                                                Items: {itemCount}
                                            </Text>
                                        </div>
                                    </Card.Body>
                                </Card>

                                {/* transactions table */}
                                <div className="h-2/5 min-h-0 max-h-[44vh] justify-center items-center overflow-auto flex-2">
                                    <Table rounded shadow pagination={{ maxItems: 10 }}>
                                        <Table.Row borderedBottom>
                                            <Table.Header textVariant="cream" text="Quantity" />
                                            <Table.Header textVariant="cream" text="Description" />
                                            <Table.Header textVariant="cream" text="Price" />
                                            <Table.Header textVariant="cream" text="Amount" />
                                        </Table.Row>
                                        {cart.map((line) => (
                                            <Table.Row key={line.product.id}>
                                                <Table.Data>
                                                    <div className="flex flex-row justify-center gap-[10%] items-center">
                                                        {/*TODO: Change the quantity buttons and add yung basta pwede maedit yung number yeah*/}
                                                        <Button
                                                            size="smallest"
                                                            leftIcon={Add}
                                                            aria-label={`Add one ${line.product.productName}`}
                                                            onClick={() => changeQuantity(line.product.id, 1)}
                                                        />
                                                        {line.quantity}
                                                        <Button
                                                            size="smallest"
                                                            variant="grey"
                                                            leftIcon={Remove}
                                                            aria-label={`Remove one ${line.product.productName}`}
                                                            onClick={() => changeQuantity(line.product.id, -1)}
                                                        />
                                                    </div>
                                                </Table.Data>
                                                <Table.Data>
                                                    <button
                                                        type="button"
                                                        className="text-brown underline-offset-2 hover:underline"
                                                        onClick={() => openQuantityPopup(line.product)}
                                                    >
                                                        {line.product.productName}
                                                    </button>
                                                </Table.Data>
                                                <Table.Data
                                                    text={formatCurrency(getPrice(line.product))}
                                                    className="cursor-pointer"
                                                    onClick={() => openQuantityPopup(line.product)}
                                                />
                                                <Table.Data
                                                    text={formatCurrency(line.quantity * getPrice(line.product))}
                                                    className="cursor-pointer"
                                                    onClick={() => openQuantityPopup(line.product)}
                                                />
                                            </Table.Row>
                                        ))}
                                        {!cart.length && (
                                            <Table.Row>
                                                <Table.Data colSpan={4}>
                                                    <Text align="center" variant="brown">
                                                        Search and select a product to start a sale.
                                                    </Text>
                                                </Table.Data>
                                            </Table.Row>
                                        )}
                                    </Table>
                                </div>

                                {/* Actions panel */}
                                <Card className="flex flex-col flex-1 justify-center items-center px-10">
                                    <Card.Body className="flex flex-row justify-between w-full">
                                        <div className="flex flex-col items-center justify-center w-[45%] gap-2">
                                            <div className="flex flex-row w-full items-center justify-center gap-2">
                                                <div className="bg-brown h-[2px] w-full flex-1"></div>
                                                <Text className="" variant="crimson" size="medium" weight="bold">
                                                    SELECT MODE OF PAYMENT
                                                </Text>
                                                <div className="bg-brown h-[2px] w-full flex-1"></div>
                                            </div>

                                            <div className="flex flex-row gap-3 items-center  w-full">
                                                <Button
                                                    className={`${buttonSize}`}
                                                    variant={paymentMethod === "CASH" ? "main" : "transparent"}
                                                    size="medium"
                                                    onClick={() => setPaymentMethod("CASH")}
                                                >
                                                    Cash
                                                </Button>
                                                <Button
                                                    className={`${buttonSize}`}
                                                    variant={paymentMethod === "ECASH" ? "main" : "transparent"}
                                                    size="medium"
                                                    onClick={() => setPaymentMethod("ECASH")}
                                                >
                                                    E-Cash
                                                </Button>
                                                <Button
                                                    className={`${buttonSize}`}
                                                    variant={paymentMethod === "CARD" ? "main" : "transparent"}
                                                    size="medium"
                                                    onClick={() => setPaymentMethod("CARD")}
                                                >
                                                    Card
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center w-[45%] gap-2 ">
                                            <div className="flex flex-row w-full items-center justify-center gap-2">
                                                <div className="bg-brown h-[2px] w-full flex-1"></div>
                                                <Text className="" variant="crimson" size="medium" weight="bold">
                                                    Transaction Actions
                                                </Text>
                                                <div className="bg-brown h-[2px] w-full flex-1"></div>
                                            </div>
                                            <div className="flex flex-row gap-3 items-center w-full">
                                                <Button
                                                    className={`${buttonSize}`}
                                                    variant="transparent"
                                                    size="medium"
                                                    onClick={suspendCurrentSale}
                                                    disabled={!cart.length}
                                                >
                                                    Suspend
                                                </Button>
                                                <Button
                                                    className={`${buttonSize}`}
                                                    variant="transparent"
                                                    size="medium"
                                                    onClick={() => navigate("suspended")}
                                                >
                                                    Resume
                                                </Button>
                                                <Button
                                                    className={`${buttonSize}`}
                                                    variant="transparent"
                                                    size="medium"
                                                    onClick={() => navigate("void")}
                                                    disabled={!cart.length}
                                                >
                                                    Void
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                    <Card.Body></Card.Body>
                                    <div className="w-full mb-3">
                                        {checkoutError && (
                                            <Text className="mb-2" variant="crimson" role="alert">
                                                {checkoutError}
                                            </Text>
                                        )}
                                        <Button
                                            className="w-full!"
                                            variant="main"
                                            size="medium"
                                            onClick={openPaymentPopup}
                                            disabled={!cart.length || isSubmitting}
                                        >
                                            {isSubmitting ? "Processing..." : "Pay"}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                            <SideBar isRetail={isRetail} onToggleRetail={() => setIsRetail((current) => !current)} />
                        </div>
                    </div>
                </section>

                {
                    // Displays all global and page popups
                    <Outlet
                        context={{
                            amountDue: total,
                            transactionNumber: lastTransactionId ?? 0,
                            completePayment,
                        }}
                    />
                }
            </div>
        </PosProvider>
    );
}

export default Cashier_PointOfSale;
