import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import Table from "../components/Table";
import { type ColorVariant, type SizeVariant, type WeightVariant } from "../types/common";
import "../index.css";
import { TABLE_SAMPLE_USERS } from "../TESTINGDATA/tableData";

// Custom args type
type TableArgs = {
    // Table props
    bordered: boolean;
    rounded: boolean;
    shadow: boolean;
    enablePagination: boolean;
    // Header props
    headerText: string;
    headerTextVariant: ColorVariant;
    headerWeight: WeightVariant;
    headerSize: SizeVariant;
    headerStyle: "capitalize" | "uppercase";
    headerNowrap: boolean;
    headerBorderedBottom: boolean;
    // Data props
    dataTextVariant: ColorVariant;
    dataWeight: WeightVariant;
    dataSize: SizeVariant;
    dataNowrap: boolean;
    dataBorderedBottom: boolean;
    // Pagination props
    maxItems: number;
    borderedTop: boolean;
    borderVariant: ColorVariant;
    bgVariant: ColorVariant;
    textVariant: ColorVariant;
    textSize: SizeVariant;
    textWeight: WeightVariant;
};

const COLOR_OPTIONS: ColorVariant[] = [
    "black",
    "slate",
    "slate-dark",
    "slate-medium",
    "slate-light",
    "brown",
    "maroon",
    "crimson",
    "crimson-muted",
    "cream",
    "cream-muted",
];

const SIZE_OPTIONS: SizeVariant[] = [
    "iconHero",
    "larger",
    "large",
    "bigger",
    "big",
    "mediumBig",
    "mediumSmall",
    "medium",
    "normal",
    "description",
    "small",
    "smaller",
    "smallest",
];

const WEIGHT_OPTIONS: WeightVariant[] = ["black", "bold", "medium", "regular", "light"];

const meta = {
    title: "Table",
    component: Table,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        children: { table: { disable: true } },
        pagination: { table: { disable: true } },

        // Table props
        bordered: {
            control: "boolean",
            description: "Enable border around the table",
            table: { category: "Table" },
        },
        rounded: {
            control: "boolean",
            description: "Apply rounded corners to the table",
            table: { category: "Table" },
        },
        shadow: {
            control: "boolean",
            description: "Apply shadow to the table",
            table: { category: "Table" },
        },
        enablePagination: {
            control: "boolean",
            description: "Enable pagination controls",
            table: { category: "Table" },
        },
        // Header props
        headerText: {
            control: "text",
            description: "Text displayed in header cells",
            table: { category: "Header" },
        },
        headerTextVariant: {
            control: "select",
            options: COLOR_OPTIONS,
            description: "Text color variant for headers",
            table: { category: "Header" },
        },
        headerWeight: {
            control: "select",
            options: WEIGHT_OPTIONS,
            description: "Font weight for headers",
            table: { category: "Header" },
        },
        headerSize: {
            control: "select",
            options: SIZE_OPTIONS,
            description: "Font size for headers",
            table: { category: "Header" },
        },
        headerStyle: {
            control: "select",
            options: ["capitalize", "uppercase"],
            description: "Text transform style for headers",
            table: { category: "Header" },
        },
        headerNowrap: {
            control: "boolean",
            description: "Prevent text wrapping in headers",
            table: { category: "Header" },
        },
        headerBorderedBottom: {
            control: "boolean",
            description: "Show border below header row",
            table: { category: "Header" },
        },
        // Data props
        dataTextVariant: {
            control: "select",
            options: COLOR_OPTIONS,
            description: "Text color variant for data cells",
            table: { category: "Data" },
        },
        dataWeight: {
            control: "select",
            options: WEIGHT_OPTIONS,
            description: "Font weight for data cells",
            table: { category: "Data" },
        },
        dataSize: {
            control: "select",
            options: SIZE_OPTIONS,
            description: "Font size for data cells",
            table: { category: "Data" },
        },
        dataNowrap: {
            control: "boolean",
            description: "Prevent text wrapping in data cells",
            table: { category: "Data" },
        },
        dataBorderedBottom: {
            control: "boolean",
            description: "Show border below data rows",
            table: { category: "Data" },
        },
        // Pagination props
        maxItems: {
            control: { type: "range", min: 1, max: 20, step: 1 },
            description: "Maximum items per page",
            table: { category: "Pagination" },
        },
        borderedTop: {
            control: "boolean",
            description: "Show border on top of pagination bar",
            table: { category: "Pagination" },
        },
        borderVariant: {
            control: "select",
            options: COLOR_OPTIONS,
            description: "Border color variant for pagination",
            table: { category: "Pagination" },
        },
        bgVariant: {
            control: "select",
            options: COLOR_OPTIONS,
            description: "Background color variant for pagination",
            table: { category: "Pagination" },
        },
        textVariant: {
            control: "select",
            options: COLOR_OPTIONS,
            description: "Text color variant for pagination info",
            table: { category: "Pagination" },
        },
        textSize: {
            control: "select",
            options: SIZE_OPTIONS,
            description: "Font size for pagination info",
            table: { category: "Pagination" },
        },
        textWeight: {
            control: "select",
            options: WEIGHT_OPTIONS,
            description: "Font weight for pagination info",
            table: { category: "Pagination" },
        },
    },
    args: {
        // Table defaults
        bordered: true,
        rounded: true,
        shadow: true,
        enablePagination: true,
        // Header defaults
        headerText: "Column",
        headerTextVariant: "crimson",
        headerWeight: "bold",
        headerSize: "mediumBig",
        headerStyle: "capitalize",
        headerNowrap: true,
        headerBorderedBottom: true,
        // Data defaults
        dataTextVariant: "brown",
        dataWeight: "medium",
        dataSize: "normal",
        dataNowrap: true,
        dataBorderedBottom: true,
        // Pagination defaults
        maxItems: 5,
        borderedTop: true,
        borderVariant: "brown",
        bgVariant: "cream-muted",
        textVariant: "crimson",
        textSize: "description",
        textWeight: "medium",
    },
};

