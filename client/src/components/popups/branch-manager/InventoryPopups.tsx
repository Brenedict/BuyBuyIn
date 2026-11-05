// General Imports
import { useState } from "react";
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
import type { BranchInventoryEntry, BranchInventoryOptionsResponse } from "@buybuyin/shared/schema/branchInventory";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";

// Material UI Icons
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export function InventoryItemRestockPopup() {
    const navigate = useNavigatePage();

    const item = useLoaderData<BranchInventoryEntry | null>();

    const [action, setAction] = useState<"add" | "deduct">("add");

    // When triggered, returns to the inventory page (exiting the popup) and keeps the filters
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.inventory, true);

    if (!item) {
        return (
            <PopUp title="Item Not Found" size="md" handleCloseProp={handleClose}>
                <Text>The item you are looking for no longer exists in this branch's inventory.</Text>
                <div className="flex w-full gap-2">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const formId = "inventoryRestockForm";

    return (
        <PopUp title="Stock Adjustment" subtitle={item.product.productName} size="sm" handleCloseProp={handleClose}>
            <Form id={formId} method="post" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 rounded-2xl bg-cream p-4">
                    <Text size="normal" weight="bold" variant="brown">
                        Current stock
                    </Text>
                    <Text size="description" weight="medium" variant="brown">
                        Before adjustment
                    </Text>
                    <Text size="big" weight="bold" variant="crimson">
                        {item.quantity}
                    </Text>
                </div>

                <div className="flex flex-col gap-2">
                    <Text size="description" weight="bold" variant="brown">
                        What do you want to do? <span className="text-crimson">*</span>
                    </Text>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setAction("add")}
                            className={`rounded-2xl border px-4 py-3 font-bold transition-colors ${
                                action === "add"
                                    ? "border-crimson text-crimson bg-white"
                                    : "border-[#d8d2c4] text-brown bg-off-white"
                            }`}
                        >
                            Add Stock
                        </button>
                        <button
                            type="button"
                            onClick={() => setAction("deduct")}
                            className={`rounded-2xl border px-4 py-3 font-bold transition-colors ${
                                action === "deduct"
                                    ? "border-crimson text-crimson bg-white"
                                    : "border-[#d8d2c4] text-brown bg-off-white"
                            }`}
                        >
                            Deduct Stock
                        </button>
                    </div>
                </div>

                <input type="hidden" name="action" value={action} />

                <GeneralInput
                    name="quantity"
                    type="number"
                    min={1}
                    max={action === "deduct" ? item.quantity : undefined}
                    label="How many unit/s"
                    labelVariant="small"
                    required
                />
            </Form>

            <div className="flex w-full gap-2 pt-12">
                <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="main" size="normal" className="flex-1" form={formId}>
                    Apply
                </Button>
            </div>
        </PopUp>
    );
}

export function InventoryItemDeletePopup() {
    const navigate = useNavigatePage();
    const item = useLoaderData<BranchInventoryEntry | null>();
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.inventory, true);

    if (!item) {
        return (
            <PopUp title="Item Not Found" size="md" handleCloseProp={handleClose}>
                <Text>The item you are looking for no longer exists in this branch's inventory.</Text>
                <div className="flex w-full gap-2">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const formId = "inventoryDeleteForm";

    return (
        <PopUp title="Delete item" subtitle="This action cannot be undone" size="md" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <div className="w-fit rounded-full bg-cream px-4 py-1.5">
                        <Text size="normal" weight="bold" variant="brown">
                            {item.product.productName} ({item.product.sku})
                        </Text>
                    </div>
                </div>

                <Text>
                    Are you sure you want to delete <span className="font-bold">{item.product.productName}</span> from
                    this branch's inventory? This action cannot be undone.
                </Text>

                <div className="flex items-start gap-3 rounded-2xl bg-crimson-muted p-3">
                    <WarningAmberOutlinedIcon className="text-crimson" fontSize="small" />
                    <Text size="description" weight="medium" variant="crimson">
                        This is not permanent. Once deleted, the item will still remain in the catalogue.
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

export function InventoryItemAddPopup() {
    const navigate = useNavigatePage();

    const { products } = useLoaderData<BranchInventoryOptionsResponse>();

    const productOptions = Object.fromEntries(products.map((product) => [product.productName, String(product.id)]));
    const defaultProductId = String(products[0]?.id ?? "");

    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.inventory, true);

    if (products.length === 0) {
        return (
            <PopUp
                title="Add new item"
                subtitle="Fill in the details to add to inventory"
                size="md"
                handleCloseProp={handleClose}
            >
                <Text>
                    Every product in the business catalogue is already stocked in this branch. Ask HQ Admin to add a
                    product to the catalogue first.
                </Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const formId = "inventoryAddForm";

    return (
        <PopUp
            title="Add new item"
            subtitle="Fill in the details to add to inventory"
            size="md"
            handleCloseProp={handleClose}
        >
            <Form id={formId} method="post" className="flex flex-col gap-4">
                <Text>Only products from the business catalogue can be added to your inventory.</Text>

                <SelectInput
                    id="product"
                    name="productId"
                    label="Product"
                    options={productOptions}
                    defaultValue={defaultProductId}
                />

                <div className="grid grid-cols-2 gap-3">
                    <GeneralInput
                        name="quantity"
                        type="number"
                        min={1}
                        label="Quantity to Add"
                        labelVariant="small"
                        required
                    />

                    <GeneralInput
                        name="reorderThreshold"
                        type="number"
                        min={0}
                        label="Reorder Threshold"
                        labelVariant="small"
                        required
                    />
                </div>

                <Text size="description" variant="brown">
                    A restocking alert will appear when stock drops to this number.
                </Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1" form={formId}>
                        Save item
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
}
