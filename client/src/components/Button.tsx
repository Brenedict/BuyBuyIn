// General Imports
import React from "react";
// Components
import Icon, { type IconProps } from "./Icon";
import type { MaterialIcon } from "../types/common";


const ButtonColorClasses = {
    main : {
        button:"bg-crimson text-cream font-bold hover:opacity-75 active:bg-maroon active:opacity-100 hover:cursor-pointer",
        icon: "cream"
    },
    secondary : {
        button:"bg-cream text-black border-2 border-black font-bold hover:bg-brown hover:text-cream hover:border-cream hover:cursor-pointer hover:opacity-75 active:opacity-100 active:bg-brown active:text-cream active:border-cream",
        icon: "black"
    },
    login : {
        button:"bg-crimson text-cream font-bold",
        icon: "cream"
    },
    grey : {
        button: "bg-slate-medium text-cream font-bold hover:opacity-75 hover:cursor-pointer active:opactiy-100 active:text-brown active:bg-cream",
        icon: "cream"
    }, 
} as const;

type ButtonColorVariant = keyof typeof ButtonColorClasses;

const ButtonSizeClasses = {
    small : {
        button:"px-4 py-2 m-h-4 m-w-16 text-xs border rounded-[10px] gap-1",
        icon: "small"
    },
    medium : { 
        button: "py-4 px-6 m-h-8 m-w-16 text-medium border rounded-[10px] gap-2",
        icon: "medium"
    },
    large : { 
        button:"p-6 px-8 m-h-10 m-w-20 text-large rounded-[15px] gap-6",
        icon: "large"
    }
} as const;

type ButtonSizeVariant = keyof typeof ButtonSizeClasses;

// Properties that can be passed to the button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonColorVariant;
    size?: ButtonSizeVariant;
    leftIcon?: MaterialIcon;
    rightIcon?: MaterialIcon;
    children: React.ReactNode;
}


// Main logic of the Button component
function Button ({
                    variant = "main",
                    size = "medium",
                    leftIcon,
                    rightIcon,
                    children,
                    className = "",
                    ...props
                }: ButtonProps){
    return (
        <button
            className={`${ButtonColorClasses[variant].button} ${ButtonSizeClasses[size].button} ${className} flex items-center`}
            {...props}
        >
            {leftIcon && <Icon icon={leftIcon} variant={ButtonColorClasses[variant].icon} size={ButtonSizeClasses[size].icon}/>}
            <div>{children}</div>
            {rightIcon && <Icon icon={rightIcon} variant={ButtonColorClasses[variant].icon} size={ButtonSizeClasses[size].icon} />}
        </button>
    );
};

export default Button;
