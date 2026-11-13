// General Imports
import { useEffect, useState, type FormEvent } from "react";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import Table from "../../Table";
import SearchInput from "../../inputs/SearchInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";
import { usePos } from "../../../context/PosContext";
import { getPosTransactions, type PosTransactionListItem } from "../../../api/posService";

import type { BranchInventoryProduct } from "@buybuyin/shared/schema/branchInventory";

export function ResumeTransactionsPopup() {
    const navigate = useNavigatePage();
    const { suspendedSales, resumeSuspendedSale } = usePos();

    const [selectedNo, setSelectedNo] = useState<string>(suspendedSales[0]?.id ?? "");

    // When triggered, returns to the point of sale page (exiting the popup)
    const handleClose = () => navigate();

    const handleEnter = () => {
        if (!selectedNo) return;
        resumeSuspendedSale(selectedNo);
        handleClose();
    };

    return (
        <PopUp title="List of Suspended Transactions" size="md">
            <div data-no-drag className="flex flex-col gap-4">
                <Table pageKey="resume_page">
                    <Table.Row>
                        <Table.Header text="Transaction No." bgVariant="crimson" isPadded={false} />
                        <Table.Header text="Amount" bgVariant="crimson" isPadded={false} />
                        <Table.Header text="Name" bgVariant="crimson" isPadded={false} />
                    </Table.Row>
                    {suspendedSales.map((sale) => {
                        const isSelected = sale.id === selectedNo;
                        const handleSelect = () => setSelectedNo(sale.id);
                        const itemCount = sale.cart.reduce((count, line) => count + line.quantity, 0);

                        return (
                            <Table.Row key={sale.id} bgVariant={isSelected ? "cream" : "off-white"}>
                                <Table.Data text={sale.id} className="cursor-pointer" onClick={handleSelect} />
                                <Table.Data
                                    text={`₱${sale.amountDue.toFixed(2)} (${itemCount} item${itemCount === 1 ? "" : "s"})`}
                                    className="cursor-pointer"
                                    onClick={handleSelect}
                                />
                                <Table.Data
                                    text={new Date(sale.createdAt).toLocaleString()}
                                    className="cursor-pointer"
                                    onClick={handleSelect}
                                />
                            </Table.Row>
                        );
                    })}
                    {!suspendedSales.length && (
                        <Table.Row>
                            <Table.Data colSpan={3} text="No suspended sales" />
                        </Table.Row>
                    )}
                </Table>

                <div className="flex w-full gap-2">
                    <Button
                        type="button"
                        variant="main"
                        size="normal"
                        className="flex-1"
                        onClick={handleEnter}
                        disabled={!selectedNo}
                    >
                        Enter
                    </Button>
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </div>
        </PopUp>
    );
}

