// General Imports
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

// Components
import Icon from "./Icon";

// Material UI Icons
import VisiblityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { Text } from "./Text";
import { Button } from "./Button";

interface LabelProp {
    htmlFor?: string;
    label?: ReactNode;
    boldLabel?: boolean;
    isRequired?: boolean;
    error?: string;
}

interface InputProp extends React.InputHTMLAttributes<HTMLInputElement> {
    boldLabel?: boolean;
    error?: string;
}

interface TextAreaProp extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    boldLabel?: boolean;
    hidden?: boolean;
    error?: string;
}

interface GeneralInputProp extends LabelProp, InputProp {
    boldLabel?: boolean;
    type: "text" | "email" | "number" | "time" | "date" | "datetime-local";
    hidden?: boolean;
}

const InputStyles = {
    error: (error: string | undefined): string => (error ? "border-crimson" : "border-brown"),
    disabled: (disabled: boolean): string =>
        disabled
            ? " disabled:text-slate-light disabled:border-slate-light disabled:font-normal disabled:cursor-not-allowed"
            : "",
};

function Label({ htmlFor, label, boldLabel = true, isRequired }: LabelProp) {
    if (!label) return null;

    return (
        <label
            htmlFor={htmlFor}
            className={`text-big block w-full mb-1 text-brown ${boldLabel ? "font-bold" : "font-normal"}`}
        >
            {label}
            {isRequired && (
                <span className="text-crimson ml-1" aria-hidden="true">
                    *
                </span>
            )}
        </label>
    );
}

function ErrorMessage({ error }: { error?: string }) {
    if (!error) return null;
    return <span className="text-crimson text-xs mt-1 block">{error}</span>;
}

function BaseInput({ className, error, type, ...props }: InputProp) {
    // Extracts native input  attribute
    const { disabled, placeholder } = props;

    // Sets to default false if disabled is not provided as an argument
    const isDisabled: boolean = disabled ?? false;

    // Sets a default placeholder so input is never blank
    const placeholderText = placeholder ?? "Enter something here...";

    // Determines fix styles when input has error/is disabled
    const errorStyle = InputStyles.error(error);
    const disabledStyle = InputStyles.disabled(isDisabled ?? false);

    const requiresNonWhitespace = type === "text" || type === "search" || !type;

    // Used to hold input element (equivalent to document.getElementById)
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Handles native clearing logic from input of search type
    const handleClear = () => {
        const input = inputRef.current;
        if (!input) {
            return null;
        }

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

        // Clears input via the native html way
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, "");
        }

        // Clears input, fall back for modern browsers
        else {
            input.value = "";
        }

        // Triggers input event
        input.dispatchEvent(new Event("input", { bubbles: true }));

        // Returns focus on the search element
        input.focus();
    };

    return (
        <div className="relative w-full">
            <input
                type={type}
                pattern={requiresNonWhitespace ? ".*\\S+.*" : undefined}
                title={requiresNonWhitespace ? "This field cannot be empty or just spaces." : undefined}
                aria-invalid={!!error}
                ref={inputRef}
                {...props}
                placeholder={placeholderText}
                className={`
                    rounded-xl! text-medium! py-2! block font-medium border border-slate-dark 
                    [&::-webkit-search-cancel-button]:hidden calendar-icon-brown bg-cream w-full placeholder-slate-light 
                    focus:outline-none focus:ring-1 focus:ring-slate-dark
                    ${errorStyle}
                    ${disabledStyle} 
                    ${className}
                `}
            />
            {type === "search" && !isDisabled && (
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown hover:text-slate-light hover:cursor-pointer focus:outline-none"
                    aria-label="Clear search"
                    onClick={handleClear}
                >
                    <ClearIcon />
                </button>
            )}

            {type === "date" && !isDisabled && <div className="absolute top-0 h-11 right-13 w-px bg-slate-dark"></div>}
        </div>
    );
}

export function GeneralInput({
    type,
    placeholder,
    label,
    boldLabel,
    className = "",
    hidden = false,
    isRequired,
    error,
    ...props
}: GeneralInputProp) {
    return (
        <div className={`w-full ${hidden ? "hidden" : ""}`}>
            <Label htmlFor={props.id} label={label} isRequired={isRequired} boldLabel={boldLabel} />
            <BaseInput
                type={type}
                placeholder={placeholder}
                className={`px-4 py-3 rounded-2xl ${className}`}
                error={error}
                required={isRequired}
                aria-required={isRequired}
                {...props}
            />
            <ErrorMessage error={error} />
        </div>
    );
}

export function PasswordInput({
    placeholder,
    label,
    className = "",
    hidden = false,
    isRequired,
    error,
    ...props
}: LabelProp & InputProp) {
    const [visible, setVisible] = useState<boolean>(false);

    const handleVisible = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVisible(e.target.checked);
    };

    return (
        <div className={`text-dark-blue w-full ${hidden ? "hidden" : ""}`}>
            <Label htmlFor={props.id} label={label} isRequired={isRequired} />
            <div className="relative">
                <BaseInput
                    type={visible ? "text" : "password"}
                    placeholder={placeholder}
                    className={`pr-12 text-sm px-4 py-3 rounded-2xl ${className}`}
                    error={error}
                    required={isRequired}
                    aria-required={isRequired}
                    {...props}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center">
                    <label className="cursor-pointer hover:bg-gray-200 transition-colors p-1 rounded-lg box-content flex items-center">
                        <input type="checkbox" onChange={handleVisible} checked={visible} className="sr-only" />
                        <Icon icon={visible ? VisiblityIcon : VisibilityOffIcon} variant="brown" size="medium" />
                    </label>
                </div>
            </div>
            <ErrorMessage error={error} />
        </div>
    );
}

