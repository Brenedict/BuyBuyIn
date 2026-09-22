import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Calculator } from "../../components/Calculator";
import SearchInput from "../../components/inputs/SearchInput";
import Table from "../../components/Table";
import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Icon from "../../components/Icon";
import { AccessTime, ArrowLeftRounded, CalendarMonth, VisibilityOff, VisibilityOffOutlined } from "@mui/icons-material";

export function Cashier_PointOfSale() {
    const [isCalculatorToggled, setIsCalculatorToggled] = useState<boolean>(true);

    const date = new Date();
    const current = date.toDateString();

    const time = new Date().toLocaleTimeString();

    const terminalNumber: number = 1;
    const cashierNum: number = 1;
    const amount: number = 90.0;
    const transNum: number = 939391;

    const discAmt: number = 125.0;
    const afterVatAmt: number = 145.09;
    const itemCnt: number = 8;

    const buttonSize = "min-w-[125px] flex-1";
    const spacing = "p-2 gap-3 m-2";

    return (
        <div className="flex flex-col h-full">
            <section className={`flex flex-col h-full ${spacing}`}>
                <div className="flex flex-row gap-2 w-full">
                    <SearchInput className="flex-1" />
                    <div className="flex flex-row">
                        <Icon icon={AccountCircleIcon} size="large" variant="cream" />
                        <Text size="bigger" variant="cream" weight="extraBold">
                            Cashier {cashierNum}
                        </Text>
                    </div>
                </div>

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
                                {time}
                            </Text>
                        </div>

                        {/*Separator line*/}
                        <div className="h-[2px] w-[20%] flex-1 bg-brown"></div>
                        <Text size="big" variant="crimson" weight="bold">
                            POS Terminal {terminalNumber}
                        </Text>
                    </div>

                    <div className={`flex flex-row w-full h-full px-0! ${spacing}`}>
                        <div className={`flex flex-col flex-1 gap-2 h-full`}>
                            <Card isGlass={false} dropShadow className="flex-1 h-1/5 max-h-[20vh] bg-off-white">
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
                                        <div className="pb-2">
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
                                    </div>
                                </Card.Body>
                            </Card>

                            <div className="h-2/5 min-h-0 max-h-[44vh] justify-center items-center overflow-auto flex-2">
                                <Table rounded shadow pagination={{ maxItems: 10 }}>
                                    <Table.Row borderedBottom>
                                        <Table.Header textVariant="cream" text="Quantity" />
                                        <Table.Header textVariant="cream" text="Description" />
                                        <Table.Header textVariant="cream" text="Price" />
                                        <Table.Header textVariant="cream" text="Amount" />
                                    </Table.Row>
                                    <Table.Row>
                                        {" "}
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Data text="2" />
                                        <Table.Data text="something" />
                                        <Table.Data text="90000" />
                                        <Table.Data text="180000" />
                                    </Table.Row>
                                </Table>
                            </div>
                            <Card className="flex flex-col flex-0 justify-center items-center px-10">
                                <Card.Body className="flex flex-row justify-between w-full  px-0!">
                                    <div className="flex flex-col items-center  justify-center w-[45%] gap-2">
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
                                <div className="w-full mb-3">
                                    <Button className="w-full!" variant="main" size="medium">
                                        Pay
                                    </Button>
                                </div>
                            </Card>
                        </div>

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
                                <span className="hidden group-hover:inline">Calculator</span>
                            </Button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Cashier_PointOfSale;
