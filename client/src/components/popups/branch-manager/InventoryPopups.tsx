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
import type { BranchInventoryEntry, BranchInventoryOptionsResponse } from "@buybuyin/shared/schema/branchInventory";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";
import { NumberFormat } from "../../../utils/chartConfigs";

// Material UI Icons

import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import type { MaterialIcon } from "../../../types/common";

function ItemDetailRow({ icon, label, value }: { icon: MaterialIcon; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-[#cfcabd] py-2 last:border-b-0">
            <Text
                size="description"
                weight="medium"
                variant="brown"
                svg={{ icon, size: "smaller", position: "left", gap: "small" }}
            >
                {label}
            </Text>
            <Text size="normal" weight="bold" variant="crimson" align="right">
                {value}
            </Text>
        </div>
    );
}

export function InventoryItemRestockPopup() {
    const navigate = useNavigatePage();

    const item = useLoaderData<BranchInventoryEntry | null>();

    // When triggered, returns to the inventory page (exiting the popup) and keeps the filters
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.inventory, true);

    if (!item) {
        return (
            <PopUp title="Item Not Found" handleCloseProp={handleClose}>
                <Text>The item you are looking for no longer exists in this branch's inventory.</Text>
            </PopUp>
        );
    }

    return (
        <PopUp title={`Restock ${item.product.productName}`} handleCloseProp={handleClose}>
            <Form method="post" className="flex flex-col gap-4">
                <ItemDetailRow icon={WarningAmberOutlinedIcon} label="Current Stock" value={`${item.quantity} units`} />
                <ItemDetailRow
                    icon={PaymentsOutlinedIcon}
                    label="Unit Price"
                    value={NumberFormat(item.unitPrice, "₱")}
                />
                <ItemDetailRow
                    icon={LocalShippingOutlinedIcon}
                    label="Supplier"
                    value={item.product.supplier?.supplierName ?? "—"}
                />

                <GeneralInput
                    name="quantity"
                    label="Quantity to Add"
                    labelVariant="small"
                    type="number"
                    min={1}
                    placeholder="0"
                    required
                />

                <div className="flex gap-2">
                    <Button type="button" onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" size="normal">
                        Restock
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
}

export function InventoryItemDeletePopup() {
    const navigate = useNavigatePage();
    const item = useLoaderData<BranchInventoryEntry | null>();
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.inventory, true);

    return (
        <PopUp title="Delete Item" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <Text>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {item ? `${item.product.productName} (${item.product.sku})` : "this item"}
                    </span>{" "}
                    from this branch's inventory? This action cannot be undone.
                </Text>

                <Form method="post" className="flex gap-2">
                    <Button type="button" onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" className="flex-1" size="normal">
                        Delete
                    </Button>
                </Form>
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
            <PopUp title="Add Item to Inventory" handleCloseProp={handleClose}>
                <section className="flex flex-col gap-4">
                    <Text>
                        Every product in the business catalogue is already stocked in this branch. Ask HQ Admin to add a
                        product to the catalogue first.
                    </Text>

                    <Button type="button" onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Close
                    </Button>
                </section>
            </PopUp>
        );
    }

    return (
        <PopUp title="Add Item to Inventory" handleCloseProp={handleClose}>
            <Form method="post" className="flex flex-col gap-4">
                <Text>Only products from the business catalogue can be added to your inventory.</Text>

                <SelectInput
                    id="product"
                    name="productId"
                    label="Product"
                    options={productOptions}
                    defaultValue={defaultProductId}
                />

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

                <div className="flex gap-2">
                    <Button type="button" onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" size="normal">
                        Add Item
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
}