export default meta;
type Story = StoryObj<TableArgs>;

export const Default: Story = {
    render: (args) => {
        const paginationConfig = args.enablePagination
            ? {
                  maxItems: args.maxItems,
                  borderedTop: args.borderedTop,
                  borderVariant: args.borderVariant,
                  bgVariant: args.bgVariant,
                  textVariant: args.textVariant,
                  textSize: args.textSize,
                  textWeight: args.textWeight,
              }
            : undefined;

        return (
            <Table bordered={args.bordered} rounded={args.rounded} shadow={args.shadow} pagination={paginationConfig}>
                <Table.Row borderedBottom={args.headerBorderedBottom}>
                    <Table.Header
                        text={args.headerText}
                        textVariant={args.headerTextVariant}
                        weight={args.headerWeight}
                        size={args.headerSize}
                        style={args.headerStyle}
                        nowrap={args.headerNowrap}
                    />
                    <Table.Header
                        text="Contact No."
                        textVariant={args.headerTextVariant}
                        weight={args.headerWeight}
                        size={args.headerSize}
                        style={args.headerStyle}
                        nowrap={args.headerNowrap}
                    />
                    <Table.Header
                        text="Role"
                        textVariant={args.headerTextVariant}
                        weight={args.headerWeight}
                        size={args.headerSize}
                        style={args.headerStyle}
                        nowrap={args.headerNowrap}
                    />
                    <Table.Header
                        text="Branch"
                        textVariant={args.headerTextVariant}
                        weight={args.headerWeight}
                        size={args.headerSize}
                        style={args.headerStyle}
                        nowrap={args.headerNowrap}
                    />
                    <Table.Header
                        text="Status"
                        textVariant={args.headerTextVariant}
                        weight={args.headerWeight}
                        size={args.headerSize}
                        style={args.headerStyle}
                        nowrap={args.headerNowrap}
                    />
                </Table.Row>

                {TABLE_SAMPLE_USERS.map((user, i) => (
                    <Table.Row key={i} borderedBottom={args.dataBorderedBottom}>
                        <Table.Data
                            text={user.name}
                            textVariant={args.dataTextVariant}
                            weight={args.dataWeight}
                            size={args.dataSize}
                            nowrap={args.dataNowrap}
                        />
                        <Table.Data
                            text={user.contact}
                            textVariant={args.dataTextVariant}
                            weight={args.dataWeight}
                            size={args.dataSize}
                            nowrap={args.dataNowrap}
                        />
                        <Table.Data
                            text={user.role}
                            textVariant={args.dataTextVariant}
                            weight={args.dataWeight}
                            size={args.dataSize}
                            nowrap={args.dataNowrap}
                        />
                        <Table.Data
                            text={user.branch}
                            textVariant={args.dataTextVariant}
                            weight={args.dataWeight}
                            size={args.dataSize}
                            nowrap={args.dataNowrap}
                        />
                        <Table.Data
                            text={user.status}
                            textVariant={args.dataTextVariant}
                            weight={args.dataWeight}
                            size={args.dataSize}
                            nowrap={args.dataNowrap}
                        />
                    </Table.Row>
                ))}
            </Table>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "A fully configurable table with controls for all Table, Header, Data, and Pagination properties.",
            },
        },
    },
};

export const WithoutPagination: Story = {
    args: {
        enablePagination: false,
    },
    render: (args) => (
        <Table bordered={args.bordered} rounded={args.rounded} shadow={args.shadow}>
            <Table.Row borderedBottom>
                <Table.Header text="Name" nowrap />
                <Table.Header text="Contact No." nowrap />
                <Table.Header text="Role" nowrap />
                <Table.Header text="Branch" nowrap />
                <Table.Header text="Status" nowrap />
            </Table.Row>

            {TABLE_SAMPLE_USERS.slice(0, 5).map((user, i) => (
                <Table.Row key={i} borderedBottom={args.dataBorderedBottom}>
                    <Table.Data text={user.name} nowrap />
                    <Table.Data text={user.contact} nowrap />
                    <Table.Data text={user.role} nowrap />
                    <Table.Data text={user.branch} nowrap />
                    <Table.Data text={user.status} nowrap />
                </Table.Row>
            ))}
        </Table>
    ),
    parameters: {
        docs: {
            description: {
                story: "Table without pagination controls, showing all rows at once.",
            },
        },
    },
};

