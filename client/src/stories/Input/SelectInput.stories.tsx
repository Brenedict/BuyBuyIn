import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import SelectInput from "../../components/inputs/SelectInput";
import { Card } from "../../components/Card";
import "../../index.css";

const DEFAULT_OPTIONS: Record<string, string> = {
    option1: "option1",
    option2: "option2",
    option3: "option3",
    option4: "option4",
    option5: "option5",
};

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
        defaultValue: "option2",
        options: DEFAULT_OPTIONS,
        disabled: false,
        hidden: false,
    },
} satisfies Meta<typeof SelectInput>;

export default selectInputMeta;
type Story = StoryObj<typeof selectInputMeta>;

const renderSelect = (args: ComponentProps<typeof SelectInput>) => <SelectInput {...args} />;

export const DefaultVariant: Story = {
    render: renderSelect,
    parameters: {
        docs: {
            source: {
                // This explicitly sets the code block in the Storybook Docs tab
                code: `
<SelectInput
    name="roles"
    defaultValue="option2"
    options={{ option1: "option1", option2: "option2", option3: "option3", option4: "option4", option5: "option5" }}
/>
                `.trim(),
            },
        },
    },
};

export const ButtonVariant: Story = {
    args: {
        variant: "button",
    },
    render: renderSelect,
    parameters: {
        docs: {
            source: {
                // Explicitly sets the syntax box for the button variant
                code: `
<SelectInput
    variant="button"
    name="roles"
    defaultValue="option2"
    options={{ option1: "option1", option2: "option2", option3: "option3", option4: "option4", option5: "option5" }}
/>
                `.trim(),
            },
        },
    },
};

export const Comparison: Story = {
    render: (args) => (
        <div className="min-w-[500px]">
            <Card isGlass={false}>
                <Card.Body className="flex flex-col gap-4">
                    {/* Standard Variant */}
                    <SelectInput
                        {...args}
                        options={{ "Standard 1": "option1", "Standard 2": "option2" }}
                    />

                    {/* Button Variant */}
                    <SelectInput
                        {...args}
                        variant="button"
                        options={{ "Button 1": "option1", "Button 2": "option2" }}
                    />
                </Card.Body>
            </Card>
        </div>
    ),
};
