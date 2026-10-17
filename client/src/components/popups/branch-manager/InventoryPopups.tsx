// General Imports
import { useMemo, type SubmitEvent } from "react";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";
import SelectInput from "../../inputs/SelectInput";
import TextAreaInput from "../../inputs/TextAreaInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";
import { useParams } from "react-router";

// TEST DATA
import { ROUTES } from "../../../routes/Routes";
import { NumberFormat } from "../../../utils/chartConfigs";
import {
    TABLE_OUT_OF_STOCK_ITEMS,
    TABLE_CURRENT_STOCK_ITEMS,
    TABLE_SUPPLIERS,
    type InventoryItem,
} from "../../../TESTINGDATA/inventoryData";

// Material UI Icons
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import type { MaterialIcon } from "../../../types/common";

/* ---------- Helpers ---------- */

// The two tables hold disjoint slices of the same item list
const ALL_INVENTORY_ITEMS: InventoryItem[] = [...TABLE_OUT_OF_STOCK_ITEMS, ...TABLE_CURRENT_STOCK_ITEMS];

function useInventoryItem() {
    const { id } = useParams();

    return useMemo(() => ALL_INVENTORY_ITEMS.find((item) => item.itemId === id), [id]);
}

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

/* ---------- Popups ---------- */

export function InventoryItemViewPopup() {
    // Used for redirecting
    const navigate = useNavigatePage();

    // Extracts the inventory item id from the URL param
    const item = useInventoryItem();

    // When triggered, returns to the inventory page (exiting the popup) and keeps the filters
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.inventory, true);

    if (!item) {
        return (
            <PopUp title="Item Not Found" handleCloseProp={handleClose}>
                <Text>The item you are looking for no longer exists in this branch's inventory.</Text>
            </PopUp>
        );
    }

    const isLowStock = item.stockLevel <= item.reorderThreshold;

    return (
        <PopUp title={item.itemName} handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-cream px-4 py-3">
                    <Text
                        size="normal"
                        weight="bold"
                        variant="brown"
                        svg={{ icon: Inventory2OutlinedIcon, size: "normal", position: "left", gap: "small" }}
                    >
                        {item.sku}
                    </Text>
                </div>

                <ItemDetailRow icon={Inventory2OutlinedIcon} label="Category" value={item.category} />
                <ItemDetailRow
                    icon={WarningAmberOutlinedIcon}
                    label="Stock Level"
                    value={`${item.stockLevel} units${isLowStock ? " (Low Stock)" : ""}`}
                />
                <ItemDetailRow
                    icon={WarningAmberOutlinedIcon}
                    label="Reorder Threshold"
                    value={`≤ ${item.reorderThreshold} units`}
                />
                <ItemDetailRow
                    icon={PaymentsOutlinedIcon}
                    label="Unit Price"
                    value={NumberFormat(item.unitPrice, "₱")}
                />
                <ItemDetailRow icon={LocalShippingOutlinedIcon} label="Supplier" value={item.supplier} />

                <div className="flex gap-2">
                    <Button onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Close
                    </Button>
                    <Button className="flex-1" size="normal">
                        Restock Item
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

export function InventoryItemRestockPopup() {
    // Used for redirecting
    const navigate = useNavigatePage();

    // Extracts the inventory item id from the URL param
    const item = useInventoryItem();

    // Supplier options are derived from the supplier table, keyed by visible label
    const supplierOptions = useMemo(
        () =>
            TABLE_SUPPLIERS.reduce<Record<string, string>>((acc, supplier) => {
                acc[supplier.supplierName] = supplier.supplierId;
                return acc;
            }, {}),
        []
    );

    // When triggered, returns to the inventory page (exiting the popup) and keeps the filters
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.inventory, true);

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        // TODO: Wire to the restock API once it exists
        event.preventDefault();
        handleClose();
    };

    if (!item) {
        return (
            <PopUp title="Item Not Found" handleCloseProp={handleClose}>
                <Text>The item you are looking for no longer exists in this branch's inventory.</Text>
            </PopUp>
        );
    }

    return (
        <PopUp title={`Restock ${item.itemName}`} handleCloseProp={handleClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 rounded-2xl bg-cream px-4 py-3">
                    <Text size="description" weight="medium" variant="brown">
                        Current stock
                    </Text>
                    <Text size="normal" weight="bold" variant="crimson">
                        {item.stockLevel} units
                    </Text>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <GeneralInput
                        name="quantity"
                        label="Quantity to Add"
                        labelVariant="small"
                        type="number"
                        min={1}
                        placeholder="0"
                        required
                    />
                    <GeneralInput
                        name="unitCost"
                        label="Unit Cost"
                        labelVariant="small"
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder={`₱${item.unitPrice.toFixed(2)}`}
                        defaultValue={item.unitPrice}
                        required
                    />
                </div>

                <SelectInput
                    id="restockSupplier"
                    name="restockSupplier"
                    label="Supplier"
                    options={supplierOptions}
                    defaultValue={item.supplier}
                />

                <TextAreaInput
                    name="notes"
                    label="Notes"
                    labelVariant="small"
                    placeholder="Optional remarks about this restock"
                />

                <div className="flex gap-2">
                    <Button type="button" onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" size="normal">
                        Restock
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

export function InventoryItemDeletePopup() {
    // Used for redirecting
    const navigate = useNavigatePage();

    // Extracts the inventory item id from the URL param
    const item = useInventoryItem();

    // When triggered, returns to the inventory page (exiting the popup) and keeps the filters
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.inventory, true);

    const handleDelete = () => {
        // TODO: Wire to the delete API once it exists
        handleClose();
    };

    return (
        <PopUp title="Delete Item" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <Text>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {item ? `${item.itemName} (${item.sku})` : "this item"}
                    </span>{" "}
                    from this branch's inventory? This action cannot be undone.
                </Text>

                <div className="flex gap-2">
                    <Button onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} className="flex-1" size="normal">
                        Delete
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}