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

// API Services
import type { ProductFormLoaderData } from "../../../api/productService";

// BuyBuyIn Shared Imports
import type { CatalogueProduct } from "@buybuyin/shared/schema/product";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";

// Material UI Icons
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export function ProductFormPopup({ mode }: { mode: "add" | "edit" }) {
    const navigate = useNavigatePage();

    const { product, options } = useLoaderData<ProductFormLoaderData>();

    const supplierOptions = Object.fromEntries(options.suppliers.map((s) => [s.supplierName, String(s.id)]));
    const categoryOptions = Object.fromEntries(options.categories.map((c) => [c.categoryName, String(c.id)]));

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.catalogue, true);

    if (mode === "edit" && !product) {
        return (
            <PopUp title="Product Not Found" size="md" handleCloseProp={handleClose}>
                <Text>The product you are looking for no longer exists in the catalogue.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const defaultSupplier = String(product?.supplier?.id ?? options.suppliers[0]?.id ?? "");
    const defaultCategory = String(product?.category?.id ?? options.categories[0]?.id ?? "");

    const formId = "productForm";

    return (
        <PopUp
            title={mode === "add" ? "Add product" : "Edit product"}
            subtitle={
                mode === "add" ? "Fill in the details to add to the catalogue" : "Update the product's details below"
            }
            size="md"
            handleCloseProp={handleClose}
        >
            <Form id={formId} method="post" className="flex flex-col gap-4">
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

                <div className="grid grid-cols-2 gap-3">
                    <SelectInput
                        id="supplierId"
                        name="supplierId"
                        label="Supplier"
                        labelVariant="small"
                        options={supplierOptions}
                        defaultValue={defaultSupplier}
                    />
                    <SelectInput
                        id="categoryId"
                        name="categoryId"
                        label="Category"
                        labelVariant="small"
                        options={categoryOptions}
                        defaultValue={defaultCategory}
                    />
                </div>
            </Form>

            <div className="flex w-full gap-2 pt-12">
                <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="main" size="normal" className="flex-1" form={formId}>
                    {mode === "add" ? "Save item" : "Save changes"}
                </Button>
            </div>
        </PopUp>
    );
}

export function ProductDeletePopup() {
    const navigate = useNavigatePage();

    const product = useLoaderData<CatalogueProduct | null>();

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.catalogue, true);

    if (!product) {
        return (
            <PopUp title="Product Not Found" size="md" handleCloseProp={handleClose}>
                <Text>The product you are looking for no longer exists in the catalogue.</Text>
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const formId = "productDeleteForm";

    return (
        <PopUp title="Delete product" subtitle="This action cannot be undone" size="md" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <div className="w-fit rounded-full bg-cream px-4 py-1.5">
                        <Text size="normal" weight="bold" variant="brown">
                            {product.productName}
                        </Text>
                    </div>
                </div>

                <Text>
                    Are you sure you want to delete <span className="font-bold">{product.productName}</span> from the
                    catalogue? This action cannot be undone.
                </Text>

                <div className="flex items-start gap-3 rounded-2xl bg-crimson-muted p-3">
                    <WarningAmberOutlinedIcon className="text-crimson" fontSize="small" />
                    <Text size="description" weight="medium" variant="crimson">
                        This is permanent. Once deleted, this product and its data cannot be recovered.
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
