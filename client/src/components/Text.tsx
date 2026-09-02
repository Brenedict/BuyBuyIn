// Components
import Icon, { type IconProps } from "./Icon.tsx";

// Types
import {
    SizeClasses,
    type SizeVariant,
    ColorClasses,
    type ColorVariant,
    type AlignVariant,
    FontClasses,
    type FontVariant,
    WeightClasses,
    type WeightVariant,
    type svgPosition,
    GapClasses,
    type GapVariant,
} from "../types/common.ts";

interface HeadingProp extends React.HTMLAttributes<HTMLParagraphElement> {
    children?: React.ReactNode;
    size?: SizeVariant;
    variant?: ColorVariant;
    weight?: WeightVariant;
    font?: FontVariant;
    align?: AlignVariant;

    // You can optionally include Icons
    svg?: Omit<IconProps, "variant" | "align"> & {
        //Icon type (you can pass the name here)
        variant?: ColorVariant;
        position: svgPosition;
        gap: GapVariant;
    };

    // Additional className for the text component (for further customization)
    className?: string;
}

const alignFlexClasses = {
    center: "justify-center",
    left: "justify-start",
    right: "justify-end",
} as const;

export function Text({
    children,
    size = "normal",
    variant = "black",
    weight = "regular",
    font = "default",
    align = "left",
    svg,
    className,
}: HeadingProp) {
    return (
        <div
            className={`flex items-center ${alignFlexClasses[align]} ${svg?.position === "right" ? "flex-row-reverse" : "flex-row"} ${svg ? GapClasses[svg.gap] : ""} ${className}`}
        >
            {svg && <Icon icon={svg.icon} size={svg.size} variant={svg.variant || variant} bg={svg.bg} />}
            <p
                className={`${SizeClasses[size]} ${ColorClasses[variant].text} ${WeightClasses[weight]} ${FontClasses[font]} `}
            >
                {children}
            </p>
        </div>
    );
}
