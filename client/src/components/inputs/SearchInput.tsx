// General Imports
import { BaseInput, ErrorMessage, type InputProp } from "./BaseInput";
import { Label, type LabelProp } from "./InputLabel";

// Material UI Icons
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export default function SearchInput({
    className = "",
    hidden = false,
    label,
    boldLabel,
    error,
    ...props
}: LabelProp & InputProp) {
    // Checks if native input attribute is present
    const { disabled, required } = props;

    // Sets to default false if disabled is not provided as an argument
    const isDisabled: boolean = disabled ?? false;

    // Sets to default false, ensures that when 'required' is not passed it is set to false instead of undefined
    const isRequired = required;

    // Changes search icon style depending on when the input is disabled
    const searchIconStyle = isDisabled ? "text-slate-light" : "text-brown";

    return (
        <div className={`relative ${className} ${hidden ? "hidden" : ""}`}>
            <Label htmlFor={props.id} label={label} isRequired={isRequired} boldLabel={boldLabel} />

            <BaseInput type="search" className={`pl-10 py-2 px-4 rounded-3xl `} error={error} {...props} />

            <SearchOutlinedIcon className={`text-xs stroke-0 absolute bottom-2 left-3.5 ${searchIconStyle}`} />
            <ErrorMessage error={error} />
        </div>
    );
}
