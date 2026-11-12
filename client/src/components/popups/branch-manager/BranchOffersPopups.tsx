// General Imports
import { useState } from "react";
import { Form, useLoaderData } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import Table from "../../Table";
import GeneralInput from "../../inputs/GeneralInput";
import TextAreaInput from "../../inputs/TextAreaInput";
import ChoiceInput from "../../inputs/ChoiceInput";
import SelectInput from "../../inputs/SelectInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// API Services
import type { BranchWideOfferFormPageData } from "../../../api/branchWideOfferService";

// BuyBuyIn Shared Imports
import type {
    BranchWideOfferEntry,
    BranchWideOfferFormType,
    BranchWideOfferOptionsResponse,
    BranchWideOfferStatusType,
} from "@buybuyin/shared/schema/branchWideOffer";
import type { CatalogueProduct } from "@buybuyin/shared/schema/product";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";
import { calculateDiscountedSubtotal, calculateSubtotal, formatDiscountValue } from "../../../utils/offersUtils";
import { formatFullDate } from "../../../utils/dateUtils";

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

type ProductInput = BranchWideOfferFormType["products"][number];
type StatusVariant = "enabled" | "disabled" | "draft";

const STATUS_CLASSES: Record<StatusVariant, string> = {
    enabled: "bg-crimson text-cream font-bold",
    disabled: "bg-slate-light text-cream font-bold",
    draft: "bg-slate-medium/90 text-cream font-bold",
};

const getInitialProductInputs = (offer: BranchWideOfferEntry | null): ProductInput[] =>
    offer?.products.map(({ productId, requiredQuantity, unitDiscountValue, discountType }) => ({
        productId,
        requiredQuantity,
        unitDiscountValue,
        discountType,
    })) ?? [];

const getStatusVariant = (status: BranchWideOfferStatusType): StatusVariant => status.toLowerCase() as StatusVariant;

