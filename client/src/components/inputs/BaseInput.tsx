// General Imports
import { useRef } from "react";

// Material UI Icons
import ClearIcon from "@mui/icons-material/Clear";

// Fixed Input Variation Styles
export const InputStyles = {
    error: (error: string | undefined): string => (error ? "border-crimson" : "border-brown"),
    disabled: (disabled: boolean): string =>
        disabled
            ? " disabled:text-slate-light disabled:border-slate-light disabled:font-normal disabled:cursor-not-allowed"
            : "",
};

export interface InputProp extends React.InputHTMLAttributes<HTMLInputElement> {
    boldLabel?: boolean;
    error?: string;
}

export function ErrorMessage({ error }: { error?: string }) {
    if (!error) return null;
    return <span className="text-crimson text-xs mt-1 block">{error}</span>;
}

export function BaseInput({ className, error, type, ...props }: InputProp) {
    // Extracts native input  attribute
    const { disabled, placeholder } = props;

    // Sets to default false if disabled is not provided as an argument
    const isDisabled: boolean = disabled ?? false;

    // Sets a default placeholder so input is never blank
    const placeholderText = placeholder ?? "Enter something here...";

    // Determines fix styles when input has error/is disabled
    const errorStyle = InputStyles.error(error);
    const disabledStyle = InputStyles.disabled(isDisabled ?? false);
    const searchStyle = "pr-10!";

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
        // NOTE: Added a min width here to prevent input from being extremely short
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
                    rounded-xl! xl:text-medium! text-description py-2! block font-medium border border-slate-dark 
                    [&::-webkit-search-cancel-button]:hidden calendar-icon-brown bg-cream w-full placeholder-slate-light 
                    focus:outline-none focus:ring-1 focus:ring-slate-dark
                    ${errorStyle}
                    ${disabledStyle} 
                    ${type === "search" && searchStyle}
                    ${className}
                `}
            />

            {/* Adds Button Specific to 'Search' type inputs */}
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
