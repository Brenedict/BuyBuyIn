// General Import
import { useState } from "react";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";

import SearchInput from "../../components/inputs/SearchInput";
import GeneralInput from "../../components/inputs/GeneralInput";
import TextAreaInput from "../../components/inputs/TextAreaInput";
import ChoiceInput from "../../components/inputs/ChoiceInput";
import SelectInput from "../../components/inputs/SelectInput";
import { EditDeleteButtons } from "../../components/TablePartials";

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

// Test Data
import { SAMPLE_OFFERS } from "../../TESTINGDATA/branchWideOfferData";

interface OfferProps {
    offerTitle: string;
    startDate: string;
    endDate: string;
    status: "enabled" | "draft" | "disabled";
}

function OfferCard({ offerTitle, startDate, endDate, status }: OfferProps) {
    const statusClass: Record<OfferProps["status"], string> = {
        enabled: "bg-crimson text-cream font-bold",
        disabled: "bg-slate-light text-cream font-bold",
        draft: "bg-slate-medium/90 text-cream font-bold",
    };

    const shortenedTitle = offerTitle.length > 20 ? `${offerTitle.substring(0, 20)}...` : offerTitle;

    return (
        <Card
            className="hover:opacity-75 active:opacity-100 hover:cursor-pointer hover:scale-102 active:scale-100 transition-transform"
            onClick={() => {}}
        >
            <Card.Body className="flex gap-3 justify-between">
                <div className="flex flex-col gap-3">
                    <Text weight="extraBold" size="big" className="col-span-2">
                        {shortenedTitle}
                    </Text>
                    <Text variant="slate-light">
                        {startDate} - {endDate}
                    </Text>
                    <div className={`w-fit px-3 py-1 rounded-xl ${statusClass[status]}`}>{status}</div>
                </div>
                <div className="flex h-fit gap-1 pt-1">
                    <Button
                        variant="secondary"
                        rightIcon={CreateIcon}
                        size="normal"
                        className="p-1! bg-transparent! hover:bg-slate-dark!"
                    ></Button>
                    <Button
                        variant="secondary"
                        rightIcon={DeleteOutlinedIcon}
                        size="normal"
                        className="p-1! bg-transparent! hover:bg-crimson!"
                    ></Button>
                </div>
            </Card.Body>
        </Card>
    );
}

function OffersListSection() {
    return (
        <div className="w-[25%] flex flex-col gap-4 h-full min-h-0">
            <SearchInput placeholder="Search Offers" />
            <section className="flex flex-col gap-6 pr-3 grow overflow-y-auto min-h-0 *:shrink-0">
                {SAMPLE_OFFERS.map((row, i) => (
                    <OfferCard
                        offerTitle={row.offerName}
                        startDate={String(row.startDate.toLocaleDateString("en-US"))}
                        endDate={String(row.endDate.toLocaleDateString("en-US"))}
                        status={row.offerStatus.toLocaleLowerCase() as OfferProps["status"]}
                    />
                ))}
            </section>
        </div>
    );
}

function ToggleSelectBranches() {
    const exampleBranches = ["North Manila", "South Pasay", "West Pasig", "East Ave"];

    return (
        <Card dropShadow={false}>
            <Card.Body>
                {exampleBranches.map((value) => (
                    <ChoiceInput id={value}>{value}</ChoiceInput>
                ))}
            </Card.Body>
        </Card>
    );
}

function ToggleOverallDiscountType() {
    const [discountType, setDiscountType] = useState("Percentage");
    const [discountAmount, setdiscountAmount] = useState(10);

    return (
        <div className="grid grid-cols-2 gap-x-6">
            <SelectInput
                name="discountType"
                defaultValue="Percentage"
                label="Discount Type"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDiscountType(e.target.value)}
            >
                <SelectInput.Option value="Percentage">Percentage</SelectInput.Option>
                <SelectInput.Option value="FixedValue">Fixed Value</SelectInput.Option>
            </SelectInput>
            <GeneralInput
                type="number"
                placeholder="10"
                defaultValue={10}
                label="Discount Value"
                // TODO: Make the onChange work here
                onChange={(e) => setdiscountAmount(Number(e.target.value))}
            />
            <Text>
                WARNING: This will apply a{" "}
                <span className="font-bold ">
                    {discountType === "Percentage" ? `${discountAmount}%` : `Php ${discountAmount}`} discount
                </span>{" "}
                to all products.
            </Text>
        </div>
    );
}

