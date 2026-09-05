import type { Meta, StoryObj } from "@storybook/react-vite";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

import { Text } from "../components/Text";
import "../index.css";

const meta = {
    title: "Text Component",
    component: Text,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "This is the singular component to be used for all text in the application. `Text` wraps a `<p>` element and exposes props for `size`, `weight`, `variant` (color), `font`, and `align`. Meaning by configuring the options of the text, you can reproduce every text variation in BuyBuyIn. You can also include the optional `svg` prop to render an icon alongside the text, with control over its position and spacing.",
            },
        },
    },
    tags: ["autodocs"],
    args: {
        weight: "light",
        variant: "black",
        font: "default",
    },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextUse: Story = {
    args: {
        size: "larger",
        weight: "bold",
        variant: "crimson",
        children: "I am a Text component",
        font: "default",
    },
    render: (args) => <Text {...args}>{args.children}</Text>,
};

export const TextGuide: Story = {
    parameters: {
        docs: {
            description: {
                story: "This is the the full `size` scale of the `Text` component. The `iconHero` is the largest and `smallest` is the smallest. Use this as a quick reference when deciding which size to use.",
            },
        },
    },
    render: () => (
        <div className="flex flex-col gap-1">
            <Text size="iconHero">Icon Text 4rem (64px)</Text>
            <Text size="larger">Larger Text 3rem (48px)</Text>
            <Text size="large">Large Text 2.5rem (40px)</Text>
            <Text size="bigger">Bigger Text 2rem (32px)</Text>
            <Text size="big">Big Text 1.5rem (24px)</Text>
            <Text size="mediumBig">Medium Big 1.375rem (22px)</Text>
            <Text size="mediumSmall">Medium Small 1.25rem (20px)</Text>
            <Text size="medium">Medium Text 1.125rem (18px)</Text>
            <Text size="normal">Normal Text 1rem (16px)</Text>
            <Text size="description">Description 0.875rem (14px)</Text>
            <Text size="small">SMALL DESCRIPTION 0.75REM (12px)</Text>
            <Text size="smaller">SMALLER DESCRIPTION 0.625REM (10px)</Text>
            <Text size="smallest">SMALLEST DESCRIPTION 0.5REM (8px)</Text>
        </div>
    ),
};

export const LargerIconAndTextExample: Story = {
    args: {
        size: "iconHero",
        weight: "bold",
        variant: "maroon",
        children: "Happy",
        font: "default",
        svg: {
            gap: "medium",
            icon: InsertEmoticonIcon,
            position: "right",
            size: "iconHero",
        },
    },
    parameters: {
        docs: {
            description: {
                // Yes tama yung formatting nito, wag galawin indentation masisira yung code block - Binas
                story: `Just an example of how a text can be used. Also **NOTE** that currently the icon only accepts icons imported from MUI 
\`\`\`typescript
// Example Icon Import from MUI
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

<Text size: "iconHero",
        weight: "bold",
        variant: "maroon",
        children: "Happy",
        font: "default", 
        svg={{ gap: "medium", icon: InsertEmoticonIcon, position: "right", size: "iconHero" }}
    >
    Happy
</Text>
\`\`\`
                `,
            },
        },
    },
    render: (args) => <Text {...args}>{args.children}</Text>,
};

export const TextLeftIcon: Story = {
    args: {
        size: "bigger",
        weight: "bold",
        variant: "crimson",
        children: "test",
        font: "default",
        svg: {
            gap: "medium",
            icon: AccountBoxIcon,
            position: "left",
            size: "larger",
        },
    },
    parameters: {
        docs: {
            // Yes tama yung formatting nito, wag galawin indentation masisira yung code block - Binas
            description: {
                story: `The \`gap\` prop controls the spacing between the icon and the text, and the \`size\` prop controls the size of the icon. The \`variant\` prop of the \`svg\` object can be used to override the color of the icon, but if not provided, it will inherit the color from the text variant. Pass an \`svg\` prop with \`position: "left"\` to render an icon before the text. 
\`\`\`typescript
const svg = {
    gap: "medium",
    icon: AccountBoxIcon,
    position: "left",
    size: "larger",
}
\`\`\`

\`\`\`typescript
// Usage 1: Object argument
<Text svg={svg}>
    test
</Text>
\`\`\`

\`\`\`typescript
// Usage 2: Raw argument
<Text svg={{ gap: "medium", icon: AccountBoxIcon, position: "left", size: "larger" }}>
    test
</Text>
\`\`\`
                `,
            },
        },
    },
    render: (args) => (
        <Text svg={args.svg} {...args}>
            {args.children}
        </Text>
    ),
};

export const TextRightIcon: Story = {
    args: {
        size: "bigger",
        weight: "bold",
        variant: "crimson",
        children: "test",
        font: "default",
        svg: {
            gap: "medium",
            icon: AccountBoxIcon,
            position: "right",
            size: "larger",
        },
    },
    parameters: {
        docs: {
            // Yes tama yung formatting nito, wag galawin indentation masisira yung code block - Binas
            description: {
                story: `Same thing but with \`position: "right"\` to render an icon after the text. 
\`\`\`typescript
// Example Usage: Right Position Icon
<Text svg={{ gap: "medium", icon: AccountBoxIcon, position: "right", size: "larger" }}>
    test
</Text>
\`\`\`
                `,
            },
        },
    },
    render: (args) => <Text {...args}>{args.children}</Text>,
};
