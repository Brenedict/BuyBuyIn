// General Imports
import React, { type ReactNode } from "react";

// Components
import Icon from "./Icon";

// TODO: Include Rhomer's buttons
// import Button, { variantStyles } from "./Button";

// Icons
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// Types
import { AlignFlexClasses, ColorClasses, type AlignVariant } from "../types/common";

type CardBgVariant = "solid" | "glass";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    variant?: CardBgVariant;
    bordered?: true | false;
    className?: string;
}

function CardContainer({
    children,
    className,
    dropShadow = true,
    onClick,
    ...props
}: {
    children?: ReactNode;
    className?: string;
    dropShadow?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <div
            onClick={onClick}
            className={`border-[0.1px] border-brown/50 rounded-2xl overflow-clip ${dropShadow ? "drop-shadow-sm" : ""}  ${className} `}
            {...props}
        >
            {children}
        </div>
    );
}

function Header({
    children,
    variant = "solid",
    bordered = true,
    className,
    centerContent = false,
    toggleRightButton = false,
    rightButton,
    ...props
}: CardProps & {
    centerContent?: boolean;
    toggleRightButton?: boolean;
    rightButton?: React.ComponentType<any>;
}) {
    const defaultClass = `${bordered == true ? "border-b-[0.3px] border-black" : ""} ${variant === "glass" ? "bg-opacity-50 backdrop-blur-md" : "bg-off-white "}`;

    // Basically, if you provide toggleRightButton (meaning a button), automatically the the button will be on the right side
    // But if you want to center the content, you can set centerContent to true. But this will not work if toggleRightButton is true, because the button will always be on the right side
    const contentAlignmentClass = toggleRightButton
        ? "justify-between"
        : centerContent
          ? AlignFlexClasses.center
          : AlignFlexClasses.left;

    const RightButtonComponent = rightButton;

    return (
        <div className={`${defaultClass} w-full px-6 py-4 flex ${contentAlignmentClass} ${className} `} {...props}>
            {children}
            {toggleRightButton && RightButtonComponent && <RightButtonComponent />}
        </div>
    );
}

function Body({ children, variant = "solid", bordered = false, className, ...props }: CardProps) {
    const defaultClass = `bg-off-white ${bordered == true ? "border-b-[0.3px] border-t-[0.3px] border-black" : ""} ${variant === "glass" ? "bg-opacity-50 backdrop-blur-md" : ""}`;
    return (
        <div className={`${defaultClass} w-full px-6 py-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

function Footer({ children, variant = "solid", bordered = true, className, ...props }: CardProps) {
    const defaultClass = `bg-off-white ${bordered == true ? "border-t-[0.3px] border-black" : ""} ${variant === "glass" ? "bg-opacity-50 backdrop-blur-md" : ""}`;
    return (
        <div className={`${defaultClass} w-full px-6 py-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

export const Card = Object.assign(CardContainer, {
    Header,
    Body,
    Footer,
});
