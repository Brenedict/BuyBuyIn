// General Imports
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

// Components
import { Label, type LabelProp } from "./InputLabel";
import Icon from "../Icon";
import { Text } from "../Text";
import { Button } from "../Button";

// Material UI Icons
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

interface SelectInputProp extends LabelProp, React.SelectHTMLAttributes<HTMLSelectElement> {
    name: string;
    children: ReactNode;
    defaultValue: string;
    variant?: "default" | "button";
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Context provider for updating input when an option is selected
interface SelectContextType {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedValue: string;
    setSelectedValue?: React.Dispatch<React.SetStateAction<string>>;
    onChange?: (e: any) => void;
    name?: string;
}

const SelectContext = createContext<SelectContextType | null>(null);

function Option({ value, children }: { value: string; children: ReactNode }) {
    const context = useContext(SelectContext);

    if (!context) {
        throw new Error("Select.Option must be used within a Select");
    }

    const { setIsOpen, selectedValue, setSelectedValue, onChange, name } = context;
    const isSelected = selectedValue === value;

    return (
        <div
            onClick={() => {
                if (setSelectedValue) setSelectedValue(value);
                setIsOpen(false);
                if (onChange) {
                    onChange({ target: { value, name } } as any);
                }
            }}
            className={`cursor-pointer px-4 py-2 hover:bg-off-white hover:text-slate-dark hover:font-normal ${isSelected ? "bg-crimson font-bold text-cream" : "bg-cream"}`}
        >
            {children}
        </div>
    );
}

function SelectInputDefaultVariant({
    isOpen,
    setIsOpen,
    selectedValue,
    className,
}: SelectContextType & { className?: string }) {
    const isOpenStyle = isOpen ? "rounded-t-xl border-2! border-slate-dark!" : "rounded-2xl";

    // NOTE: Added a minimum width here to prevent the drop down icon hitting the text
    return (
        <section
            onClick={() => setIsOpen((open) => !open)}
            className={`
                flex justify-between items-center px-4 border   
                bg-cream w-full min-w-48 placeholder-slate-light hover:bg-off-white-border transition-colors 
                ${isOpenStyle}              
                ${className}
            `}
        >
            <Text variant="black" size="normal" weight="medium" className="py-3">
                {selectedValue}
            </Text>

            <div className="flex self-stretch gap-4">
                {/* Vertical Line Separator */}
                <div className={`self-stretch bg-slate-dark ${isOpen ? "w-0.5" : "w-px"}`} />

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

function SelectInputButtonVariant({
    isOpen,
    setIsOpen,
    selectedValue,
    className,
}: SelectContextType & { className?: string }) {
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
            {selectedValue}
        </Button>
    );
}

export default function SelectInput({
    id,
    name,
    label,
    children,
    defaultValue,
    variant = "default",
    className,
    onChange,
}: SelectInputProp) {
    const selectInputParentRef = useRef<HTMLDivElement | null>(null);

    // State management for dropdown modal
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    const isDefaultVariant = variant === "default";

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
            <Label htmlFor={id} label={label} />
            <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, setSelectedValue, onChange, name }}>
                {/* hidden input that holds data of dropdown */}
                <input hidden type="text" name={name} value={selectedValue} />

                {isDefaultVariant ? (
                    <SelectInputDefaultVariant
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        className={className}
                    />
                ) : (
                    <SelectInputButtonVariant
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        className={className}
                    />
                )}

                {isOpen && (
                    // This is nested so that the scrollbar properly follows the border radius
                    <section className={`absolute z-800 max-h-41 overflow-hidden ${dropdownVariantStyle}`}>
                        <div className="max-h-41 overflow-auto">{children}</div>
                    </section>
                )}
            </SelectContext.Provider>
        </div>
    );
}

SelectInput.Option = Option;
