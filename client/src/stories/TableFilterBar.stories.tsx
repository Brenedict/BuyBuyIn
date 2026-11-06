// General Imports
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

// Components
import { TableFilterBar } from "../components/TableFilterBar";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
import SelectInput from "../components/inputs/SelectInput";

// Styles
import "../index.css";

// TYPES
type FilterProps = {
    prefix?: string;
};

type SearchDemoProps = {
    isComplex?: boolean;
};

// DROPDOWN OPTIONS
const categoryOptions = {
    "All Categories": "",
    Equipment: "Equipment",
    Supplies: "Supplies",
    Maintenance: "Maintenance",
};

const locationOptions = {
    "All Locations": "",
    "Manila HQ": "Manila HQ",
    "Quezon City": "Quezon City",
    "Cebu HQ": "Cebu HQ",
    "Davao HQ": "Davao HQ",
};

const statusOptions = {
    "All Status": "",
    Available: "Available",
    "Low Stock": "Low Stock",
    "Out of Stock": "Out of Stock",
};

const stockOptions = {
    "All Stock Levels": "",
    "In Stock": "In Stock",
    "Low Stock": "Low Stock",
    "Out of Stock": "Out of Stock",
};

const supplierOptions = {
    "All Suppliers": "",
    TechSource: "TechSource",
    PaperWorks: "PaperWorks",
    CleanPro: "CleanPro",
    PackRight: "PackRight",
    NetSolutions: "NetSolutions",
};

// REUSABLE FILTER COMPONENTS
function CategoryFilter({ prefix = "category" }: FilterProps) {
    return (
        <SelectInput id={`${prefix}-category`} name={`${prefix}-category`} defaultValue="" options={categoryOptions} />
    );
}

function LocationFilter({ prefix = "location" }: FilterProps) {
    return (
        <SelectInput id={`${prefix}-location`} name={`${prefix}-location`} defaultValue="" options={locationOptions} />
    );
}

function StatusFilter({ prefix = "status" }: FilterProps) {
    return <SelectInput id={`${prefix}-status`} name={`${prefix}-status`} defaultValue="" options={statusOptions} />;
}

function StockFilter({ prefix = "stock" }: FilterProps) {
    return <SelectInput id={`${prefix}-stock`} name={`${prefix}-stock`} defaultValue="" options={stockOptions} />;
}

function SupplierFilter({ prefix = "supplier" }: FilterProps) {
    return (
        <SelectInput id={`${prefix}-supplier`} name={`${prefix}-supplier`} defaultValue="" options={supplierOptions} />
    );
}

// REUSABLE SEARCH DEMO
function SearchDemo({ isComplex = false }: SearchDemoProps) {
    const [search, setSearch] = useState("");

    return (
        <TableFilterBar
            isComplex={isComplex}
            searchValue={search}
            onSearchChange={(e) => setSearch(e.target.value)}
            searchPlaceholder="Search inventory..."
        />
    );
}

