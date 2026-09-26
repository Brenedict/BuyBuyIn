// General Imports
import { Label, type LabelProp } from "./InputLabel";
import { ErrorMessage, InputStyles } from "./BaseInput";

interface TextAreaProp extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    hidden?: boolean;
    error?: string;
}

export default function TextAreaInput({
    label,
    labelVariant,
    className = "",
    hidden = false,
    error,
    onChange,
    ...props
}: LabelProp & TextAreaProp) {
    // Checks if native input attribute is present
    const { disabled, placeholder, required } = props;

    // Sets to default false if disabled is not provided as an argument
    const isDisabled: boolean = disabled ?? false;

    // Sets a default placeholder so input is never blank
    const placeholderText = placeholder ?? "Enter something here...";

    // Sets to default false, ensures that when 'required' is not passed it is set to false instead of undefined
    const isRequired = required;

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
        // NOTE: Added a min width here to prevent input from being extremely short
        <div className={`w-full min-w-64 ${hidden ? "hidden" : ""}`}>
            <Label htmlFor={props.id} label={label} labelVariant={labelVariant} isRequired={isRequired} />

            <textarea
                required={isRequired}
                aria-required={isRequired}
                aria-invalid={!!error}
                onChange={handleTextAreaChange}
                {...props}
                placeholder={placeholderText}
                className={`
                    block rounded-xl text-description! xl:text-medium! font-medium px-4 py-3 scroll-px-4 scroll-py-3 border border-slate-dark
                    bg-off-white w-full min-h-20 resize-none placeholder-slate-light  
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
