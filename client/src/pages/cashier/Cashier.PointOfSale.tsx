import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Calculator } from "../../components/Calculator";
import SearchInput from "../../components/inputs/SearchInput";
import Table from "../../components/Table";
import { useState } from "react";

export function Cashier_PointOfSale() {
    const [isCalculatorToggled, toggleCalculator] = useState(true);
    const date = new Date();
    const current = date.toDateString();

    const time = new Date().toLocaleTimeString();

    const terminalNumber: number = 1;

    const amount: number = 90.0;
    const transNum: number = 939391;

    const discAmt: number = 125.0;
    const afterVatAmt: number = 145.09;
    const itemCnt: number = 8;

    const buttonSize = "min-w-[115px]";

    return (
        <div>
            <section>
                <SearchInput />
                <div className="flex flex-col">
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Text size="big" variant="crimson" weight="bold">
                            Cashier POS
                        </Text>
                        {/*TODO make the date and time actually track current date and time*/}
                        <Text size="big" variant="crimson" weight="bold">
                            {current}
                        </Text>
                        <Text size="big" variant="crimson" weight="bold">
                            {time}
                        </Text>
                        {/*Separator line*/}
                        <div className="h-[1px] w-[20%] bg-slate-medium"></div>
                        <Text size="big" variant="crimson" weight="bold">
                            POS Terminal {terminalNumber}
                        </Text>
                    </div>

                    <div className="flex flex-row w-full border-blue border-1">
                        <div className="flex flex-col flex-1 border-1 border-green">
                            <Card isGlass dropShadow className="flex-1 h-2/5">
                                <Card.Header>
                                    <Text variant="crimson" weight="bold" size="big">
                                        TOTAL AMOUNT DUE
                                    </Text>
                                </Card.Header>
                                <Card.Body>
                                    <Text variant="crimson" weight="extraBold" size="large">
                                        P{amount}
                                    </Text>
                                </Card.Body>
                                <Card.Footer>
                                    <div className="flex flex-row items-center justify-between">
                                        <Text variant="crimson" weight="medium" size="normal">
                                            Transaction #: {transNum}
                                        </Text>
                                        <div>
                                            <Text variant="crimson" weight="medium" size="normal">
                                                Discount : {discAmt}
                                            </Text>
                                            <Text variant="crimson" weight="medium" size="normal">
                                                {" "}
                                                VAT 12% : {afterVatAmt}
                                            </Text>
                                            <Text variant="crimson" weight="medium" size="normal">
                                                Items: {itemCnt}
                                            </Text>
                                        </div>
                                    </div>
                                </Card.Footer>
                            </Card>

                            <Card isGlass dropShadow className="h-2/5 max-h-[35vh] min-h-0">
                                <Card.Body className="flex flex-col flex-1 max-h-[35vh]">
                                    <Table rounded shadow pagination={{ maxItems: 10 }}>
                                        <Table.Row borderedBottom>
                                            <Table.Header bgVariant="crimson" textVariant="cream" text="Quantity" />
                                            <Table.Header bgVariant="crimson" textVariant="cream" text="Description" />
                                            <Table.Header bgVariant="crimson" textVariant="cream" text="Price" />
                                            <Table.Header bgVariant="crimson" textVariant="cream" text="Amount" />
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
                                </Card.Body>
                            </Card>

                            <Card className="flex flex-col flex-1">
                                <Card.Body className="flex flex-row justify-between">
                                    <div className="flex flex-col items-center justify-center">
                                        <Text variant="crimson" size="medium" weight="bold">
                                            SELECT MODE OF PAYMENT
                                        </Text>

                                        <div className="flex flex-row gap-1 items-center justify-center">
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
                                    <div className="flex flex-col items-center justify-center">
                                        <Text variant="crimson" size="medium" weight="bold">
                                            TRANSACTION ACTIONS
                                        </Text>
                                        <div className="flex flex-row gap-1 justify-center items-center">
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
                                <Card.Body>
                                    <Button className="w-full!" variant="transparent" size="medium">
                                        Pay
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>

                        {isCalculatorToggled && <Calculator />}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Cashier_PointOfSale;
