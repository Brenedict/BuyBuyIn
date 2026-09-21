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

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import { EditDeleteButtons } from "../../components/partials/TablePartials";

interface OfferProps {
    offerTitle: string;
    startDate: string;
    endDate: string;
    status: "Enabled" | "Draft" | "Disabled";
}

function OfferCard({ offerTitle, startDate, endDate, status }: OfferProps) {
    return (
        <Card isGlass={false}>
            <Card.Body>
                <Text weight="extraBold" size="big">
                    {offerTitle}
                </Text>
                <Text>
                    {startDate} - {endDate}
                </Text>
                <div>{status}</div>
            </Card.Body>
        </Card>
    );
}

function OffersListSection() {
    return (
        <section className="flex flex-col gap-6">
            <SearchInput placeholder="Search Offers" />
            <OfferCard offerTitle="Summer Sale 2026" startDate="May 1" endDate="June 30" status="Enabled" />
            <OfferCard offerTitle="Summer Sale 2026" startDate="May 1" endDate="June 30" status="Enabled" />
            <OfferCard offerTitle="Summer Sale 2026" startDate="May 1" endDate="June 30" status="Enabled" />
        </section>
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
                WARNING: This will apply{" "}
                {discountType === "Percentage" ? `${discountAmount}%` : `Php ${discountAmount}`} discount to all
                products.
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
            <Card.Header toggleRightButton rightButton={<Button leftIcon={AddIcon}>Add</Button>} bordered>
                <Text weight="bold" size="big">
                    Included Products
                </Text>
            </Card.Header>
            <Table bordered rounded shadow pagination={{}}>
                <Table.Row borderedBottom>
                    <Table.Header text="Quantity" />
                    <Table.Header text="Product ID" />
                    <Table.Header text="Product Name" />
                    <Table.Header text="Shelf Price" />
                    <Table.Header text="Discount" />
                    <Table.Header text="Subtotal" />
                    <Table.Header text="Action" />
                </Table.Row>
                <Table.Row>
                    <Table.Data isPadded={false} text={"10"} />
                    <Table.Data isPadded={false} text={"123-456"} />
                    <Table.Data isPadded={false} text={"Meatbolz"} />
                    <Table.Data isPadded={false} text={"P17.00"} />
                    <Table.Data isPadded={false} text={"0.20"} />
                    <Table.Data isPadded={false} text={"P27.20"} />

                    <Table.Data isPadded={false}>
                        <EditDeleteButtons id={1} handleEdit={handleEdit} handleDelete={handleDelete} />
                    </Table.Data>
                </Table.Row>
                <Table.Row>
                    <Table.Data isPadded={false} text={"26"} nowrap />
                    <Table.Data isPadded={false} text={"532-124"} nowrap />
                    <Table.Data isPadded={false} text={"Corned Beef"} nowrap />
                    <Table.Data isPadded={false} text={"P36.00"} nowrap />
                    <Table.Data isPadded={false} text={"0.70"} nowrap />
                    <Table.Data isPadded={false} text={"P52.56"} nowrap />

                    <Table.Data isPadded={false}>
                        <EditDeleteButtons id={1} handleEdit={handleEdit} handleDelete={handleDelete} />
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
        <Card className="flex-1" isGlass={false}>
            <Card.Header toggleRightButton rightButton={<Button>Save Offer</Button>} bordered>
                <Text weight="bold" size="bigger">
                    Offer Configuration
                </Text>
            </Card.Header>

            <Card.Body>
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
        <Card>
            <Card.Body className="flex gap-6">
                <OffersListSection />
                <OfferConfigurationSection />
            </Card.Body>
        </Card>
    );
}

export default HQ_BranchWideOffers;