export function ReprintTransactionsPopup() {
    const navigate = useNavigatePage();
    const [transactions, setTransactions] = useState<PosTransactionListItem[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        getPosTransactions()
            .then((result) => {
                if (!active) return;
                const completed = result.filter((transaction) => transaction.status === "COMPLETE");
                setTransactions(completed);
                setSelectedId(completed[0]?.id ?? null);
            })
            .catch((loadError) => {
                if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load transactions.");
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    // When triggered, returns to the point of sale page (exiting the popup)
    const handleClose = () => navigate();

    const selectedTransaction = transactions.find((transaction) => transaction.id === selectedId);

    const handleReprint = () => {
        if (!selectedTransaction) return;

        const receiptRows = selectedTransaction.transactionItems
            .map(
                (item) =>
                    `<tr><td>Product ${item.productId ?? `Offer ${item.branchWideOfferId}`}</td><td>${item.quantity}</td><td>₱${item.currentPrice.toFixed(2)}</td><td>₱${(item.quantity * item.currentPrice).toFixed(2)}</td></tr>`
            )
            .join("");
        const printWindow = window.open("", "_blank", "width=420,height=640");
        if (!printWindow) {
            setError("Allow pop-ups in your browser to print this receipt.");
            return;
        }

        printWindow.document.write(
            `<!doctype html><html><head><title>Receipt ${selectedTransaction.id}</title><style>body{font:14px monospace;max-width:380px;margin:24px auto}h1{text-align:center;font-size:18px}table{width:100%;border-collapse:collapse}td{padding:5px 2px;border-bottom:1px dashed #888}td:nth-child(n+2){text-align:right}.total{font-weight:bold;text-align:right;margin-top:12px}</style></head><body><h1>BUYBUYIN RECEIPT</h1><p>Transaction: ${selectedTransaction.id}<br>Date: ${new Date(selectedTransaction.dateofTransaction).toLocaleString()}<br>Payment: ${selectedTransaction.paymentMethod}</p><table>${receiptRows}</table><p>Discount: ₱${selectedTransaction.discount.toFixed(2)}</p><p class="total">TOTAL: ₱${selectedTransaction.totalPrice.toFixed(2)}</p><script>window.onload=()=>window.print()</script></body></html>`
        );
        printWindow.document.close();
    };

    return (
        <PopUp title="List of Transactions" size="md">
            <div data-no-drag className="flex flex-col gap-4">
                <Table pageKey="reprint_page">
                    <Table.Row>
                        <Table.Header text="Transaction No." bgVariant="crimson" isPadded={false} />
                        <Table.Header text="Amount" bgVariant="crimson" isPadded={false} />
                        <Table.Header text="Name" bgVariant="crimson" isPadded={false} />
                    </Table.Row>
                    {transactions.map((transaction) => {
                        const isSelected = transaction.id === selectedId;
                        const handleSelect = () => setSelectedId(transaction.id);

                        return (
                            <Table.Row key={transaction.id} bgVariant={isSelected ? "cream" : "off-white"}>
                                <Table.Data
                                    text={`#${String(transaction.id).padStart(9, "0")}`}
                                    className="cursor-pointer"
                                    onClick={handleSelect}
                                />
                                <Table.Data
                                    text={`₱${transaction.totalPrice.toFixed(2)}`}
                                    className="cursor-pointer"
                                    onClick={handleSelect}
                                />
                                <Table.Data
                                    text={`${transaction.user.firstName} ${transaction.user.lastName}`}
                                    className="cursor-pointer"
                                    onClick={handleSelect}
                                />
                            </Table.Row>
                        );
                    })}
                    {!isLoading && !transactions.length && (
                        <Table.Row>
                            <Table.Data colSpan={3} text="No completed transactions" />
                        </Table.Row>
                    )}
                </Table>
                {isLoading && <Text variant="brown">Loading transactions...</Text>}
                {error && (
                    <Text variant="crimson" role="alert">
                        {error}
                    </Text>
                )}

                <div className="flex w-full gap-2">
                    <Button
                        type="button"
                        variant="transparent"
                        size="normal"
                        className="flex-1"
                        onClick={handleReprint}
                        disabled={!selectedTransaction}
                    >
                        Reprint
                    </Button>
                    <Button
                        type="button"
                        variant="main"
                        size="normal"
                        className="flex-1"
                        onClick={handleReprint}
                        disabled={!selectedTransaction}
                    >
                        Enter
                    </Button>
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </div>
        </PopUp>
    );
}

type ItemsTableProps = {
    items: BranchInventoryProduct[];
    onSelectItem?: (item: BranchInventoryProduct) => void;
};

// Table of items with its own pagination footer. Used by the Search and Check Price popups
function ItemsTable({ items, onSelectItem }: ItemsTableProps) {
    // The page of the items that is currently shown
    const [page, setPage] = useState<number>(1);

    // Number of items shown per page
    const itemsPerPage = 6;

    // Splits the items into pages
    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
    const pageItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const showingStart = items.length === 0 ? 0 : (page - 1) * itemsPerPage + 1;
    const showingEnd = Math.min(page * itemsPerPage, items.length);

    return (
        <div data-no-drag className="flex flex-col gap-4">
            <Table pageKey="items_page">
                <Table.Row borderedBottom>
                    <Table.Header
                        text="Item Code"
                        textVariant="crimson"
                        bgVariant="off-white"
                        style="uppercase"
                        isPadded={false}
                    />
                    <Table.Header
                        text="Item Name"
                        textVariant="crimson"
                        bgVariant="off-white"
                        style="uppercase"
                        isPadded={false}
                    />
                    <Table.Header
                        text="Retail Price"
                        textVariant="crimson"
                        bgVariant="off-white"
                        style="uppercase"
                        isPadded={false}
                    />
                    <Table.Header
                        text="Whole Sale"
                        textVariant="crimson"
                        bgVariant="off-white"
                        style="uppercase"
                        isPadded={false}
                    />
                </Table.Row>
                {pageItems.map((item) => {
                    const handleSelect = () => onSelectItem?.(item);
                    const cellClass = onSelectItem ? "cursor-pointer" : "";
                    const itemCode = item.sku ?? `SKU-${String(item.id).padStart(4, "0")}`;

                    return (
                        <Table.Row key={item.id} borderedBottom>
                            <Table.Data
                                text={itemCode}
                                className={`whitespace-nowrap ${cellClass}`}
                                onClick={handleSelect}
                            />
                            <Table.Data text={item.productName} className={cellClass} onClick={handleSelect} />
                            <Table.Data
                                text={`₱${item.shelfPrice.toFixed(2)}`}
                                className={cellClass}
                                onClick={handleSelect}
                            />
                            <Table.Data
                                text={`₱${item.basePrice.toFixed(2)}`}
                                className={cellClass}
                                onClick={handleSelect}
                            />
                        </Table.Row>
                    );
                })}
            </Table>

            <div className="flex items-center justify-between gap-2">
                <Text size="description" weight="medium" variant="crimson">
                    {`Showing ${showingStart} to ${showingEnd} of ${items.length} items`}
                </Text>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="grey"
                        size="smallest"
                        className="rounded-full! px-3! disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <Button
                            key={pageNumber}
                            type="button"
                            variant={pageNumber === page ? "main" : "transparent"}
                            size="smallest"
                            className="rounded-full! px-2.5!"
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber}
                        </Button>
                    ))}

                    <Button
                        type="button"
                        variant="main"
                        size="smallest"
                        className="rounded-full! px-3! disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function SearchItemPopup() {
    const navigate = useNavigatePage();
    const { addProduct, searchInventory, setQuantityProduct } = usePos();

    // What the cashier is currently typing in the search bar
    const [searchInput, setSearchInput] = useState<string>("");

    // The search that was submitted. The table only changes when ENTER is pressed
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [results, setResults] = useState<BranchInventoryProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // When triggered, returns to the point of sale page (exiting the popup)
    const handleClose = () => navigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = searchInput.trim();
        setSearchQuery(query);
        setError("");
        if (!query) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            setResults(await searchInventory(query));
        } catch (searchError) {
            setError(searchError instanceof Error ? searchError.message : "Unable to search inventory.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PopUp title="Search Item" size="lg">
            <div className="flex flex-col gap-4">
                <form onSubmit={handleSubmit} className="flex items-start gap-2">
                    <SearchInput
                        className="flex-1"
                        name="search"
                        placeholder="Search item by name, ID, or SKU"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="transparent"
                        size="normal"
                        className="rounded-full! px-5! uppercase shadow-md"
                    >
                        Enter
                    </Button>
                    <Button
                        type="button"
                        variant="main"
                        size="normal"
                        className="rounded-full! px-5! uppercase shadow-md"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </form>
                {isLoading && <Text variant="brown">Searching inventory...</Text>}
                {error && (
                    <Text variant="crimson" role="alert">
                        {error}
                    </Text>
                )}

                <ItemsTable
                    key={searchQuery}
                    items={results}
                    onSelectItem={(product) => {
                        addProduct(product);
                        setQuantityProduct(product);
                        navigate("../quantity");
                    }}
                />
            </div>
        </PopUp>
    );
}

