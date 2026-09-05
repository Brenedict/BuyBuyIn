import type { Meta, StoryObj } from "@storybook/react-vite";
// import Icon, { type IconProps } from "../components/Icon.tsx";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import  Button  from "../components/Button";
import "../index.css";

const meta = {
    title: "Button Component",
    component: Button,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "Button component to be used as primary template for all buttons in the project",
            },
        },
    },
    tags: ["autodocs"],
    args: {
        size: "medium",
        variant: "main",
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonUse: Story = {
    args: {
        size: "medium",
        variant: "main",
        children: "I am a Button component",
    },
    render: (args) => <Button {...args}>{args.children}</Button>,
};

export const LeftIconAndButtonExample: Story = {
    args: {
        size: "medium",
        variant: "grey",
        children: "Dropdown",
        leftIcon: ArrowDropDownIcon
    },
    parameters: {
        docs: {
            description: {
                // Yes tama yung formatting nito, wag galawin indentation masisira yung code block - Binas
                story: `Just an example of how a button can be used. Also **NOTE** that currently the icon only accepts icons imported from MUI 
\`\`\`typescript
// Example Icon Import from MUI
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

<Button size: "iconHero",
        variant: "main",
        leftIcon: SampleIcon
    >
    button
</Button>
\`\`\`
                `,
            },
        },
    },
    render: (args) => <Button {...args}>{args.children}</Button>,
};
export const RightIconAndButtonExample: Story = {
    args: {
        size: "medium",
        variant: "secondary",
        children: "Dropdown",
        rightIcon: ArrowDropDownIcon
    },
    parameters: {
        docs: {
        },
    },
    render: (args) => <Button {...args}>{args.children}</Button>,
};
