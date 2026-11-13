import type { HTMLAttributes } from "react";

export interface NumpadOverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, "onKeyPress"> {
    onKeyPress?: (key: string) => void;
    onBackspace?: () => void;
    onClear?: () => void;
    includeDecimal?: boolean;
    compact?: boolean;
    className?: string;
}

const numpadRows = [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"], ["0"]] as const;

const baseKeyClass =
    "flex min-w-0 items-center justify-center rounded-xl border border-crimson/30 bg-cream text-slate-dark shadow-[0_2px_0_rgba(98,55,51,0.2)] font-bold transition-all duration-150 hover:cursor-pointer hover:-translate-y-0.5 hover:bg-[#f7e9e6] hover:shadow-[0_4px_0_rgba(98,55,51,0.2)] active:translate-y-0 active:shadow-[0_2px_0_rgba(98,55,51,0.2)] active:bg-crimson active:text-cream";

export function NumpadOverlay({
    onKeyPress,
    onBackspace,
    onClear,
    includeDecimal = false,
    compact = true,
    className = "",
    ...props
}: NumpadOverlayProps) {
    const keyClass = compact
        ? "h-12 min-w-[3.4rem] text-sm sm:h-14 sm:min-w-[3.9rem] sm:text-base"
        : "h-14 min-w-[4rem] text-base sm:h-16 sm:min-w-[4.4rem] sm:text-lg";
    const actionClass = compact ? "h-12 px-4 text-[10px] sm:text-xs" : "h-14 px-4 text-sm sm:text-base";

    const decimalButton = includeDecimal ? ["."] : [];
    const lastRow = ["00", ...decimalButton];

    return (
        <div
            {...props}
            className={`m-0 w-full max-w-[260px] rounded-2xl border border-crimson/20 bg-off-white p-2 shadow-[0_12px_24px_rgba(62,45,38,0.12)] ${className}`}
        >
            <div className="flex flex-col gap-1.5">
                {numpadRows.map((row, rowIndex) => (
                    <div
                        key={`numpad-row-${rowIndex}`}
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

                <div className="grid grid-cols-[1fr_1fr] gap-1">
                    {lastRow.map((key) => (
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

export default NumpadOverlay;
