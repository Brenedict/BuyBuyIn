import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "../components/Card";
import { Text } from "../components/Text";

import "../index.css";
import { Button } from "../components/Button";

const meta = {
    title: "Card",
    component: Card,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicCardStructure: Story = {
    parameters: {
        docs: {
            description: {
                story: `
The \`<Card>\` component acts as a styled container wrapper. It provides modular sub-components (\`<Card.Header>\`, \`<Card.Body>\`, and \`<Card.Footer>\`) so you only include what you need. 

You can also control the styling via the \`isGlass\`, \`dropShadow\`, and \`className\` props.

By **DEFAULT** the card is set to \`isGlass = true\` and \`dropShadow = true\`, in this example they are set to true just to showcase the property. In the future if you need a card that isn't a glass and doesn't have a drop shadow, set the properties to false.

### Standard Structure Example:
\`\`\`tsx
<Card isGlass={true} dropShadow={true} className="w-full">
    <Card.Header>
        <Text weight="bold">Header Content</Text>
    </Card.Header>
    <Card.Body>
        <Text>Body Content</Text>
    </Card.Body>
    <Card.Footer>
        <Text>Footer Content</Text>
    </Card.Footer>
</Card>
\`\`\`
`,
            },
        },
    },
    render: () => (
        <div className="flex flex-col gap-4 w-[500px]">
            {/* 1. Just a Card (Body only) */}
            <Card>
                <Card.Body>
                    <Text weight="bold">1. Simple Card</Text>
                    <Text size="smaller">This is a basic card using only the Body.</Text>
                </Card.Body>
            </Card>

            {/* 2. Card with Header, Body, and Footer */}
            <Card>
                <Card.Header>
                    <Text weight="bold">2. Full Structure</Text>
                </Card.Header>
                <Card.Body>
                    <Text size="smaller">This card utilizes the Header, the Body, and the Footer.</Text>
                </Card.Body>
                <Card.Footer>
                    <Text size="smaller">Footer Section</Text>
                </Card.Footer>
            </Card>

            {/* 3. Card with Header and Body */}
            <Card>
                <Card.Header>
                    <Text weight="bold">3. Header & Body</Text>
                </Card.Header>
                <Card.Body>
                    <Text size="smaller">This card only has a Header and a Body, omitting the Footer entirely.</Text>
                </Card.Body>
            </Card>
        </div>
    ),
};

export const CardWithNoHeaderAndFooter: Story = {
    parameters: {
        docs: {
            description: {
                story: `This is one of the common ways to use the card component that you can see in Figma. A card with only a body

### Basic Card Structure Example:
\`\`\`tsx
<Card isGlass={true} dropShadow={true} className="w-full">
    <Card.Body>
        <Text>Body Content</Text>
    </Card.Body>
</Card>
\`\`\``,
            },
        },
    },
    render: () => (
        <Card dropShadow={true}>
            <Card.Body>
                <Text>This is a card component using a text component</Text>
            </Card.Body>
        </Card>
    ),
};

export const AddingHeaderAndFooterBorders: Story = {
    parameters: {
        docs: {
            description: {
                story: "Observe the previous card example above has a `header`, `body`, and `footer`. By default they Use `bordered={false}`, so if you want a card that has a border for some reason add: `<Card.Header bordered={true}>` & `<Card.Footer bordered={true}>` or `<Card.Body bordered={true}>` if you want both footer and header borders",
            },
        },
    },
    render: () => (
        <div className="flex flex-col gap-4 w-[500px]">
            {/* 1. Card with <Card.Body bordered={true}> */}
            <Card>
                <Card.Header>
                    <Text size="medium" weight="bold">
                        Body border set to true
                    </Text>
                </Card.Header>
                <Card.Body bordered={true}>
                    <Text>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut rem, corrupti esse adipisci
                        consectetur nam eius possimus cumque molestiae, illo incidunt debitis minus accusantium
                        quibusdam minima deserunt temporibus amet iusto.
                    </Text>
                </Card.Body>
                <Card.Footer>
                    <Text size="smaller" weight="regular">
                        This is the footer
                    </Text>
                </Card.Footer>
            </Card>

            {/* 2. Card with <Card.Header bordered={true}> */}
            <Card>
                <Card.Header bordered={true}>
                    <Text size="medium" weight="bold">
                        Header border set to true
                    </Text>
                </Card.Header>
                <Card.Body>
                    <Text>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut rem, corrupti esse adipisci
                        consectetur nam eius possimus cumque molestiae, illo incidunt debitis minus accusantium
                        quibusdam minima deserunt temporibus amet iusto.
                    </Text>
                </Card.Body>
                <Card.Footer>
                    <Text size="smaller" weight="regular">
                        This is the footer
                    </Text>
                </Card.Footer>
            </Card>

            {/* 3. Card with <Card.Footer bordered={true}> */}
            <Card>
                <Card.Header>
                    <Text size="medium" weight="bold">
                        Footer border set to true
                    </Text>
                </Card.Header>
                <Card.Body>
                    <Text>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut rem, corrupti esse adipisci
                        consectetur nam eius possimus cumque molestiae, illo incidunt debitis minus accusantium
                        quibusdam minima deserunt temporibus amet iusto.
                    </Text>
                </Card.Body>
                <Card.Footer bordered={true}>
                    <Text size="smaller" weight="regular">
                        This is the footer
                    </Text>
                </Card.Footer>
            </Card>
        </div>
    ),
};

export const InsertingOtherComponents: Story = {
    parameters: {
        docs: {
            description: {
                story: "Reminder that you are not limited to passing `<Text>`. You can pass any other components.",
            },
        },
    },
    render: () => (
        <div className="flex flex-col gap-8 w-[500px]">
            {/* Card Example #1 */}
            <Card>
                <Card.Header bordered={false}>
                    <Text size="medium" weight="bold">
                        Card With Button
                    </Text>
                </Card.Header>
                <Card.Body>
                    <Text>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut rem, corrupti esse adipisci
                        consectetur nam eius possimus cumque molestiae, illo incidunt debitis minus accusantium
                        quibusdam minima deserunt temporibus amet iusto.
                    </Text>
                    <div className="grid grid-cols-4 gap-4">
                        <Button size="small" variant="main">
                            Facebook
                        </Button>
                        <Button size="small" variant="secondary">
                            Youtube
                        </Button>
                        <Button size="small" variant="main">
                            Twitter
                        </Button>
                        <Button size="small" variant="secondary">
                            Others
                        </Button>
                    </div>
                </Card.Body>
                <Card.Footer bordered={false}>
                    <Button size="large" variant="grey">
                        I'm a footer button
                    </Button>
                </Card.Footer>
            </Card>

            {/* Card Example #2 */}
            <Card>
                <Card.Body>
                    <Text size="big" weight="bold">
                        Cards inside of other Cards
                    </Text>
                    <div className="grid grid-cols-4 gap-4">
                        <Card dropShadow={false}>
                            <Card.Body>
                                <Text>Card WITH NO drop shadow</Text>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Text>Card WITH drop shadow</Text>
                            </Card.Body>
                        </Card>
                        <Card dropShadow={false}>
                            <Card.Body>
                                <Text>Card WITH NO drop shadow</Text>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Text>Card WITH drop shadow</Text>
                            </Card.Body>
                        </Card>
                    </div>
                </Card.Body>
            </Card>
        </div>
    ),
};

export const DifferentCardSizes: Story = {
    parameters: {
        docs: {
            description: {
                story: `The card component does not have a fix sized. You can use the \`className\` attirbute to add your own TailwindCSS styles.
\`\`\`tsx
# If your styles don't seem to reflect try adding an exclamation mark (ex: w-full!)
<Card className="w-full">
    <Card.Body>
        <Text>Body Content</Text>
    </Card.Body>
</Card>
\`\`\`
                `,
            },
        },
    },
    render: () => (
        <div className="flex flex-wrap">
            <Card className="w-[65%]">
                <Card.Header bordered={false}>
                    <Text size="medium" weight="bold">
                        65% Width
                    </Text>
                </Card.Header>
                <Card.Body>
                    <Text>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut rem, corrupti esse adipisci
                        consectetur nam eius possimus cumque molestiae, illo incidunt debitis minus accusantium
                        quibusdam minima deserunt temporibus amet iusto.
                    </Text>
                </Card.Body>
                <Card.Footer bordered={false}>
                    <Text size="smaller" weight="regular">
                        This is the footer
                    </Text>
                </Card.Footer>
            </Card>
            <Card className="w-[35%]">
                <Card.Body>
                    <Text size="big" weight="bold">
                        35% Width
                    </Text>
                </Card.Body>
            </Card>
            <Card className="w-[100%]">
                <Card.Body>
                    <Text size="big" weight="bold">
                        100% Width
                    </Text>
                </Card.Body>
            </Card>
        </div>
    ),
};
