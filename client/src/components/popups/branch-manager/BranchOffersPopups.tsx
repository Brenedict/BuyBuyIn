// General Imports
import { useLoaderData } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// BuyBuyIn Shared Imports
import type { BranchWideOfferEntry, BranchWideOfferStatusType } from "@buybuyin/shared/schema/branchWideOffer";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";
import { formatDiscountValue } from "../../../utils/offersUtils";
import { formatFullDate } from "../../../utils/dateUtils";

type StatusVariant = "enabled" | "disabled" | "draft";

const STATUS_CLASSES: Record<StatusVariant, string> = {
    enabled: "bg-crimson text-cream font-bold",
    disabled: "bg-slate-light text-cream font-bold",
    draft: "bg-slate-medium/90 text-cream font-bold",
};

const getStatusVariant = (status: BranchWideOfferStatusType): StatusVariant => status.toLowerCase() as StatusVariant;

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
