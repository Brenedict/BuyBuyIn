import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type MaterialIcon = OverridableComponent<SvgIconTypeMap<object, "svg">> & {
    muiName: string;
};

// ------------------------ FIXED Text Font Classes and Type ------------------------

export const FontClasses = {
    default: "font-sans-flex",
    ligconsolata: "font-ligconsolata",
} as const;

export type FontVariant = keyof typeof FontClasses;

// ------------------------ FIXED Text Size Classes and Type ------------------------

// Size Classes (Text and SVG)
// Currently, the text sizes are downscaled two units for md size (1024x748)
export const SizeClasses = {
    iconHero: "lg:text-icon-hero md:text-large",
    larger: "lg:text-larger md:text-bigger",
    large: "lg:text-large md:text-big",
    bigger: "lg:text-bigger md:text-medium-big",
    big: "lg:text-big md:text-medium-small",
    mediumBig: "lg:text-medium-big md:text-medium",
    mediumSmall: "lg:text-medium-small md:text-normal",
    medium: "lg:text-medium md:text-description",
    normal: "lg:text-normal md:text-small-description",
    description: "text-description",
    small: "text-small-description",
    smaller: "lg:text-smaller-description md:text-[0px]!",
    smallest: "text-smallest-description",
} as const;

// Extracts: "giant" | "bigger"| "big" | "description"...
export type SizeVariant = keyof typeof SizeClasses;

// ------------------------ FIXED Text Weight Classes and Type ------------------------

export const WeightClasses = {
    extraBold: "font-extra-bold",
    bold: "font-bold",
    medium: "font-medium",
    regular: "font-regular",
    light: "font-light",
} as const;

// Extracts: "bold" | "normal" | "thin"
export type WeightVariant = keyof typeof WeightClasses;

// ------------------------ FIXED Bg and Text Color Classes and Type ------------------------

export const ColorClasses = {
    black: { bg: "bg-black", text: "text-black", border: "border-black" },
    slate: { bg: "bg-slate", text: "text-slate", border: "border-slate" },
    "slate-dark": { bg: "bg-slate-dark", text: "text-slate-dark", border: "border-slate-dark" },
    "slate-medium": { bg: "bg-slate-medium", text: "text-slate-medium", border: "border-slate-medium" },
    "slate-light": { bg: "bg-slate-light", text: "text-slate-light", border: "border-slate-light" },
    brown: { bg: "bg-brown", text: "text-brown", border: "border-brown" },
    maroon: { bg: "bg-maroon", text: "text-maroon", border: "border-maroon" },
    crimson: { bg: "bg-crimson", text: "text-crimson", border: "border-crimson" },
    "crimson-muted": { bg: "bg-crimson-muted", text: "text-crimson-muted", border: "border-crimson-muted" },
    coral: { bg: "bg-coral", text: "text-coral", border: "border-coral" },
    "off-white": { bg: "bg-off-white", text: "text-off-white", border: "border-off-white" },
    cream: { bg: "bg-cream", text: "text-cream", border: "border-cream" },
    "cream-muted": { bg: "bg-cream-muted", text: "text-cream-muted", border: "border-cream-muted" },
} as const;

// Extracts: "black" | "slate" | "slate-medium" | "crimson"
export type ColorVariant = keyof typeof ColorClasses;

// ------------------------ FIXED Text Alignment Classes and Type ------------------------

export const AlignClasses = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
} as const;

// Extracts: "left", "right", "center"
export type AlignVariant = keyof typeof AlignClasses;

export const AlignFlexClasses = {
    center: "justify-center",
    left: "justify-start",
    right: "justify-end",
} as const;

// ------------------------ FIXED Text SVG Position and Gap Classes and Type ------------------------
export type svgPosition = "left" | "right"; // For position

export const GapClasses = {
    none: "gap-0",
    small: "gap-1",
    base: "gap-1.5",
    medium: "gap-2",
    big: "gap-3",
    large: "gap-4",
    extraLarge: "gap-6",
} as const;

// Extracts: "none", "small", "medium", "large", "extraLarge"
export type GapVariant = keyof typeof GapClasses;
