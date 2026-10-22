// General Imports
import { useMemo } from "react";
import { Form, useParams } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";
import SelectInput from "../../inputs/SelectInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";
import { NumberFormat } from "../../../utils/chartConfigs";

// TEST DATA
import {
    CATALOGUE_PRODUCTS,
    CATALOGUE_CATEGORIES,
    CATALOGUE_SUPPLIERS,
    type CatalogueProduct,
} from "../../../TESTINGDATA/catalogueData";

// Material UI Icons
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import type { MaterialIcon } from "../../../types/common";

// Extracts the catalogue product from the URL param
function useCatalogueProduct(): CatalogueProduct | undefined {
    const { id } = useParams();

    return useMemo(() => CATALOGUE_PRODUCTS.find((product) => product.productId === id), [id]);
}

// Select options are keyed by the visible label, mapping each value to itself
function toSelectOptions(values: string[]): Record<string, string> {
    return values.reduce<Record<string, string>>((acc, value) => {
        acc[value] = value;
        return acc;
    }, {});
}

function ProductDetailRow({ icon, label, value }: { icon: MaterialIcon; label: string; value: string }) {
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

export function ProductFormPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();

    const product = useCatalogueProduct();

    const supplierOptions = useMemo(() => toSelectOptions(CATALOGUE_SUPPLIERS), []);
    const categoryOptions = useMemo(() => toSelectOptions(CATALOGUE_CATEGORIES), []);

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.catalogue, true);

    if (mode === "edit" && !product) {
        return (
            <PopUp title="Product Not Found" handleCloseProp={handleClose}>
                <Text>The product you are looking for no longer exists in the catalogue.</Text>
            </PopUp>
        );
    }

    // On edit, the current values are kept. On add, the first option is the default.
    const defaultSupplier = product?.supplier ?? CATALOGUE_SUPPLIERS[0] ?? "";
    const defaultCategory = product?.category ?? CATALOGUE_CATEGORIES[0] ?? "";

    return (
        <PopUp title={mode === "add" ? "Add Product" : "Edit Product"} handleCloseProp={handleClose}>
            <Form method="post" className="flex flex-col gap-4">
                <GeneralInput
                    name="productName"
                    type="text"
                    label="Product Name"
                    labelVariant="small"
                    defaultValue={product?.productName}
                    required
                />

                <div className="grid grid-cols-2 gap-3">
                    <GeneralInput
                        name="basePrice"
                        type="number"
                        min={0}
                        step="0.01"
                        label="Base Price"
                        labelVariant="small"
                        defaultValue={product?.basePrice}
                        required
                    />
                    <GeneralInput
                        name="shelfPrice"
                        type="number"
                        min={0}
                        step="0.01"
                        label="Shelf Price"
                        labelVariant="small"
                        defaultValue={product?.shelfPrice}
                        required
                    />
                </div>

                <SelectInput
                    id="supplier"
                    name="supplier"
                    label="Supplier"
                    options={supplierOptions}
                    defaultValue={defaultSupplier}
                />

                <SelectInput
                    id="category"
                    name="category"
                    label="Category"
                    options={categoryOptions}
                    defaultValue={defaultCategory}
                />

                <div className="flex gap-2">
                    <Button type="button" onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" size="normal">
                        {mode === "add" ? "Add Product" : "Save Changes"}
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
}

export function ProductViewPopup() {
    const navigate = useNavigatePage();

    const product = useCatalogueProduct();

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.catalogue, true);

    if (!product) {
        return (
            <PopUp title="Product Not Found" handleCloseProp={handleClose}>
                <Text>The product you are looking for no longer exists in the catalogue.</Text>
            </PopUp>
        );
    }

    return (
        <PopUp title={product.productName} handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-cream px-4 py-3">
                    <Text
                        size="normal"
                        weight="bold"
                        variant="brown"
                        svg={{ icon: TagOutlinedIcon, size: "normal", position: "left", gap: "small" }}
                    >
                        {product.productId}
                    </Text>
                </div>

                <ProductDetailRow icon={CategoryOutlinedIcon} label="Category" value={product.category} />
                <ProductDetailRow
                    icon={PaymentsOutlinedIcon}
                    label="Base Price"
                    value={NumberFormat(product.basePrice, "₱")}
                />
                <ProductDetailRow
                    icon={PaymentsOutlinedIcon}
                    label="Shelf Price"
                    value={NumberFormat(product.shelfPrice, "₱")}
                />
                <ProductDetailRow icon={LocalShippingOutlinedIcon} label="Supplier" value={product.supplier} />

                <div className="flex gap-2">
                    <Button onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Close
                    </Button>
                    <Button
                        onClick={() => navigate(ROUTES.HQ_ADMIN.catalogueProductEdit(product.productId), true)}
                        className="flex-1"
                        size="normal"
                    >
                        Edit Product
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

export function ProductDeletePopup() {
    const navigate = useNavigatePage();

    const product = useCatalogueProduct();

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.catalogue, true);

    return (
        <PopUp title="Delete Product" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <Text>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">{product ? product.productName : "this product"}</span> from the
                    catalogue? This action cannot be undone.
                </Text>

                <Form method="post" className="flex gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1">
                        Delete
                    </Button>
                </Form>
            </section>
        </PopUp>
    );
}
