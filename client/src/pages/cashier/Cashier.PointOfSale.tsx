import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Calculator } from "../../components/Calculator";
import SearchInput from "../../components/inputs/SearchInput";
import Table from "../../components/Table";

export function Cashier_PointOfSale() {
    const date = new Date();
    const current = date.toDateString();

    const time = new Date().toLocaleTimeString();

    const terminalNumber: number = 1;

    const amount: number = 90.0;
    const transNum: number = 939391;

    const discAmt: number = 125.0;
    const afterVatAmt: number = 145.09;
    const itemCnt: number = 8;

    return (
        <div>
            <section>
                <SearchInput />
                <div className="">
                    <div className="flex flex-row gap-2 items-center justify-center">
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

                    <div className="flex flex-row w-full">
                        <div className="flex flex-col">
                            <Card isGlass dropShadow>
                                <Card.Header>
                                    <Text variant="crimson" weight="bold" size="big">
                                        TOTAL AMOUNT DUE
                                    </Text>
                                </Card.Header>
                                <Card.Body>
                                    <Text variant="crimson" weight="extraBold" size="larger">
                                        P{amount}
                                    </Text>
                                </Card.Body>
                                <Card.Footer>
                                    <div className="flex flex-row items-center justify-between">
                                        <Text variant="crimson" weight="medium" size="medium">
                                            Transaction #: {transNum}
                                        </Text>
                                        <div>
                                            <Text variant="crimson" weight="medium" size="medium">
                                                Discount : {discAmt}
                                            </Text>
                                            <Text variant="crimson" weight="medium" size="medium">
                                                VAT 12% : {afterVatAmt}
                                            </Text>
                                            <Text variant="crimson" weight="medium" size="medium">
                                                Items: {itemCnt}
                                            </Text>
                                        </div>
                                    </div>
                                </Card.Footer>
                            </Card>

                            <Card>
                                <Card.Body>
                                    <Table rounded shadow>
                                        <Table.Row borderedBottom>
                                            <Table.Header bgVariant="crimson" textVariant="cream" text="Quantity" />
                                            <Table.Header bgVariant="crimson" textVariant="cream" text="Description" />
                                            <Table.Header bgVariant="crimson" textVariant="cream" text="Price" />
                                            <Table.Header bgVariant="crimson" textVariant="cream" text="Amount" />
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

                            <Card>
                                <Card.Body className="flex flex-row justify-between">
                                    <div>
                                        <Text variant="crimson" size="medium" weight="bold">
                                            SELECT MODE OF PAYMENT
                                        </Text>

                                        <div className="flex flex-row">
                                            <Button variant="transparent" size="medium">
                                                Cash
                                            </Button>
                                            <Button variant="transparent" size="medium">
                                                E-Cash
                                            </Button>
                                            <Button variant="transparent" size="medium">
                                                Card
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <Text variant="crimson" size="medium" weight="bold">
                                            TRANSACTION ACTIONS
                                        </Text>
                                        <div className="flex flex-row">
                                            <Button variant="transparent" size="medium">
                                                Suspend
                                            </Button>
                                            <Button variant="transparent" size="medium">
                                                Resume
                                            </Button>
                                            <Button variant="transparent" size="medium">
                                                Void
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                                <Button className="w-full!" variant="transparent" size="medium">
                                    Pay
                                </Button>
                            </Card>
                        </div>

                        <Calculator />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Cashier_PointOfSale;