export function BranchOfferFormPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();

    const loaderData = useLoaderData<BranchWideOfferFormPageData | BranchWideOfferOptionsResponse>();

    const options = "options" in loaderData ? loaderData.options : loaderData;
    const offer = "options" in loaderData ? loaderData.offer : null;

    const [isOverall, setIsOverall] = useState(offer?.offerType === "OVERALL");
    const [discountTypeInput, setDiscountTypeInput] = useState<"PERCENTAGE" | "FIXED_VALUE">(
        offer?.discountType ?? "PERCENTAGE"
    );
    const [discountAmount, setDiscountAmount] = useState(offer?.overallDiscountValue ?? 0);
    const [productInputs, setProductInputs] = useState<ProductInput[]>(getInitialProductInputs(offer));

    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.branchOffers, true);

    const title = mode === "add" ? "Add Offer" : "Edit Offer";
    const branch = options.branches[0];

    if (mode === "edit" && !offer) {
        return (
            <PopUp title="Offer Not Found" size="md" handleCloseProp={handleClose}>
                <Text>The offer you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    if (mode === "edit" && offer && !offer.isExclusive) {
        return (
            <PopUp title="Offer Cannot Be Edited" size="md" handleCloseProp={handleClose}>
                <Text>This offer applies to all branches. Only an HQ Admin can edit it.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    if (options.branches.length === 0) {
        return (
            <PopUp title={title} size="md" handleCloseProp={handleClose}>
                <Text>
                    You do not have a branch assigned. Ask an HQ Admin to assign you to a branch before creating an
                    offer.
                </Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const formId = "branchOfferForm";

    return (
        <PopUp
            title={title}
            subtitle={branch ? `Exclusive to ${branch.location}` : undefined}
            size="lg"
            handleCloseProp={handleClose}
        >
            <Form id={formId} method="post" className="flex flex-col gap-4">
                <GeneralInput
                    name="offerName"
                    type="text"
                    label="Offer Name"
                    labelVariant="small"
                    defaultValue={offer?.offerName}
                    required
                />
                <TextAreaInput
                    name="description"
                    label="Description"
                    labelVariant="small"
                    defaultValue={offer?.description}
                    required
                />

                <div className="flex gap-6 items-end">
                    <GeneralInput
                        name="startDate"
                        type="date"
                        label="Start Date"
                        labelVariant="small"
                        defaultValue={offer?.startDate}
                        required
                    />
                    <GeneralInput
                        name="endDate"
                        type="date"
                        label="End Date"
                        labelVariant="small"
                        defaultValue={offer?.endDate}
                        required
                    />
                </div>

                <Text size="description" weight="medium" variant="slate-medium">
                    This offer applies only to {branch.location}.
                </Text>

                <div>
                    <Text size="big" weight="bold" variant="brown">
                        Offer Type
                    </Text>
                    <div className="flex gap-6">
                        <ChoiceInput
                            type="radio"
                            id="offerTypeOverall"
                            name="offerTypeSelection"
                            className="w-fit!"
                            checked={isOverall}
                            onChange={() => setIsOverall(true)}
                        >
                            Overall
                        </ChoiceInput>
                        <ChoiceInput
                            type="radio"
                            id="offerTypeIndividual"
                            name="offerTypeSelection"
                            className="w-fit!"
                            checked={!isOverall}
                            onChange={() => setIsOverall(false)}
                        >
                            Included Products
                        </ChoiceInput>
                    </div>
                </div>

                {isOverall ? (
                    <OffersOverallDiscountSection
                        discountTypeInput={discountTypeInput}
                        setDiscountTypeInput={setDiscountTypeInput}
                        discountAmount={discountAmount}
                        setDiscountAmount={setDiscountAmount}
                    />
                ) : (
                    <IncludedProductsSection
                        catalogueProducts={options.products}
                        productInputs={productInputs}
                        setProductInputs={setProductInputs}
                    />
                )}

                <SelectInput
                    name="offerStatus"
                    defaultValue={offer?.offerStatus ?? "DRAFT"}
                    label="Status"
                    labelVariant="small"
                    options={{
                        Enabled: "ENABLED",
                        Disabled: "DISABLED",
                        Draft: "DRAFT",
                    }}
                />

                <input type="hidden" name="offerType" value={isOverall ? "OVERALL" : "INDIVIDUAL"} />
                <input type="hidden" name="isExclusive" value="true" />
                <input
                    type="hidden"
                    name="branchIds"
                    value={JSON.stringify(options.branches.map((optionsBranch) => optionsBranch.branchId))}
                />
                <input type="hidden" name="products" value={JSON.stringify(productInputs)} />
            </Form>

            <div className="flex w-full gap-2 pt-4">
                <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="main" size="normal" className="flex-1" form={formId}>
                    Save Offer
                </Button>
            </div>
        </PopUp>
    );
}

function OffersOverallDiscountSection({
    discountTypeInput,
    setDiscountTypeInput,
    discountAmount,
    setDiscountAmount,
}: {
    discountTypeInput: "PERCENTAGE" | "FIXED_VALUE";
    setDiscountTypeInput: (discountType: "PERCENTAGE" | "FIXED_VALUE") => void;
    discountAmount: number;
    setDiscountAmount: (discountAmount: number) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-x-6">
            <SelectInput
                name="discountType"
                defaultValue={discountTypeInput}
                label="Discount Type"
                labelVariant="small"
                options={{
                    Percentage: "PERCENTAGE",
                    "Fixed Value": "FIXED_VALUE",
                }}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setDiscountTypeInput(e.target.value as "PERCENTAGE" | "FIXED_VALUE")
                }
            />
            <GeneralInput
                type="number"
                name="overallDiscountValue"
                min={0}
                placeholder="10"
                defaultValue={discountAmount}
                label="Discount Value"
                labelVariant="small"
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
            />
            <Text>
                Warning: This will apply a{" "}
                <span className="font-bold">
                    {discountTypeInput === "PERCENTAGE" ? `${discountAmount}%` : `Php ${discountAmount}`} discount
                </span>{" "}
                to all products.
            </Text>
        </div>
    );
}

function IncludedProductsSection({
    catalogueProducts,
    productInputs,
    setProductInputs,
}: {
    catalogueProducts: CatalogueProduct[];
    productInputs: ProductInput[];
    setProductInputs: React.Dispatch<React.SetStateAction<ProductInput[]>>;
}) {
    const usedProductIds = new Set(productInputs.map((product) => product.productId));
    const firstAvailableProduct = catalogueProducts.find((product) => !usedProductIds.has(product.id));
    const canAddProduct = catalogueProducts.length > 0 && firstAvailableProduct !== undefined;

    const updateProductInput = (index: number, changes: Partial<ProductInput>) => {
        setProductInputs((current) =>
            current.map((productInput, productIndex) =>
                productIndex === index ? { ...productInput, ...changes } : productInput
            )
        );
    };

    const handleAddProduct = () => {
        if (!firstAvailableProduct) return;

        setProductInputs((current) => [
            ...current,
            {
                productId: firstAvailableProduct.id,
                requiredQuantity: 1,
                unitDiscountValue: 0,
                discountType: "PERCENTAGE",
            },
        ]);
    };

    const handleRemoveProduct = (index: number) => {
        setProductInputs((current) => current.filter((_, productIndex) => productIndex !== index));
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <Text weight="bold" size="big" variant="brown">
                    Included Products
                </Text>
                <Button
                    type="button"
                    size="normal"
                    variant="grey"
                    leftIcon={AddIcon}
                    onClick={handleAddProduct}
                    disabled={!canAddProduct}
                >
                    Add
                </Button>
            </div>

            {catalogueProducts.length === 0 ? (
                <Text variant="slate-light">
                    No products are available in the catalogue yet. Add a product before creating an individual offer.
                </Text>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
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

                        {productInputs.map((productInput, index) => {
                            const selectedProduct = catalogueProducts.find(
                                (product) => product.id === productInput.productId
                            );

                            // Products already used by other rows are removed from this row's options
                            const selectableProducts = catalogueProducts.filter(
                                (product) =>
                                    product.id === productInput.productId ||
                                    !productInputs.some(
                                        (otherInput, otherIndex) =>
                                            otherIndex !== index && otherInput.productId === product.id
                                    )
                            );

                            const productOptions = Object.fromEntries(
                                selectableProducts.map((product) => [product.productName, String(product.id)])
                            );

                            return (
                                <Table.Row key={productInput.productId}>
                                    <Table.Data isPadded={false} className="px-3!">
                                        <GeneralInput
                                            type="number"
                                            name={`quantity-${index}`}
                                            aria-label="Quantity"
                                            min={1}
                                            value={productInput.requiredQuantity}
                                            className="min-w-20!"
                                            onChange={(e) =>
                                                updateProductInput(index, {
                                                    requiredQuantity: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </Table.Data>
                                    <Table.Data isPadded={false} size="small" text={String(productInput.productId)} />
                                    <Table.Data isPadded={false} className="px-3!">
                                        <SelectInput
                                            name={`product-${index}`}
                                            defaultValue={String(productInput.productId)}
                                            options={productOptions}
                                            className="min-w-40!"
                                            onChange={(e) =>
                                                updateProductInput(index, {
                                                    productId: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </Table.Data>
                                    <Table.Data
                                        isPadded={false}
                                        size="small"
                                        text={selectedProduct ? String(selectedProduct.shelfPrice) : "—"}
                                        className="px-3!"
                                    />
                                    <Table.Data isPadded={false} className="px-3!">
                                        <div className="flex flex-col gap-2 min-w-40">
                                            <SelectInput
                                                name={`discountType-${index}`}
                                                defaultValue={productInput.discountType}
                                                options={{
                                                    Percentage: "PERCENTAGE",
                                                    "Fixed Value": "FIXED_VALUE",
                                                }}
                                                className="min-w-32!"
                                                onChange={(e) =>
                                                    updateProductInput(index, {
                                                        discountType: e.target.value as "PERCENTAGE" | "FIXED_VALUE",
                                                    })
                                                }
                                            />
                                            <GeneralInput
                                                type="number"
                                                name={`unitDiscountValue-${index}`}
                                                aria-label="Discount value"
                                                min={0}
                                                value={productInput.unitDiscountValue}
                                                className="min-w-20!"
                                                onChange={(e) =>
                                                    updateProductInput(index, {
                                                        unitDiscountValue: Number(e.target.value),
                                                    })
                                                }
                                            />
                                            <Text size="description" variant="slate-light" align="center">
                                                {formatDiscountValue(
                                                    productInput.discountType,
                                                    productInput.unitDiscountValue
                                                )}
                                            </Text>
                                        </div>
                                    </Table.Data>
                                    <Table.Data
                                        isPadded={false}
                                        size="small"
                                        text={
                                            selectedProduct
                                                ? calculateSubtotal(
                                                      productInput.requiredQuantity,
                                                      selectedProduct.shelfPrice
                                                  )
                                                : "—"
                                        }
                                        className="px-3!"
                                    />
                                    <Table.Data
                                        isPadded={false}
                                        size="small"
                                        text={
                                            selectedProduct
                                                ? calculateDiscountedSubtotal(
                                                      productInput.discountType,
                                                      productInput.unitDiscountValue,
                                                      productInput.requiredQuantity,
                                                      selectedProduct.shelfPrice
                                                  )
                                                : "—"
                                        }
                                        className="px-3!"
                                    />
                                    <Table.Data isPadded={false} className="px-3!">
                                        <Button
                                            type="button"
                                            aria-label="Remove product"
                                            variant="secondary"
                                            size="smallest"
                                            rightIcon={DeleteOutlinedIcon}
                                            onClick={() => handleRemoveProduct(index)}
                                        />
                                    </Table.Data>
                                </Table.Row>
                            );
                        })}
                    </Table>
                </div>
            )}
        </div>
    );
}

export function BranchOfferViewPopup() {
    const navigate = useNavigatePage();
    const offer = useLoaderData<BranchWideOfferEntry | null>();

    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.branchOffers, true);

    if (!offer) {
        return (
            <PopUp title="Offer Not Found" size="md" handleCloseProp={handleClose}>
                <Text>The offer you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const status = getStatusVariant(offer.offerStatus);
    const appliesTo = offer.isExclusive ? offer.branches.map((branch) => branch.location).join(", ") : "All branches";

    return (
        <PopUp title="Offer Details" subtitle={offer.offerName} size="lg" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 rounded-2xl bg-cream p-4">
                    <Text size="description" weight="bold" variant="slate-medium" className="uppercase">
                        Description
                    </Text>
                    <Text weight="medium" variant="brown">
                        {offer.description}
                    </Text>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Text size="description" weight="bold" variant="slate-medium" className="uppercase">
                            Date Range
                        </Text>
                        <Text weight="medium" variant="brown">
                            {formatFullDate(new Date(offer.startDate))} - {formatFullDate(new Date(offer.endDate))}
                        </Text>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Text size="description" weight="bold" variant="slate-medium" className="uppercase">
                            Status
                        </Text>
                        <div className={`w-fit px-3 py-1 rounded-xl text-normal ${STATUS_CLASSES[status]}`}>
                            {status}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Text size="description" weight="bold" variant="slate-medium" className="uppercase">
                            Offer Type
                        </Text>
                        <Text weight="medium" variant="brown">
                            {offer.offerType === "OVERALL" ? "Overall" : "Included Products"}
                        </Text>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Text size="description" weight="bold" variant="slate-medium" className="uppercase">
                            Applies To
                        </Text>
                        <Text weight="medium" variant="brown">
                            {appliesTo || "No branches"}
                        </Text>
                    </div>
                </div>

                {offer.offerType === "OVERALL" ? (
                    <div className="flex flex-col gap-1">
                        <Text size="description" weight="bold" variant="slate-medium" className="uppercase">
                            Overall Discount
                        </Text>
                        <Text weight="medium" variant="crimson">
                            {formatDiscountValue(offer.discountType ?? "PERCENTAGE", offer.overallDiscountValue ?? 0)}{" "}
                            off all products
                        </Text>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <Text size="description" weight="bold" variant="slate-medium" className="uppercase">
                            Included Products
                        </Text>
                        {offer.products.length === 0 ? (
                            <Text variant="slate-light">No products included.</Text>
                        ) : (
                            offer.products.map((product) => (
                                <div
                                    key={product.productId}
                                    className="flex items-center justify-between rounded-xl bg-cream px-3 py-2"
                                >
                                    <div className="flex flex-col gap-1">
                                        <Text size="description" weight="bold" variant="brown">
                                            {product.productName}
                                        </Text>
                                        <Text size="description" variant="slate-medium">
                                            Qty {product.requiredQuantity} · Shelf ₱{product.shelfPrice.toFixed(2)}
                                        </Text>
                                    </div>
                                    <Text size="description" weight="bold" variant="crimson">
                                        {formatDiscountValue(product.discountType, product.unitDiscountValue)}
                                    </Text>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

export function BranchOfferDeletePopup() {
    const navigate = useNavigatePage();
    const offer = useLoaderData<BranchWideOfferEntry | null>();

    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.branchOffers, true);

    if (!offer) {
        return (
            <PopUp title="Offer Not Found" size="md" handleCloseProp={handleClose}>
                <Text>The offer you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const formId = "branchOfferDeleteForm";

    return (
        <PopUp
            title="Delete offer"
            subtitle="This removes the offer from your branch"
            size="md"
            handleCloseProp={handleClose}
        >
            <section className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <div className="w-fit rounded-full bg-cream px-4 py-1.5">
                        <Text size="normal" weight="bold" variant="brown">
                            {offer.offerName}
                        </Text>
                    </div>
                </div>

                <Text>
                    Are you sure you want to remove <span className="font-bold">{offer.offerName}</span> from your
                    branch? If this is the only branch using the offer, it will be deleted.
                </Text>

                <div className="flex items-start gap-3 rounded-2xl bg-crimson-muted p-3">
                    <WarningAmberOutlinedIcon className="text-crimson" fontSize="small" />
                    <Text size="description" weight="medium" variant="crimson">
                        Offers with existing transaction history are disabled instead of being permanently deleted.
                    </Text>
                </div>

                <Form id={formId} method="post" />
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1" form={formId}>
                        Yes, delete
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}
