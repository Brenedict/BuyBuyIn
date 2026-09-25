import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

// Components
import { Card, type CardProps } from "./Card";

function Header({
    children,
    bordered,
    className,
    ...props
}: CardProps & { toggleRightIcon?: boolean; onRightAction?: () => void }) {
    return (
        <div className="flex">
            <Card.Header bordered={bordered} className={className} {...props}>
                {children}
            </Card.Header>
        </div>
    );
}

function Body({ children, bordered, className, ...props }: CardProps) {
    return (
        <Card.Body variant={variant} bordered={bordered} className={className} {...props}>
            {children}
        </Card.Body>
    );
}

function Footer({ children, variant, bordered, className, ...props }: CardProps) {
    return (
        <Card.Footer variant={variant} bordered={bordered} className={className} {...props}>
            {children}
        </Card.Footer>
    );
}

function DialogContainer({
    children,
    className,
    dropShadow = true,
    onClose,
    ...props
}: {
    children?: ReactNode;
    className?: string;
    dropShadow?: boolean;
    onClose: () => void | Promise<void>;
}) {
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key == "Escape") {
                void onClose();
            }
        };

        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [onClose]);

    const handleClick = () => {
        void onClose();
    };

    return createPortal(
        <div
            className="flex h-screen w-screen justify-center items-center bg-black-opaque fixed top-0 right-0 z-999 "
            onClick={handleClick}
        >
            <section className="min-w-md min-h-fit" onClick={(e) => e.stopPropagation()}>
                <Card {...props} className={className} dropShadow={dropShadow}>
                    {children}
                </Card>
            </section>
        </div>,
        document.body
    );
}

export const Dialog = Object.assign(DialogContainer, {
    Header,
    Body,
    Footer,
});
