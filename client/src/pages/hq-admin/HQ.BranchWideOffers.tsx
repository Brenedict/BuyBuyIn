// General Import
import { useEffect, useMemo, useState } from "react";
import { Form, Outlet, useParams } from "react-router";

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

// ROUTES
import { ROUTES } from "../../routes/Routes";

// Hooks
import useNavigatePage from "../../hooks/useNavigatePage";

// Utils
import { calculateDiscountedSubtotal, calculateSubtotal, formatDiscountValue } from "../../utils/offersUtils";
import { formatFullDate } from "../../utils/dateUtils";

// Test Data
import { SAMPLE_OFFERS } from "../../TESTINGDATA/branchWideOfferData";
import { SAMPLE_OVERALL_BRANCHES } from "../../TESTINGDATA/branchWideOfferData";
import { useFormSearchParams } from "../../hooks/useFormSearchParams";

interface OfferProps {
    offerTitle: string;
    startDate: string;
    endDate: string;
    status: "enabled" | "draft" | "disabled";
    handleClick: () => void;
}

// Main Page Exported
export default function HQ_BranchWideOffers() {
    return (
        <>
            <Card className="h-[calc(100vh-4rem)] flex flex-col">
                <Card.Body className="flex gap-6 grow min-h-0">
                    <OffersListSection />
                    <OfferConfigurationSection />
                </Card.Body>
            </Card>
            <Outlet />
        </>
    );
}

function OfferCard({ offerTitle, startDate, endDate, status, handleClick }: OfferProps) {
    const statusClass: Record<OfferProps["status"], string> = {
        enabled: "bg-crimson text-cream font-bold",
        disabled: "bg-slate-light text-cream font-bold",
        draft: "bg-slate-medium/90 text-cream font-bold",
    };

    const shortenedTitle = offerTitle.length > 20 ? `${offerTitle.substring(0, 20)}...` : offerTitle;

    return (
        <Card
            className="hover:opacity-80 active:opacity-100 hover:cursor-pointer hover:scale-99 transition-transform"
            onClick={handleClick}
        >
            <Card.Body className="flex xl:flex-row md:flex-col gap-3 justify-between">
                <div className="flex flex-col gap-3">
                    <Text weight="extraBold" size="big" className="col-span-2">
                        {shortenedTitle}
                    </Text>
                    <Text variant="slate-light">
                        {startDate} - {endDate}
                    </Text>
                    <div
                        className={`w-fit px-3 py-1 rounded-xl lg:text-normal md:text-small-description ${statusClass[status]}`}
                    >
                        {status}
                    </div>
                </div>
                <div className="flex h-fit gap-1 pt-1">
                    {/* Overwritten Buttons for customized no background buttons */}
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
    // Used for redirecting
    const useNavigate = useNavigatePage();

    const { values, submit } = useFormSearchParams({ search: "" });

    return (
        <div className="w-[25%] flex flex-col gap-4 h-full min-h-0">
            <Form onSubmit={submit()}>
                <SearchInput name="search" placeholder="Search Offers" defaultValue={values.search} />
            </Form>
            <section className="flex flex-col gap-6 pr-3 grow overflow-y-auto min-h-0 *:shrink-0">
                {/* Generates the offer cards */}
                {SAMPLE_OFFERS.filter((offer) =>
                    offer.offerName.toLowerCase().includes(values.search.toLowerCase())
                ).map((offer, i) => (
                    <OfferCard
                        offerTitle={offer.offerName}
                        startDate={formatFullDate(new Date(offer.startDate))}
                        endDate={formatFullDate(new Date(offer.endDate))}
                        status={offer.offerStatus.toLocaleLowerCase() as OfferProps["status"]}
                        handleClick={() => {
                            useNavigate(ROUTES.HQ_ADMIN.branchOffersEdit(String(offer.id)), true);
                        }}
                    />
                ))}
            </section>
        </div>
    );
}

function ToggleSelectBranches() {
    // Extracts the Branch Wide Offer Id from the URL Param
    const { id } = useParams();

    // Data containing all branches from a business
    const testAllBranches = SAMPLE_OVERALL_BRANCHES;

    // Extracting the branches only. The 'useMemo' is for caching.
    const testOfferBranches = useMemo(
        () => SAMPLE_OFFERS.find((offer) => String(offer.id) == id)?.branchWideOfferBranches,
        [id]
    );

    return (
        <Card dropShadow={false}>
            <Card.Body>
                {testAllBranches.map((branch, i) => {
                    // Check the current branch from the overall list is checked in the current offer (means the current branch is selected)
                    const isChecked = testOfferBranches?.some(
                        (offerBranch) => String(offerBranch.branchId) === String(branch.branchId)
                    );

                    return (
                        <ChoiceInput id={String(branch.branchId)} defaultChecked={isChecked}>
                            {branch.location}
                        </ChoiceInput>
                    );
                })}
            </Card.Body>
        </Card>
    );
}

function ToggleOverallDiscountType() {
    // Extracts the Branch Wide Offer Id from the URL Param
    const { id } = useParams();

    // Extracting the branches only. The 'useMemo' is for caching.
    // @ts-ignore
    const { discountType, overallDiscountValue } = useMemo(
        () => SAMPLE_OFFERS.find((offer) => String(offer.id) == id),
        [id]
    );

    // State variables
    const [discountTypeInput, setDiscountTypeInput] = useState(discountType ?? "PERCENTAGE");
    const [discountAmount, setdiscountAmount] = useState(overallDiscountValue ?? 0);

    return (
        <div className="grid grid-cols-2 gap-x-6">
            <SelectInput
                name="discountTypeInput"
                defaultValue={discountType ?? "PERCENTAGE"}
                label="Discount Type"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDiscountTypeInput(e.target.value)}
            >
                <SelectInput.Option value="PERCENTAGE">Percentage</SelectInput.Option>
                <SelectInput.Option value="FIXED_VALUE">Fixed Value</SelectInput.Option>
            </SelectInput>
            <GeneralInput
                type="number"
                placeholder="10"
                defaultValue={overallDiscountValue ?? 0}
                label="Discount Value"
                // TODO: Make the onChange work here
                onChange={(e) => setdiscountAmount(Number(e.target.value))}
            />
            <Text>
                WARNING: This will apply a{" "}
                <span className="font-bold ">
                    {discountTypeInput === "PERCENTAGE" ? `${discountAmount}%` : `Php ${discountAmount}`} discount
                </span>{" "}
                to all products.
            </Text>
        </div>
    );
}

