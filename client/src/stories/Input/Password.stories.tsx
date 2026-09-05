import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInput } from "../../components/Input";
import "../../index.css";
import { fn } from "storybook/test";

// Meta for PasswordInput
const passwordInputMeta = {
    title: "Input/Password",
    component: PasswordInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        id: "password",
        name: "password",
        placeholder: "Enter password",
        label: "Password",
        onChange: fn(),
        isRequired: true,
        disabled: false,
        hidden: false,
    },
} satisfies Meta<typeof PasswordInput>;

export default passwordInputMeta;
type Story = StoryObj<typeof passwordInputMeta>;

export const PasswordInputStory: Story = {
    args: {
        id: "password",
        name: "password",
        placeholder: "Enter password",
    },
};
