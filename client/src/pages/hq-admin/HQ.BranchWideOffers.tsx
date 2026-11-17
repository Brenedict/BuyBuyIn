// General Import
import { useEffect, useState } from "react";
import { Form, Outlet, useLoaderData, useSearchParams } from "react-router";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import {
    BranchOfferProductAddPopup,
    BranchOfferProductDeletePopup,
    BranchOfferProductEditPopup,
} from "../../components/popups/hq-admin/BranchOffersPopups";

import SearchInput from "../../components/inputs/SearchInput";
import GeneralInput from "../../components/inputs/GeneralInput";
import TextAreaInput from "../../components/inputs/TextAreaInput";
import ChoiceInput from "../../components/inputs/ChoiceInput";
import SelectInput from "../../components/inputs/SelectInput";

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

// ROUTES
import { ROUTES } from "../../routes/Routes";

// Hooks
import useNavigatePage from "../../hooks/useNavigatePage";
import { useFormSearchParams } from "../../hooks/useFormSearchParams";

// API Services
import type { HQBranchWideOffersPageData } from "../../api/branchWideOfferService";

// BuyBuyIn Shared Imports
import type {
    BranchWideOfferEntry,
    BranchWideOfferFormType,
    BranchWideOfferListResponse,
    BranchWideOfferOptionsResponse,
    BranchWideOfferStatusType,
} from "@buybuyin/shared/schema/branchWideOffer";
import type { CatalogueProduct } from "@buybuyin/shared/schema/product";

// Utils
import { calculateDiscountedSubtotal, calculateSubtotal, formatDiscountValue } from "../../utils/offersUtils";
import { formatFullDate } from "../../utils/dateUtils";

type ProductInput = BranchWideOfferFormType["products"][number];

const getInitialProductInputs = (offer: BranchWideOfferEntry | null): ProductInput[] =>
    offer?.products.map(({ productId, requiredQuantity, unitDiscountValue, discountType }) => ({
        productId,
        requiredQuantity,
        unitDiscountValue,
        discountType,
    })) ?? [];

const getStatusVariant = (status: BranchWideOfferStatusType): "enabled" | "disabled" | "draft" =>
    status.toLowerCase() as "enabled" | "disabled" | "draft";

// Main Page Exported
export default function HQ_BranchWideOffers() {
    const { list, options, offer } = useLoaderData<HQBranchWideOffersPageData>();

    return (
        <>
            <Card className="h-[calc(100vh-4rem)] flex flex-col">
                <Card.Body className="flex gap-6 grow min-h-0">
                    <OffersListSection list={list} />
                    <OfferConfigurationSection
                        key={`${offer?.id ?? "new"}-${list.summary.totalOffers}`}
                        options={options}
                        offer={offer}
                    />
                </Card.Body>
            </Card>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </>
    );
}

function OfferCard({ offer }: { offer: BranchWideOfferEntry }) {
    const navigate = useNavigatePage();

    const statusClass: Record<"enabled" | "disabled" | "draft", string> = {
        enabled: "bg-crimson text-cream font-bold",
        disabled: "bg-slate-light text-cream font-bold",
        draft: "bg-slate-medium/90 text-cream font-bold",
    };

    const status = getStatusVariant(offer.offerStatus);
    const shortenedTitle = offer.offerName.length > 20 ? `${offer.offerName.substring(0, 20)}...` : offer.offerName;
    const editPath = ROUTES.HQ_ADMIN.branchOffersEdit(String(offer.id));
    const deletePath = ROUTES.HQ_ADMIN.branchOffersDelete(String(offer.id));

    const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        navigate(editPath, true);
    };

    const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        navigate(deletePath, true);
    };

    return (
        <Card
            className="hover:opacity-80 active:opacity-100 hover:cursor-pointer hover:scale-99 transition-transform"
            onClick={() => navigate(editPath, true)}
        >
            <Card.Body className="flex xl:flex-row md:flex-col gap-3 justify-between">
                <div className="flex flex-col gap-3">
                    <Text weight="extraBold" size="big" className="col-span-2">
                        {shortenedTitle}
                    </Text>
                    <Text variant="slate-light">
                        {formatFullDate(new Date(offer.startDate))} - {formatFullDate(new Date(offer.endDate))}
                    </Text>
                    <div
                        className={`w-fit px-3 py-1 rounded-xl lg:text-normal md:text-small-description ${statusClass[status]}`}
                    >
                        {status}
                    </div>
                </div>
                <div className="flex h-fit gap-1 pt-1">
                    <Button
                        type="button"
                        aria-label="Edit offer"
                        variant="secondary"
                        rightIcon={CreateIcon}
                        size="normal"
                        className="p-1! bg-transparent! hover:bg-slate-dark!"
                        onClick={handleEdit}
                    ></Button>
                    <Button
                        type="button"
                        aria-label="Delete offer"
                        variant="secondary"
                        rightIcon={DeleteOutlinedIcon}
                        size="normal"
                        className="p-1! bg-transparent! hover:bg-crimson!"
                        onClick={handleDelete}
                    ></Button>
                </div>
            </Card.Body>
        </Card>
    );
}

