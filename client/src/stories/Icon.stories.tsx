import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { SizeClasses, ColorClasses, type ColorVariant } from "../types/common";
import Icon from "../components/Icon";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import "../index.css";

// 1. Define the flattened "story-friendly" props once.
type IconStoryProps = Omit<ComponentProps<typeof Icon>, "bg"> & {
    bg?: boolean;
    bg_variant: ColorVariant;
    bg_padding: "small" | "big";
    bg_type: "normal" | "circle";
};

// 2. A wrapper component whose props ARE that flattened shape.
//    This is what Storybook actually renders and type-checks against.
function IconStoryComponent({ bg, bg_variant, bg_padding, bg_type, ...rest }: IconStoryProps) {
    return <Icon {...rest} bg={bg ? { variant: bg_variant, padding: bg_padding, type: bg_type } : undefined} />;
}

const meta = {
    title: "Icon",
    component: IconStoryComponent, // <-- wrapper, not the real Icon
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        variant: "cream",
        icon: AccountCircleOutlinedIcon,
        size: "larger",
        bg: true,
        bg_variant: "crimson",
        bg_padding: "big",
        bg_type: "normal",
    },
    argTypes: {
        icon: {
            table: { disable: true },
        },
        bg: {
            control: "boolean",
        },
        size: {
            control: "select",
            options: Object.keys(SizeClasses),
        },
        variant: {
            control: "select",
            options: Object.keys(ColorClasses),
        },
        bg_variant: {
            control: "select",
            options: Object.keys(ColorClasses),
        },
        bg_padding: {
            control: "select",
            options: ["small", "big"],
        },
        bg_type: {
            control: "select",
            options: ["normal", "circle"],
        },
    },
} satisfies Meta<typeof IconStoryComponent>; // <-- matches component now

export default meta;
type Story = StoryObj<typeof meta>;

export const IconPreview: Story = {
    args: {
        variant: "cream",
        icon: AccountCircleOutlinedIcon,
        size: "bigger",
        bg_variant: "crimson",
        bg_padding: "big",
        bg_type: "normal",
    },
    parameters: {
        docs: {
            description: {
                component:
                    "An Icon wraps a Material UI icon and lets you control its color, size, and an optional background container.",
                story: "Use the controls below to explore every visual aspect of the Icon component.\n\n- **icon**: The Material UI icon to render. The icon is fixed in this story; swap components or import a different one to try others.\n- **size**: Maps to a typographic scale token (e.g. larger, bigger, big, medium, normal, description, small, smaller, smallest).\n- **variant**: Sets the icon's color from the shared palette (e.g. cream, black, primary-blue, dark-blue, red, green, etc.).\n- **bg**: Toggles the background container on or off. When enabled, additional controls appear:\n  - **bg_variant**: Color of the background container, drawn from the same palette.\n  - **bg_padding**: Spacing inside the container (small = p-2, big = p-3).\n  - **bg_type**: Shape of the container (normal = rounded square, circle = fully rounded).",
            },
        },
    },
};
// Directly hovering the icon itself — plain `hover:`/`active:` works fine here
// because the icon IS the hovered element, no `group` ancestor needed.
export const IconDirectHover: Story = {
    args: {
        variant: "black",
        icon: AccountCircleOutlinedIcon,
        size: "bigger",
        bg: true,
        bg_variant: "cream",
        bg_padding: "big",
        bg_type: "circle",
        iconClassName: "hover:text-crimson active:text-maroon transition-colors",
    },
    parameters: {
        docs: {
            description: {
                story:
                    "Hover or click directly on the icon to see it change color. Since nothing wraps it, plain `hover:`/`active:` classes on `iconClassName` apply normally — no `group` needed when the icon itself is the element being interacted with.",
            },
        },
    },
};

// Icon inside a `group` container, mirroring how it behaves inside Button:
// the icon's color reacts to hovering/pressing the PARENT, not itself.
export const IconGroupHover: Story = {
    render: (args) => (
        <div className="group cursor-pointer rounded-xl bg-slate-dark px-6 py-4 transition-colors hover:bg-brown active:bg-maroon">
            <IconStoryComponent {...args} />
        </div>
    ),
    args: {
        variant: "cream",
        icon: AccountCircleOutlinedIcon,
        size: "bigger",
        bg: false,
        bg_variant: "crimson",
        bg_padding: "big",
        bg_type: "normal",
        iconClassName: "transition-colors group-hover:text-brown group-active:text-maroon",
    },
    parameters: {
        docs: {
            description: {
                story:
                    "Hover or click anywhere on the surrounding container to see the icon's color respond. This uses Tailwind's `group`/`group-hover:`/`group-active:` pattern: the container carries the `group` class, and the icon's `iconClassName` uses `group-hover:`/`group-active:` prefixes instead of plain `hover:`/`active:`. This is the same mechanism used inside the Button component, where the icon mirrors the button's hover/active state rather than needing to be hovered directly.",
            },
        },
    },
};
