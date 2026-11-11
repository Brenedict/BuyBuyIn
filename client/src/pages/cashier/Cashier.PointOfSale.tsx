// General Imports
import { Outlet } from "react-router";
import { useState, useEffect } from "react";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import SearchInput from "../../components/inputs/SearchInput";
import Table from "../../components/Table";
import Icon from "../../components/Icon";
import useNavigatePage from "../../hooks/useNavigatePage";

// Material UI Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AccessTime, Add, ArrowLeftRounded, CalendarMonth, Remove } from "@mui/icons-material";

function SideBar() {
    const navigate = useNavigatePage();
    const [isRetail, setIsRetail] = useState(true);

    return (
        <nav className="flex flex-col justify-center p-[1.25rem] gap-[1.5rem] rounded-[10px] bg-cream/40 card-glass-effect card-drop-shadow">
            <Button variant="grey" size="medium" onClick={() => navigate("quantity")}>
                QTY
            </Button>
            <Button variant="grey" size="medium" onClick={() => navigate("item")}>
                ADD ITEM
            </Button>
            <Button variant="grey" size="medium" onClick={() => navigate("discount")}>
                DISC
            </Button>
            <Button variant="grey" size="medium" onClick={() => navigate("checkprice")}>
                CHK PRC
            </Button>
            <Button variant={isRetail ? "main" : "secondary"} size="medium" onClick={() => setIsRetail(!isRetail)}>
                {isRetail ? "Retail" : "Wholesale"}
            </Button>
            <Button variant="grey" size="medium">
                REPRINT
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
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

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

    const discAmt: number = 125.0;
    const afterVatAmt: number = 145.09;
    const itemCnt: number = 8;

    type transaction = [number, string, number];
    const transactionData: transaction[] = [
        [2, "Tomato", 10.0],
        [3, "Kamatis", 10.0],
        [2, "Kalamansi", 5.0],
        [6, "Kalamatis", 15.0],
    ];

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
                                        P{amount}
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
                                        <Table.Row key={transaction[1]}>
                                            <Table.Data>
                                                <div className="flex flex-row justify-center gap-[10%] items-center">
                                                    <Button size="smallest" leftIcon={Add}></Button>
                                                    {transaction[0]}
                                                    <Button size="smallest" variant="grey" leftIcon={Remove}></Button>
                                                </div>
                                            </Table.Data>
                                            <Table.Data text={String(transaction[1])}></Table.Data>
                                            <Table.Data text={String(transaction[2])}></Table.Data>
                                            <Table.Data text={String(transaction[0] * transaction[2])}></Table.Data>
                                        </Table.Row>
                                    ))}
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
                        <SideBar></SideBar>
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
