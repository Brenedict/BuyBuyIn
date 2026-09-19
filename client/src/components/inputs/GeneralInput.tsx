// General Imports
import { BaseInput, ErrorMessage, type InputProp } from "./BaseInput";
import { Label, type LabelProp } from "./InputLabel";

interface GeneralInputProp extends LabelProp, InputProp {
    boldLabel?: boolean;
    type: "text" | "email" | "number" | "time" | "date" | "datetime-local";
}

export default function GeneralInput({
    type,
    placeholder,
    label,
    boldLabel,
    className = "",
    hidden = false,
    error,
    ...props
}: GeneralInputProp) {
    // Checks if native required attribute is present
    const { required, id } = props;

    // Sets to default false, ensures that when 'required' is not passed it is set to false instead of undefined
    const isRequired = required;

    console.log(id, " & ", props.id);

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