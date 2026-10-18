// General Imports
import { Outlet } from "react-router";
import { useState, useEffect } from "react";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Calculator, type CalculatorDiscount } from "../../components/Calculator";
import SearchInput from "../../components/inputs/SearchInput";
import Table from "../../components/Table";
import Icon from "../../components/Icon";

// Material UI Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AccessTime, Add, ArrowLeftRounded, CalendarMonth, Remove } from "@mui/icons-material";

export function Cashier_PointOfSale() {
    const [isCalculatorToggled, setIsCalculatorToggled] = useState<boolean>(true);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [confirmedDiscount, setConfirmedDiscount] = useState<CalculatorDiscount | null>(null);
    type Transaction = { id: string; name: string; quantity: number; price: number };
    const [transactionData, setTransactionData] = useState<Transaction[]>([
        { id: "TOM-001", name: "Tomato", quantity: 2, price: 10.0 },
        { id: "KAM-001", name: "Kamatis", quantity: 3, price: 10.0 },
        { id: "KAL-001", name: "Kalamansi", quantity: 2, price: 5.0 },
        { id: "KMT-001", name: "Kalamatis", quantity: 6, price: 15.0 },
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
    const amount: number = 90.0;
    const transNum: number = 939391;

    const discountAmount = confirmedDiscount ? (amount * confirmedDiscount.percentage) / 100 : 0;
    const amountDue = amount - discountAmount;
    const afterVatAmt: number = 145.09;
    const itemCnt: number = 8;

    const updateItemQuantity = (itemIdentifier: string, quantity: number) => {
        const matchingItem = transactionData.find(
            (item) =>
                item.id.toLowerCase() === itemIdentifier.toLowerCase() ||
                item.name.toLowerCase() === itemIdentifier.toLowerCase()
        );

        if (!matchingItem) {
            return false;
        }

        setTransactionData((items) =>
            items.map((item) => (item.id === matchingItem.id ? { ...item, quantity } : item))
        );
        return true;
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
                        <Text size="big" variant="cream" weight="extraBold">
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
                        <div className={`flex flex-col gap-2 h-full w-full`}>
                            <Card isGlass={false} dropShadow className="flex flex-col flex-1 bg-off-white">
                                <Card.Body className="flex flex-col justify-between h-full py-[1.5rem]!">
                                    <Text variant="crimson" weight="bold" size="big">
                                        TOTAL AMOUNT DUE
                                    </Text>
                                    <Text variant="crimson" weight="extraBold" size="large">
                                        P{amountDue.toFixed(2)}
                                    </Text>
                                    <div className="flex flex-row items-center justify-between">
                                        <Text variant="crimson" weight="medium" size="normal">
                                            Transaction #: {transNum}
                                        </Text>
                                        <Text variant="crimson" weight="medium" size="small">
                                            Discount : P{discountAmount.toFixed(2)}
                                        </Text>
                                        <Text variant="crimson" weight="medium" size="small">
                                            {" "}
                                            VAT 12% : {afterVatAmt}
                                        </Text>
                                        <Text variant="crimson" weight="medium" size="small">
                                            Items: {itemCnt}
                                        </Text>
                                    </div>
                                    {confirmedDiscount && (
                                        <Text variant="crimson" weight="medium" size="small">
                                            Discount entry: {confirmedDiscount.type} (20%) - {confirmedDiscount.name},
                                            ID {confirmedDiscount.idNumber}
                                        </Text>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* transactions table */}
                            <div className="h-2/5 min-h-0 justify-center items-center overflow-auto flex-1">
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
                                            <Table.Data text={String(transaction.price)}></Table.Data>
                                            <Table.Data
                                                text={String(transaction.quantity * transaction.price)}
                                            ></Table.Data>
                                        </Table.Row>
                                    ))}
                                </Table>
                            </div>

                            {/* Actions panel */}
                            <Card className="flex flex-col flex-1 h-fit! justify-center items-center px-10">
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
                                            <Button className={`${buttonSize}`} variant="transparent" size="medium">
                                                Cash
                                            </Button>
                                            <Button className={`${buttonSize}`} variant="transparent" size="medium">
                                                E-Cash
                                            </Button>
                                            <Button className={`${buttonSize}`} variant="transparent" size="medium">
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
                            <Calculator
                                handleToggle={setIsCalculatorToggled}
                                onConfirmDiscount={setConfirmedDiscount}
                                onConfirmQuantity={updateItemQuantity}
                            />
                        ) : (
                            <Button
                                className="absolute group -right-14.5 bottom-1/2 z-50"
                                variant="secondary"
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
