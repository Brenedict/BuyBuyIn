import { useState } from "react";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";
import type { BranchInventoryProduct } from "@buybuyin/shared/schema/branchInventory";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";
import { usePos } from "../../../context/PosContext";

export function QtyPopUp() {
    const navigate = useNavigatePage();
    const { cart, searchInventory, setProductQuantity } = usePos();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<BranchInventoryProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<BranchInventoryProduct | null>(cart[0]?.product ?? null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [quantity, setQuantity] = useState(String(cart[0]?.quantity ?? 1));
    const selectedLine = cart.find((line) => line.product.id === selectedProduct?.id);

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!search.trim()) return;
        setIsSearching(true);
        setSearchError("");
        try {
            setResults(await searchInventory(search.trim()));
        } catch (error) {
            setSearchError(error instanceof Error ? error.message : "Unable to search branch inventory.");
        } finally {
            setIsSearching(false);
        }
    };

    const selectProduct = (product: BranchInventoryProduct) => {
        setSelectedProduct(product);
        setQuantity(String(cart.find((line) => line.product.id === product.id)?.quantity ?? 1));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextQuantity = Number(quantity);
        if (!selectedProduct || !Number.isInteger(nextQuantity) || nextQuantity < 0) return;
        setProductQuantity(selectedProduct, nextQuantity);
        navigate();
    };

    return (
        <PopUp title="Enter Product Quantity">
            <div className="flex flex-col gap-4">
                <form className="flex flex-col gap-3" onSubmit={handleSearch}>
                    <GeneralInput
                        label="Find product by name or ID"
                        type="text"
                        placeholder="Product name, ID, or SKU"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <Button type="submit" size="medium" disabled={!search.trim() || isSearching}>
                        {isSearching ? "Searching..." : "Search"}
                    </Button>
                </form>
                {searchError && (
                    <Text variant="crimson" role="alert">
                        {searchError}
                    </Text>
                )}
                {results.length > 0 && (
                    <div className="max-h-40 overflow-auto rounded border border-brown/30">
                        {results.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                className="flex w-full justify-between border-b border-brown/20 px-3 py-2 text-left text-brown hover:bg-cream"
                                onClick={() => selectProduct(product)}
                            >
                                <span>{product.productName}</span>
                                <span>SKU-{String(product.id).padStart(4, "0")}</span>
                            </button>
                        ))}
                    </div>
                )}
                {selectedProduct && (
                    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                        <Text variant="brown">
                            Selected: {selectedProduct.productName}
                            {selectedLine ? ` (in cart: ${selectedLine.quantity})` : " (not yet in cart)"}
                        </Text>
                        <GeneralInput
                            label="Set quantity"
                            type="number"
                            min={0}
                            step={1}
                            value={quantity}
                            onChange={(event) => setQuantity(event.target.value)}
                            required
                        />
                        <Text size="small" variant="brown">
                            Use 0 to remove this item from the sale.
                        </Text>
                        <Button type="submit" size="medium">
                            Apply quantity
                        </Button>
                    </form>
                )}
                <div className="flex justify-center">
                    <Button type="button" size="medium" variant="grey" onClick={() => navigate()}>
                        Cancel
                    </Button>
                </div>
            </div>
        </PopUp>
    );
}

export function AddItemPopUp() {
    //TODO:change the value to the standardized format
    const gap = "gap-[1rem]";
    return (
        <PopUp title="Enter Product">
            <form className={`flex flex-col ${gap}`}>
                <Text size="mediumBig" weight="medium">
                    Product Name/ID
                </Text>
                <GeneralInput placeholder="e.g. Tomato sauce" type="text"></GeneralInput>
                <Text size="mediumBig" weight="medium">
                    Quantity
                </Text>
                <GeneralInput placeholder="e.g. 2,3 10" type="text"></GeneralInput>
                {/*<KeyboardOverlay></KeyboardOverlay>*/}
                <div className="flex flex-row gap-[2rem] justify-center">
                    <Button size="medium">Apply</Button>
                    <Button size="medium" variant="grey">
                        Cancel
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

export function DiscountPopUp() {
    const navigate = useNavigatePage();
    const { subtotal, discount, seniorDiscountCustomer, setSeniorDiscountCustomer } = usePos();
    const [isEnabled, setIsEnabled] = useState(seniorDiscountCustomer !== null);
    const [customerId, setCustomerId] = useState(seniorDiscountCustomer?.id ?? "");
    const [customerName, setCustomerName] = useState(seniorDiscountCustomer?.name ?? "");
    const [error, setError] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isEnabled) {
            setSeniorDiscountCustomer(null);
            navigate();
            return;
        }

        if (!customerId.trim() || !customerName.trim()) {
            setError("Enter both the PWD/Senior ID and customer name.");
            return;
        }

        setSeniorDiscountCustomer({ id: customerId.trim(), name: customerName.trim() });
        navigate();
    };

    return (
        <PopUp title="Apply Discount">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Text variant="brown">
                    Subtotal: {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(subtotal)}
                </Text>
                <label className="flex items-center gap-3 text-brown">
                    <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(event) => {
                            setIsEnabled(event.target.checked);
                            setError("");
                        }}
                    />
                    Apply PWD/Senior 20% discount
                </label>
                <GeneralInput
                    label="PWD/Senior ID"
                    type="text"
                    value={customerId}
                    onChange={(event) => setCustomerId(event.target.value)}
                    disabled={!isEnabled}
                    required={isEnabled}
                />
                <GeneralInput
                    label="Name"
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    disabled={!isEnabled}
                    required={isEnabled}
                />
                <Text variant="brown">
                    20% discount:{" "}
                    {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
                        Math.round(subtotal * 0.2 * 100) / 100
                    )}
                    Current discount:{" "}
                    {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(discount)}
                </Text>
                {error && (
                    <Text variant="crimson" role="alert">
                        {error}
                    </Text>
                )}
                <div className="flex justify-center gap-4">
                    <Button type="submit" size="medium" disabled={isEnabled && subtotal <= 0}>
                        {isEnabled ? "Apply 20%" : "Remove discount"}
                    </Button>
                    <Button type="button" size="medium" variant="grey" onClick={() => navigate()}>
                        Cancel
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

export function CheckPricePopUp() {
    //TODO:change the value to the standardized format
    const gap = "gap-[1rem]";
    return (
        <PopUp title="Check Price">
            <form className={`flex flex-col ${gap}`}>
                <Text size="mediumBig" weight="medium">
                    Product Name/ID
                </Text>
                <GeneralInput placeholder="e.g. Tomato sauce" type="text"></GeneralInput>
                <Text size="mediumBig" weight="medium">
                    Price
                </Text>
                <GeneralInput placeholder="..." disabled type="text"></GeneralInput>
                {/*<KeyboardOverlay></KeyboardOverlay>*/}
                <div className="flex flex-row gap-[2rem] justify-center">
                    <Button size="medium">Apply</Button>
                    <Button size="medium" variant="grey">
                        Cancel
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}
