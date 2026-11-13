import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import {
    CheckPricePopup,
    ReprintTransactionsPopup,
    ResumeTransactionsPopup,
    SearchItemPopup,
} from "../components/popups/cashier/TransactionPopups";

import "../index.css";

const meta = {
    title: "All-Components/CashierPopups",
    component: ResumeTransactionsPopup,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: "Popups used in the cashier point of sale screen",
            },
        },
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ResumeTransactionsPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResumeTransactions: Story = {
    parameters: {
        docs: {
            description: {
                story: "Lists the suspended transactions. Click a row to highlight it, then press ENTER to resume it.",
            },
        },
    },
    render: () => (
        <MemoryRouter>
            <div className="min-h-[700px]">
                <ResumeTransactionsPopup />
            </div>
        </MemoryRouter>
    ),
};

export const ReprintTransactions: Story = {
    parameters: {
        docs: {
            description: {
                story: "Lists the completed transactions. Click a row to highlight it, then press REPRINT to print its receipt.",
            },
        },
    },
    render: () => (
        <MemoryRouter>
            <div className="min-h-[700px]">
                <ReprintTransactionsPopup />
            </div>
        </MemoryRouter>
    ),
};

export const SearchItem: Story = {
    parameters: {
        docs: {
            description: {
                story: "Search for an item by name or item code. Press ENTER to submit the search.",
            },
        },
    },
    render: () => (
        <MemoryRouter>
            <div className="min-h-[700px]">
                <SearchItemPopup />
            </div>
        </MemoryRouter>
    ),
};

export const CheckPrice: Story = {
    parameters: {
        docs: {
            description: {
                story: "Type an item code (barcode) and press ENTER to see its retail and wholesale price.",
            },
        },
    },
    render: () => (
        <MemoryRouter>
            <div className="min-h-[700px]">
                <CheckPricePopup />
            </div>
        </MemoryRouter>
    ),
};