export function TextAreaInput({
    label,
    boldLabel,
    className = "",
    hidden = false,
    isRequired,
    error,
    onChange,
    ...props
}: LabelProp & TextAreaProp) {
    // Extracts native input  attribute
    const { disabled, placeholder } = props;

    // Sets to default false if disabled is not provided as an argument
    const isDisabled: boolean = disabled ?? false;

    // Sets a default placeholder so input is never blank
    const placeholderText = placeholder ?? "Enter something here...";

    // Determines fix styles when input has error/is disabled
    const errorStyle = InputStyles.error(error);
    const disabledStyle = InputStyles.disabled(isDisabled);

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textValue = e.target.value;

        if (isRequired && textValue.length > 0 && textValue.trim() === "") {
            e.target.setCustomValidity("This field cannot be empty or just spaces.");
        } else {
            e.target.setCustomValidity("");
        }
        if (onChange) onChange(e);
    };

    return (
        <div className={`w-full ${hidden ? "hidden" : ""}`}>
            <Label htmlFor={props.id} label={label} isRequired={isRequired} boldLabel={boldLabel} />

            <textarea
                required={isRequired}
                aria-required={isRequired}
                aria-invalid={!!error}
                onChange={handleTextAreaChange}
                {...props}
                placeholder={placeholderText}
                className={`
                    block rounded-xl text-description font-normal px-4 py-3 scroll-px-4 scroll-py-3 border border-slate-dark
                    bg-cream w-full min-h-20 resize-none placeholder-slate-light  
                    focus:outline-none focus:ring-1 focus:ring-slate-dark focus:border-slate-dark
                    ${errorStyle} 
                    ${disabledStyle} 
                    ${className}
                    `}
            ></textarea>
            <ErrorMessage error={error} />
        </div>
    );
}

export function SearchInput({
    className = "",
    hidden = false,
    isRequired,
    label,
    boldLabel,
    error,
    ...props
}: LabelProp & InputProp) {
    // Extracts native input  attribute
    const { disabled } = props;

    // Sets to default false if disabled is not provided as an argument
    const isDisabled: boolean = disabled ?? false;

    // Changes search icon style depending on when the input is disabled
    const searchIconStyle = isDisabled ? "text-slate-light" : "text-brown";

    return (
        <div className={`w-full relative ${hidden ? "hidden" : ""}`}>
            <Label htmlFor={props.id} label={label} isRequired={isRequired} boldLabel={boldLabel} />

            <BaseInput
                type="search"
                className={`pl-10 text-sm py-2 px-4 rounded-3xl ${className}`}
                error={error}
                {...props}
            />

            <SearchOutlinedIcon className={`text-big-medium stroke-0 absolute bottom-2 left-3.5 ${searchIconStyle}`} />
            <ErrorMessage error={error} />
        </div>
    );
}

interface SelectContextType {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedValue: string;
    setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
}

const SelectContext = createContext<SelectContextType | null>(null);

function Option({ value, children }: { value: string; children: ReactNode }) {
    const context = useContext(SelectContext);

    if (!context) {
        throw new Error("Select.Option must be used within a Select");
    }

    const { setIsOpen, selectedValue, setSelectedValue } = context;
    const isSelected = selectedValue === value;

    return (
        <div
            onClick={() => {
                setSelectedValue(value);
                setIsOpen(false);
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
    setSelectedValue,
    className,
}: SelectContextType & { className?: string }) {
    const isOpenStyle = isOpen ? "rounded-t-xl border-2! border-slate-dark!" : "rounded-2xl";

    return (
        <section
            onClick={() => setIsOpen((open) => !open)}
            className={`
                flex justify-between items-center px-4 border   
                bg-cream w-full placeholder-slate-light hover:bg-off-white-border transition-colors 
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
    setSelectedValue,
    className,
}: SelectContextType & { className?: string }) {
    return (
        <Button
            onClick={() => setIsOpen((open) => !open)}
            variant="main"
            size="medium"
            className={`transition ease-in ${className}`}
            rightIcon={ArrowDropDownOutlinedIcon}
            iconExtraClass={`${isOpen ? "rotate-180 transition ease-in " : "transition ease-in "}`}
        >
            {selectedValue}
        </Button>
    );
}

export function SelectInput({
    name,
    children,
    defaultValue,
    variant = "default",
    className,
}: {
    name: string;
    children: ReactNode;
    defaultValue: string;
    variant?: "default" | "button";
    className?: string;
}) {
    const selectInputParentRef = useRef<HTMLDivElement | null>(null);

    // State management for dropdown modal
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    const isDefaultVariant = variant === "default";

    // Custom style for options dropdown depending on variant
    const dropdownVariantStyle = isDefaultVariant
        ? "w-full rounded-b-xl border-b  border-x"
        : "mt-1 min-w-40 rounded-xl border";

    document.addEventListener("click", function (event) {
        // Check if the click is outside of the select input
        if (selectInputParentRef.current && !selectInputParentRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    });

    return (
        <div className="w-full relative" ref={selectInputParentRef}>
            <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, setSelectedValue }}>
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
                    <section className={`absolute z-100 max-h-41 overflow-hidden ${dropdownVariantStyle}`}>
                        <div className="max-h-41 overflow-auto">{children}</div>
                    </section>
                )}
            </SelectContext.Provider>
        </div>
    );
}

SelectInput.Option = Option;

export function LeftLabeledInput({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex items-center gap-2">
            <Text size="description" variant="brown" weight="medium">
                {label}
            </Text>
            {children}
        </div>
    );
}
