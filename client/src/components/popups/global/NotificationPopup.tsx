// General Imports
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Text } from "../../Text";
import { Button } from "../../Button";

// Material UI Icons
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

type NotificationVariant = "success" | "error";

type Notification = {
    message: string;
    variant: NotificationVariant;
};

const NotificationContent = {
    success: {
        title: "Success",
        description: "The changes have been saved.",
        circleClass: "bg-crimson-muted",
        iconClass: "text-crimson",
        titleVariant: "crimson",
        descriptionVariant: "brown",
        icon: NotificationsActiveOutlinedIcon,
    },
    error: {
        title: "Something went wrong",
        description: "Please try again, or adjust your input and resubmit.",
        circleClass: "bg-amber-100",
        iconClass: "text-amber-600",
        titleVariant: "brown",
        descriptionVariant: "slate-light",
        icon: ReportProblemOutlinedIcon,
    },
} as const;

export function NotificationPopup() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [notification, setNotification] = useState<Notification | null>(null);

    useEffect(() => {
        const notif = searchParams.get("NOTIF");
        const error = searchParams.get("ERROR");
        const statusKey = notif ?? error;

        if (!statusKey || notification) return;

        setNotification({ message: statusKey, variant: notif ? "success" : "error" });

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("NOTIF");
        nextParams.delete("ERROR");
        setSearchParams(nextParams, { replace: true });
    }, [searchParams, notification, setSearchParams]);

    const handleClose = () => setNotification(null);

    if (!notification) return null;

    const content = NotificationContent[notification.variant];
    const Icon = content.icon;

    return (
        <PopUp title={notification.variant === "success" ? "Notification" : "Warning"} handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${content.circleClass}`}
                    >
                        <Icon className={content.iconClass} sx={{ fontSize: 34 }} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Text size="bigger" weight="extraBold" variant={content.titleVariant}>
                            {content.title}
                        </Text>
                        <Text size="normal" weight="medium" variant="black">
                            {notification.message}
                        </Text>
                    </div>
                </div>

                <Text size="description" weight="regular" variant={content.descriptionVariant}>
                    {content.description}
                </Text>

                <Button className="w-full" size="normal" onClick={handleClose}>
                    Close
                </Button>
            </section>
        </PopUp>
    );
}
