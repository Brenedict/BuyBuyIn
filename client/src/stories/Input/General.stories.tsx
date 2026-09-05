import type { Meta, StoryObj } from "@storybook/react-vite";
import { GeneralInput } from "../../components/Input";
import "../../index.css";

import { fn } from "storybook/test";

// Meta for GeneralInput
const generalInputMeta = {
    title: "Input/General",
    component: GeneralInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        id: "generalInput",
        label: "Text",
        name: "generalInput",
        placeholder: "Enter anything here",
        type: "text",
        onChange: fn(),
        isRequired: true,
        disabled: false,
        hidden: false,
    },
} satisfies Meta<typeof GeneralInput>;

export default generalInputMeta;
type Story = StoryObj<typeof generalInputMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const TextInput: Story = {
    args: {
        id: "textInput",
        label: "Text",
        name: "textInput",
        placeholder: "Enter anything here",
        type: "text",
    },
};

export const NumberInput: Story = {
    args: {
        id: "numberInput",
        label: "Age",
        name: "numberInput",
        placeholder: "Input your age",
        type: "number",
    },
};

export const EmailInput: Story = {
    args: {
        id: "emailInput",
        label: "Email Address",
        name: "emailInput",
        placeholder: "Enter your email",
        type: "text",
    },
};
