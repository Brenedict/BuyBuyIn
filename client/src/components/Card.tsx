// General Imports
import React, { type ReactNode } from "react";

// Types
import { AlignFlexClasses } from "../types/common";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    bordered?: true | false;
    className?: string;
}

function CardContainer({
    children,
    className,
    isGlass = true,
    dropShadow = true,
    onClick,
    ...props
}: {
    children?: ReactNode;
    className?: string;
    isGlass?: boolean;
    dropShadow?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <div
            onClick={onClick}
            className={`border border-slate-dark rounded-2xl overflow-clip ${isGlass === true ? "card-glass-effect" : "bg-off-white"} ${dropShadow ? "card-drop-shadow" : ""}  ${className} `}
            {...props}
        >
            {children}
        </div>
    );
}

function Header({
    children,
    bordered = false,
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
    const defaultClass = `${bordered == true ? "border-b-[0.3px] border-black" : ""} `;

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

function Body({ children, bordered = false, className, ...props }: CardProps) {
    const defaultClass = `${bordered == true ? "border-b-[0.3px] border-t-[0.3px] border-black" : ""}`;
    return (
        <div className={`${defaultClass} w-full px-6 py-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

function Footer({ children, bordered = false, className, ...props }: CardProps) {
    const defaultClass = `${bordered == true ? "border-t-[0.3px] border-black" : ""}`;
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
