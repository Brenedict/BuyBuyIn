// General Imports
import React from "react";
// Components
import Icon from "./Icon";
import type { MaterialIcon } from "../types/common";

export const ButtonColorClasses = {
    main: {
        button: "bg-crimson text-cream font-bold hover:opacity-75 active:bg-maroon active:opacity-100 hover:cursor-pointer",
        icon: "cream",
        iconExtra: "",
    },
    secondary: {
        button: "bg-cream text-black border-2 border-black font-bold hover:bg-slate-dark/75 hover:text-cream hover:border-cream hover:cursor-pointer hover:opacity-75 active:opacity-100 active:bg-slate-dark active:text-cream active:border-cream",
        icon: "black",
        iconExtra: "group-active:text-cream group-hover:text-cream",
    },
    login: {
        button: "bg-crimson text-cream font-bold",
        icon: "cream",
        iconExtra: "",
    },
    grey: {
        button: "bg-slate-medium text-cream font-bold hover:opacity-75 hover:cursor-pointer active:opacity-100 active:text-brown active:bg-cream",
        icon: "cream",
        iconExtra: "group-active:text-brown",
    },
} as const;

export type ButtonColorVariant = keyof typeof ButtonColorClasses;

const ButtonSizeClasses = {
    smallest: {
        button: "px-1 py-1 m-h-4 m-w-16 lg:text-xs text-2xs border rounded-[10px] gap-1",
        icon: "smaller",
    },
    small: {
        button: "px-3 py-2 m-h-4 m-w-16 lg:text-xs text-2xs border rounded-[10px] gap-1",
        icon: "small",
    },
    normal: {
        button: "px-3 py-2 m-h-4 m-w-16 lg:text-sm text-xs border rounded-[10px] gap-1",
        icon: "normal",
    },
    medium: {
        button: "px-4 py-3 m-h-8 m-w-16 lg:text-medium text-description border rounded-[10px] gap-2",
        icon: "bigger",
    },
    large: {
        button: "px-6 py-5 m-h-10 m-w-20 lg:text-large text-big rounded-[15px] gap-6",
        icon: "iconHero",
    },
} as const;

type ButtonSizeVariant = keyof typeof ButtonSizeClasses;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonColorVariant;
    size?: ButtonSizeVariant;
    leftIcon?: MaterialIcon;
    rightIcon?: MaterialIcon;
    iconExtraClass?: string;
    children?: React.ReactNode;
    transition?: boolean;
}

export function Button({
    variant = "main",
    size = "medium",
    leftIcon,
    rightIcon,
    children,
    iconExtraClass = "",
    className = "",
    transition = true,
    ...props
}: ButtonProps) {
    const transitionClass = transition ? "hover:scale-102 active:scale-100 transition-transform transition-color" : "";

    let buttonClass: string;
    if (variant === "login") {
        buttonClass = `group ${ButtonColorClasses.login.button} h-[3rem] min-w-[11.5rem] py-0 pr-[2.4rem] pl-[1.75rem] rounded-tl-[999px] rounded-tr-[0] rounded-br-[0] rounded-bl-[999px] relative overflow-visible hover:bg-[#b43320] active:bg-[var(--color-maroon)] ${className}`;
    } else {
        buttonClass = `group ${ButtonColorClasses[variant].button} ${ButtonSizeClasses[size].button} ${transitionClass} ${className} flex items-center justify-center `;
    }

    return (
        <button className={buttonClass} {...props}>
            {leftIcon && (
                <Icon
                    icon={leftIcon}
                    variant={ButtonColorClasses[variant].icon}
                    iconClassName={`${ButtonColorClasses[variant].iconExtra} ${iconExtraClass}`}
                    size={ButtonSizeClasses[size].icon}
                />
            )}
            {children && <div>{children}</div>}
            {rightIcon && (
                <Icon
                    icon={rightIcon}
                    variant={ButtonColorClasses[variant].icon}
                    iconClassName={`${ButtonColorClasses[variant].iconExtra} ${iconExtraClass}`}
                    size={ButtonSizeClasses[size].icon}
                />
            )}
            {variant === "login" && (
                <span className="absolute top-0 right-[-1.15rem] h-0 w-0 border-y-[1.5rem] border-l-[1.15rem] border-y-transparent border-l-crimson group-hover:border-l-[#b43320] group-active:border-l-[var(--color-maroon)]" />
            )}
        </button>
    );
}
