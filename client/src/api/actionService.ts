// General Imports
import { redirect } from "react-router";
import { z } from "zod";

// API Services
import { apiFetch } from "./httpClient";

// Routes & Utils
import { ROUTES } from "../routes/Routes";

export class ApiError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export const JSON_HEADERS = {
    "Content-Type": "application/json",
    Accept: "application/json",
} satisfies HeadersInit;

export const extractQuery = (request: Request, omit?: string[]) => {
    const searchParams = new URL(request.url).searchParams;

    const omitted = omit
        ? (Object.fromEntries(omit.map((param) => [param, searchParams.get(param)])) as Record<string, string>)
        : undefined;

    omit?.forEach((param) => searchParams.delete(param));

    const query = Object.fromEntries(searchParams) as Record<string, string>;

    return { query, omitted };
};

export const extractQueryToObject = (request: Request, omit?: string[]) => {
    const { query, omitted } = extractQuery(request, omit);

    return { query, omitted };
};

export const buildQueryString = (query: Record<string, string | string[]>): string => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((entry) => params.append(key, entry));
            return;
        }

        if (value !== undefined && value !== null) {
            params.append(key, value);
        }
    });

    return params.toString();
};

export const redirectWithQuery = (request: Request, path: string, extraQuery?: string) => {
    const { query } = extractQuery(request);
    const queryString = buildQueryString(query);
    const search = [queryString, extraQuery].filter(Boolean).join("&");

    if (search) {
        return redirect(`${path}?${search}`);
    }

    return redirect(path);
};

export const handleErrRedirect = (err: unknown, request: Request, path: string, withQuery: boolean = true) => {
    // 2nd Line of Defense on Unauthorized URL Access
    if (err instanceof Response) throw err;

    if (err instanceof ApiError && err.status === 403) return redirect(ROUTES.FORBIDDEN);

    console.error(err);

    if (withQuery) {
        // Returns to root directory with queries
        return redirectWithQuery(request, path);
    }

    return redirect(path);
};

export const apiJson = async (route: string, options: RequestInit = {}) => {
    return apiFetch(route, {
        ...options,
        headers: {
            ...JSON_HEADERS,
            ...options.headers,
        },
        retry: true,
    });
};

export const ensureOk = async (res: Response, message: string) => {
    if (res.ok) {
        return res;
    }

    let errorMessage = `${message} (${res.status})`;

    try {
        const body = await res.json();

        if (body?.error) {
            errorMessage += `: \n${JSON.stringify(body.error, null, 2)}`;
        }
    } catch {
        // Skip if response is not a json
    }

    console.log(errorMessage);

    if (res.status === 401) {
        throw redirect(ROUTES.AUTH);
    }

    if (res.status === 400) {
        throw res;
    }

    throw new ApiError(errorMessage, res.status);
};

export const ensureOkOrRedirect = async (res: Response, message: string, request: Request, path: string) => {
    if (res.ok) {
        return res;
    }

    if (res.status === 401) {
        throw redirect(ROUTES.AUTH);
    }

    if (res.status === 400 || res.status === 404 || res.status === 409) {
        let detail = message;

        try {
            const body = await res.json();

            if (body?.error) {
                detail = typeof body.error === "string" ? body.error : JSON.stringify(body.error);
            }
        } catch {
            // Skip if response is not a json
        }

        throw redirectWithQuery(request, path, `ERROR=${encodeURIComponent(detail)}`);
    }

    throw new ApiError(`${message} (${res.status})`, res.status);
};

export function validateForm<T extends z.ZodType>(
    formData: FormData,
    schema: T,
    errorMessage = "Invalid form data"
): z.output<T> {
    const result = schema.safeParse(formData);

    if (!result.success) {
        console.error(z.prettifyError(result.error));
        throw new Error(errorMessage);
    }

    return result.data;
}

export function getParentPath(request: Request, childPath: string) {
    const { pathname } = new URL(request.url);
    return pathname.replace(new RegExp(`/${childPath}/?$`), "") || "/";
}
