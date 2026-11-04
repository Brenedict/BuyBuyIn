// General Imports
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router";
import { Text } from "../../Text";

type NotificationVariant = "success" | "error";

type Notification = {
    message: string;
    variant: NotificationVariant;
};

export function NotificationPopup() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [notification, setNotification] = useState<Notification | null>(null);

    useEffect(() => {
        const notif = searchParams.get("NOTIF");
        const error = searchParams.get("ERROR");
        const statusKey = notif ?? error;

        if (!statusKey || notification) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotification({ message: statusKey, variant: notif ? "success" : "error" });

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("NOTIF");
        nextParams.delete("ERROR");
        setSearchParams(nextParams, { replace: true });
    }, [searchParams, notification, setSearchParams]);

    const handleClose = () => setNotification(null);

    useEffect(() => {
        if (!notification) return;

        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [notification]);

    if (!notification) return null;

    const [headline, ...issues] = notification.message.split("\n");

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-dark/50" onClick={handleClose}>
            <div className="mx-4 w-full max-w-md rounded-2xl border border-crimson bg-off-white/95  p-4 text-center">
                <div className="border-2 rounded-2xl px-6 py-8 border-crimson">
                    <Text variant="crimson" size="mediumBig" weight="bold" align="center" className="uppercase">
                        {headline}
                    </Text>
                    {issues.length > 0 && (
                        <div className="flex justify-center">
                            <ul className="mt-2 list-disc space-y-1 pl-6 text-left font-normal normal-case marker:text-crimson">
                                {issues.map((issue, index) => (
                                    <li key={index}>
                                        <Text variant="crimson" size="normal">
                                            {issue}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
