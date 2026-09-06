import type { Meta, StoryObj } from "@storybook/react-vite";
// import Icon, { type IconProps } from "../components/Icon.tsx";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { Button } from "../components/Button";
import "../index.css";

const meta = {
    title: "Button Component",
    component: Button,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: "Button component to be used as primary template for all buttons in the project",
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
        variant: "main",
        children: "Dropdown",
        leftIcon: ArrowDropDownIcon,
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
        rightIcon: ArrowDropDownIcon,
    },
    parameters: {
        docs: {},
    },
    render: (args) => <Button {...args}>{args.children}</Button>,
};
// export const TextLeftIcon: Story = {
//     args: {
//         size: "bigger",
//         weight: "bold",
//         variant: "crimson",
//         children: "test",
//         font: "default",
//         svg: {
//             gap: "medium",
//             icon: AccountBoxIcon,
//             position: "left",
//             size: "larger",
//         },
//     },
//     parameters: {
//         docs: {
//             // Yes tama yung formatting nito, wag galawin indentation masisira yung code block - Binas
//             description: {
//                 story: `The \`gap\` prop controls the spacing between the icon and the text, and the \`size\` prop controls the size of the icon. The \`variant\` prop of the \`svg\` object can be used to override the color of the icon, but if not provided, it will inherit the color from the text variant. Pass an \`svg\` prop with \`position: "left"\` to render an icon before the text.
// \`\`\`typescript
// const svg = {
//     gap: "medium",
//     icon: AccountBoxIcon,
//     position: "left",
//     size: "larger",
// }
// \`\`\`

// \`\`\`typescript
// // Usage 1: Object argument
// <Text svg={svg}>
//     test
// </Text>
// \`\`\`

// \`\`\`typescript
// // Usage 2: Raw argument
// <Text svg={{ gap: "medium", icon: AccountBoxIcon, position: "left", size: "larger" }}>
//     test
// </Text>
// \`\`\`
//                 `,
//             },
//         },
//     },
//     render: (args) => (
//         <Text svg={args.svg} {...args}>
//             {args.children}
//         </Text>
//     ),
// };

// export const TextRightIcon: Story = {
//     args: {
//         size: "bigger",
//         weight: "bold",
//         variant: "crimson",
//         children: "test",
//         font: "default",
//         svg: {
//             gap: "medium",
//             icon: AccountBoxIcon,
//             position: "right",
//             size: "larger",
//         },
//     },
//     parameters: {
//         docs: {
//             // Yes tama yung formatting nito, wag galawin indentation masisira yung code block - Binas
//             description: {
//                 story: `Same thing but with \`position: "right"\` to render an icon after the text.
// \`\`\`typescript
// // Example Usage: Right Position Icon
// <Text svg={{ gap: "medium", icon: AccountBoxIcon, position: "right", size: "larger" }}>
//     test
// </Text>
// \`\`\`
//                 `,
//             },
//         },
//     },
//     render: (args) => <Text {...args}>{args.children}</Text>,
// };
