import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectInput } from "../../components/Input";
import { Card } from "../../components/Card";
import "../../index.css";

const selectInputMeta = {
    title: "All-Components/Input-Components/Select",
    component: SelectInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        id: "roles",
        name: "roles",
        label: "",
        isRequired: true,
        disabled: false,
        hidden: false,
    },
} satisfies Meta<typeof SelectInput>;

export default selectInputMeta;
type Story = StoryObj<typeof selectInputMeta>;

// Reusable render function for the compound components
const renderSelect = (args: any) => (
    <SelectInput {...args}>
        <SelectInput.Option value="option1">option1</SelectInput.Option>
        <SelectInput.Option value="option2">option2</SelectInput.Option>
        <SelectInput.Option value="option3">option3</SelectInput.Option>
        <SelectInput.Option value="option4">option4</SelectInput.Option>
        <SelectInput.Option value="option5">option5</SelectInput.Option>
    </SelectInput>
);

export const DefaultVariant: Story = {
    // @ts-ignore
    args: {
        defaultValue: "option2",
    },
    render: renderSelect,
    parameters: {
        docs: {
            source: {
                // This explicitly sets the code block in the Storybook Docs tab
                code: `
<SelectInput name="roles" defaultValue="option2">
    <SelectInput.Option value="option1">option1</SelectInput.Option>
    <SelectInput.Option value="option2">option2</SelectInput.Option>
    <SelectInput.Option value="option3">option3</SelectInput.Option>
    <SelectInput.Option value="option4">option4</SelectInput.Option>
    <SelectInput.Option value="option5">option5</SelectInput.Option>
</SelectInput>
                `.trim(),
            },
        },
    },
};

export const ButtonVariant: Story = {
    // @ts-ignore
    args: {
        variant: "button",
        defaultValue: "option2",
    },
    render: renderSelect,
    parameters: {
        docs: {
            source: {
                // Explicitly sets the syntax box for the button variant
                code: `
<SelectInput variant="button" name="roles" defaultValue="option2">
    <SelectInput.Option value="option1">option1</SelectInput.Option>
    <SelectInput.Option value="option2">option2</SelectInput.Option>
    <SelectInput.Option value="option3">option3</SelectInput.Option>
    <SelectInput.Option value="option4">option4</SelectInput.Option>
    <SelectInput.Option value="option5">option5</SelectInput.Option>
</SelectInput>
                `.trim(),
            },
        },
    },
};

export const Comparison: Story = {
    // @ts-ignore
    args: {
        defaultValue: "option2",
    },
    render: (args) => (
        <div className="min-w-[500px]">
            <Card isGlass={false}>
                <Card.Body className="flex flex-col gap-4">
                    {/* Standard Variant */}
                    <SelectInput {...args}>
                        <SelectInput.Option value="option1">Standard 1</SelectInput.Option>
                        <SelectInput.Option value="option2">Standard 2</SelectInput.Option>
                    </SelectInput>

                    {/* Button Variant */}
                    <SelectInput {...args} variant="button">
                        <SelectInput.Option value="option1">Button 1</SelectInput.Option>
                        <SelectInput.Option value="option2">Button 2</SelectInput.Option>
                    </SelectInput>
                </Card.Body>
            </Card>
        </div>
    ),
};
