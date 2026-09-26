import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Card } from "./Card";
import { Text } from "./Text";
import { Button } from "./Button";

type PopUpProps = {
    onClose: () => void | Promise<void>;
    className?: string;
    title?: string;
    children?: ReactNode;
};

export function PopUp({ onClose, className, title = "Add a title", children = "Insert Body" }: PopUpProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    const [dragging, setDragging] = useState(false);

    const [offset, setOffset] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                void onClose();
            }
        };

        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [onClose]);

    const handleOnPress = (e: React.PointerEvent) => {
        const target = e.target as HTMLElement;

        if (
            target.closest("button") ||
            target.closest("input") ||
            target.closest("textarea") ||
            target.closest("select") ||
            target.closest("[data-no-drag]")
        ) {
            return;
        }

        setDragging(true);

        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });

        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging || !modalRef.current) return;

        const nextX = e.clientX - offset.x;
        const nextY = e.clientY - offset.y;

        const { width, height } = modalRef.current.getBoundingClientRect();

        // Calculate max distance from center before hitting edges
        const maxX = Math.max(0, (window.innerWidth - width) / 2);
        const maxY = Math.max(0, (window.innerHeight - height) / 2);

        // Clamp coordinates
        const clampedX = Math.max(-maxX, Math.min(nextX, maxX));
        const clampedY = Math.max(-maxY, Math.min(nextY, maxY));

        setPosition({
            x: clampedX,
            y: clampedY,
        });
    };

    const handleOnRelease = () => {
        setDragging(false);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-9999 bg-slate-dark/50"
            onPointerMove={handlePointerMove}
            onPointerUp={handleOnRelease}
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className={`
                    ${className} 
                    absolute left-1/2 top-1/2
                    ${dragging ? "cursor-grabbing" : "cursor-grab"}
                    w-[904px] max-w-full
                `}
                style={{
                    transform: `
                        translate(
                            calc(-50% + ${position.x}px),
                            calc(-50% + ${position.y}px)
                        )
                    `,
                }}
                onPointerDown={handleOnPress}
                onClick={(e) => e.stopPropagation()}
            >
                <Card className="bg-off-white">
                    <Card.Header
                        className="bg-crimson "
                        toggleRightButton
                        rightButton={
                            <Button type="button" aria-label="Close" size="small" onClick={onClose}>
                                ✕
                            </Button>
                        }
                    >
                        <Text size="big" weight="bold" variant="off-white">
                            {title}
                        </Text>
                    </Card.Header>
                    <Card.Body>{children}</Card.Body>
                </Card>
            </div>
        </div>,
        document.body
    );
}