// STORYBOOK
const meta = {
    title: "All-Components/TableFilterBar",
    component: TableFilterBar,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof TableFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// CASE 1: SINGLE ROW SEARCH
export const SingleRowSearch: Story = {
    parameters: {
        docs: {
            description: {
                story: `
The simplest usage of the TableFilterBar.


This example contains only a search field.


### Example


\`\`\`tsx
<TableFilterBar
    searchValue={search}
    onSearchChange={(e) => setSearch(e.target.value)}
    searchPlaceholder="Search inventory..."
/>
\`\`\`


The component uses its default single-row layout.
                `,
            },
        },
    },
    render: () => <SearchDemo />,
};

// CASE 2: SEARCH + DROPDOWNS
export const SearchWithDropdowns: Story = {
    parameters: {
        docs: {
            description: {
                story: `
Use the \`filters\` prop to insert dropdown filters beside the search field.


The component automatically arranges the search, filters, and actions.


### Example


\`\`\`tsx
<TableFilterBar
    searchValue={search}
    onSearchChange={(e) => setSearch(e.target.value)}
    filters={
        <>
            <CategoryFilter />
            <StatusFilter />
        </>
    }
/>
\`\`\`


                `,
            },
        },
    },
    render: () => (
        <div className="w-full">
            <TableFilterBar
                searchValue=""
                onSearchChange={() => {}}
                searchPlaceholder="Search inventory..."
                filters={
                    <>
                        <CategoryFilter prefix="case-2" />
                        <StatusFilter prefix="case-2" />
                    </>
                }
            />
        </div>
    ),
};

// CASE 3: SEARCH + ACTIONS
export const SearchWithActions: Story = {
    parameters: {
        docs: {
            description: {
                story: `
The \`actions\` prop allows buttons to be placed beside the filters.


This is intended for simple layouts with a maximum of 3 dropdowns.


### Example


\`\`\`tsx
<TableFilterBar
    searchValue={search}
    onSearchChange={handleSearch}
    filters={
        <>
            <CategoryFilter />
            <StatusFilter />
        </>
    }
    actions={
        <>
            <Button variant="secondary">
                Reset
            </Button>
            <Button>
                Apply
            </Button>
        </>
    }
/>
\`\`\`
                `,
            },
        },
    },
    render: () => (
        <TableFilterBar
            searchValue=""
            onSearchChange={() => {}}
            searchPlaceholder="Search inventory..."
            filters={
                <>
                    <CategoryFilter prefix="case-3" />
                    <StatusFilter prefix="case-3" />
                </>
            }
            actions={
                <>
                    <Button variant="secondary" size="medium">
                        Reset
                    </Button>
                    <Button size="medium">Apply</Button>
                </>
            }
        />
    ),
};

// CASE 4: RESPONSIVE WRAPPING
export const ResponsiveWrapping: Story = {
    parameters: {
        docs: {
            description: {
                story: `
Demonstrates the single-row layout with more than 3 dropdowns.


The component uses:


- \`flex-wrap\` on the filter container.
- \`shrink-0\` on dropdowns.
- \`gap-4\` for spacing.


Dropdowns maintain their width and wrap when there is insufficient space.


**Important:** The component documentation recommends complex mode for 4 or more dropdowns. This story demonstrates what happens if single-row mode is used beyond its intended limit.


### Example


\`\`\`tsx
<TableFilterBar
    filters={
        <>
            <CategoryFilter />
            <LocationFilter />
            <StatusFilter />
            <StockFilter />
        </>
    }
/>
\`\`\`
                `,
            },
        },
    },
    render: () => (
        <div className="w-full">
            <TableFilterBar
                searchValue=""
                onSearchChange={() => {}}
                searchPlaceholder="Search inventory..."
                filters={
                    <>
                        <CategoryFilter prefix="case-4" />
                        <LocationFilter prefix="case-4" />
                        <StatusFilter prefix="case-4" />
                        <StockFilter prefix="case-4" />
                    </>
                }
                actions={
                    <Button variant="secondary" size="medium">
                        Reset
                    </Button>
                }
            />
        </div>
    ),
};

// CASE 5: COMPLEX LAYOUT
export const ComplexLayout: Story = {
    parameters: {
        docs: {
            description: {
                story: `
Complex mode provides a responsive two-section layout.


The left section contains the search and date range.


The right section contains the filters and actions.


The layout changes from stacked sections to side-by-side sections at the \`lg\` breakpoint.


### Example


\`\`\`tsx
<TableFilterBar
    isComplex={true}
    searchValue={search}
    onSearchChange={handleSearch}
    filters={
        <>
            <CategoryFilter />
            <LocationFilter />
            <StatusFilter />
            <StockFilter />
        </>
    }
    actions={<Button>Apply Filters</Button>}
/>
\`\`\`
                `,
            },
        },
    },
    render: () => (
        <TableFilterBar
            isComplex={true}
            searchValue=""
            onSearchChange={() => {}}
            searchPlaceholder="Search inventory..."
            filters={
                <>
                    <CategoryFilter prefix="case-5" />
                    <LocationFilter prefix="case-5" />
                    <StatusFilter prefix="case-5" />
                    <StockFilter prefix="case-5" />
                </>
            }
            actions={
                <>
                    <Button variant="secondary" size="medium">
                        Reset
                    </Button>
                    <Button size="medium">Apply Filters</Button>
                </>
            }
        />
    ),
};

// CASE 6: COMPLEX + DATE RANGE
export const ComplexWithDateRange: Story = {
    parameters: {
        docs: {
            description: {
                story: `
Use the \`dateRange\` prop to place date controls in the left section.


The component provides a Date Range label and a responsive wrapper around the supplied controls.


The date inputs themselves are supplied by the consumer.


### Example


\`\`\`tsx
<TableFilterBar
    isComplex={true}
    searchValue={search}
    onSearchChange={handleSearch}
    dateRange={
        <>
            <input type="date" />
            <input type="date" />
        </>
    }
    filters={
        <>
            <CategoryFilter />
            <StatusFilter />
        </>
    }
/>
\`\`\`
                `,
            },
        },
    },
    render: () => (
        <TableFilterBar
            isComplex={true}
            searchValue=""
            onSearchChange={() => {}}
            searchPlaceholder="Search inventory..."
            dateRange={
                <>
                    <input type="date" className="rounded-xl border border-[#cfcabd] bg-off-white px-3 py-3" />
                    <input type="date" className="rounded-xl border border-[#cfcabd] bg-off-white px-3 py-3" />
                </>
            }
            filters={
                <>
                    <CategoryFilter prefix="case-6" />
                    <StatusFilter prefix="case-6" />
                    <LocationFilter prefix="case-6" />
                </>
            }
            actions={<Button size="medium">Apply Filters</Button>}
        />
    ),
};

// CASE 7: COMPLEX WITH MANY FILTERS
export const ComplexWithMultipleFilters: Story = {
    parameters: {
        docs: {
            description: {
                story: `
Complex mode supports multiple filters


The grid changes based on the screen size:


- 1 column by default.
- 2 columns at the \`sm\` breakpoint.
- 3 columns at the \`xl\` breakpoint.


Additional filters automatically create new rows.


### Example


\`\`\`tsx
<TableFilterBar
    isComplex={true}
    filters={
        <>
            <CategoryFilter />
            <LocationFilter />
            <StatusFilter />
            <StockFilter />
            <SupplierFilter />
        </>
    }
/>
\`\`\`
                `,
            },
        },
    },
    render: () => (
        <TableFilterBar
            isComplex={true}
            searchValue=""
            onSearchChange={() => {}}
            searchPlaceholder="Search inventory..."
            filters={
                <>
                    <CategoryFilter prefix="case-7" />
                    <LocationFilter prefix="case-7" />
                    <StatusFilter prefix="case-7" />
                    <StockFilter prefix="case-7" />
                    <SupplierFilter prefix="case-7" />
                </>
            }
            actions={
                <>
                    <Button variant="secondary" size="medium">
                        Reset
                    </Button>
                    <Button size="medium">Apply Filters</Button>
                </>
            }
        />
    ),
};

// CASE 8: CUSTOM POSITIONING
export const CustomPositioning: Story = {
    parameters: {
        docs: {
            description: {
                story: `
The \`children\` prop allows a custom layout to replace the automatic complex layout.


When children are provided, the component renders them directly inside the outer container.


**The positioning in this example is controlled by the consumer, not by TableFilterBar.**


### Example


\`\`\`tsx
<TableFilterBar isComplex={true}>
    <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
            <SearchInput />
            <CategoryFilter />
        </div>


        <div className="flex flex-wrap gap-3">
            <LocationFilter />
            <StatusFilter />
        </div>
    </div>
</TableFilterBar>
\`\`\`
                `,
            },
        },
    },
    render: () => (
        <TableFilterBar isComplex={true}>
            <div className="flex flex-col gap-4">
                {/* Row 1 */}
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="search"
                        placeholder="Search inventory..."
                        className="w-full rounded-xl border border-[#cfcabd] bg-off-white px-4 py-3 sm:w-72"
                    />

                    <CategoryFilter prefix="case-8" />
                </div>

                {/* Row 2 */}
                <div className="flex flex-wrap items-center gap-3">
                    <LocationFilter prefix="case-8" />
                    <StatusFilter prefix="case-8" />

                    <div className="ml-auto flex gap-3">
                        <Button variant="secondary" size="medium">
                            Reset
                        </Button>

                        <Button size="medium">Apply</Button>
                    </div>
                </div>
            </div>
        </TableFilterBar>
    ),
};

// CASE 9: COMPLEX WITHOUT SEARCH
export const ComplexWithoutSearch: Story = {
    parameters: {
        docs: {
            description: {
                story: `
The search field is optional.


When \`onSearchChange\` is omitted, the search section is not rendered.


This example demonstrates a complex layout that contains only date range, filters, and actions.


### Example


\`\`\`tsx
<TableFilterBar
    isComplex={true}
    dateRange={
        <>
            <input type="date" />
            <input type="date" />
        </>
    }
    filters={
        <>
            <CategoryFilter />
            <StatusFilter />
        </>
    }
/>
\`\`\`
                `,
            },
        },
    },
    render: () => (
        <TableFilterBar
            isComplex={true}
            dateRange={
                <>
                    <input type="date" className="rounded-xl border border-[#cfcabd] bg-off-white px-3 py-3" />

                    <input type="date" className="rounded-xl border border-[#cfcabd] bg-off-white px-3 py-3" />
                </>
            }
            filters={
                <>
                    <CategoryFilter prefix="case-9" />
                    <StatusFilter prefix="case-9" />
                    <LocationFilter prefix="case-9" />
                </>
            }
            actions={<Button size="medium">Apply</Button>}
        />
    ),
};

// CASE 10: COMPLETE INVENTORY EXAMPLE
export const CompleteInventoryExample: Story = {
    parameters: {
        docs: {
            description: {
                story: `
A realistic inventory filtering example combining the main features of TableFilterBar.


This example demonstrates:


- Search.
- Date range.
- Multiple dropdown filters.
- Reset and apply actions.
- Complex responsive layout.


The example is intended to demonstrate layout and component composition. The date inputs and filter values are not connected to an actual inventory dataset.
                `,
            },
        },
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Text weight="bold">HQ Admin Inventory</Text>

                <Text size="smaller">Manage and filter inventory items.</Text>
            </div>

            <TableFilterBar
                isComplex={true}
                searchValue=""
                onSearchChange={() => {}}
                searchPlaceholder="Search by item or ID..."
                dateRange={
                    <>
                        <input type="date" className="rounded-xl border border-[#cfcabd] bg-off-white px-3 py-3" />

                        <input type="date" className="rounded-xl border border-[#cfcabd] bg-off-white px-3 py-3" />
                    </>
                }
                filters={
                    <>
                        <CategoryFilter prefix="case-10" />
                        <LocationFilter prefix="case-10" />
                        <StatusFilter prefix="case-10" />
                        <StockFilter prefix="case-10" />
                        <SupplierFilter prefix="case-10" />
                    </>
                }
                actions={
                    <>
                        <Button variant="secondary" size="medium">
                            Reset
                        </Button>

                        <Button size="medium">Apply Filters</Button>
                    </>
                }
            />

            {/* Example Inventory Table */}
            <div className="overflow-x-auto rounded-xl border border-black/10">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-[#FEFCED]">
                        <tr>
                            <th className="p-3">Item ID</th>
                            <th className="p-3">Item Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="border-t border-black/10">
                            <td className="p-3">INV-001</td>
                            <td className="p-3">Wireless Barcode Scanner</td>
                            <td className="p-3">Equipment</td>
                            <td className="p-3">Manila HQ</td>
                            <td className="p-3">45</td>
                            <td className="p-3">Available</td>
                        </tr>

                        <tr className="border-t border-black/10">
                            <td className="p-3">INV-002</td>
                            <td className="p-3">Thermal Receipt Paper</td>
                            <td className="p-3">Supplies</td>
                            <td className="p-3">Quezon City</td>
                            <td className="p-3">120</td>
                            <td className="p-3">Available</td>
                        </tr>

                        <tr className="border-t border-black/10">
                            <td className="p-3">INV-003</td>
                            <td className="p-3">POS Terminal</td>
                            <td className="p-3">Equipment</td>
                            <td className="p-3">Cebu HQ</td>
                            <td className="p-3">4</td>
                            <td className="p-3">Low Stock</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    ),
};
