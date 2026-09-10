import type { ColorVariant, MaterialIcon } from "../types/common";
import { Button, type ButtonColorVariant } from "./Button";
import Table from "./Table";
import { Text } from "./Text";
import DangerousIcon from "@mui/icons-material/Dangerous";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { formatFullDate, formatShortDate, formatTime } from "../utils/dateUtils";

export interface ButtonActions {
    text: string;
    variant?: ButtonColorVariant;
    leftIcon?: MaterialIcon;
    rightIcon?: MaterialIcon;
    handleClick: (id: string | number) => React.MouseEventHandler<HTMLButtonElement>;
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

export function ActionButtons({ id, actions }: { id: string | number; actions: ButtonActions[] }) {
    return (
        <div className="flex items-center gap-2 justify-center">
            {actions.map((action, index) => (
                <Button
                    leftIcon={action.leftIcon}
                    variant={action.variant}
                    rightIcon={action.rightIcon}
                    onClick={action.handleClick(id)}
                    key={index}
                    size="small"
                    className="border-0! text-description! shadow!"
                >
                    {action.text}
                </Button>
            ))}
        </div>
    );
}

export function EditDeleteButtons({
    id,
    handleEdit,
    handleDelete,
}: {
    id: string | number;
    handleEdit: ButtonActions["handleClick"];
    handleDelete: ButtonActions["handleClick"];
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
        />
    );
}

function NormalText({ text }: { text: string }) {
    return (
        <Text size="normal" variant="brown" weight="medium">
            {text}
        </Text>
    );
}

function SubText({ text }: { text: string }) {
    return (
        <Text size="description" variant="slate-light" weight="medium">
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
