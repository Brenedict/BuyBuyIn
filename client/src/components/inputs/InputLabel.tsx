// General Imports
import type { ReactNode } from "react";

// Components
import { Text } from "../Text";

export interface LabelProp {
    htmlFor?: string;
    label?: ReactNode;
    labelVariant?: "default" | "small";
    isRequired?: boolean;
    error?: string;
}

// Input Label: Default top placement
export function Label({ htmlFor, label, labelVariant = "default", isRequired }: LabelProp) {
    if (!label) return null;

    const labelClass =
        labelVariant === "default" ? "text-medium-small xl:text-big text-brown font-bold" : "text-crimson font-medium";

    return (
        <label htmlFor={htmlFor} className={`block w-full mb-1 ${labelClass} `}>
            {label}
            {isRequired && (
                <span className="text-crimson ml-1" aria-hidden="true">
                    *
                </span>
            )}
        </label>
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
