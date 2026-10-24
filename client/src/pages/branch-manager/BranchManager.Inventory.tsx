import { Form, Outlet, useLoaderData } from "react-router";
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import SearchInput from "../../components/inputs/SearchInput";
import { EditDeleteButtons, PrimarySecondaryText } from "../../components/partials/TablePartials";
import { useFormSearchParams } from "../../hooks/useFormSearchParams";
import useNavigatePage from "../../hooks/useNavigatePage";
import { NumberFormat } from "../../utils/chartConfigs";
import { ROUTES } from "../../routes/Routes";
import type { MaterialIcon } from "../../types/common";
import { TABLE_SUPPLIERS } from "../../TESTINGDATA/inventoryData";

// BuyBuyIn Shared Imports
import type { BranchInventoryEntry, BranchInventoryListResponse } from "@buybuyin/shared/schema/branchInventory";

import AddIcon from "@mui/icons-material/Add";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

function formatThreshold(reorderThreshold: number) {
    return `≤ ${reorderThreshold} units`;
}

// Page-local components
interface StatCardProps {
    icon: MaterialIcon;
    title: string;
    value: string;
    subtitle: string;
}

function InventoryStatCard({ icon, title, value, subtitle }: StatCardProps) {
    return (
        <Card className="grow">
            <Card.Body className="flex flex-col gap-1">
                <Text
                    size="normal"
                    weight="extraBold"
                    variant="crimson"
                    svg={{ icon, size: "normal", variant: "crimson", position: "left", gap: "small" }}
                >
                    {title}
                </Text>
                <Text size="large" weight="extraBold" variant="crimson">
                    {value}
                </Text>
                <Text size="description" variant="slate-light">
                    {subtitle}
                </Text>
            </Card.Body>
        </Card>
    );
}

function ItemRowActions({ id }: { id: string }) {
    const navigate = useNavigatePage();

    return (
        <div className="flex items-center gap-2 justify-center">
            <Button
                size="smallest"
                variant="secondary"
                className="border-0! shadow!"
                leftIcon={AddShoppingCartOutlinedIcon}
                onClick={() => navigate(ROUTES.BRANCH_MANAGER.inventoryItemRestock(String(id)), true)}
            >
                Restock
            </Button>
            <Button
                size="smallest"
                variant="main"
                className="border-0! shadow!"
                leftIcon={DeleteForeverOutlinedIcon}
                onClick={() => navigate(ROUTES.BRANCH_MANAGER.inventoryItemDelete(String(id)), true)}
            >
                Delete
            </Button>
        </div>
    );
}

function renderOutOfStockRow(item: BranchInventoryEntry) {
    return (
        <Table.Row key={item.id}>
            <Table.Data wrapWords>
                <PrimarySecondaryText primary={item.product.productName} secondary={item.product.sku} />
            </Table.Data>
            <Table.Data text={item.product.category?.categoryName ?? "—"} />
            <Table.Data text={formatThreshold(item.reorderThreshold)} />
            <Table.Data text={NumberFormat(item.unitPrice, "₱")} />
            <Table.Data text={item.product.supplier?.supplierName ?? "—"} wrapWords />
            <Table.Data>
                <ItemRowActions id={String(item.id)} />
            </Table.Data>
        </Table.Row>
    );
}

