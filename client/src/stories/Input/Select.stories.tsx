import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectInput } from "../../components/Input";
import { Card } from "../../components/Card";
import "../../index.css";

// Meta for SelectInput
const passwordInputMeta = {
    title: "Input/Select",
    component: SelectInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        id: "role",
        name: "role",
        label: "Select Role",
        optionList: [
            { content: "Administrator", value: "admin" },
            { content: "Frontline Encoder", value: "frontline" },
        ],
        isRequired: true,
        disabled: false,
        hidden: false,
    },
} satisfies Meta<typeof SelectInput>;

export default passwordInputMeta;
type Story = StoryObj<typeof passwordInputMeta>;

export const SelectStory: Story = {
    args: {
        id: "role",
        name: "role",
        label: "Select Role",
        optionList: [
            { content: "Administrator", value: "admin" },
            { content: "Frontline Encoder", value: "frontline" },
        ],
    },
};

export const TestMultiple: Story = {
    args: {
        id: "role",
        name: "role",
        label: "Select Role",
        optionList: [
            { content: "Administrator", value: "admin" },
            { content: "Frontline Encoder", value: "frontline" },
        ],
    },
    render: (args) => (
        <div className="min-w-[500px]">
            <Card isGlass={false}>
                <Card.Body>
                    <SelectInput {...args} />
                    <SelectInput {...args} />
                    <SelectInput {...args} />
                </Card.Body>
            </Card>
        </div>
    ),
};
