import { useCallback, useMemo, type SubmitEvent } from "react";
import { useSearchParams } from "react-router";

interface UseFormSearchParamsReturn<T extends Record<string, string>> {
    values: T;
    reset: () => void;
    submit: (onSubmit?: (params: URLSearchParams) => void) => (event: SubmitEvent<HTMLFormElement>) => void;
}

export function useFormSearchParams<T extends Record<string, string>>(defaults: T): UseFormSearchParamsReturn<T> {
    const [searchParams, setSearchParams] = useSearchParams();

    // If a param already exists in our current URL, we use that instead of the default
    const values = useMemo<T>(() => {
        const result = { ...defaults };
        for (const key of Object.keys(defaults) as (keyof T)[]) {
            const fromUrl = searchParams.get(String(key));
            if (fromUrl !== null) result[key] = fromUrl as T[keyof T];
        }
        return result;
    }, [defaults, searchParams]);

    const reset = useCallback(() => {
        const next = new URLSearchParams(searchParams);
        for (const key of Object.keys(defaults)) next.delete(key); // delete only the existing keys in defaults
        setSearchParams(next);
    }, [defaults, searchParams, setSearchParams]);

    const submit = useCallback(
        (onSubmit?: (params: URLSearchParams) => void) => (event: SubmitEvent<HTMLFormElement>) => {
            event.preventDefault();

            const form = event.currentTarget;
            const formData = new FormData(form);

            const params = new URLSearchParams(searchParams);
            for (const key of Object.keys(defaults)) params.delete(key); // delete only the existing keys in defaults

            for (const key of Object.keys(defaults)) {
                const value = formData.get(String(key));
                if (typeof value === "string" && value !== "") params.set(key, value); // update only the existing keys in defaults
            }

            setSearchParams(params);
            onSubmit?.(params);
        },
        [defaults, searchParams, setSearchParams]
    );

    return {
        values,
        reset,
        submit,
    };
}