// Main page
export function BranchManager_Inventory() {
    const { items, summary } = useLoaderData<BranchInventoryListResponse>();
    const { values, submit } = useFormSearchParams({ search: "" });

    const outOfStock = items.filter((item) => item.status === "OUT_OF_STOCK");
    const currentStock = items.filter((item) => item.status !== "OUT_OF_STOCK");

    // Used for redirecting
    const navigate = useNavigatePage();

    const handleEditSupplier = (id: string | number) => () => {
        alert(`Edit supplier: ${id}`);
    };
    const handleDeleteSupplier = (id: string | number) => () => {
        alert(`Delete supplier: ${id}`);
    };
    const handleAddItem = () => {
        navigate(ROUTES.BRANCH_MANAGER.inventoryItemAdd, true);
    };
    const handleAddSupplier = () => {
        alert("Add Supplier");
    };

    const formatStockLevel = (item: BranchInventoryEntry) => {
        if (item.status === "LOW_STOCK") return `${item.quantity} (Low Stock)`;
        return `${item.quantity}`;
    };

    return (
        <Card>
            <Card.Body className="flex flex-col gap-8 py-6 px-10 overflow-scroll">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Text variant="crimson" size="large" weight="extraBold">
                            INVENTORY TRACKING
                        </Text>
                        <Text variant="brown" size="normal" weight="light">
                            Monitor stock and stay ahead of restocking
                        </Text>
                    </div>

                    <Form onSubmit={submit()} className="flex items-center gap-3">
                        <SearchInput
                            name="search"
                            placeholder="Search items, supplier..."
                            defaultValue={values.search}
                            className="w-72"
                        />
                        <Button type="button" leftIcon={AddIcon} onClick={handleAddItem}>
                            Add Item
                        </Button>
                    </Form>
                </div>

                {/* Stat Cards */}
                <div className="flex flex-wrap gap-5">
                    <InventoryStatCard
                        icon={Inventory2OutlinedIcon}
                        title="Total Items"
                        value={summary.totalItems.toLocaleString()}
                        subtitle={`Across ${summary.totalCategories} categories`}
                    />
                    <InventoryStatCard
                        icon={PaymentsOutlinedIcon}
                        title="Total Stock Value"
                        value={NumberFormat(summary.totalStockValue, "₱")}
                        subtitle="Last update today"
                    />
                    <InventoryStatCard
                        icon={WarningAmberOutlinedIcon}
                        title="Low Stock Items"
                        value={summary.lowStockCount.toLocaleString()}
                        subtitle="Near reorder threshold"
                    />
                    <InventoryStatCard
                        icon={RemoveShoppingCartOutlinedIcon}
                        title="Out of Stock"
                        value={summary.outOfStockCount.toLocaleString()}
                        subtitle="Requires immediate action"
                    />
                </div>

                {/* Out of Stock Table */}
                <Card>
                    <Card.Header centerContent bordered>
                        <Text variant="crimson" size="bigger" weight="extraBold">
                            Out of Stock
                        </Text>
                    </Card.Header>
                    <Card.Body removePadding>
                        <Table
                            bordered={false}
                            shadow={false}
                            rounded={false}
                            pagination={{
                                bgVariant: "cream-muted",
                                borderVariant: "brown",
                                borderedTop: true,
                                maxItems: 5,
                                textSize: "description",
                                textVariant: "crimson",
                                textWeight: "medium",
                            }}
                            pageKey="out_of_stock_page"
                        >
                            <Table.Row borderedBottom>
                                <Table.Header text="Item" size="big" />
                                <Table.Header text="Category" size="big" />
                                <Table.Header
                                    text="Reorder Threshold"

                                    size="big"
                                />
                                <Table.Header
                                    text="Unit Price"

                                    size="big"
                                />
                                <Table.Header text="Supplier" size="big" />
                                <Table.Header text="Actions" size="big" />
                            </Table.Row>
                            {outOfStock.map(renderOutOfStockRow)}
                        </Table>
                    </Card.Body>
                </Card>

                {/* Current Stock Levels Table */}
                <Card>
                    <Card.Header centerContent bordered>
                        <Text variant="crimson" size="bigger" weight="extraBold">
                            Current Stock Levels
                        </Text>
                    </Card.Header>
                    <Card.Body removePadding>
                        <Table
                            bordered={false}
                            shadow={false}
                            rounded={false}
                            pagination={{
                                bgVariant: "cream-muted",
                                borderVariant: "brown",
                                borderedTop: true,
                                maxItems: 10,
                                textSize: "description",
                                textVariant: "crimson",
                                textWeight: "medium",
                            }}
                            pageKey="current_stock_page"
                        >
                            <Table.Row borderedBottom>
                                <Table.Header text="Item" size="big" />
                                <Table.Header text="Category" size="big" />
                                <Table.Header text="Stock Level" size="big" />
                                <Table.Header text="Reorder Threshold" size="big" />
                                <Table.Header text="Unit Price" size="big" />
                                <Table.Header text="Supplier" size="big" />
                                <Table.Header text="Actions" size="big" />
                            </Table.Row>
                            {currentStock.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Data wrapWords>
                                        <PrimarySecondaryText
                                            primary={item.product.productName}
                                            secondary={item.product.sku}
                                        />
                                    </Table.Data>
                                    <Table.Data text={item.product.category?.categoryName ?? "—"} />
                                    <Table.Data text={formatStockLevel(item)} />
                                    <Table.Data text={formatThreshold(item.reorderThreshold)} />
                                    <Table.Data text={NumberFormat(item.unitPrice, "₱")} />
                                    <Table.Data text={item.product.supplier?.supplierName ?? "—"} wrapWords />
                                    <Table.Data>
                                        <ItemRowActions id={String(item.id)} />
                                    </Table.Data>
                                </Table.Row>
                            ))}
                        </Table>
                    </Card.Body>
                </Card>

                {/* Suppliers Table */}
                <Card>
                    <Card.Header
                        toggleRightButton
                        rightButton={<Button leftIcon={AddIcon} onClick={handleAddSupplier} size="normal" />}
                        bordered
                    >
                        <Text variant="crimson" size="bigger" weight="extraBold">
                            Suppliers
                        </Text>
                    </Card.Header>
                    <Card.Body removePadding>
                        <Table
                            bordered={false}
                            shadow={false}
                            rounded={false}
                            pagination={{
                                bgVariant: "cream-muted",
                                borderVariant: "brown",
                                borderedTop: true,
                                maxItems: 5,
                                textSize: "description",
                                textVariant: "crimson",
                                textWeight: "medium",
                            }}
                            pageKey="suppliers_page"
                        >
                            <Table.Row borderedBottom>
                                <Table.Header text="Supplier" size="big" />
                                <Table.Header text="Contact Person" size="big" />
                                <Table.Header text="Contact Information" size="big" />
                                <Table.Header text="Address" size="big" />
                                <Table.Header text="Actions" size="big" />
                            </Table.Row>
                            {TABLE_SUPPLIERS.map((supplier) => (
                                <Table.Row key={supplier.supplierId}>
                                    <Table.Data text={supplier.supplierName} wrapWords />
                                    <Table.Data text={supplier.contactPerson} wrapWords />
                                    <Table.Data wrapWords>
                                        <PrimarySecondaryText
                                            primary={supplier.contactNumber}
                                            secondary={supplier.email}
                                        />
                                    </Table.Data>
                                    <Table.Data text={supplier.address} wrapWords />
                                    <Table.Data>
                                        <EditDeleteButtons
                                            id={supplier.supplierId}
                                            handleEdit={handleEditSupplier}
                                            handleDelete={handleDeleteSupplier}
                                            size="smallest"
                                        />
                                    </Table.Data>
                                </Table.Row>
                            ))}
                        </Table>
                    </Card.Body>
                </Card>
            </Card.Body>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </Card>
    );
}

export default BranchManager_Inventory;
