import type { Meta, StoryObj } from "@storybook/react-vite";
// import Icon, { type IconProps } from "../components/Icon.tsx";

import { Calculator } from "../components/Calculator";
import "../index.css";

const meta = {
    title: "All-Components/Calculator",
    component: Calculator,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: "Calculator used by POS",
            },
        },
    },
    tags: ["autodocs"],
    args: { handleToggle: () => undefined },
} satisfies Meta<typeof Calculator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonUse: Story = {
    args: { handleToggle: () => undefined },
    render: (args) => <Calculator {...args}></Calculator>,
};
