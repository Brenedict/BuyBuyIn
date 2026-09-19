// General Import
import { Label, type LabelProp } from "../inputs/InputLabel";
import { Text } from "../Text";

interface ChoiceProp extends LabelProp, React.InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode;
    inputVariant?: "checkbox" | "radio";
    stylized?: boolean;
}

export default function ChoiceInput({
    children,
    inputVariant = "checkbox",
    stylized = false,
    label,
    className,
    ...props
}: ChoiceProp) {
    // Checks if native required attribute is present
    const { required } = props;

    // Sets to default false, ensures that when 'required' is not passed it is set to false instead of undefined
    const isRequired = required;

    // TODO: Add additional styling here if there are special checkboxes/radios
    const baseClass = stylized ? "" : "";
    return (
        <div className={`w-full ${baseClass} ${className}`}>
            <Label htmlFor={props.id} label={label} isRequired={isRequired} />
            <div className={`flex gap-2 `}>
                <input className={`accent-crimson`} type={inputVariant} {...props} />
                <label htmlFor={props.id}>
                    <Text weight="medium" size="medium" variant="brown">
                        {children}
                    </Text>
                </label>
            </div>
        </div>
    );
}