function OffersListSection({ list }: { list: BranchWideOfferListResponse }) {
    const { values, handleChange } = useFormSearchParams({ search: "" });

    return (
        <div className="w-[25%] flex flex-col gap-4 h-full min-h-0">
            <Form onChange={handleChange}>
                <SearchInput name="search" placeholder="Search Offers" defaultValue={values.search} />
            </Form>
            <section className="flex flex-col gap-6 pr-3 grow overflow-y-auto min-h-0 *:shrink-0">
                {list.items.length === 0 ? (
                    <Text variant="slate-light">No offers found. Create one using the configuration form.</Text>
                ) : (
                    list.items.map((offer) => <OfferCard key={offer.id} offer={offer} />)
                )}
            </section>
        </div>
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
    const [searchParams, setSearchParams] = useSearchParams();
    const [isAdding, setIsAdding] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [draft, setDraft] = useState<ProductInput | null>(null);
    const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

    const usedProductIds = new Set(productInputs.map((product) => product.productId));
    const firstAvailableProduct = catalogueProducts.find((product) => !usedProductIds.has(product.id));

    const updateProductInput = (index: number, changes: Partial<ProductInput>) => {
        setProductInputs((current) =>
            current.map((productInput, productIndex) =>
                productIndex === index ? { ...productInput, ...changes } : productInput
            )
        );
    };

    const handleAddProduct = () => {
        if (!firstAvailableProduct) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("ERROR", "All products are already added");
            setSearchParams(nextParams, { replace: true });
            return;
        }

        setIsAdding(true);
        setDraft({
            productId: firstAvailableProduct.id,
            requiredQuantity: 1,
            unitDiscountValue: 0,
            discountType: "PERCENTAGE",
        });
    };

    const handleCloseAdd = () => {
        setIsAdding(false);
        setDraft(null);
    };

    const handleSaveAdd = () => {
        if (!draft) return;

        setProductInputs((current) => [...current, draft]);
        handleCloseAdd();
    };

    const handleRemoveProduct = (index: number) => {
        setProductInputs((current) => current.filter((_, productIndex) => productIndex !== index));
    };

    const getSelectableProducts = (productId: number, excludeIndex: number | null) =>
        catalogueProducts.filter(
            (product) =>
                product.id === productId ||
                !productInputs.some(
                    (otherInput, otherIndex) => otherIndex !== excludeIndex && otherInput.productId === product.id
                )
        );

    const handleOpenEdit = (index: number) => {
        const productInput = productInputs[index];

        if (!productInput) return;

        setEditingIndex(index);
        setDraft({ ...productInput });
    };

    const handleCloseEdit = () => {
        setEditingIndex(null);
        setDraft(null);
    };

    const handleSaveEdit = () => {
        if (editingIndex === null || !draft) return;

        updateProductInput(editingIndex, draft);
        handleCloseEdit();
    };

    const handleOpenDelete = (index: number) => setDeletingIndex(index);

    const handleCloseDelete = () => setDeletingIndex(null);

    const handleConfirmDelete = () => {
        if (deletingIndex === null) return;

        handleRemoveProduct(deletingIndex);
        handleCloseDelete();
    };

    const draftSelectedProduct = draft
        ? catalogueProducts.find((product) => product.id === draft.productId)
        : undefined;

    const draftProductOptions = draft
        ? Object.fromEntries(
              getSelectableProducts(draft.productId, isAdding ? null : editingIndex).map((product) => [
                  product.productName,
                  String(product.id),
              ])
          )
        : {};

    const deletingProduct = deletingIndex !== null ? productInputs[deletingIndex] : undefined;
    const deletingProductName =
        catalogueProducts.find((product) => product.id === deletingProduct?.productId)?.productName ?? "this product";

    return (
        <>
            <Card dropShadow={false}>
                <Card.Header
                    toggleRightButton
                    rightButton={
                        <Button
                            type="button"
                            size="normal"
                            variant="grey"
                            leftIcon={AddIcon}
                            onClick={handleAddProduct}
                            disabled={catalogueProducts.length === 0}
                        >
                            Add
                        </Button>
                    }
                    bordered
                >
                    <Text weight="bold" size="big">
                        Included Products
                    </Text>
                </Card.Header>
                <Card.Body className="p-0! overflow-hidden!">
                    {catalogueProducts.length === 0 ? (
                        <Text variant="slate-light" className="p-4">
                            No products are available in the catalogue yet. Add a product before creating an individual
                            offer.
                        </Text>
                    ) : (
                        <Table className="rounded-none! border-0!">
                            {/* Fixed table headers */}
                            <Table.Row borderedBottom>
                                <Table.Header isPadded={false} size="small" className="px-3!" text="Quantity" />
                                <Table.Header isPadded={false} size="small" className="px-3!" text="Product ID" />
                                <Table.Header isPadded={false} size="small" className="px-3!" text="Product Name" />
                                <Table.Header isPadded={false} size="small" className="px-3!" text="Shelf Price" />
                                <Table.Header isPadded={false} size="small" className="px-3!" text="Discount" />
                                <Table.Header isPadded={false} size="small" className="px-3!" text="Subtotal" />
                                <Table.Header
                                    isPadded={false}
                                    size="small"
                                    className="px-3!"
                                    text="Discounted Subtotal"
                                />
                                <Table.Header isPadded={false} size="small" className="px-3!" text="Action" />
                            </Table.Row>

                            {productInputs.map((productInput, index) => {
                                const selectedProduct = catalogueProducts.find(
                                    (product) => product.id === productInput.productId
                                );

                                return (
                                    <Table.Row key={productInput.productId}>
                                        <Table.Data
                                            isPadded={false}
                                            size="small"
                                            className="px-3!"
                                            text={String(productInput.requiredQuantity)}
                                        />
                                        <Table.Data
                                            isPadded={false}
                                            size="small"
                                            text={String(productInput.productId)}
                                        />
                                        <Table.Data
                                            isPadded={false}
                                            size="small"
                                            className="px-3!"
                                            text={selectedProduct?.productName ?? "—"}
                                        />
                                        <Table.Data
                                            isPadded={false}
                                            size="small"
                                            text={selectedProduct ? String(selectedProduct.shelfPrice) : "—"}
                                            className="px-3!"
                                        />
                                        <Table.Data
                                            isPadded={false}
                                            size="small"
                                            className="px-3!"
                                            text={formatDiscountValue(
                                                productInput.discountType,
                                                productInput.unitDiscountValue
                                            )}
                                        />
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
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="small"
                                                    onClick={() => handleOpenEdit(index)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="main"
                                                    size="small"
                                                    onClick={() => handleOpenDelete(index)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Table.Data>
                                    </Table.Row>
                                );
                            })}
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {editingIndex !== null && draft && (
                <BranchOfferProductEditPopup
                    productInput={draft}
                    productOptions={draftProductOptions}
                    selectedProduct={draftSelectedProduct}
                    onChange={(changes) => setDraft((current) => (current ? { ...current, ...changes } : current))}
                    onConfirm={handleSaveEdit}
                    onClose={handleCloseEdit}
                />
            )}

            {isAdding && draft && (
                <BranchOfferProductAddPopup
                    productInput={draft}
                    productOptions={draftProductOptions}
                    selectedProduct={draftSelectedProduct}
                    onChange={(changes) => setDraft((current) => (current ? { ...current, ...changes } : current))}
                    onConfirm={handleSaveAdd}
                    onClose={handleCloseAdd}
                />
            )}

            {deletingProduct && (
                <BranchOfferProductDeletePopup
                    productName={deletingProductName}
                    onConfirm={handleConfirmDelete}
                    onClose={handleCloseDelete}
                />
            )}
        </>
    );
}

function OfferConfigurationSection({
    options,
    offer,
}: {
    options: BranchWideOfferOptionsResponse;
    offer: BranchWideOfferEntry | null;
}) {
    const isEdit = offer !== null;

    const [selectBranches, setSelectBranches] = useState(offer?.isExclusive ?? false);
    const [selectedBranchIds, setSelectedBranchIds] = useState<number[]>(
        offer?.branches.map((branch) => branch.branchId) ?? []
    );
    const [isOverall, setIsOverall] = useState(offer?.offerType === "OVERALL");
    const [discountTypeInput, setDiscountTypeInput] = useState<"PERCENTAGE" | "FIXED_VALUE">(
        offer?.discountType ?? "PERCENTAGE"
    );
    const [discountAmount, setDiscountAmount] = useState(offer?.overallDiscountValue ?? 0);
    const [productInputs, setProductInputs] = useState<ProductInput[]>(getInitialProductInputs(offer));

    const offerId = offer?.id;

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        setSelectBranches(offer?.isExclusive ?? false);
        setSelectedBranchIds(offer?.branches.map((branch) => branch.branchId) ?? []);
        setIsOverall(offer?.offerType === "OVERALL");
        setDiscountTypeInput(offer?.discountType ?? "PERCENTAGE");
        setDiscountAmount(offer?.overallDiscountValue ?? 0);
        setProductInputs(getInitialProductInputs(offer));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offerId]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const toggleBranch = (branchId: number) => {
        setSelectedBranchIds((current) =>
            current.includes(branchId) ? current.filter((id) => id !== branchId) : [...current, branchId]
        );
    };

    const navigate = useNavigatePage();

    const formAction = isEdit
        ? ROUTES.HQ_ADMIN.branchOffersEditSave(String(offer.id))
        : ROUTES.HQ_ADMIN.branchOffersSave;

    const handleAddOffer = () => navigate(ROUTES.HQ_ADMIN.branchOffers, true);

    return (
        <Card isGlass={false} className="w-[75%] h-full flex flex-col">
            <Form method="post" action={formAction} className="flex flex-col grow min-h-0">
                <Card.Header
                    toggleRightButton
                    rightButton={
                        <div className="flex gap-2">
                            {isEdit && (
                                <Button type="button" variant="secondary" onClick={handleAddOffer}>
                                    Add Offer
                                </Button>
                            )}
                            <Button type="submit">Save Offer</Button>
                        </div>
                    }
                    bordered
                    className="shrink-0"
                >
                    <Text weight="bold" size="bigger">
                        Offer Configuration - {isEdit ? "Edit" : "Add"}
                    </Text>
                </Card.Header>

                <Card.Body className="flex flex-col gap-4 grow overflow-y-auto min-h-0 *:shrink-0">
                    <GeneralInput
                        name="offerName"
                        type="text"
                        label="Offer Name"
                        defaultValue={offer?.offerName}
                        required
                    />
                    <TextAreaInput name="description" label="Description" defaultValue={offer?.description} required />

                    {/* Date Range */}
                    <div className="flex gap-6 items-end">
                        <GeneralInput
                            name="startDate"
                            type="date"
                            label="Date Range"
                            defaultValue={offer?.startDate}
                            required
                        />
                        <GeneralInput name="endDate" type="date" defaultValue={offer?.endDate} required />
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
                                checked={selectBranches === false}
                                onChange={() => {
                                    setSelectBranches(false);
                                    setSelectedBranchIds([]);
                                }}
                            >
                                All Branches
                            </ChoiceInput>
                            <ChoiceInput
                                type="radio"
                                id="selectedBranches"
                                name="selectBranch"
                                className="w-fit!"
                                checked={selectBranches === true}
                                onChange={() => setSelectBranches(true)}
                            >
                                Select Branches
                            </ChoiceInput>
                        </div>
                        {selectBranches && (
                            <Card dropShadow={false}>
                                <Card.Body>
                                    {options.branches.length === 0 ? (
                                        <Text variant="slate-light">No branches are available for this business.</Text>
                                    ) : (
                                        options.branches.map((branch) => (
                                            <ChoiceInput
                                                key={branch.branchId}
                                                id={`branch-${branch.branchId}`}
                                                checked={selectedBranchIds.includes(branch.branchId)}
                                                onChange={() => toggleBranch(branch.branchId)}
                                            >
                                                {branch.location}
                                            </ChoiceInput>
                                        ))
                                    )}
                                </Card.Body>
                            </Card>
                        )}
                    </div>

                    {/* Offer Type Selection */}
                    <ChoiceInput
                        id="offerType"
                        label="Offer Type"
                        className="w-fit!"
                        checked={isOverall}
                        onChange={() => setIsOverall((value) => !value)}
                    >
                        All Product Discount (Overall)
                    </ChoiceInput>

                    {/* Toggle for discounts */}
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

                    {/* Set status of offer */}
                    <SelectInput
                        name="offerStatus"
                        defaultValue={offer?.offerStatus ?? "DRAFT"}
                        label="Status"
                        options={{
                            Enabled: "ENABLED",
                            Disabled: "DISABLED",
                            Draft: "DRAFT",
                        }}
                    />

                    <input type="hidden" name="offerType" value={isOverall ? "OVERALL" : "INDIVIDUAL"} />
                    <input type="hidden" name="isExclusive" value={String(selectBranches)} />
                    <input type="hidden" name="branchIds" value={JSON.stringify(selectedBranchIds)} />
                    <input type="hidden" name="products" value={JSON.stringify(productInputs)} />
                </Card.Body>
            </Form>
        </Card>
    );
}
