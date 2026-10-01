import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import GeneralInput from "../../components/inputs/GeneralInput";
import { Outlet } from "react-router";
import { SearchInput } from "../../components/Input";
import SelectInput from "../../components/inputs/SelectInput";
import Table from "../../components/Table";

//Mock Data
import { TABLE_XREAD } from "../../TESTINGDATA/xreadData";

function Date_Section() {
    const gap = "gap-[0.8rem]";
    const margin = "m-[1rem]";
    const paymentMethods = { option1: "Cash", option2: "Card", option3: "E-Cash" };
    return (
        <Card>
            <Card.Body className={`flex flex-col justify-center gap-[2rem]`}>
                <div className={`flex flex-col justify-center w-[100%] ${gap}`}>
                    <div className={`flex flex-row items-center justify-center w-[100%] ${gap} `}>
                        {/*Didn't use the label because it doesn't align the inputs accurately*/}
                        <div className={`flex flex-col w-[40%] ${gap}`}>
                            <Text size="medium" weight="medium" variant="crimson">
                                Date Range
                            </Text>
                            <GeneralInput type="date"></GeneralInput>
                        </div>
                        <Text className="self-end pb-[0.7rem]">TO</Text>
                        <div className={`flex flex-col w-[40%] ${gap}`}>
                            <Text size="medium" weight="medium" variant="crimson" className="invisible">
                                Date Range
                            </Text>
                            <GeneralInput type="date"></GeneralInput>
                        </div>
                        <Button variant="grey" size="medium" className="self-end">
                            VIEW
                        </Button>
                    </div>
                </div>
                <div className={`flex flex-col justify-center w-full ${gap}`}>
                    <div className={`flex flex-row items-center justify-center ${gap} `}>
                        <div className={`flex flex-col justifty-center ${gap} w-[40%]`}>
                            <Text size="medium" weight="medium" variant="crimson">
                                Search
                            </Text>

                            <SearchInput className="bg-off-white "></SearchInput>
                        </div>
                        <Text className="invisible">TO</Text>
                        <div className={`flex flex-col justifty-center ${gap} w-[40%]`}>
                            <Text size="medium" weight="medium" variant="crimson">
                                Payment Methods
                            </Text>

                            <SelectInput
                                className="w-[35%]"
                                options={paymentMethods}
                                name="paymentMethods"
                                defaultValue="option1"
                            ></SelectInput>
                        </div>
                        <Button variant="secondary" size="medium" className="self-end">
                            Print
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

function XREAD_Table() {
    return (
        <Card>
            <Card.Body removePadding bordered={false}>
                <Table
                    bordered={false}
                    pagination={{
                        bgVariant: "cream-muted",
                        borderVariant: "brown",
                        borderedTop: true,
                        maxItems: 6,
                        textSize: "description",
                        textVariant: "crimson",
                        textWeight: "medium",
                    }}
                    pageKey="employee_page"
                    rounded={false}
                    shadow
                >
                    <Table.Row borderedBottom>
                        <Table.Header text="Date" />
                        <Table.Header text="Time" />
                        <Table.Header text="Receipt No." />
                        <Table.Header text="Reference No." />
                        <Table.Header text="Payment Method" />
                        <Table.Header text="Amount" />
                    </Table.Row>
                    {TABLE_XREAD.map((entry, index) => (
                        <Table.Row key={index}>
                            <Table.Data text={entry.date} />
                            <Table.Data text={entry.time} />
                            <Table.Data text={entry.receiptNo} />
                            <Table.Data text={entry.refNo} />
                            <Table.Data text={entry.paymentMethod} />

                            <Table.Data text={"₱ " + entry.amount} />
                        </Table.Row>
                    ))}
                </Table>
            </Card.Body>
        </Card>
    );
}

export function Cashier_XRead() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <div className="flex flex-row justify-between items-center">
                    <Text size="bigger" variant="crimson" weight="bold">
                        X-Read
                    </Text>
                    <Button variant="main" size="medium">
                        End Shift
                    </Button>
                </div>
            </Card.Body>
            <Card.Body className="flex flex-col gap-[2.7rem]">
                <Date_Section></Date_Section>
                <XREAD_Table></XREAD_Table>
            </Card.Body>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </Card>
    );
}

export default Cashier_XRead;
