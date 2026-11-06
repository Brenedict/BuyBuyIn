import React from "react";
import SearchInput from "./inputs/SearchInput";

/*
 LAYOUT RULE
  1. SINGLE-ROW LIMIT (isComplex={false}):
    - Use for a MAX of 3 dropdown filters, 1 Search bar, and 1-2 buttons.
    - Best for simple filtering requirements.
    - Beyond 3 dropdowns, the screen width may force elements to squeeze or overlap.
 
  2. COMPLEX LAYOUT (isComplex={true}):
    - Use whenever you have 4 OR MORE dropdown filters.
    - Use when combining Date Range pickers + multiple search/filter fields.
    - Supports automated responsive grid layouts.
    - Additional dropdowns automatically create new rows.
    - Supports multiple action buttons.
    - Supports custom layouts via children.
    - Uses container queries to respond to the available component width.
 */

interface TableFilterBarProps {
    searchValue?: string;
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchPlaceholder?: string;
    searchClassName?: string;
    filters?: React.ReactNode;
    actions?: React.ReactNode;
    dateRange?: React.ReactNode;
    isComplex?: boolean;
    children?: React.ReactNode;
}

export function TableFilterBar({
    searchValue = "",
    onSearchChange,
    searchPlaceholder = "Search...",
    searchClassName = "",
    filters,
    actions,
    dateRange,
    isComplex = false,
    children,
}: TableFilterBarProps) {
    // COMPLEX MODE: Container-Based Responsive Layout or Custom Children
    if (isComplex) {
        return (
            <div className="bg-[#FEFCED] p-6 rounded-3xl shadow-sm border border-[#D6CDB8] mb-2 w-full @container">
                {children ? (
                    children
                ) : (
                    <div className="flex flex-col @min-[47rem]:flex-row items-stretch gap-6 w-full min-w-0">
                        {/* LEFT SECTION: Search & Date Range */}
                        <div className="flex flex-col justify-between gap-5 flex-1 min-w-0 @min-[47rem]:min-w-[320px]">
                            {onSearchChange && (
                                <div className="flex flex-col gap-1.5 min-w-0">
                                    <label className="text-crimson font-bold text-sm">Search</label>

                                    <SearchInput
                                        id="table-search"
                                        name="table-search"
                                        value={searchValue}
                                        onChange={onSearchChange}
                                        placeholder={searchPlaceholder}
                                        className={`w-full! ${searchClassName}`}
                                    />
                                </div>
                            )}

                            {dateRange && (
                                <div className="flex flex-col gap-1.5 min-w-0">
                                    <label className="text-crimson font-bold text-sm">Date Range</label>

                                    <div className="flex flex-wrap items-center gap-3">{dateRange}</div>
                                </div>
                            )}
                        </div>

                        {/* CENTER DIVIDER LINE */}
                        <div className="hidden @min-[47rem]:block w-px bg-slate-dark/30 my-1 self-stretch" />

                        <div className="@min-[47rem]:hidden h-px w-full bg-slate-dark/30" />

                        {/* RIGHT SECTION: Responsive Filters Grid & Action Buttons */}
                        <div className="flex flex-col justify-between gap-5 flex-1 min-w-0 @min-[47rem]:min-w-[340px]">
                            {filters && (
                                <div className="grid grid-cols-1 @min-[47rem]:grid-cols-2 @min-[60rem]:grid-cols-3 items-end gap-3 w-full [&>*]:min-w-0 [&>*]:w-full">
                                    {filters}
                                </div>
                            )}

                            {actions && <div className="flex flex-wrap items-end gap-3 justify-end">{actions}</div>}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // SINGLE ROW MODE
    return (
        <div className="flex flex-wrap items-center justify-between gap-6 w-full mb-4">
            {onSearchChange && (
                <div className="flex-1 min-w-[300px]">
                    <SearchInput
                        id="table-search"
                        name="table-search"
                        value={searchValue}
                        onChange={onSearchChange}
                        placeholder={searchPlaceholder}
                        className={`w-full! ${searchClassName}`}
                    />
                </div>
            )}

            {(filters || actions) && (
                <div className="flex flex-wrap items-center gap-4">
                    {filters && (
                        <div className="flex items-center flex-wrap gap-4 [&>*]:w-48 [&>*]:shrink-0">{filters}</div>
                    )}

                    {actions && <div className="flex items-center flex-wrap gap-2 shrink-0">{actions}</div>}
                </div>
            )}
        </div>
    );
}

export default TableFilterBar;
