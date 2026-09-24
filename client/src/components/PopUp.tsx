import { useState } from "react";

type PopUpProps = {
    children: React.ReactNode;
    onClose?: () => void;
    className?: string;
};

export function PopUp({ children, onClose, className }: PopUpProps) {
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    const [dragging, setDragging] = useState(false);

    const [offset, setOffset] = useState({
        x: 0,
        y: 0,
    });

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

    return (
        <div className="fixed inset-0 z-50 bg-black/40" onPointerMove={handlePointerMove} onPointerUp={handleOnRelease}>
            <div
                className={`
                    ${className} 
                    absolute left-1/2 top-1/2
                    ${dragging ? "cursor-grabbing" : "cursor-grab"}
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
                {children}
            </div>
        </div>
    );
}
