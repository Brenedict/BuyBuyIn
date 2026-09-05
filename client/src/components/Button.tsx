// General Imports
import React, { useState } from "react";
// Components
import Icon from "./Icon";
import type { MaterialIcon, ColorVariant } from "../types/common";

const ButtonColorClasses = {
    main: {
        button: "bg-crimson text-cream font-bold hover:opacity-75 active:bg-maroon active:opacity-100 hover:cursor-pointer",
        icon: "cream",
        activeIcon: "cream",
    },
    secondary: {
        button: "bg-cream text-black border-2 border-black font-bold hover:bg-brown hover:text-cream hover:border-cream hover:cursor-pointer hover:opacity-75 active:opacity-100 active:bg-brown active:text-cream active:border-cream",
        icon: "black",
        activeIcon: "cream",
    },
    //TODO: Make custom styling for the main Login button
    login: {
        button: "bg-crimson text-cream font-bold",
        icon: "cream",
        activeIcon: "cream",
    },
    grey: {
        button: "bg-slate-medium text-cream font-bold hover:opacity-75 hover:cursor-pointer active:opactiy-100 active:text-brown active:bg-cream",
        icon: "cream",
        activeIcon: "brown",
    },
} as const;

type ButtonColorVariant = keyof typeof ButtonColorClasses;

const ButtonSizeClasses = {
    small: {
        button: "px-2 py-2 m-h-4 m-w-16 text-xs border rounded-[10px] gap-1",
        icon: "normal",
    },
    medium: {
        button: "px-4 py-3 m-h-8 m-w-16 text-medium border rounded-[10px] gap-2",
        icon: "bigger",
    },
    large: {
        button: "px-6 py-5 m-h-10 m-w-20 text-large rounded-[15px] gap-6",
        icon: "iconHero",
    },
} as const;

type ButtonSizeVariant = keyof typeof ButtonSizeClasses;

// Properties that can be passed to the button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonColorVariant;
    size?: ButtonSizeVariant;
    leftIcon?: MaterialIcon;
    rightIcon?: MaterialIcon;
    children?: React.ReactNode;
}

// Main logic of the Button component
function Button({
    variant = "main",
    size = "medium",
    leftIcon,
    rightIcon,
    children,
    className = "",
    ...props
}: ButtonProps) {
    const [isActive, setIsActive] = useState(false);
    const colorConfig = ButtonColorClasses[variant];
    const activeIconVariant = colorConfig.activeIcon ?? colorConfig.icon;

    return (
        <button
            className={`${colorConfig.button} ${ButtonSizeClasses[size].button} ${className} flex items-center`}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            onMouseLeave={() => setIsActive(false)}
            {...props}
        >
            {leftIcon && (
                <Icon
                    icon={leftIcon}
                    variant={colorConfig.icon}
                    activeVariant={activeIconVariant as ColorVariant}
                    active={isActive}
                    size={ButtonSizeClasses[size].icon}
                />
            )}
            {children && <div>{children}</div>}
            {rightIcon && (
                <Icon
                    icon={rightIcon}
                    variant={colorConfig.icon}
                    activeVariant={activeIconVariant as ColorVariant}
                    active={isActive}
                    size={ButtonSizeClasses[size].icon}
                />
            )}
        </button>
    );
}

export default Button;
