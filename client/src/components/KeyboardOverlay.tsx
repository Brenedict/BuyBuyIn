import type { HTMLAttributes } from "react";

export type KeyboardOverlayKey = string;

export interface KeyboardOverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, "onKeyPress"> {
    onKeyPress?: (key: KeyboardOverlayKey) => void;
    onBackspace?: () => void;
    onClear?: () => void;
    showSpace?: boolean;
    compact?: boolean;
    uppercase?: boolean;
    className?: string;
}

const keyboardRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
] as const;

const baseKeyClass =
    "flex w-full items-center justify-center rounded-xl border border-crimson/30 bg-cream text-slate-dark shadow-[0_2px_0_rgba(98,55,51,0.2)] font-bold transition-all duration-150 hover:cursor-pointer hover:-translate-y-0.5 hover:bg-[#f7e9e6] hover:shadow-[0_4px_0_rgba(98,55,51,0.2)] active:translate-y-0 active:shadow-[0_2px_0_rgba(98,55,51,0.2)] active:bg-crimson active:text-cream";

export function KeyboardOverlay({
    onKeyPress,
    onBackspace,
    onClear,
    showSpace = true,
    compact = true,
    uppercase = true,
    className = "",
    ...props
}: KeyboardOverlayProps) {
    const preparedRows = keyboardRows.map((row) =>
        row.map((key) => (uppercase ? key.toUpperCase() : key.toLowerCase()))
    );

    const keyClass = compact ? "h-12 text-[11px] sm:h-14 sm:text-xs" : "h-14 text-sm sm:h-16 sm:text-base";

    const actionClass = compact ? "h-12 px-4 text-[10px] sm:text-xs" : "h-14 px-4 text-sm sm:text-base";

    return (
        <div
            {...props}
            className={`m-0 w-full max-w-[520px] rounded-2xl border border-crimson/20 bg-off-white p-2 shadow-[0_12px_24px_rgba(62,45,38,0.12)] ${className}`}
        >
            <div className="flex flex-col gap-1.5">
                {preparedRows.map((row, rowIndex) => (
                    <div
                        key={`row-${rowIndex}`}
                        className="grid gap-1"
                        style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
                    >
                        {row.map((key) => (
                            <button
                                key={key}
                                type="button"
                                className={`${baseKeyClass} ${keyClass}`}
                                onClick={() => onKeyPress?.(key)}
                                aria-label={`Input ${key}`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                ))}

                {showSpace && (
                    <button
                        type="button"
                        className={`${baseKeyClass} ${actionClass} w-full`}
                        onClick={() => onKeyPress?.(" ")}
                        aria-label="Add space"
                    >
                        Space
                    </button>
                )}

                <div className="grid grid-cols-[1fr_1fr] gap-1">
                    {onClear && (
                        <button
                            type="button"
                            className={`${baseKeyClass} ${actionClass}`}
                            onClick={onClear}
                            aria-label="Clear input"
                        >
                            Clear
                        </button>
                    )}

                    {onBackspace && (
                        <button
                            type="button"
                            className={`${baseKeyClass} ${actionClass}`}
                            onClick={onBackspace}
                            aria-label="Backspace"
                        >
                            ⌫
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default KeyboardOverlay;
