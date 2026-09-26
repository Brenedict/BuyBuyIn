// General Imports
import { useEffect, useRef, useState } from "react";

// Components
import { Label, type LabelProp } from "./InputLabel";
import Icon from "../Icon";
import { Text } from "../Text";
import { Button } from "../Button";

// Material UI Icons
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

interface SelectInputProp extends LabelProp, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
    name: string;
    options: Record<string, string>;
    defaultValue: string;
    variant?: "default" | "button";
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface SelectInputVariantProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedLabel: string;
    className?: string;
}

function SelectInputDefaultVariant({ isOpen, setIsOpen, selectedLabel, className }: SelectInputVariantProps) {
    const isOpenStyle = isOpen ? "rounded-t-xl border-2! border-slate-dark!" : "rounded-2xl";

    // NOTE: Added a minimum width here to prevent the drop down icon hitting the text
    return (
        <section
            onClick={() => setIsOpen((open) => !open)}
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

function SelectInputButtonVariant({ isOpen, setIsOpen, selectedLabel, className }: SelectInputVariantProps) {
    return (
        <Button
            onClick={() => setIsOpen((open) => !open)}
            type="button"
            variant="main"
            size="medium"
            className={`transition ease-in ${className}`}
            rightIcon={ArrowDropDownOutlinedIcon}
            iconExtraClass={`transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
            {selectedLabel}
        </Button>
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

    // State management for dropdown modal
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    const optionEntries = Object.entries(options);
    const selectedLabel = optionEntries.find(([, value]) => value === selectedValue)?.[0] ?? selectedValue;

    const isDefaultVariant = variant === "default";

    const handleOptionSelect = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);

        const select = selectInputRef.current;
        if (select) {
            select.value = value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        }
    };

    // Custom style for options dropdown depending on variant
    const dropdownVariantStyle = isDefaultVariant
        ? "w-full rounded-b-xl border-b  border-x"
        : "mt-1 min-w-40 rounded-xl border";

    // Prevent actionListener from being created and stack per every component reload
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (selectInputParentRef.current && !selectInputParentRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    return (
        <div className="w-full relative" ref={selectInputParentRef}>
            <Label htmlFor={id} label={label} boldLabel={boldLabel} />
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
                    setIsOpen={setIsOpen}
                    selectedLabel={selectedLabel}
                    className={className}
                />
            ) : (
                <SelectInputButtonVariant
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    selectedLabel={selectedLabel}
                    className={className}
                />
            )}

            {isOpen && (
                <section className={`absolute z-100 max-h-41 overflow-hidden ${dropdownVariantStyle}`}>
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
                </section>
            )}
        </div>
    );
}
