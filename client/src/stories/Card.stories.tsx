import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "../components/Card";
import { Text } from "../components/Text";
// import Button from "../components/Button";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import "../index.css";

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
console.log("HELLO");
export const CardWithNoHeaderAndFooter: Story = {
    render: () => (
        <Card dropShadow={true}>
            <Card.Body>
                <Text>This is a card component using a text component</Text>
            </Card.Body>
        </Card>
    ),
};

export const CardComponentColorChange: Story = {
    parameters: {
        docs: {
            description: {
                story: "This is one of the common ways to use the card component that you can see in Figma. By default the header is set to a different color, you can change it by editing its variant attribute: `<Card.Header variant='off-white'>`. This applies to `<Card.Body>` and `<Card.Footer>`",
            },
        },
    },
    render: () => (
        <div className="w-[900px]">
            <Card>
                <Card.Header variant="solid">
                    <Text size="medium" weight="bold">
                        Account Information
                    </Text>
                </Card.Header>
                <Card.Body>
                    <Text>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut rem, corrupti esse adipisci
                        consectetur nam eius possimus cumque molestiae, illo incidunt debitis minus accusantium
                        quibusdam minima deserunt temporibus amet iusto.
                    </Text>
                </Card.Body>
                <Card.Footer variant="solid">
                    <Text size="smaller">This is the footer</Text>
                </Card.Footer>
            </Card>
        </div>
    ),
};

export const AddingHeaderAndFooterBorders: Story = {
    parameters: {
        docs: {
            description: {
                story: "Observe the previous card example above has a `header`, `body`, and `footer`. By default they Use `bordered={true}`, so if you wanna turn that off make sure to add: `<Card.Header bordered={false}` & `<Card.Footer bordered={false}`",
            },
        },
    },
    render: () => (
        <Card>
            <Card.Header variant="glass" bordered={false} toggleRightButton={true} rightButton={CloseRoundedIcon}>
                <Text size="medium" weight="bold">
                    Account Information
                </Text>
            </Card.Header>
            <Card.Body>
                <Text>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut rem, corrupti esse adipisci
                    consectetur nam eius possimus cumque molestiae, illo incidunt debitis minus accusantium quibusdam
                    minima deserunt temporibus amet iusto.
                </Text>
            </Card.Body>
            <Card.Footer variant="solid" bordered={false}>
                <Text size="smaller">This is the footer</Text>
            </Card.Footer>
        </Card>
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
        <Card>
            <Card.Header variant="solid" bordered={false}>
                <Text size="medium" weight="bold">
                    Account Information
                </Text>
            </Card.Header>
            <Card.Body>
                <Text>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut rem, corrupti esse adipisci
                    consectetur nam eius possimus cumque molestiae, illo incidunt debitis minus accusantium quibusdam
                    minima deserunt temporibus amet iusto.
                </Text>
                {/* <Button variant="blue" size="large">
                    Something
                </Button> */}
                <button>Something</button>
            </Card.Body>
            <Card.Footer variant="solid" bordered={false}>
                {/* <Button variant="red" size="small">
                    Subscribe
                </Button> */}
                <button>Subscribe</button>
            </Card.Footer>
        </Card>
    ),
};

export const DifferentCardSizes: Story = {
    parameters: {
        docs: {
            description: {
                story: "The card component does not have a fix sized. You can use the `className` attirbute to add your own TailwindCSS styles.",
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
                <Card.Footer variant="solid" bordered={false}>
                    <Text size="smaller">This is the footer</Text>
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
