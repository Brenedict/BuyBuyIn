import { useCallback, useLayoutEffect, useState } from "react";
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

    const syncPage = useCallback(
        (requestedPage: number) => {
            const maxPages = Math.max(1, Math.ceil(rows.length / maxItems));
            const clampedPage = clampPage(requestedPage, maxPages);

            setPage((currentPage) => (currentPage === clampedPage ? currentPage : clampedPage));

            const urlPage = searchParams.has(pageKey) ? Number(searchParams.get(pageKey)) : 1;
            if (clampedPage !== urlPage) {
                const newParams = new URLSearchParams(searchParams);
                if (clampedPage !== 1) newParams.set(pageKey, clampedPage.toString());
                else newParams.delete(pageKey);
                setSearchParams(newParams);
            }
        },
        [maxItems, pageKey, rows.length, searchParams, setSearchParams]
    );

    useLayoutEffect(() => {
        const initPages = async () => {
            const pageParam = searchParams.has(pageKey) ? Number(searchParams.get(pageKey)) : 1;
            syncPage(pageParam);
        };
        initPages();
    }, [pageKey, searchParams, syncPage]);

    return {
        page,
        setPage: syncPage,
    };
}
