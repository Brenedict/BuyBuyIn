// Types
import {
    type MaterialIcon,
    type SizeVariant,
    SizeClasses,
    type ColorVariant,
    ColorClasses,
    type AlignVariant,
    AlignClasses,
} from "../types/common";

export interface IconProps {
    icon: MaterialIcon;
    size: SizeVariant;
    variant: ColorVariant;
    align?: AlignVariant;
    active?: boolean;
    activeVariant?: ColorVariant;
    bg?: {
        variant: ColorVariant;
        type: "normal" | "circle";
        padding: "small" | "big";
    };
}

function Icon({ icon, size, variant, active = false, activeVariant, bg, align = "center" }: IconProps) {
    const IconType = icon;
    const effectiveVariant = active && activeVariant ? activeVariant : variant;

    // Get background styles if it exists
    const bgStyles = bg
        ? `${ColorClasses[bg.variant].bg} ${bg.type === "normal" ? "rounded-xl" : "rounded-full"} ${bg.padding === "small" ? "p-2" : "p-3"}`
        : "";

    return (
        <div className={` aspect-square flex w-fit ${AlignClasses[align]} items-center ${bgStyles}`}>
            <IconType
                className={`${ColorClasses[effectiveVariant].text}  stroke-0 `}
                style={{ fontSize: `var(--${SizeClasses[size]})` }}
            />
        </div>
    );
}

export default Icon;