export function CheckPricePopup() {
    const navigate = useNavigatePage();
    const { searchInventory } = usePos();

    // What the cashier is currently typing in the barcode field
    const [barcodeInput, setBarcodeInput] = useState<string>("");

    // The item whose price is shown in the banner
    const [selectedItem, setSelectedItem] = useState<BranchInventoryProduct | null>(null);

    // Message shown under the barcode field when no item matches
    const [barcodeError, setBarcodeError] = useState<string>("");
    const [results, setResults] = useState<BranchInventoryProduct[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // When triggered, returns to the point of sale page (exiting the popup)
    const handleClose = () => navigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = barcodeInput.trim();
        if (!query) return;
        setIsSearching(true);
        setBarcodeError("");
        try {
            const found = await searchInventory(query);
            setResults(found);
            setSelectedItem(found.length === 1 ? found[0] : null);
            setBarcodeError(found.length ? "" : "Item not found");
        } catch (lookupError) {
            setBarcodeError(lookupError instanceof Error ? lookupError.message : "Unable to look up this item.");
        } finally {
            setIsSearching(false);
        }
    };

    // Clicking a row in the table shows that item's price in the banner
    const handleSelectItem = (item: BranchInventoryProduct) => {
        setSelectedItem(item);
        setBarcodeError("");
    };

    return (
        <PopUp title="Check Price" size="lg">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-crimson px-5 py-4">
                    <div className="flex flex-col gap-1">
                        <Text size="description" weight="bold" variant="off-white">
                            PRODUCT NAME
                        </Text>
                        <Text size="normal" weight="bold" variant="off-white">
                            {selectedItem?.productName ?? "—"}
                        </Text>
                    </div>

                    <Text size="larger" weight="extraBold" variant="off-white">
                        PRICE:
                    </Text>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <Text size="description" weight="bold" variant="off-white">
                                RETAIL
                            </Text>
                            <Text size="normal" weight="bold" variant="off-white">
                                {selectedItem ? `₱${selectedItem.shelfPrice.toFixed(2)}` : "—"}
                            </Text>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Text size="description" weight="bold" variant="off-white">
                                WHOLESALE
                            </Text>
                            <Text size="normal" weight="bold" variant="off-white">
                                {selectedItem ? `₱${selectedItem.basePrice.toFixed(2)}` : "—"}
                            </Text>
                        </div>
                    </div>
                </div>

                <form id="checkPriceForm" onSubmit={handleSubmit} className="flex items-start gap-2">
                    <Button
                        type="submit"
                        variant="transparent"
                        size="normal"
                        className="rounded-full! px-5! uppercase shadow-md"
                        disabled={!barcodeInput.trim() || isSearching}
                    >
                        {isSearching ? "Searching..." : "Search"}
                    </Button>
                    <SearchInput
                        className="flex-1"
                        name="barcode"
                        placeholder="Product name, ID, or SKU"
                        value={barcodeInput}
                        error={barcodeError}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="transparent"
                        size="normal"
                        className="rounded-full! px-5! uppercase shadow-md"
                        disabled={!barcodeInput.trim() || isSearching}
                    >
                        Enter
                    </Button>
                    <Button
                        type="button"
                        variant="main"
                        size="normal"
                        className="rounded-full! px-5! uppercase shadow-md"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </form>

                <ItemsTable items={results} onSelectItem={handleSelectItem} />
            </div>
        </PopUp>
    );
}

