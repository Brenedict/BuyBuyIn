import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextAreaInput } from "../../components/Input";
import "../../index.css";

// Meta for TextAreaInput
const textAreaMeta = {
    title: "Input/TextArea",
    component: TextAreaInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        id: "comment",
        name: "comment",
        label: "Comment",
        placeholder: "Enter your comment here",
        isRequired: true,
        disabled: false,
        hidden: false,
    },
} satisfies Meta<typeof TextAreaInput>;

export default textAreaMeta;
type Story = StoryObj<typeof textAreaMeta>;

export const TextAreaInputStory: Story = {
    args: {
        id: "comment",
        name: "comment",
        label: "Comment",
        placeholder: "Enter your comment here",
    },
};
