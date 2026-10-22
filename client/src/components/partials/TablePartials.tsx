import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { ColorVariant, MaterialIcon } from "../../types/common";
import { Button, type ButtonColorVariant } from "../Button";
import Icon from "../Icon";
import Table from "../Table";
import { Text } from "../Text";
import DangerousIcon from "@mui/icons-material/Dangerous";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import { formatFullDate, formatShortDate, formatTime } from "../../utils/dateUtils";

export interface ButtonActions {
    text: string;
    variant?: ButtonColorVariant;
    leftIcon?: MaterialIcon;
    rightIcon?: MaterialIcon;
    handleClick: (id: string | number) => React.MouseEventHandler<HTMLButtonElement>;
}

export interface MenuActions extends ButtonActions {
    // Menu rows can be tinted to read as destructive (e.g. "Delete")
    textVariant?: ColorVariant;
    iconVariant?: ColorVariant;
}

export function EmptyData({ bgVariant }: { bgVariant: ColorVariant }) {
    return (
        <Table.Row bgVariant={bgVariant}>
            <Table.Data colSpan={9999} className="px-0">
                <div className="flex items-center justify-center py-8">
                    <div className="p-2 bg-crimson rounded-2xl flex justify-center items-center">
                        <Text
                            variant="cream"
                            svg={{ icon: DangerousIcon, size: "medium", gap: "big", position: "left" }}
                        >
                            No data to show here!
                        </Text>
                    </div>
                </div>
            </Table.Data>
        </Table.Row>
    );
}

export function ActionButtons({
    id,
    actions,
    size = "default",
}: {
    id: string | number;
    actions: ButtonActions[];
    size?: string;
}) {
    const buttonSizeClass = size === "default" ? "small" : "smallest";

    return (
        <div className="flex items-center gap-2 justify-center">
            {actions.map((action, index) => (
                <Button
                    leftIcon={action.leftIcon}
                    variant={action.variant}
                    rightIcon={action.rightIcon}
                    onClick={action.handleClick(id)}
                    key={index}
                    size={buttonSizeClass}
                    className={`border-0! shadow!`}
                >
                    {action.text}
                </Button>
            ))}
        </div>
    );
}

// Width the portalled menu is laid out at. Also used to clamp it against the viewport.
const MENU_WIDTH = 200;

// Gap between the trigger and the menu, in pixels.
const MENU_OFFSET = 6;

// Rough menu height used only to decide whether to flip the panel above the trigger.
const MENU_HEIGHT_ESTIMATE = 40 * 3 + 8;

export function MoreActionsMenu({
    id,
    actions,
    label = "More actions",
}: {
    id: string | number;
    actions: MenuActions[];
    label?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // Button does not forward refs, so the trigger is measured through its wrapper
    const triggerRef = useRef<HTMLSpanElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => setIsOpen(false), []);

    const handleOpen = () => {
        const trigger = triggerRef.current;
        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();

        // Right-align against the trigger so the panel opens leftward, then keep it on screen
        const left = Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8));
        const spaceBelow = window.innerHeight - rect.bottom;

        // Flip above the trigger when there is not enough room underneath
        const top =
            spaceBelow < MENU_HEIGHT_ESTIMATE
                ? Math.max(8, rect.top - MENU_HEIGHT_ESTIMATE - MENU_OFFSET)
                : rect.bottom + MENU_OFFSET;

        setPosition({ top, left });
        setIsOpen(true);
    };

    // Dismiss on outside click or Escape. Registered once, cleaned up properly.
    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
            close();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };

        // The panel is fixed-positioned, so any scroll would leave it detached from the row
        const handleScroll = () => close();

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isOpen, close]);

    useEffect(() => {
        if (!isOpen) return;
        menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    }, [isOpen]);

    return (
        <span ref={triggerRef} className="relative inline-flex">
            <Button
                type="button"
                size="smallest"
                variant="grey"
                onClick={isOpen ? close : handleOpen}
                // Square trigger, fixed height so it lines up with the labelled buttons beside it
                className="border-0! shadow! h-[1.625rem] w-8! px-0!"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-label={label}
                leftIcon={MoreHorizOutlinedIcon}
            />

            {isOpen &&
                createPortal(
                    <div
                        ref={menuRef}
                        role="menu"
                        aria-label={label}
                        className="fixed z-9999 overflow-hidden rounded-xl border border-[#cfcabd] bg-cream shadow-xl"
                        style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
                    >
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                type="button"
                                role="menuitem"
                                onClick={(event) => {
                                    setIsOpen(false);
                                    action.handleClick(id)(event);
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-off-white hover:text-slate-dark"
                            >
                                {action.leftIcon && (
                                    <Icon
                                        icon={action.leftIcon}
                                        size="smaller"
                                        variant={action.iconVariant ?? "brown"}
                                    />
                                )}
                                <Text size="description" weight="medium" variant={action.textVariant ?? "brown"}>
                                    {action.text}
                                </Text>
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </span>
    );
}

// TODO: Currently i added a variant sa button na smallest, if the size here should have proper enumeration pasabi
export function EditDeleteButtons({
    id,
    handleEdit,
    handleDelete,
    size = "default",
}: {
    id: string | number;
    handleEdit: ButtonActions["handleClick"];
    handleDelete: ButtonActions["handleClick"];
    size?: "default" | "smallest";
}) {
    return (
        <ActionButtons
            id={id}
            actions={[
                {
                    text: "Edit",
                    variant: "secondary",
                    leftIcon: DriveFileRenameOutlineOutlinedIcon,
                    handleClick: handleEdit,
                },
                {
                    text: "Delete",
                    variant: "main",
                    leftIcon: DeleteForeverOutlinedIcon,
                    handleClick: handleDelete,
                },
            ]}
            size={size}
        />
    );
}

function NormalText({ text }: { text: string }) {
    return (
        <Text size="normal" variant="brown" weight="medium" align="center">
            {text}
        </Text>
    );
}

function SubText({ text }: { text: string }) {
    return (
        <Text size="description" variant="slate-light" weight="medium" align="center">
            {text}
        </Text>
    );
}

export function PrimarySecondaryText({ primary, secondary }: { primary: string; secondary: string }) {
    return (
        <div className="flex flex-col justify-center items-center">
            <NormalText text={primary} />
            <SubText text={secondary} />
        </div>
    );
}

export function DateText({ date, type }: { date: Date; type: "shortdate" | "fulldate" | "datetime" | "time" }) {
    switch (type) {
        case "shortdate":
            return <NormalText text={formatShortDate(date)} />;
        case "fulldate":
            return <NormalText text={formatFullDate(date)} />;
        case "time":
            return <NormalText text={formatTime(date)} />;
        case "datetime":
            return <PrimarySecondaryText primary={formatFullDate(date)} secondary={formatTime(date)} />;
        default:
            return null;
    }
}

export function TableToolbar({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-brown bg-transparent w-full ${className}`}>
            {children}
        </div>
    );
}

export function TableFilterWrapper({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex flex-col gap-6 p-6 rounded-2xl border border-slate-dark bg-transparent w-full ${className}`}>
            {children}
        </div>
    );
}