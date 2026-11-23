/* eslint-disable react-refresh/only-export-components */
// General Imports
import React from "react";
import { UNSAFE_DataRouterStateContext } from "react-router";
// Components
import Icon from "./Icon";
import type { MaterialIcon } from "../types/common";

export const ButtonColorClasses = {
    main: {
        button: "bg-crimson text-cream font-bold border-1 border-crimson hover:opacity-75 active:bg-maroon active:opacity-100 hover:cursor-pointer",
        icon: "cream",
        iconExtra: "",
    },
    secondary: {
        button: "bg-off-white text-black border-1 border-black font-bold hover:bg-slate-dark/75 hover:text-cream hover:border-cream hover:cursor-pointer hover:opacity-75 active:opacity-100 active:bg-slate-dark active:text-cream active:border-cream",
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
    transparent: {
        button: "text-crimson border-crimson border-1 font-bold hover:bg-crimson-muted hover:text-cream hover:cursor-pointer",
        icon: "crimson",
        iconExtra: "",
    },
    popup: {
        button: "bg-off-white text-crimson border border-off-white font-bold hover:bg-cream",
        icon: "crimson",
        iconExtra: "",
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

// Ignores duplicate clicks that happen within this window. This stops a
// double-click from firing a popup action (e.g. submitting a create-user form)
// twice before the first request resolves.
const DOUBLE_CLICK_GUARD_MS = 500;

export function Button({
    variant = "main",
    size = "medium",
    leftIcon,
    rightIcon,
    children,
    iconExtraClass = "",
    className = "",
    transition = true,
    onClick,
    type = "submit",
    disabled,
    ...props
}: ButtonProps) {
    const lastClickRef = React.useRef(0);

    // Stays true for the whole duration of a form submission (which can be slow,
    // e.g. while the confirmation email is being sent), not just for the double-click
    // window. Reading the context directly keeps the Button usable outside a data
    // router (Storybook) where useNavigation would throw.
    const routerState = React.useContext(UNSAFE_DataRouterStateContext);
    const isSubmitting = routerState?.navigation.state === "submitting";
    const isDisabled = Boolean(disabled) || (isSubmitting && type === "submit");

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        const now = Date.now();

        if (now - lastClickRef.current < DOUBLE_CLICK_GUARD_MS) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        lastClickRef.current = now;
        onClick?.(e);
    };

    const transitionClass = transition ? "hover:scale-102 active:scale-100 transition-transform transition-color" : "";

    let buttonClass: string;
    if (variant === "login") {
        buttonClass = `group ${ButtonColorClasses.login.button} h-[3rem] min-w-[11.5rem] py-0 pr-[2.4rem] pl-[1.75rem] rounded-tl-[999px] rounded-tr-[0] rounded-br-[0] rounded-bl-[999px] relative overflow-visible hover:bg-[#b43320] active:bg-[var(--color-maroon)] ${className}`;
    } else {
        buttonClass = `group ${ButtonColorClasses[variant].button} ${ButtonSizeClasses[size].button} ${transitionClass} ${className} flex items-center justify-center `;
    }

    return (
        <button className={buttonClass} type={type} disabled={isDisabled} onClick={handleClick} {...props}>
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
                <span className="absolute top-0 right-[-1.1rem] h-0 w-0 border-y-[1.5rem] border-l-[1.15rem] border-y-transparent border-l-crimson group-hover:border-l-[#b43320] group-active:border-l-[var(--color-maroon)]" />
            )}
        </button>
    );
}
