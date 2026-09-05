import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

interface UseTablePaginationReturn {
    page: number;
    setPage: (page: number) => void;
}

function clampPage(page: number, maxPages: number): number {
    return Math.min(Math.max(page, 1), Math.max(1, maxPages));
}

export function useTablePagination<T>(rows: T[], pageKey: string, maxItems: number): UseTablePaginationReturn {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState<number>(() => (searchParams.has(pageKey) ? Number(searchParams.get(pageKey)) : 1));

    // Function to clamp the page to the number of pages
    const setPageClamped = useCallback(
        (page: number) => {
            const maxPages = Math.ceil(rows.length / maxItems);
            const clampedPage = Math.min(Math.max(page, 1), maxPages);

            const newParams = new URLSearchParams(searchParams);
            if (clampedPage !== 1) newParams.set(pageKey, clampedPage.toString());
            else newParams.delete(pageKey);

            setPage(() => clampedPage);
            setSearchParams(newParams);
        },
        [maxItems, pageKey, rows.length, searchParams, setSearchParams]
    );

    // Clamp the page when the user directly modifies the url
    useEffect(() => {
        const clampedPageInit = () => {
            const rawParam = searchParams.get(pageKey);
            const pageParam = rawParam ? Number(rawParam) : 1;
            const maxPages = Math.max(1, Math.ceil(rows.length / maxItems));
            const clampedPage = clampPage(pageParam, maxPages);

            if (clampedPage !== page) setPage(clampedPage);

            if (clampedPage !== pageParam) {
                const newParams = new URLSearchParams(searchParams);
                if (clampedPage !== 1) newParams.set(pageKey, clampedPage.toString());
                else newParams.delete(pageKey);
                setSearchParams(newParams);
            }
        };
        clampedPageInit();
    }, [pageKey, searchParams, maxItems, rows.length, page, setSearchParams]);

    return {
        page,
        setPage: setPageClamped,
    };
}
