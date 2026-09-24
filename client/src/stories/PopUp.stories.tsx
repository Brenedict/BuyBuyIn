import type { Meta, StoryObj } from "@storybook/react-vite";

import { PopUp } from "../components/PopUp";
import { Card } from "../components/Card";
import { Text } from "../components/Text";

import "../index.css";

const meta = {
    title: "All-Components/PopUp",
    component: PopUp,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: "Wrapper component to be used to enclose Card components in the project",
            },
        },
    },
    tags: ["autodocs"],
    args: {
        children: (
            <Card>
                <Card.Header>
                    <Text variant="crimson" size="iconHero">
                        This is a Pop Up
                    </Text>
                </Card.Header>
            </Card>
        ),
    },
} satisfies Meta<typeof PopUp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PopUpUse: Story = {
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                story: "The Pop up component is just something to wrap around a Card component to make them draggable and have a built-in onClose function.",
            },
        },
    },
    render: () => (
        <div className="min-h-[700px]">
            <PopUp>
                <Card className="w-[500px]">
                    <Card.Header>
                        <Text variant="crimson" size="iconHero">
                            This is a Pop Up
                        </Text>
                    </Card.Header>
                </Card>
            </PopUp>
        </div>
    ),
};
export const DisableDrag: Story = {
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                story: 'By adding "data-no-drag" to an element, it disables the dragging capability.',
            },
        },
    },
    render: () => (
        <div className="min-h-[700px]">
            <PopUp>
                <Card className="w-[500px]">
                    <Card.Header>
                        <Text variant="crimson" size="iconHero">
                            This is a Pop Up
                        </Text>
                    </Card.Header>
                    <Card.Body data-no-drag>
                        <Text>This cannot be used to drag</Text>
                    </Card.Body>
                </Card>
            </PopUp>
        </div>
    ),
};