export const NoTableBorderStyle: Story = {
    args: {
        enablePagination: false,
        bordered: false,
        rounded: false,
        shadow: false,
    },
    render: (args) => (
        <Table bordered={args.bordered} rounded={args.rounded} shadow={args.shadow}>
            <Table.Row>
                <Table.Header text="Name" nowrap />
                <Table.Header text="Contact No." nowrap />
                <Table.Header text="Role" nowrap />
                <Table.Header text="Branch" nowrap />
                <Table.Header text="Status" nowrap />
            </Table.Row>

            {TABLE_SAMPLE_USERS.slice(0, 5).map((user, i) => (
                <Table.Row key={i}>
                    <Table.Data text={user.name} nowrap />
                    <Table.Data text={user.contact} nowrap />
                    <Table.Data text={user.role} nowrap />
                    <Table.Data text={user.branch} nowrap />
                    <Table.Data text={user.status} nowrap />
                </Table.Row>
            ))}
        </Table>
    ),
    parameters: {
        docs: {
            description: {
                story: "Table without any border styling (pwede magamit sa embedded na tables like sa dialog, cards, etc.).",
            },
        },
    },
};

export const UppercaseHeaders: Story = {
    args: {
        headerStyle: "uppercase",
        headerTextVariant: "brown",
        headerWeight: "bold",
        headerSize: "medium",
        enablePagination: false,
    },
    render: (args) => (
        <Table bordered={args.bordered} rounded={args.rounded} shadow={args.shadow}>
            <Table.Row borderedBottom>
                <Table.Header
                    text="Name"
                    textVariant={args.headerTextVariant}
                    weight={args.headerWeight}
                    size={args.headerSize}
                    style={args.headerStyle}
                    nowrap
                />
                <Table.Header
                    text="Contact No."
                    textVariant={args.headerTextVariant}
                    weight={args.headerWeight}
                    size={args.headerSize}
                    style={args.headerStyle}
                    nowrap
                />
                <Table.Header
                    text="Role"
                    textVariant={args.headerTextVariant}
                    weight={args.headerWeight}
                    size={args.headerSize}
                    style={args.headerStyle}
                    nowrap
                />
                <Table.Header
                    text="Branch"
                    textVariant={args.headerTextVariant}
                    weight={args.headerWeight}
                    size={args.headerSize}
                    style={args.headerStyle}
                    nowrap
                />
                <Table.Header
                    text="Status"
                    textVariant={args.headerTextVariant}
                    weight={args.headerWeight}
                    size={args.headerSize}
                    style={args.headerStyle}
                    nowrap
                />
            </Table.Row>

            {TABLE_SAMPLE_USERS.slice(0, 5).map((user, i) => (
                <Table.Row key={i} borderedBottom={args.dataBorderedBottom}>
                    <Table.Data text={user.name} nowrap />
                    <Table.Data text={user.contact} nowrap />
                    <Table.Data text={user.role} nowrap />
                    <Table.Data text={user.branch} nowrap />
                    <Table.Data text={user.status} nowrap />
                </Table.Row>
            ))}
        </Table>
    ),
    parameters: {
        docs: {
            description: {
                story: "Table with uppercase headers and custom styling.",
            },
        },
    },
};

export const CustomPaginationColors: Story = {
    args: {
        bgVariant: "crimson",
        borderVariant: "cream",
        textVariant: "cream",
        textSize: "small",
        textWeight: "bold",
        maxItems: 3,
    },
    render: (args) => {
        const paginationConfig = {
            maxItems: args.maxItems,
            borderedTop: true,
            borderVariant: args.borderVariant,
            bgVariant: args.bgVariant,
            textVariant: args.textVariant,
            textSize: args.textSize,
            textWeight: args.textWeight,
        };

        return (
            <Table bordered={args.bordered} rounded={args.rounded} shadow={args.shadow} pagination={paginationConfig}>
                <Table.Row borderedBottom={args.headerBorderedBottom}>
                    <Table.Header text="Name" nowrap />
                    <Table.Header text="Contact No." nowrap />
                    <Table.Header text="Role" nowrap />
                    <Table.Header text="Branch" nowrap />
                    <Table.Header text="Status" nowrap />
                </Table.Row>

                {TABLE_SAMPLE_USERS.map((user, i) => (
                    <Table.Row key={i} borderedBottom={args.dataBorderedBottom}>
                        <Table.Data text={user.name} nowrap />
                        <Table.Data text={user.contact} nowrap />
                        <Table.Data text={user.role} nowrap />
                        <Table.Data text={user.branch} nowrap />
                        <Table.Data text={user.status} nowrap />
                    </Table.Row>
                ))}
            </Table>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Table with custom pagination colors (crimson background with cream text).",
            },
        },
    },
};
