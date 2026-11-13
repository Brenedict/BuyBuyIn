// General Imports
import { Form, useLoaderData } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";
import SelectInput from "../../inputs/SelectInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// BuyBuyIn Shared Imports
import type { BranchWideOfferEntry, BranchWideOfferFormType } from "@buybuyin/shared/schema/branchWideOffer";
import type { CatalogueProduct } from "@buybuyin/shared/schema/product";

// Utils
import { calculateDiscountedSubtotal } from "../../../utils/offersUtils";

// Routes
import { ROUTES } from "../../../routes/Routes";

// Material UI Icons
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export function BranchOfferDeletePopup() {
    const navigate = useNavigatePage();
    const offer = useLoaderData<BranchWideOfferEntry | null>();

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.branchOffers, true);

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
        <PopUp title="Delete offer" subtitle="This action cannot be undone" size="md" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <div className="w-fit rounded-full bg-cream px-4 py-1.5">
                        <Text size="normal" weight="bold" variant="brown">
                            {offer.offerName}
                        </Text>
                    </div>
                </div>

                <Text>
                    Are you sure you want to delete <span className="font-bold">{offer.offerName}</span>? The offer will
                    be removed from all branches.
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

type ProductInput = BranchWideOfferFormType["products"][number];

type BranchOfferProductFormPopupProps = {
    title: string;
    confirmLabel: string;
    productInput: ProductInput;
    productOptions: Record<string, string>;
    selectedProduct?: CatalogueProduct;
    onChange: (changes: Partial<ProductInput>) => void;
    onConfirm: () => void;
    onClose: () => void;
};

function BranchOfferProductFormPopup({
    title,
    confirmLabel,
    productInput,
    productOptions,
    selectedProduct,
    onChange,
    onConfirm,
    onClose,
}: BranchOfferProductFormPopupProps) {
    return (
        <PopUp title={title} subtitle={selectedProduct?.productName} size="md" handleCloseProp={onClose}>
            <section className="flex flex-col gap-4">
                <SelectInput
                    label="Product"
                    name="productFormProduct"
                    defaultValue={String(productInput.productId)}
                    options={productOptions}
                    onChange={(e) => onChange({ productId: Number(e.target.value) })}
                />
                <GeneralInput
                    type="number"
                    label="Quantity"
                    name="productFormQuantity"
                    min={1}
                    value={productInput.requiredQuantity}
                    onChange={(e) => onChange({ requiredQuantity: Number(e.target.value) })}
                />
                <div className="grid grid-cols-2 gap-3">
                    <SelectInput
                        label="Discount Type"
                        name="productFormDiscountType"
                        defaultValue={productInput.discountType}
                        options={{ Percentage: "PERCENTAGE", "Fixed Value": "FIXED_VALUE" }}
                        onChange={(e) => onChange({ discountType: e.target.value as "PERCENTAGE" | "FIXED_VALUE" })}
                    />
                    <GeneralInput
                        type="number"
                        label="Discount Value"
                        name="productFormDiscountValue"
                        min={0}
                        value={productInput.unitDiscountValue}
                        onChange={(e) => onChange({ unitDiscountValue: Number(e.target.value) })}
                    />
                </div>

                {selectedProduct && (
                    <div>
                        <Text size="description" variant="slate-light" align="center" className="mb-0!">
                            Shelf Price: {selectedProduct.shelfPrice}{" "}
                        </Text>
                        <Text size="description" variant="slate-light" align="center">
                            Discounted Subtotal:{" "}
                            {calculateDiscountedSubtotal(
                                productInput.discountType,
                                productInput.unitDiscountValue,
                                productInput.requiredQuantity,
                                selectedProduct.shelfPrice
                            )}
                        </Text>
                    </div>
                )}

                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" variant="main" size="normal" className="flex-1" onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

type BranchOfferProductEditPopupProps = Omit<BranchOfferProductFormPopupProps, "title" | "confirmLabel">;

export function BranchOfferProductEditPopup(props: BranchOfferProductEditPopupProps) {
    return <BranchOfferProductFormPopup title="Edit Product" confirmLabel="Save" {...props} />;
}

export function BranchOfferProductAddPopup(props: BranchOfferProductEditPopupProps) {
    return <BranchOfferProductFormPopup title="Add Product" confirmLabel="Add" {...props} />;
}

type BranchOfferProductDeletePopupProps = {
    productName: string;
    onConfirm: () => void;
    onClose: () => void;
};

export function BranchOfferProductDeletePopup({ productName, onConfirm, onClose }: BranchOfferProductDeletePopupProps) {
    return (
        <PopUp title="Remove product" subtitle="This action cannot be undone" size="md" handleCloseProp={onClose}>
            <section className="flex flex-col gap-4">
                <Text>
                    Are you sure you want to remove <span className="font-bold">{productName}</span> from this offer?
                </Text>

                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" variant="main" size="normal" className="flex-1" onClick={onConfirm}>
                        Delete
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}
