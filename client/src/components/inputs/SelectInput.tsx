// General Imports
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Components
import { Label, type LabelProp } from "./InputLabel";
import Icon from "../Icon";
import { Text } from "../Text";
import { Button } from "../Button";

// Material UI Icons
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";


const DROPDOWN_MIN_WIDTH = 192;
const DROPDOWN_HEIGHT_ESTIMATE = 164;
const DROPDOWN_OFFSET = 0;
const BUTTON_VARIANT_OFFSET = 4;

interface SelectInputProp extends LabelProp, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
    name: string;
    options: Record<string, string>;
    defaultValue: string;
    variant?: "default" | "button";
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface SelectInputVariantProps {
    isOpen: boolean;
    onToggle: () => void;
    selectedLabel: string;
    className?: string;
    triggerRef: React.RefObject<HTMLElement | null>;
}

function SelectInputDefaultVariant({
    isOpen,
    onToggle,
    selectedLabel,
    className,
    triggerRef,
}: SelectInputVariantProps) {
    const isOpenStyle = isOpen ? "rounded-t-xl border-2! border-slate-dark!" : "rounded-2xl";

    // NOTE: Added a minimum width here to prevent the drop down icon hitting the text
    return (
        <section
            ref={triggerRef}
            onClick={onToggle}
            className={`
                flex justify-between items-center px-4 border border-[#cfcabd]
                bg-off-white w-full min-w-48 placeholder-slate-light hover:bg-off-white-border transition-colors
                ${isOpenStyle}
                ${className}
            `}
        >
            <Text variant="black" size="normal" weight="medium" className="py-3">
                {selectedLabel}
            </Text>

            <div className="flex self-stretch gap-4">
                {/* Vertical Line Separator */}
                <div className={`self-stretch  ${isOpen ? "w-0.5 bg-slate-dark" : "w-px bg-[#cfcabd]"}`} />

                <span className="flex items-center">
                    <div className="bg-crimson rounded-sm">
                        <Icon
                            icon={ArrowDropDownOutlinedIcon}
                            size="big"
                            variant="cream"
                            className={`${isOpen ? "rotate-180 transition ease-in" : "transition ease-in"}`}
                        />
                    </div>
                </span>
            </div>
        </section>
    );
}

function SelectInputButtonVariant({ isOpen, onToggle, selectedLabel, className, triggerRef }: SelectInputVariantProps) {
    return (
        <span
            ref={(node: HTMLSpanElement | null) => {
                triggerRef.current = node;
            }}
            className="relative inline-flex"
        >
            <Button
                onClick={onToggle}
                type="button"
                variant="main"
                size="medium"
                className={`transition ease-in ${className}`}
                rightIcon={ArrowDropDownOutlinedIcon}
                iconExtraClass={`transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"}`}
            >
                {selectedLabel}
            </Button>
        </span>
    );
}

export default function SelectInput({
    id,
    name,
    label,
    options,
    defaultValue,
    variant = "default",
    className,
    onChange,
}: SelectInputProp) {
    const selectInputParentRef = useRef<HTMLDivElement | null>(null);
    const selectInputRef = useRef<HTMLSelectElement | null>(null);

    const triggerRef = useRef<HTMLElement | null>(null);
    const optionListRef = useRef<HTMLElement | null>(null);

    // State management for dropdown modal
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [position, setPosition] = useState({ top: 0, left: 0, width: DROPDOWN_MIN_WIDTH });

    const optionEntries = Object.entries(options);
    const selectedLabel = optionEntries.find(([, value]) => value === selectedValue)?.[0] ?? selectedValue;

    const isDefaultVariant = variant === "default";


    const close = useCallback(() => setIsOpen(false), []);

    const handleOpen = () => {
        const trigger = triggerRef.current;
        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();

        const width = Math.max(rect.width, DROPDOWN_MIN_WIDTH);
        const offset = isDefaultVariant ? DROPDOWN_OFFSET : BUTTON_VARIANT_OFFSET;
        const spaceBelow = window.innerHeight - rect.bottom;

        const top =
            spaceBelow < DROPDOWN_HEIGHT_ESTIMATE
                ? Math.max(8, rect.top - DROPDOWN_HEIGHT_ESTIMATE - offset)
                : rect.bottom + offset;

        const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));

        setPosition({ top, left, width });
        setIsOpen(true);
    };

    const handleToggle = () => {
        if (isOpen) {
            close();
            return;
        }

        handleOpen();
    };

    const handleOptionSelect = (value: string) => {
        setSelectedValue(value);
        close();

        const select = selectInputRef.current;
        if (select) {
            select.value = value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        }
    };

    // Custom style for options dropdown depending on variant
    const dropdownVariantStyle = isDefaultVariant ? "rounded-b-xl border-b border-x" : "rounded-xl border";

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (selectInputParentRef.current?.contains(target) || optionListRef.current?.contains(target)) return;
            close();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };

        // The list is fixed-positioned, so any scroll would leave it detached from the trigger
        const handleScroll = (event: Event) => {
            // Scrolling inside the list itself should keep it open
            if (optionListRef.current?.contains(event.target as Node)) return;
            close();
        };

        const handleResize = () => close();

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleResize);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleResize);
        };
    }, [isOpen, close]);

    return (
        <div className="w-full relative" ref={selectInputParentRef} data-no-drag>
            <Label htmlFor={id} label={label} />
            <select id={id} ref={selectInputRef} hidden name={name} value={selectedValue} onChange={onChange}>
                {optionEntries.map(([label, value]) => (
                    <option key={label} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            {isDefaultVariant ? (
                <SelectInputDefaultVariant
                    isOpen={isOpen}
                    onToggle={handleToggle}
                    selectedLabel={selectedLabel}
                    className={className}
                    triggerRef={triggerRef}
                />
            ) : (
                <SelectInputButtonVariant
                    isOpen={isOpen}
                    onToggle={handleToggle}
                    selectedLabel={selectedLabel}
                    className={className}
                    triggerRef={triggerRef}
                />
            )}

            {isOpen &&
                createPortal(
                    <section
                        ref={optionListRef}
                        data-no-drag
                        className={`fixed z-10000 max-h-41 overflow-hidden shadow-xl bg-cream ${dropdownVariantStyle}`}
                        style={{ top: position.top, left: position.left, width: position.width }}
                    >
                        <div className="max-h-41 overflow-auto">
                            {optionEntries.map(([label, value]) => {
                                const isSelected = selectedValue === value;

                                return (
                                    <div
                                        key={label}
                                        onClick={() => handleOptionSelect(value)}
                                        className={`cursor-pointer px-4 py-2 hover:bg-off-white hover:text-slate-dark hover:font-normal ${isSelected ? "bg-crimson font-bold text-cream" : "bg-cream"}`}
                                    >
                                        {label}
                                    </div>
                                );
                            })}
                        </div>
                    </section>,
                    document.body
                )}
        </div>
    );
}
