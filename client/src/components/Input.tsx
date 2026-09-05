// General Imports
import { useRef, useState, type ReactNode } from "react";

// Components
import Icon from "./Icon";

// Material UI Icons
import VisiblityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { Text } from "./Text";

interface LabelProp {
    htmlFor?: string;
    label?: ReactNode;
    isRequired?: boolean;
    error?: string;
}

interface InputProp extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    error?: string;
}

interface TextAreaProp extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    placeholder?: string;
    hidden?: boolean;
    error?: string;
}

interface SelectProp extends React.SelectHTMLAttributes<HTMLSelectElement> {
    optionList: Array<{ content: string; value: string }>;
    hidden?: boolean;
    error?: string;
}

interface GeneralInputProp extends LabelProp, InputProp {
    type: "text" | "email" | "number" | "time" | "date" | "datetime-local";
    hidden?: boolean;
}

const InputStyles = {
    error: (error: string | undefined): string => (error ? "border-crimson" : "border-brown"),

    // TODO: This is currently temporary, for improvement refer to Issue #25
    disabled: "disabled:bg-slate-100 disabled:text-slate-dark disabled:border-slate-200 disabled:cursor-not-allowed",
};

function Label({ htmlFor, label, isRequired }: LabelProp) {
    if (!label) return null;

    return (
        <label htmlFor={htmlFor} className="text-big font-bold block w-full mb-1 text-brown">
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
    const requiresNonWhitespace = type === "text" || type === "search" || !type;
    const errorStyle = InputStyles.error(error);
    const disabledStyle = InputStyles.disabled;

    const inputRef = useRef<HTMLInputElement | null>(null);

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
                disabled
                aria-invalid={!!error}
                ref={inputRef}
                {...props}
                className={`block text-normal font-medium border 
                ${errorStyle}
                ${disabledStyle} 
                [&::-webkit-search-cancel-button]:hidden bg-cream w-full placeholder-slate-light ${className}`}
            />
            {type === "search" && (
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown hover:text-slate-light hover:cursor-pointer focus:outline-none"
                    aria-label="Clear search"
                    onClick={handleClear}
                >
                    <ClearIcon />
                </button>
            )}
        </div>
    );
}

export function GeneralInput({
    type,
    placeholder,
    label,
    className = "",
    hidden = false,
    isRequired,
    error,
    ...props
}: GeneralInputProp) {
    return (
        <div className={`w-full ${hidden ? "hidden" : ""}`}>
            <Label htmlFor={props.id} label={label} isRequired={isRequired} />
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
    placeholder,
    label,
    className = "",
    hidden = false,
    isRequired,
    error,
    onChange,
    ...props
}: LabelProp & TextAreaProp) {
    const errorStyle = InputStyles.error(error);
    const disabledStyle = InputStyles.disabled;

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
        <div className={`text-dark-blue w-full ${hidden ? "hidden" : ""}`}>
            <Label htmlFor={props.id} label={label} isRequired={isRequired} />

            <textarea
                placeholder={placeholder}
                required={isRequired}
                aria-required={isRequired}
                aria-invalid={!!error}
                onChange={handleTextAreaChange}
                className={`block rounded-2xl text-description font-normal px-4 py-3 scroll-px-4 scroll-py-3 border 
                    ${errorStyle} 
                    ${disabledStyle} 
                    bg-off-white w-full min-h-20 resize-none placeholder-grayish-blue ${className}`}
                {...props}
            ></textarea>
            <ErrorMessage error={error} />
        </div>
    );
}

export function SearchInput({ placeholder, className = "", hidden = false, error, ...props }: LabelProp & InputProp) {
    return (
        <div className={`w-full relative ${hidden ? "hidden" : ""}`}>
            <BaseInput
                type="search"
                placeholder={placeholder}
                className={`pl-10 text-sm py-2 px-4 rounded-3xl ${className}`}
                error={error}
                {...props}
            />
            <SearchOutlinedIcon className="text-brown stroke-0 absolute bottom-2 left-3.5 text-big-medium!" />
            <ErrorMessage error={error} />
        </div>
    );
}

export function SelectInput({
    label,
    className = "",
    iconClassName = "",
    optionList,
    hidden = false,
    isRequired,
    error,
    ...props
}: LabelProp & SelectProp & { iconClassName?: string }) {
    const errorStyle = InputStyles.error(error);
    const disabledStyle = InputStyles.disabled;
    return (
        <div className={`text-dark-blue relative w-full ${hidden ? "hidden" : ""}`}>
            <Label label={label} isRequired={isRequired} />

            <div className="flex items-center">
                <select
                    required={isRequired}
                    aria-required={isRequired}
                    aria-invalid={!!error}
                    className={`appearance-none block rounded-2xl text-description font-normal px-4 py-3 border pr-8 
                        ${errorStyle} 
                        ${disabledStyle} 
                        bg-cream w-full placeholder-slate-light hover:bg-off-white-border transition-colors ${className}`}
                    {...props}
                >
                    {isRequired && (
                        <option value="" disabled hidden>
                            Select an option...
                        </option>
                    )}

                    {optionList.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.content}
                        </option>
                    ))}
                </select>

                <div
                    className={`absolute right-3 shrink-0 -ml-10 pointer-events-none border-l flex pl-2 py-[14px] ${iconClassName}`}
                >
                    <div className="bg-crimson ">
                        <Icon icon={ArrowDropDownOutlinedIcon} size="medium" variant="cream" />
                    </div>
                </div>
            </div>

            <ErrorMessage error={error} />
        </div>
    );
}

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
