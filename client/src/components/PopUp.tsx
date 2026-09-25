import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "./Card";

type PopUpProps = {
    onClose: () => void | Promise<void>;
    className?: string;
};

export function PopUp({ onClose, className }: PopUpProps) {
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

    const handleOnPress = (e: React.PointerEvent) => {
        const target = e.target as HTMLElement;

        if (
            target.closest("button") ||
            target.closest("input") ||
            target.closest("textarea") ||
            target.closest("select") ||
            target.closest("[data-no-drag]") //NOTE: So you can add this tag if you don't want specific parts to be draggable
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
        if (!dragging) return;

        setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    const handleOnRelease = () => {
        setDragging(false);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-black/40"
            onPointerMove={handlePointerMove}
            onPointerUp={handleOnRelease}
            onClick={(e) => e.stopPropagation()}
        >
            <div
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
            >
                <Card className="bg-[#FEFCED]!">
                    <Card.Header
                        className="bg-crimson py-6!"
                        toggleRightButton
                        rightButton={
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={onClose}
                                className="self-start rounded-[10px] border border-cream/60 px-2 text-cream hover:cursor-pointer"
                            >
                                ✕
                            </button>
                        }
                    >
                        <span className="font-['Inter',sans-serif] text-[20.99px] font-medium text-cream">
                            {"TEST"}
                        </span>
                    </Card.Header>
                    <Card.Body className="px-10! py-8!">{"BODY"}</Card.Body>
                </Card>
            </div>
        </div>,
        document.body
    );
}
