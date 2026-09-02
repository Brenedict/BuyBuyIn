import type { Meta, StoryObj } from "@storybook/react";
import { SampleButton } from "../components/SampleButton";

const meta: Meta<typeof SampleButton> = {
    title: "Components/SampleButton",
    component: SampleButton,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: { type: "select" },
            options: ["primary", "secondary", "danger"],
        },
        children: {
            control: "text",
        },
    },
} satisfies Meta<typeof SampleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        variant: "primary",
        children: "Primary Button",
    },
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
        children: "Secondary Button",
    },
};

export const Danger: Story = {
    args: {
        variant: "danger",
        children: "Danger Button",
    },
};
