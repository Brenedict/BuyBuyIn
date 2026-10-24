// General Imports
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
import { TABLE_SUPPLIERS } from "../../TESTINGDATA/inventoryData";

// BuyBuyIn Shared Imports
import type { CatalogueListResponse, CatalogueProduct } from "@buybuyin/shared/schema/product";

// Material UI Icons
import type { MaterialIcon } from "../../types/common";
import AddIcon from "@mui/icons-material/Add";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

interface StatCardProps {
    icon: MaterialIcon;
    title: string;
    value: string;
    subtitle: string;
}

function CatalogueStatCard({ icon, title, value, subtitle }: StatCardProps) {
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

function ProductRowActions({ id }: { id: string }) {
    const navigate = useNavigatePage();

    const handleEdit = (itemId: string | number) => () => {
        navigate(ROUTES.HQ_ADMIN.catalogueProductEdit(String(itemId)), true);
    };
    const handleDelete = (itemId: string | number) => () => {
        navigate(ROUTES.HQ_ADMIN.catalogueProductDelete(String(itemId)), true);
    };

    return <EditDeleteButtons id={id} handleEdit={handleEdit} handleDelete={handleDelete} size="smallest" />;
}

function renderCatalogueRow(product: CatalogueProduct) {
    return (
        <Table.Row key={product.id}>
            <Table.Data wrapWords>
                <PrimarySecondaryText primary={product.productName} secondary={product.category?.categoryName ?? "—"} />
            </Table.Data>
            <Table.Data text={NumberFormat(product.basePrice, "₱")} />
            <Table.Data text={NumberFormat(product.shelfPrice, "₱")} />
            <Table.Data text={product.supplier?.supplierName ?? "—"} wrapWords />
            <Table.Data>
                <ProductRowActions id={String(product.id)} />
            </Table.Data>
        </Table.Row>
    );
}

// Main page
export function HQ_Catalogue() {
    const { products, summary } = useLoaderData<CatalogueListResponse>();
    const { values, submit } = useFormSearchParams({ search: "" });
    const navigate = useNavigatePage();

    const handleAddSupplier = () => {
        alert("Add Supplier");
    };
    const handleEditSupplier = (id: string | number) => () => {
        alert(`Edit supplier: ${id}`);
    };
    const handleDeleteSupplier = (id: string | number) => () => {
        alert(`Delete supplier: ${id}`);
    };

    const handleAddProduct = () => {
        navigate(ROUTES.HQ_ADMIN.catalogueProductAdd, true);
    };

    return (
        <Card>
            <Card.Body className="flex flex-col gap-8 py-6 px-10 overflow-scroll">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Text variant="crimson" size="large" weight="extraBold">
                            CATALOGUE
                        </Text>
                        <Text variant="brown" size="normal" weight="light">
                            Define the products your branches can sell
                        </Text>
                    </div>

                    <Form onSubmit={submit()} className="flex items-center gap-3">
                        <SearchInput
                            name="search"
                            placeholder="Search products, category..."
                            defaultValue={values.search}
                            className="w-72"
                        />
                        <Button type="button" leftIcon={AddIcon} onClick={handleAddProduct}>
                            Add Product
                        </Button>
                    </Form>
                </div>

                {/* Stat Cards */}
                <div className="flex flex-wrap gap-5">
                    <CatalogueStatCard
                        icon={Inventory2OutlinedIcon}
                        title="Total Products"
                        value={summary.totalProducts.toLocaleString()}
                        subtitle={`Across ${summary.totalCategories} categories`}
                    />
                    <CatalogueStatCard
                        icon={CategoryOutlinedIcon}
                        title="Categories"
                        value={summary.totalCategories.toLocaleString()}
                        subtitle="Product groupings"
                    />
                    <CatalogueStatCard
                        icon={LocalShippingOutlinedIcon}
                        title="Suppliers"
                        value={summary.totalSuppliers.toLocaleString()}
                        subtitle="Partnered suppliers"
                    />
                    <CatalogueStatCard
                        icon={PaymentsOutlinedIcon}
                        title="Average Shelf Price"
                        value={NumberFormat(summary.averageShelfPrice, "₱")}
                        subtitle="Average across catalogue"
                    />
                </div>

                {/* Catalogue Table */}
                <Card>
                    <Card.Header centerContent bordered>
                        <Text variant="crimson" size="bigger" weight="extraBold">
                            Catalogue
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
                            pageKey="catalogue_page"
                        >
                            <Table.Row borderedBottom>
                                <Table.Header text="Product" size="big" />
                                <Table.Header text="Base Price" size="big" />
                                <Table.Header text="Shelf Price" size="big" />
                                <Table.Header text="Supplier" size="big" />
                                <Table.Header text="Actions" size="big" />
                            </Table.Row>
                            {products.map(renderCatalogueRow)}
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

export default HQ_Catalogue;
