import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { NavBar } from "../components/NavBar";
import "../index.css";

const meta = {
    title: "NavBar Component",
    component: NavBar,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "NavBar component to be used as primary template for all buttons in the project",
            },
        },
    },
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={["/hq/dashboard"]}>
                <Story />
            </MemoryRouter>
        ),
    ],
    tags: ["autodocs"],
    args: {
        role: "hqadmin",
    },
} satisfies Meta<typeof NavBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CashierNav: Story = {
    args: {
        role: "cashier",
    },
};

export const BranchManagerNav: Story = {
    args: {
        role: "branchmanager",
    },
};