export function VoidCurrentSalePopup() {
    const navigate = useNavigatePage();
    const { cart, subtotal, discount, voidProduct, voidCurrentSale } = usePos();
    const [selectedProductId, setSelectedProductId] = useState<number | "">(cart[0]?.product.id ?? "");
    const [passkey, setPasskey] = useState("");
    const [error, setError] = useState("");
    const [isVoided, setIsVoided] = useState(false);
    const [voidedDescription, setVoidedDescription] = useState("");

    const handleVoid = (voidAll: boolean) => {
        if (passkey !== "1234") {
            setError("Incorrect passkey.");
            return;
        }

        if (voidAll) {
            voidCurrentSale();
            setVoidedDescription("All items were removed from the current sale.");
        } else {
            if (selectedProductId === "") {
                setError("Select an item to void.");
                return;
            }
            const selectedLine = cart.find((line) => line.product.id === selectedProductId);
            if (!selectedLine) {
                setError("The selected item is no longer in the sale.");
                return;
            }
            voidProduct(selectedLine.product.id);
            setVoidedDescription(`${selectedLine.product.productName} was removed from the current sale.`);
        }
        setIsVoided(true);
    };

    return (
        <PopUp title={isVoided ? "Item(s) Voided" : "Void Items"} size="sm">
            <div className="flex flex-col gap-4">
                <Text variant="brown">
                    {isVoided
                        ? `${voidedDescription} This has not changed any previously saved transaction.`
                        : cart.length
                          ? `Current sale total: ₱${Math.max(0, subtotal - discount).toFixed(2)}. Choose one item to void, or void all items.`
                          : "There are no items in the current sale."}
                </Text>
                {!isVoided && cart.length > 0 && (
                    <>
                        <label className="flex flex-col gap-1 text-brown">
                            Item to void
                            <select
                                className="rounded border border-brown/40 bg-off-white px-3 py-2"
                                value={selectedProductId}
                                onChange={(event) =>
                                    setSelectedProductId(event.target.value ? Number(event.target.value) : "")
                                }
                            >
                                {cart.map((line) => (
                                    <option key={line.product.id} value={line.product.id}>
                                        {line.product.productName} — Qty {line.quantity}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 text-brown">
                            Passkey
                            <input
                                type="password"
                                inputMode="numeric"
                                autoComplete="off"
                                value={passkey}
                                onChange={(event) => {
                                    setPasskey(event.target.value);
                                    setError("");
                                }}
                                className="rounded border border-brown/40 bg-off-white px-3 py-2"
                            />
                        </label>
                    </>
                )}
                {error && (
                    <Text variant="crimson" role="alert">
                        {error}
                    </Text>
                )}
                <div className="flex gap-2">
                    {!isVoided && cart.length > 0 && (
                        <>
                            <Button
                                type="button"
                                variant="main"
                                size="normal"
                                className="flex-1"
                                onClick={() => handleVoid(false)}
                            >
                                Void Selected
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                size="normal"
                                className="flex-1"
                                onClick={() => handleVoid(true)}
                            >
                                Void All
                            </Button>
                        </>
                    )}
                    <Button
                        type="button"
                        variant="secondary"
                        size="normal"
                        className="flex-1"
                        onClick={() => navigate()}
                    >
                        {isVoided ? "Close" : "Cancel"}
                    </Button>
                </div>
            </div>
        </PopUp>
    );
}
