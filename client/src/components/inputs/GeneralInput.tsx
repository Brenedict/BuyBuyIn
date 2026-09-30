// General Imports
import { BaseInput, ErrorMessage, type InputProp } from "./BaseInput";
import { Label, type LabelProp } from "./InputLabel";

interface GeneralInputProp extends LabelProp, InputProp {
    type: "text" | "email" | "number" | "time" | "date" | "datetime-local";
}

export default function GeneralInput({
    type,
    placeholder,
    label,
    labelVariant,
    className = "",
    hidden = false,
    error,
    ...props
}: GeneralInputProp) {
    // Checks if native required attribute is present
    const { required, id } = props;

    // Sets to default false, ensures that when 'required' is not passed it is set to false instead of undefined
    const isRequired = required;

    return (
        <div className={`w-full ${hidden ? "hidden" : ""}`}>
            <Label htmlFor={props.id} label={label} labelVariant={labelVariant} isRequired={isRequired} />
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
