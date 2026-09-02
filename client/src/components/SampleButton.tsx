import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
}

export const SampleButton: React.FC<ButtonProps> = ({ variant = "primary", children, style, ...props }) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case "secondary":
                return "#6c757d";
            case "danger":
                return "#dc3545";
            case "primary":
            default:
                return "#007bff";
        }
    };

    const baseStyles: React.CSSProperties = {
        padding: "10px 16px",
        fontSize: "14px",
        fontWeight: 500,
        color: "#ffffff",
        backgroundColor: getBackgroundColor(),
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "opacity 0.2s ease",
        ...style,
    };

    return (
        <button style={baseStyles} {...props}>
            {children}
        </button>
    );
};
