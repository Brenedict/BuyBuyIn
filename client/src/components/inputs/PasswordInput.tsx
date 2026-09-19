// General Imports
import {useState} from "react";

// Components
import Icon from "../Icon";
import {BaseInput, type InputProp, ErrorMessage} from "./BaseInput"
import { Label, type LabelProp } from "./InputLabel";

// Material UI Icons
import VisiblityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";

export default function PasswordInput({
    placeholder,
    label,
    className = "",
    hidden = false,
    error,
    ...props
}: LabelProp & InputProp) {
    // Checks if native required attribute is present
    const { required } = props;

    // Sets to default false, ensures that when 'required' is not passed it is set to false instead of undefined
    const isRequired = required;

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