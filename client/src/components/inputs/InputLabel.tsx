// General Imports
import type { ReactNode } from "react";

// Components
import { Text } from "../Text";

export interface LabelProp {
    htmlFor?: string;
    label?: ReactNode;
    boldLabel?: boolean;
    isRequired?: boolean;
    error?: string;
}

// Input Label: Default top placement
export function Label({ htmlFor, label, boldLabel = true, isRequired }: LabelProp) {
    if (!label) return null;

    return (
        <label
            htmlFor={htmlFor}
            className={`text-medium-small xl:text-big block w-full mb-1 text-brown ${boldLabel ? "font-bold" : "font-normal"}`}
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
