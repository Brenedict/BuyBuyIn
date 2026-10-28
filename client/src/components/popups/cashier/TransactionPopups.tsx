// General Imports
import { useState, type FormEvent } from "react";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import Table from "../../Table";
import SearchInput from "../../inputs/SearchInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// Temporary mock data (replace once the backend is connected)
import {
    TABLE_POPUP_ITEMS,
    TABLE_PREVIOUS_TRANSACTIONS,
    TABLE_SUSPENDED_TRANSACTIONS,
    type PopupItem,
} from "../../../TESTINGDATA/cashierPopupData";

export function ResumeTransactionsPopup() {
    const navigate = useNavigatePage();

    // Keeps the transaction number of the highlighted row
    const [selectedNo, setSelectedNo] = useState<string>(TABLE_SUSPENDED_TRANSACTIONS[0]?.transactionNo ?? "");

    // When triggered, returns to the point of sale page (exiting the popup)
    const handleClose = () => navigate();

    // TODO: resume the selected transaction once the backend endpoint is available
    const handleEnter = () => handleClose();

    return (
        <PopUp title="List of Suspended Transactions" size="md">
            <div data-no-drag className="flex flex-col gap-4">
                <Table pageKey="resume_page">
                    <Table.Row>
                        <Table.Header text="Transaction No." bgVariant="crimson" isPadded={false} />
                        <Table.Header text="Amount" bgVariant="crimson" isPadded={false} />
                        <Table.Header text="Name" bgVariant="crimson" isPadded={false} />
                    </Table.Row>
                    {TABLE_SUSPENDED_TRANSACTIONS.map((transaction) => {
                        const isSelected = transaction.transactionNo === selectedNo;
                        const handleSelect = () => setSelectedNo(transaction.transactionNo);

                        return (
                            <Table.Row key={transaction.transactionNo} bgVariant={isSelected ? "cream" : "off-white"}>
                                <Table.Data
                                    text={transaction.transactionNo}
                                    className="cursor-pointer"
                                    onClick={handleSelect}
                                />
                                <Table.Data
                                    text={`₱${transaction.amount}`}
                                    className="cursor-pointer"
                                    onClick={handleSelect}
                                />
                                <Table.Data text={transaction.name} className="cursor-pointer" onClick={handleSelect} />
                            </Table.Row>
                        );
                    })}
                </Table>

                <div className="flex w-full gap-2">
                    <Button type="button" variant="main" size="normal" className="flex-1" onClick={handleEnter}>
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

    // Keeps the transaction number of the highlighted row
    const [selectedNo, setSelectedNo] = useState<string>(TABLE_PREVIOUS_TRANSACTIONS[0]?.transactionNo ?? "");

    // When triggered, returns to the point of sale page (exiting the popup)
    const handleClose = () => navigate();

    // TODO: reprint the receipt of the selected transaction once the backend endpoint is available
    const handleReprint = () => handleClose();

    // TODO: confirm the selected transaction once the backend endpoint is available
    const handleEnter = () => handleClose();

    return (
        <PopUp title="List of Transactions" size="md">
            <div data-no-drag className="flex flex-col gap-4">
                <Table pageKey="reprint_page">
                    <Table.Row>
                        <Table.Header text="Transaction No." bgVariant="crimson" isPadded={false} />
                        <Table.Header text="Amount" bgVariant="crimson" isPadded={false} />
                        <Table.Header text="Name" bgVariant="crimson" isPadded={false} />
                    </Table.Row>
                    {TABLE_PREVIOUS_TRANSACTIONS.map((transaction) => {
                        const isSelected = transaction.transactionNo === selectedNo;
                        const handleSelect = () => setSelectedNo(transaction.transactionNo);

                        return (
                            <Table.Row key={transaction.transactionNo} bgVariant={isSelected ? "cream" : "off-white"}>
                                <Table.Data
                                    text={transaction.transactionNo}
                                    className="cursor-pointer"
                                    onClick={handleSelect}
                                />
                                <Table.Data
                                    text={`₱${transaction.amount}`}
                                    className="cursor-pointer"
                                    onClick={handleSelect}
                                />
                                <Table.Data text={transaction.name} className="cursor-pointer" onClick={handleSelect} />
                            </Table.Row>
                        );
                    })}
                </Table>

                <div className="flex w-full gap-2">
                    <Button
                        type="button"
                        variant="transparent"
                        size="normal"
                        className="flex-1"
                        onClick={handleReprint}
                    >
                        Reprint
                    </Button>
                    <Button type="button" variant="main" size="normal" className="flex-1" onClick={handleEnter}>
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
    items: PopupItem[];
    onSelectItem?: (item: PopupItem) => void;
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

                    return (
                        <Table.Row key={item.itemCode} borderedBottom>
                            <Table.Data
                                text={item.itemCode}
                                className={`whitespace-nowrap ${cellClass}`}
                                onClick={handleSelect}
                            />
                            <Table.Data text={item.itemName} className={cellClass} onClick={handleSelect} />
                            <Table.Data text={`₱${item.retailPrice}`} className={cellClass} onClick={handleSelect} />
                            <Table.Data text={`₱${item.wholesalePrice}`} className={cellClass} onClick={handleSelect} />
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

    // What the cashier is currently typing in the search bar
    const [searchInput, setSearchInput] = useState<string>("");

    // The search that was submitted. The table only changes when ENTER is pressed
    const [searchQuery, setSearchQuery] = useState<string>("");

    // When triggered, returns to the point of sale page (exiting the popup)
    const handleClose = () => navigate();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchQuery(searchInput.trim());
    };

    // TODO: replace with the item search endpoint once the backend is available
    const results = TABLE_POPUP_ITEMS.filter(
        (item) =>
            item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.itemCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PopUp title="Search Item" size="lg">
            <div className="flex flex-col gap-4">
                <form onSubmit={handleSubmit} className="flex items-start gap-2">
                    <SearchInput
                        className="flex-1"
                        name="search"
                        placeholder="Search item by name or item code"
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

                {/* The key sends the table back to page 1 whenever a new search is submitted */}
                <ItemsTable key={searchQuery} items={results} />
            </div>
        </PopUp>
    );
}

export function CheckPricePopup() {
    const navigate = useNavigatePage();

    // What the cashier is currently typing in the barcode field
    const [barcodeInput, setBarcodeInput] = useState<string>("");

    // The item whose price is shown in the banner
    const [selectedItem, setSelectedItem] = useState<PopupItem | null>(null);

    // Message shown under the barcode field when no item matches
    const [barcodeError, setBarcodeError] = useState<string>("");

    // When triggered, returns to the point of sale page (exiting the popup)
    const handleClose = () => navigate();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // TODO: replace with the barcode lookup endpoint once the backend is available
        const found = TABLE_POPUP_ITEMS.find(
            (item) => item.itemCode.toLowerCase() === barcodeInput.trim().toLowerCase()
        );

        setSelectedItem(found ?? null);
        setBarcodeError(found ? "" : "Item not found");
    };

    // Clicking a row in the table shows that item's price in the banner
    const handleSelectItem = (item: PopupItem) => {
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
                            {selectedItem?.itemName ?? "—"}
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
                                {selectedItem ? `₱${selectedItem.retailPrice}` : "—"}
                            </Text>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Text size="description" weight="bold" variant="off-white">
                                WHOLESALE
                            </Text>
                            <Text size="normal" weight="bold" variant="off-white">
                                {selectedItem ? `₱${selectedItem.wholesalePrice}` : "—"}
                            </Text>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex items-start gap-2">
                    {/* TODO: open the Search popup once the route is confirmed with the team */}
                    <Button
                        type="button"
                        variant="transparent"
                        size="normal"
                        className="rounded-full! px-5! uppercase shadow-md"
                    >
                        Search
                    </Button>
                    <SearchInput
                        className="flex-1"
                        name="barcode"
                        placeholder="Type Barcode"
                        value={barcodeInput}
                        error={barcodeError}
                        onChange={(e) => setBarcodeInput(e.target.value)}
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

                <ItemsTable items={TABLE_POPUP_ITEMS} onSelectItem={handleSelectItem} />
            </div>
        </PopUp>
    );
}