function ToggleIndividualDiscountType() {
    const handleEdit = (id: string | number) => () => {
        alert(`Edit: ${id}`);
    };

    const handleDelete = (id: string | number) => () => {
        alert(`Delete: ${id}`);
    };

    return (
        <Card dropShadow={false}>
            <Card.Header
                toggleRightButton
                rightButton={
                    <Button size="normal" variant="grey" leftIcon={AddIcon}>
                        Add
                    </Button>
                }
                bordered
            >
                <Text weight="bold" size="big">
                    Included Products
                </Text>
            </Card.Header>
            <Table pagination={{ maxItems: 5 }} className="rounded-none! border-0!">
                <Table.Row borderedBottom>
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Quantity" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Product ID" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Product Name" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Shelf Price" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Discount" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Subtotal" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Action" />
                </Table.Row>
                <Table.Row>
                    <Table.Data isPadded={false} size="small" text={"26"} />
                    <Table.Data isPadded={false} size="small" text={"532-124"} />
                    <Table.Data isPadded={false} size="small" text={"Corned Beef"} />
                    <Table.Data isPadded={false} size="small" text={"P36.00"} />
                    <Table.Data isPadded={false} size="small" text={"0.70"} />
                    <Table.Data isPadded={false} size="small" text={"P52.56"} />

                    <Table.Data isPadded={false}>
                        <EditDeleteButtons id={1} size="smallest" handleEdit={handleEdit} handleDelete={handleDelete} />
                    </Table.Data>
                </Table.Row>
                <Table.Row>
                    <Table.Data isPadded={false} size="small" text={"26"} />
                    <Table.Data isPadded={false} size="small" text={"532-124"} />
                    <Table.Data isPadded={false} size="small" text={"Corned Beef"} />
                    <Table.Data isPadded={false} size="small" text={"P36.00"} />
                    <Table.Data isPadded={false} size="small" text={"0.70"} />
                    <Table.Data isPadded={false} size="small" text={"P52.56"} />

                    <Table.Data isPadded={false}>
                        <EditDeleteButtons id={1} size="smallest" handleEdit={handleEdit} handleDelete={handleDelete} />
                    </Table.Data>
                </Table.Row>
            </Table>
        </Card>
    );
}

function OfferConfigurationSection() {
    const [toggleBranchListSelect, setToggleBranchListSelect] = useState(true);
    const [toggleOverallDiscount, setToggleOverallDiscount] = useState(true);

    return (
        <Card isGlass={false} className="w-[75%] h-full flex flex-col">
            <Card.Header toggleRightButton rightButton={<Button>Save Offer</Button>} bordered className="shrink-0">
                <Text weight="bold" size="bigger">
                    Offer Configuration
                </Text>
            </Card.Header>

            <Card.Body className="flex flex-col gap-4 grow overflow-y-auto min-h-0 *:shrink-0">
                <GeneralInput type="text" label="Offer Name" />
                <TextAreaInput label="Description" />

                {/* Date Range */}
                <div className="flex gap-6 items-end">
                    <GeneralInput type="date" label="Date Range" />
                    <GeneralInput type="date" />
                </div>

                {/* Branch Selection */}
                <div>
                    <Text size="big" weight="bold" variant="brown">
                        Branch Selection
                    </Text>
                    <div className="flex gap-6">
                        <ChoiceInput
                            type="radio"
                            id="allBranches"
                            name="selectBranch"
                            className="w-fit!"
                            defaultChecked
                            onChange={() => setToggleBranchListSelect(true)}
                        >
                            All Branches
                        </ChoiceInput>
                        <ChoiceInput
                            type="radio"
                            id="selectedBranches"
                            name="selectBranch"
                            className="w-fit!"
                            onChange={() => setToggleBranchListSelect(false)}
                        >
                            Select Branches
                        </ChoiceInput>
                    </div>

                    {!toggleBranchListSelect && <ToggleSelectBranches />}
                </div>
                <ChoiceInput
                    id="offerType"
                    label="Offer Type"
                    className="w-fit!"
                    defaultChecked
                    onChange={() => setToggleOverallDiscount((value) => !value)}
                >
                    All Product Discount (Overall)
                </ChoiceInput>

                {toggleOverallDiscount ? <ToggleOverallDiscountType /> : <ToggleIndividualDiscountType />}

                <SelectInput name="status" defaultValue="enabled" label="Status">
                    <SelectInput.Option value="enabled">Enabled</SelectInput.Option>
                    <SelectInput.Option value="disabled">Disabled</SelectInput.Option>
                    <SelectInput.Option value="draft">Draft</SelectInput.Option>
                </SelectInput>
            </Card.Body>
        </Card>
    );
}

export function HQ_BranchWideOffers() {
    return (
        <Card className="h-[calc(100vh-4rem)] flex flex-col">
            <Card.Body className="flex gap-6 grow min-h-0">
                <OffersListSection />
                <OfferConfigurationSection />
            </Card.Body>
        </Card>
    );
}

export default HQ_BranchWideOffers;
