import { Form } from "react-router";
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import SearchInput from "../../components/inputs/SearchInput";
import { ActionButtons, EditDeleteButtons, PrimarySecondaryText } from "../../components/partials/TablePartials";
import { useFormSearchParams } from "../../hooks/useFormSearchParams";
import { NumberFormat } from "../../utils/chartConfigs";
import type { MaterialIcon } from "../../types/common";
import {
    INVENTORY_SUMMARY,
    TABLE_OUT_OF_STOCK_ITEMS,
    TABLE_CURRENT_STOCK_ITEMS,
    TABLE_SUPPLIERS,
    type InventoryItem,
} from "../../TESTINGDATA/inventoryData";

import AddIcon from "@mui/icons-material/Add";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

function formatStockLevel(item: InventoryItem) {
    if (item.stockLevel <= item.reorderThreshold) return `${item.stockLevel} (Low Stock)`;
    return `${item.stockLevel}`;
}

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
    const handleEdit = (itemId: string | number) => () => {
        alert(`Edit item: ${itemId}`);
    };
    const handleMore = (itemId: string | number) => () => {
        alert(`More actions: ${itemId}`);
    };

    return (
        <div className="flex items-center gap-2 justify-center">
            <ActionButtons
                id={id}
                actions={[
                    {
                        text: "Edit",
                        variant: "secondary",
                        leftIcon: DriveFileRenameOutlineOutlinedIcon,
                        handleClick: handleEdit,
                    },
                ]}
                size="smallest"
            />
            <Button
                variant="secondary"
                size="smallest"
                leftIcon={MoreHorizOutlinedIcon}
                onClick={handleMore(id)}
                className="border-0! shadow!"
            />
        </div>
    );
}

function renderOutOfStockRow(item: InventoryItem) {
    return (
        <Table.Row key={item.itemId}>
            <Table.Data wrapWords>
                <PrimarySecondaryText primary={item.itemName} secondary={item.sku} />
            </Table.Data>
            <Table.Data text={item.category} />
            <Table.Data text={formatThreshold(item.reorderThreshold)} />
            <Table.Data text={NumberFormat(item.unitPrice, "₱")} />
            <Table.Data text={item.supplier} wrapWords />
            <Table.Data>
                <ItemRowActions id={item.itemId} />
            </Table.Data>
        </Table.Row>
    );
}

// Main page
export function BranchManager_Inventory() {
    const { values, submit } = useFormSearchParams({ search: "" });

    const handleEditSupplier = (id: string | number) => () => {
        alert(`Edit supplier: ${id}`);
    };
    const handleDeleteSupplier = (id: string | number) => () => {
        alert(`Delete supplier: ${id}`);
    };
    const handleAddItem = () => {
        alert("Add Item");
    };
    const handleAddSupplier = () => {
        alert("Add Supplier");
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
                        <Button leftIcon={AddIcon} onClick={handleAddItem}>
                            Add Item
                        </Button>
                    </Form>
                </div>

                {/* Stat Cards */}
                <div className="flex flex-wrap gap-5">
                    <InventoryStatCard
                        icon={Inventory2OutlinedIcon}
                        title="Total Items"
                        value={INVENTORY_SUMMARY.totalItems.toLocaleString()}
                        subtitle={`Across ${INVENTORY_SUMMARY.totalCategories} categories`}
                    />
                    <InventoryStatCard
                        icon={PaymentsOutlinedIcon}
                        title="Total Stock Value"
                        value={NumberFormat(INVENTORY_SUMMARY.totalStockValue, "₱")}
                        subtitle="Last update today"
                    />
                    <InventoryStatCard
                        icon={WarningAmberOutlinedIcon}
                        title="Low Stock Items"
                        value={INVENTORY_SUMMARY.lowStockCount.toLocaleString()}
                        subtitle="Near reorder threshold"
                    />
                    <InventoryStatCard
                        icon={RemoveShoppingCartOutlinedIcon}
                        title="Out of Stock"
                        value={INVENTORY_SUMMARY.outOfStockCount.toLocaleString()}
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
                    <Card.Body className="px-0 py-0">
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
                                <Table.Header text="Item" bgVariant="off-white" textVariant="crimson" size="big" />
                                <Table.Header
                                    text="Category"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Reorder Threshold"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Unit Price"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Supplier"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Actions"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                            </Table.Row>
                            {TABLE_OUT_OF_STOCK_ITEMS.map(renderOutOfStockRow)}
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
                    <Card.Body className="px-0 py-0">
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
                                <Table.Header text="Item" bgVariant="off-white" textVariant="crimson" size="big" />
                                <Table.Header
                                    text="Category"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Stock Level"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Reorder Threshold"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Unit Price"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Supplier"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Actions"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                            </Table.Row>
                            {TABLE_CURRENT_STOCK_ITEMS.map((item) => (
                                <Table.Row key={item.itemId}>
                                    <Table.Data wrapWords>
                                        <PrimarySecondaryText primary={item.itemName} secondary={item.sku} />
                                    </Table.Data>
                                    <Table.Data text={item.category} />
                                    <Table.Data text={formatStockLevel(item)} />
                                    <Table.Data text={formatThreshold(item.reorderThreshold)} />
                                    <Table.Data text={NumberFormat(item.unitPrice, "₱")} />
                                    <Table.Data text={item.supplier} wrapWords />
                                    <Table.Data>
                                        <ItemRowActions id={item.itemId} />
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
                    <Card.Body className="px-0 py-0">
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
                                <Table.Header
                                    text="Supplier"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Contact Person"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Contact Information"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Address"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
                                <Table.Header
                                    text="Actions"
                                    bgVariant="off-white"
                                    textVariant="crimson"
                                    size="big"
                                />
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
        </Card>
    );
}

export default BranchManager_Inventory;