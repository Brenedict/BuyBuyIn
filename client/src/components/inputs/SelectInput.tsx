// General Imports
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Components
import { Label, type LabelProp } from "./InputLabel";
import Icon from "../Icon";
import { Text } from "../Text";
import { Button } from "../Button";

// Material UI Icons
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

const DROPDOWN_MIN_WIDTH = 192;
const DROPDOWN_MAX_HEIGHT = 164;
const DROPDOWN_ITEM_HEIGHT = 40;
const VIEWPORT_MARGIN = 8;
const DEFAULT_VARIANT_OFFSET = 0;
const BUTTON_VARIANT_OFFSET = 4;

interface SelectInputProp extends LabelProp, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
    name?: string;
    options: Record<string, string>;
    defaultValue: string;
    variant?: "default" | "button";
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

type DropdownPlacement = "top" | "bottom";

interface DropdownPosition {
    top: number;
    left: number;
    width: number;
    placement: DropdownPlacement;
}

interface SelectInputVariantProps {
    isOpen: boolean;
    onToggle: () => void;
    selectedLabel: string;
    className?: string;
    placement?: DropdownPlacement;
    triggerRef: React.RefObject<HTMLElement | null>;
}

// MAIN COMPONENT
export default function SelectInput({
    id,
    name,
    label,
    labelVariant,
    options,
    defaultValue,
    variant = "default",
    className,
    onChange,
}: SelectInputProp) {
    const selectInputParentRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLElement | null>(null);
    const selectInputRef = useRef<HTMLSelectElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
        top: 0,
        left: 0,
        width: 0,
        placement: "bottom",
    });

    const optionEntries = Object.entries(options);
    const optionCount = optionEntries.length;
    const selectedLabel = optionEntries.find(([, value]) => value === selectedValue)?.[0] ?? selectedValue;
    const isDefaultVariant = variant === "default";

    const close = useCallback(() => setIsOpen(false), []);

    const handleToggle = () => {
        if (isOpen) {
            close();
            return;
        }

        setIsOpen(true);
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

    useLayoutEffect(() => {
        if (!isOpen) return;

        const trigger = triggerRef.current ?? selectInputParentRef.current;
        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();
        const width = isDefaultVariant ? rect.width : Math.max(rect.width, DROPDOWN_MIN_WIDTH);
        const dropdownHeight = Math.min(optionCount * DROPDOWN_ITEM_HEIGHT, DROPDOWN_MAX_HEIGHT);
        const offset = isDefaultVariant ? DEFAULT_VARIANT_OFFSET : BUTTON_VARIANT_OFFSET;
        const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN;
        const spaceAbove = rect.top - VIEWPORT_MARGIN;
        const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
        const left = Math.max(VIEWPORT_MARGIN, Math.min(rect.left, window.innerWidth - width - VIEWPORT_MARGIN));

        setDropdownPosition({
            top: shouldOpenUpward ? rect.top - offset : rect.bottom + offset,
            left,
            width,
            placement: shouldOpenUpward ? "top" : "bottom",
        });
    }, [isOpen, optionCount, isDefaultVariant]);

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (selectInputParentRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
            close();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };

        // The list is fixed-positioned, so any scroll would leave it detached from the trigger
        const handleScroll = (event: Event) => {
            // Scrolling inside the list itself should keep it open
            if (dropdownRef.current?.contains(event.target as Node)) return;
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

    const isOpenUpward = dropdownPosition.placement === "top";

    const dropdownVariantStyle = isDefaultVariant
        ? isOpenUpward
            ? "w-full rounded-t-xl border-t border-x border-slate-dark"
            : "w-full rounded-b-xl border-b border-x border-slate-dark"
        : `min-w-40 rounded-xl border border-slate-dark`;

    return (
        <div className="w-full relative" ref={selectInputParentRef} data-no-drag>
            <Label htmlFor={id} label={label} labelVariant={labelVariant} />
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
                    placement={dropdownPosition.placement}
                    triggerRef={triggerRef}
                />
            ) : (
                <SelectInputButtonVariant
                    isOpen={isOpen}
                    onToggle={handleToggle}
                    selectedLabel={selectedLabel}
                    className={className}
                    placement={dropdownPosition.placement}
                    triggerRef={triggerRef}
                />
            )}

            {isOpen && (
                <SelectDropdownPortal
                    dropdownRef={dropdownRef}
                    position={dropdownPosition}
                    variantStyle={dropdownVariantStyle}
                    optionEntries={optionEntries}
                    selectedValue={selectedValue}
                    onSelect={handleOptionSelect}
                />
            )}
        </div>
    );
}

// SUB-COMPONENTS

function SelectInputDefaultVariant({
    isOpen,
    onToggle,
    selectedLabel,
    className,
    placement = "bottom",
    triggerRef,
}: SelectInputVariantProps) {
    const isOpenStyle = isOpen
        ? placement === "top"
            ? "rounded-b-xl border-2! border-slate-dark!"
            : "rounded-t-xl border-2! border-slate-dark!"
        : "rounded-2xl";

    return (
        <section
            ref={triggerRef}
            data-select-trigger
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

interface SelectDropdownPortalProps {
    dropdownRef: React.RefObject<HTMLElement | null>;
    position: DropdownPosition;
    variantStyle: string;
    optionEntries: [string, string][];
    selectedValue: string;
    onSelect: (value: string) => void;
}

function SelectDropdownPortal({
    dropdownRef,
    position,
    variantStyle,
    optionEntries,
    selectedValue,
    onSelect,
}: SelectDropdownPortalProps) {
    return createPortal(
        <section
            ref={dropdownRef}
            data-no-drag
            className={`fixed z-[9999] max-h-41 overflow-hidden bg-off-white shadow-xl ${variantStyle}`}
            style={{
                top: position.top,
                left: position.left,
                width: position.width,
                transform: position.placement === "top" ? "translateY(-100%)" : undefined,
            }}
        >
            {/* The max-h-41 overflow-auto handles the automatic scrolling when options exceed ~3 items */}
            <div className="max-h-41 overflow-auto">
                {optionEntries.map(([label, value]) => {
                    const isSelected = selectedValue === value;
                    return (
                        <div
                            key={label}
                            onClick={() => onSelect(value)}
                            className={`cursor-pointer px-4 py-2 hover:bg-off-white-border hover:text-slate-dark hover:font-normal ${
                                isSelected ? "bg-crimson font-bold text-cream" : "bg-off-white"
                            }`}
                        >
                            {label}
                        </div>
                    );
                })}
            </div>
        </section>,
        document.body
    );
}