function ToggleIndividualDiscountType() {
    // Extracts the Branch Wide Offer Id from the URL Param
    const { id } = useParams();

    // Extracting the branches only.
    const testSelectedProducts = useMemo(
        () => SAMPLE_OFFERS.find((offer) => String(offer.id) == id)?.branchWideOfferProduct,
        [id]
    );

    // Test button handlers
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
                {/* Fixed table headers */}
                <Table.Row borderedBottom>
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Quantity" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Product ID" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Product Name" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Shelf Price" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Discount" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Subtotal" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Discounted Subtotal" />
                    <Table.Header isPadded={false} size="small" className="px-3!" text="Action" />
                </Table.Row>

                {/* Dynamically maps out data */}
                {testSelectedProducts?.map((product, i) => (
                    <Table.Row>
                        <Table.Data isPadded={false} size="small" text={String(product.requiredQuantity)} />
                        <Table.Data isPadded={false} size="small" text={String(product.id)} />
                        <Table.Data isPadded={false} size="small" text={String(product.productName)} />
                        <Table.Data isPadded={false} size="small" text={String(product.shelfPrice)} />
                        <Table.Data
                            isPadded={false}
                            size="small"

                            // @ts-ignore
                            text={formatDiscountValue(product.discountType, product.unitDiscountValue)}
                        />
                        <Table.Data
                            isPadded={false}
                            size="small"
                            text={calculateSubtotal(product.requiredQuantity, product.shelfPrice)}
                        />
                        <Table.Data
                            isPadded={false}
                            size="small"
                            text={calculateDiscountedSubtotal(
                                // @ts-ignore
                                product.discountType,
                                product.unitDiscountValue,
                                product.requiredQuantity,
                                product.shelfPrice
                            )}
                        />
                        <Table.Data isPadded={false}>
                            <EditDeleteButtons
                                id={1}
                                size="smallest"
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        </Table.Data>
                    </Table.Row>
                ))}
            </Table>
        </Card>
    );
}

