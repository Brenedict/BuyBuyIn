import { Children, isValidElement, useState, type ReactNode } from "react";
import { Text } from "./Text";
import Button from "./Button";
import { ColorClasses, type ColorVariant, type SizeVariant, type WeightVariant } from "../types/common";
import Icon from "./Icon";

import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useSearchParams } from "react-router";

/* eslint-disable react-refresh/only-export-components */

interface RowProps {
    children: ReactNode;
    bgVariant?: ColorVariant;
    borderedTop?: boolean;
    borderedBottom?: boolean;
}

function Row({ children, borderedBottom = false, bgVariant = "cream-muted" }: RowProps) {
    return (
        <tr className={` border-brown   ${ColorClasses[bgVariant].bg}   ${borderedBottom ? "border-b " : ""}`}>
            {children}
        </tr>
    );
}

function Footer({ children, borderedBottom = false, bgVariant = "cream-muted" }: RowProps) {
    return (
        <tr className={` border-brown   ${ColorClasses[bgVariant].bg}   ${borderedBottom ? "border-b " : ""}`}>
            {children}
        </tr>
    );
}

interface HeaderProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "style"> {
    textVariant?: ColorVariant;
    weight?: WeightVariant;
    size?: SizeVariant;
    style?: "capitalize" | "uppercase";
    text: string;
    nowrap?: boolean;
}

function Header({
    text,
    nowrap = false,
    textVariant = "crimson",
    weight = "bold",
    style = "capitalize",
    size = "mediumBig",
    ...props
}: HeaderProps) {
    return (
        <th {...props} className={`${nowrap ? "whitespace-nowrap" : ""} ${style} px-16 py-6 ${props.className} `}>
            <Text size={size} weight={weight} align="center" variant={textVariant}>
                {text}
            </Text>
        </th>
    );
}

interface DataProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children?: ReactNode;
    nowrap?: boolean;
    text?: string;
    textVariant?: ColorVariant;
    weight?: WeightVariant;
    size?: SizeVariant;
}

function Data({
    children,
    nowrap = false,
    text,
    textVariant = "brown",
    weight = "medium",
    size = "normal",
    ...props
}: DataProps) {
    return (
        <td {...props} className={`${nowrap ? "whitespace-nowrap" : ""}  px-4 py-4 border-0 ${props.className} `}>
            {text && (
                <Text variant={textVariant} weight={weight} size={size} align="center">
                    {text}
                </Text>
            )}
            {children}
        </td>
    );
}

interface PaginationControlsProps {
    page: number;
    handleLeftClick: () => void;
    handleRightClick: () => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PaginationControls({ page, handleLeftClick, handleRightClick, handleInputChange }: PaginationControlsProps) {
    return (
        <div className="flex items-center">
            <Button
                size="medium"
                variant="grey"
                className="rounded-none! rounded-l-2xl! border-0! p-1!"
                onClick={handleLeftClick}
                leftIcon={KeyboardArrowLeftOutlinedIcon}
            />
            <input
                type="text"
                size={2}
                value={page}
                onChange={handleInputChange}
                className="w-fit min-w-6 h-full text-center bg-white outline-0 border-brown border-y-2 px-1"
            />
            <Button
                size="medium"
                variant="grey"
                className="rounded-none! rounded-r-2xl! border-0! p-1!"
                onClick={handleRightClick}
                leftIcon={KeyboardArrowRightOutlinedIcon}
            />
        </div>
    );
}

interface TableProps extends React.HTMLAttributes<HTMLElement> {
    children: ReactNode;
    borderVariant?: ColorVariant;
    bordered?: boolean;
    rounded?: boolean;
    shadow?: boolean;
    pageKey?: string;
    pagination?: {
        maxItems?: number;
        borderedTop?: boolean;
        borderVariant?: ColorVariant;
        bgVariant?: ColorVariant;
        textVariant?: ColorVariant;
        textSize?: SizeVariant;
        textWeight?: WeightVariant;
    };
}

function Table({
    children,
    pagination,
    bordered = true,
    rounded = true,
    shadow = true,
    pageKey = "page",
    ...props
}: TableProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState<number>(() => (searchParams.has(pageKey) ? Number(searchParams.get(pageKey)) : 1));
    const childrenArray = Children.toArray(children).filter((child) => isValidElement(child) && child.type === Row);
    const footerChildren = Children.toArray(children).filter((child) => isValidElement(child) && child.type === Footer);
    const header = childrenArray[0];
    const rows = childrenArray.slice(1);

    let paginatedRows = null;
    let paginationText = null;

    const {
        maxItems = 5,
        borderedTop = true,
        borderVariant = "brown",
        bgVariant = "cream-muted",
        textVariant = "crimson",
        textSize = "description",
        textWeight = "medium",
    } = pagination ?? {};

    if (pagination) {
        const start = (page - 1) * maxItems;
        const end = page * maxItems;
        const lastIndex = Math.min(end, rows.length);
        paginatedRows = rows.slice(start, end);

        paginationText = `Showing ${
            paginatedRows.length > 0 ? `${start + 1} to ${lastIndex}` : "0"
        } out of ${rows.length}`;
    }

    const setPageClamped = (page: number) => {
        const maxPages = Math.ceil(rows.length / maxItems);
        const clampedPage = Math.min(Math.max(page, 1), maxPages);

        const newParams = new URLSearchParams(searchParams);
        if (clampedPage !== 1) newParams.set(pageKey, clampedPage.toString());
        else newParams.delete(pageKey);

        setPage(() => clampedPage);
        setSearchParams(newParams);
    };

    return (
        <section
            {...props}
            className={`${shadow ? "shadow-xl" : ""} ${rounded ? "rounded-2xl" : ""} ${bordered ? "border-brown border" : ""} overflow-hidden ${props.className ?? ""} `}
        >
            <table className="table-auto w-full ">
                <thead>{header}</thead>
                <tbody className="[&_tr:last-child]:border-b-0! ">
                    {paginatedRows ?? rows}
                    {footerChildren}
                </tbody>
            </table>
            {pagination && (
                <section
                    className={`${ColorClasses[bgVariant].bg} ${borderedTop ? `border-t ${ColorClasses[borderVariant].border}` : ""}  px-8 py-4  flex justify-between w-full`}
                >
                    <Text size={textSize} weight={textWeight} align="left" variant={textVariant}>
                        {paginationText}
                    </Text>
                    <PaginationControls
                        page={page}
                        handleLeftClick={() => setPageClamped(page - 1)}
                        handleRightClick={() => setPageClamped(page + 1)}
                        handleInputChange={(e) => setPageClamped(Number(e.target.value))}
                    />
                </section>
            )}
        </section>
    );
}

export default Object.assign(Table, { Row, Header, Data, Footer });
