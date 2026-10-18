// General Imports
import { Outlet } from "react-router";
import { useState, useEffect, type FormEvent } from "react";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Calculator } from "../../components/Calculator";
import GeneralInput from "../../components/inputs/GeneralInput";
import SearchInput from "../../components/inputs/SearchInput";
import Table from "../../components/Table";
import Icon from "../../components/Icon";

// Material UI Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AccessTime, Add, ArrowLeftRounded, CalendarMonth, Remove } from "@mui/icons-material";

export function Cashier_PointOfSale() {
    const [isCalculatorToggled, setIsCalculatorToggled] = useState<boolean>(true);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"Cash" | "E-Cash" | "Card">("Cash");
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState("1");
    const [newItemPrice, setNewItemPrice] = useState("");
    const [addItemError, setAddItemError] = useState("");
    type Transaction = { id: string; quantity: number; name: string; price: number };
    const [transactionData, setTransactionData] = useState<Transaction[]>([
        { id: "tomato", quantity: 2, name: "Tomato", price: 10.0 },
        { id: "kamatis", quantity: 3, name: "Kamatis", price: 10.0 },
        { id: "kalamansi", quantity: 2, name: "Kalamansi", price: 5.0 },
        { id: "kalamatis", quantity: 6, name: "Kalamatis", price: 15.0 },
    ]);

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
    const amount = transactionData.reduce((total, item) => total + item.quantity * item.price, 0);
    const transNum: number = 939391;

    const discAmt: number = 125.0;
    const afterVatAmt: number = 145.09;
    const itemCnt = transactionData.reduce((total, item) => total + item.quantity, 0);

    const addItemToTransaction = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const quantity = Number(newItemQuantity);
        const price = Number(newItemPrice);

        if (
            !newItemName.trim() ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            setAddItemError("Enter an item name, whole-number quantity, and valid unit price.");
            return;
        }

        setTransactionData((items) => [
            ...items,
            {
                id: `${newItemName.trim().toLowerCase()}-${Date.now()}`,
                name: newItemName.trim(),
                quantity,
                price,
            },
        ]);
        setNewItemName("");
        setNewItemQuantity("1");
        setNewItemPrice("");
        setAddItemError("");
        setIsAddItemOpen(false);
    };

    const buttonSize = "min-w-[125px] flex-1";
    const spacing = "p-2 gap-3 m-2";

    return (
        <div className="flex flex-col h-full">
            <section className={`flex flex-col h-full ${spacing}`}>
                {/* top section */}
                <div className="flex flex-row gap-2 w-full">
                    <SearchInput className="flex-1" />
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
                                        P{amount.toFixed(2)}
                                    </Text>
                                    <div className="flex flex-row items-center justify-between">
                                        <Text variant="crimson" weight="medium" size="normal">
                                            Transaction #: {transNum}
                                        </Text>
                                        <Text variant="crimson" weight="medium" size="small">
                                            Discount : {discAmt}
                                        </Text>
                                        <Text variant="crimson" weight="medium" size="small">
                                            {" "}
                                            VAT 12% : {afterVatAmt}
                                        </Text>
                                        <Text variant="crimson" weight="medium" size="small">
                                            Items: {itemCnt}
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
                                    {transactionData.map((transaction) => (
                                        <Table.Row key={transaction.id}>
                                            <Table.Data>
                                                <div className="flex flex-row justify-center gap-[10%] items-center">
                                                    <Button size="smallest" leftIcon={Add}></Button>
                                                    {transaction.quantity}
                                                    <Button size="smallest" variant="grey" leftIcon={Remove}></Button>
                                                </div>
                                            </Table.Data>
                                            <Table.Data text={transaction.name}></Table.Data>
                                            <Table.Data text={transaction.price.toFixed(2)}></Table.Data>
                                            <Table.Data
                                                text={(transaction.quantity * transaction.price).toFixed(2)}
                                            ></Table.Data>
                                        </Table.Row>
                                    ))}
                                </Table>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    className="self-start"
                                    variant="transparent"
                                    size="small"
                                    leftIcon={Add}
                                    aria-expanded={isAddItemOpen}
                                    onClick={() => {
                                        setIsAddItemOpen((open) => !open);
                                        setAddItemError("");
                                    }}
                                >
                                    Add item
                                </Button>
                                {isAddItemOpen && (
                                    <form
                                        className="flex flex-wrap items-end gap-2 rounded-md border border-crimson/30 bg-off-white p-3"
                                        onSubmit={addItemToTransaction}
                                    >
                                        <div className="min-w-40 flex-1">
                                            <GeneralInput
                                                id="pos-new-item-name"
                                                name="itemName"
                                                type="text"
                                                label="Item name"
                                                placeholder="Enter item name"
                                                value={newItemName}
                                                onChange={(event) => setNewItemName(event.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="w-24">
                                            <GeneralInput
                                                id="pos-new-item-quantity"
                                                name="itemQuantity"
                                                type="number"
                                                label="Quantity"
                                                min="1"
                                                step="1"
                                                value={newItemQuantity}
                                                onChange={(event) => setNewItemQuantity(event.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="w-32">
                                            <GeneralInput
                                                id="pos-new-item-price"
                                                name="itemPrice"
                                                type="number"
                                                label="Unit price"
                                                min="0"
                                                step="0.01"
                                                value={newItemPrice}
                                                onChange={(event) => setNewItemPrice(event.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" size="normal" leftIcon={Add}>
                                            Add to transaction
                                        </Button>
                                        {addItemError && <p className="w-full text-sm text-crimson">{addItemError}</p>}
                                    </form>
                                )}
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

                                        <div
                                            className="flex flex-row gap-3 items-center w-full"
                                            role="group"
                                            aria-label="Payment method"
                                        >
                                            {(["Cash", "E-Cash", "Card"] as const).map((method) => {
                                                const isSelected = selectedPaymentMethod === method;
                                                return (
                                                    <Button
                                                        key={method}
                                                        className={`${buttonSize} ${isSelected ? "bg-crimson! text-cream! ring-2 ring-crimson ring-offset-2" : ""}`}
                                                        variant={isSelected ? "main" : "transparent"}
                                                        size="medium"
                                                        aria-pressed={isSelected}
                                                        onClick={() => setSelectedPaymentMethod(method)}
                                                    >
                                                        {method}
                                                    </Button>
                                                );
                                            })}
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
                                            <Button className={`${buttonSize}`} variant="transparent" size="medium">
                                                Suspend
                                            </Button>
                                            <Button className={`${buttonSize}`} variant="transparent" size="medium">
                                                Resume
                                            </Button>
                                            <Button className={`${buttonSize}`} variant="transparent" size="medium">
                                                Void
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                                <Card.Body></Card.Body>
                                <div className="w-full mb-3">
                                    <Button className="w-full!" variant="main" size="medium">
                                        Pay
                                    </Button>
                                </div>
                            </Card>
                        </div>
                        {/* Calculator toggle */}
                        {isCalculatorToggled ? (
                            <Calculator handleToggle={setIsCalculatorToggled} />
                        ) : (
                            <Button
                                className="absolute group -right-14.5 bottom-1/2"
                                variant="grey"
                                size="medium"
                                leftIcon={ArrowLeftRounded}
                                onClick={() => setIsCalculatorToggled((e) => !e)}
                            >
                                <span className="hidden group-hover:inline">Keypad</span>
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </div>
    );
}

export default Cashier_PointOfSale;