function OfferConfigurationSection() {
    // Extracts the Branch Wide Offer Id from the URL Param
    const { id } = useParams();

    // Extracting the test data. The 'useMemo' is for caching.
    const testOffer = useMemo(() => SAMPLE_OFFERS.find((offer) => String(offer.id) == id), [id]);

    // Checks if the current config is for selected branches only or for all
    const isForSelectedBranches =
        testOffer?.branchWideOfferBranches == undefined || testOffer?.branchWideOfferBranches.length <= 0
            ? false
            : true;

    // Checks if the current config is discount for selected products only or for all
    const isForOverallDiscount = testOffer?.offerType == "OVERALL";

    // State variables used by inputs
    const [toggleSelectedBranchList, setToggleSelectedBranchList] = useState(isForSelectedBranches);
    const [toggleOverallDiscount, setToggleOverallDiscount] = useState(isForOverallDiscount);

    // Sync state whenever the offer id changes (e.g. navigating between offers)
    useEffect(() => {
        setToggleSelectedBranchList(isForSelectedBranches);
        setToggleOverallDiscount(isForOverallDiscount);
    }, [id, testOffer]);

    return (
        <Card isGlass={false} className="w-[75%] h-full flex flex-col">
            <Card.Header toggleRightButton rightButton={<Button>Save Offer</Button>} bordered className="shrink-0">
                <Text weight="bold" size="bigger">
                    Offer Configuration - {`${id ? "Edit" : "Add "}`}
                </Text>
            </Card.Header>

            <Card.Body className="flex flex-col gap-4 grow overflow-y-auto min-h-0 *:shrink-0">
                <GeneralInput
                    key={`offerName-${id}`}
                    type="text"
                    label="Offer Name"
                    defaultValue={testOffer?.offerName}
                />
                <TextAreaInput key={`description-${id}`} label="Description" defaultValue={testOffer?.description} />

                {/* Date Range */}
                <div className="flex gap-6 items-end">
                    <GeneralInput
                        key={`startDate-${id}`}
                        type="date"
                        label="Date Range"
                        defaultValue={testOffer?.startDate}
                    />
                    <GeneralInput key={`endDate-${id}`} type="date" defaultValue={testOffer?.endDate} />
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
                            checked={toggleSelectedBranchList == false}
                            onChange={() => setToggleSelectedBranchList(false)}
                        >
                            All Branches
                        </ChoiceInput>
                        <ChoiceInput
                            type="radio"
                            id="selectedBranches"
                            name="selectBranch"
                            className="w-fit!"
                            checked={toggleSelectedBranchList == true}
                            onChange={() => setToggleSelectedBranchList(true)}
                        >
                            Select Branches
                        </ChoiceInput>
                    </div>
                    {toggleSelectedBranchList && <ToggleSelectBranches key={id} />}
                </div>

                {/* Offer Type Selection */}
                <ChoiceInput
                    id="offerType"
                    label="Offer Type"
                    className="w-fit!"
                    checked={toggleOverallDiscount}
                    onChange={() => setToggleOverallDiscount((value) => !value)}
                >
                    All Product Discount (Overall)
                </ChoiceInput>

                {/* Toggle for discounts: Overall or Selected Products */}
                {toggleOverallDiscount ? (
                    // All Products Discount
                    <ToggleOverallDiscountType key={id} />
                ) : (
                    // Selected Products Discount
                    <ToggleIndividualDiscountType key={id} />
                )}

                {/* Set status of offer */}
                <SelectInput
                    key={`status-${id}`}
                    name="status"
                    defaultValue={testOffer?.offerStatus ?? "draft"}
                    label="Status"
                >
                    <SelectInput.Option value="enabled">Enabled</SelectInput.Option>
                    <SelectInput.Option value="disabled">Disabled</SelectInput.Option>
                    <SelectInput.Option value="draft">Draft</SelectInput.Option>
                </SelectInput>
            </Card.Body>
        </Card>
    );
}
