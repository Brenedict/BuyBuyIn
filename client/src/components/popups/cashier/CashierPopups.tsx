// General Imports
import { useEffect, useState, type SubmitEvent } from "react";
import { useSearchParams } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import GeneralInput from "../../inputs/GeneralInput";
import Icon from "../../Icon";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// Routes
import { ROUTES } from "../../../routes/Routes";

// Material UI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type DiscountType = "SENIOR" | "PWD";

/* ---------- Senior / PWD ---------- */

export function SeniorPwdPopup() {
    const navigate = useNavigatePage();
    const [discountType, setDiscountType] = useState<DiscountType>("SENIOR");

    const handleClose = () => navigate(ROUTES.CASHIER.pointOfSale);

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const idNumber = String(formData.get("idNumber") ?? "").trim();
        const name = String(formData.get("name") ?? "").trim();

        const params = new URLSearchParams();
        params.set("type", discountType);
        if (idNumber) params.set("idNumber", idNumber);
        if (name) params.set("name", name);

        navigate(`${ROUTES.CASHIER.pointOfSaleSeniorPwdConfirm}?${params.toString()}`);
    };

    return (
        <PopUp title="SENIOR/PWD" handleCloseProp={handleClose} className="!w-[665px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Text size="medium" weight="bold" variant="crimson">
                        TYPE:
                    </Text>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            className="flex-1"
                            size="normal"
                            variant={discountType === "SENIOR" ? "main" : "transparent"}
                            onClick={() => setDiscountType("SENIOR")}
                        >
                            SENIOR
                        </Button>
                        <Button
                            type="button"
                            className="flex-1"
                            size="normal"
                            variant={discountType === "PWD" ? "main" : "transparent"}
                            onClick={() => setDiscountType("PWD")}
                        >
                            PWD
                        </Button>
                    </div>
                </div>

                <GeneralInput
                    name="idNumber"
                    type="text"
                    label="ID NUMBER:"
                    labelVariant="small"
                    placeholder="NCR-PSG-1960-04512"
                    required
                />
                <GeneralInput
                    name="name"
                    type="text"
                    label="NAME:"
                    labelVariant="small"
                    placeholder="Corazon Santos Mendoza"
                    required
                />

                <div className="flex gap-2 justify-end">
                    <Button type="button" onClick={handleClose} variant="transparent" size="normal">
                        CANCEL
                    </Button>
                    <Button type="submit" size="normal">
                        ENTER
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

export function SeniorPwdConfirmPopup() {
    const navigate = useNavigatePage();
    const [searchParams] = useSearchParams();

    const name = searchParams.get("name") ?? "";
    const idNumber = searchParams.get("idNumber") ?? "";

    const handleClose = () => navigate(ROUTES.CASHIER.pointOfSale);

    const handleConfirm = () => {
        // UI only — discount application is out of scope for this issue
        handleClose();
    };

    return (
        <PopUp title="PWD/SENIOR DISCOUNT" handleCloseProp={handleClose} className="!w-[665px]">
            <section className="flex flex-col gap-4">
                <GeneralInput name="name" type="text" label="Name:" value={name} disabled readOnly />
                <GeneralInput name="idNumber" type="text" label="ID Number:" value={idNumber} disabled readOnly />

                <Button onClick={handleConfirm} className="w-full" size="medium">
                    CONFIRM DETAILS
                </Button>

                <div className="flex justify-end">
                    <Button onClick={handleClose} variant="secondary" size="normal">
                        CANCEL
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

/* ---------- F-Override ---------- */

export function FOverridePopup() {
    const navigate = useNavigatePage();

    const handleClose = () => navigate(ROUTES.CASHIER.pointOfSale);

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        // UI only — saving the override is out of scope for this issue
        event.preventDefault();
        handleClose();
    };

    return (
        <PopUp title="F-OVERRIDE" handleCloseProp={handleClose} className="!w-[665px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <GeneralInput
                    name="desc"
                    type="text"
                    label="Desc:"
                    labelVariant="small"
                    placeholder="Loose Stitching on Pique Polo Navy (L)"
                    required
                />
                <GeneralInput
                    name="price"
                    type="number"
                    label="Price:"
                    labelVariant="small"
                    min={0}
                    step="0.01"
                    placeholder="419.30"
                    required
                />

                <div className="flex gap-2 justify-end">
                    <Button type="button" onClick={handleClose} variant="transparent" size="normal">
                        CANCEL
                    </Button>
                    <Button type="submit" size="normal">
                        ENTER
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

/* ---------- Void ---------- */

export function VoidPopup() {
    const navigate = useNavigatePage();

    const handleClose = () => navigate(ROUTES.CASHIER.pointOfSale);

    const handleConfirm = () => {
        // UI only — voiding the sale is out of scope for this issue
        handleClose();
    };

    return (
        <PopUp title="VOID" handleCloseProp={handleClose} className="!w-[420px]">
            <section className="flex flex-col items-center gap-6 py-2">
                <Text size="big" weight="extraBold" variant="crimson" align="center">
                    CONFIRM VOID?
                </Text>

                <div className="flex w-full gap-2">
                    <Button onClick={handleClose} className="flex-1" variant="transparent" size="normal">
                        CANCEL
                    </Button>
                    <Button onClick={handleConfirm} className="flex-1" size="normal">
                        CONFIRM
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

/* ---------- Print flow ---------- */

export function PrintConfirmPopup() {
    const navigate = useNavigatePage();

    const handleClose = () => navigate(ROUTES.CASHIER.xRead);

    const handlePrint = () => navigate(ROUTES.CASHIER.xReadPrintPrinting);

    return (
        <PopUp title="PRINT RECEIPT" handleCloseProp={handleClose} className="!w-[480px]">
            <section className="flex flex-col items-center gap-4 py-2">
                <Icon
                    icon={CheckCircleIcon}
                    size="large"
                    variant="cream"
                    bg={{ variant: "crimson", type: "circle", padding: "big" }}
                />
                <div className="flex flex-col items-center gap-1">
                    <Text size="big" weight="extraBold" variant="crimson" align="center">
                        PAYMENT SUCCESSFUL!
                    </Text>
                    <Text size="medium" weight="bold" variant="crimson" align="center">
                        PRINT RECEIPT?
                    </Text>
                </div>

                <div className="flex w-full gap-2">
                    <Button onClick={handleClose} className="flex-1" variant="transparent" size="normal">
                        No, thanks
                    </Button>
                    <Button onClick={handlePrint} className="flex-1" size="normal">
                        PRINT
                    </Button>
                    <Button onClick={handlePrint} className="flex-1" size="normal">
                        PRINT A COPY
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

export function PrintPrintingPopup() {
    const navigate = useNavigatePage();

    const handleClose = () => navigate(ROUTES.CASHIER.xRead);

    // Run once on mount to simulate the print animation duration.
    useEffect(() => {
        const timer = window.setTimeout(() => {
            navigate(ROUTES.CASHIER.xReadPrintPrinted);
        }, 1600);

        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PopUp title="PRINTING" handleCloseProp={handleClose} className="!w-[420px]">
            <section className="flex flex-col items-center justify-center gap-4 py-8">
                <Text size="big" weight="extraBold" variant="crimson" align="center">
                    PRINTING...
                </Text>
                <span
                    className="inline-block h-3 w-3 rounded-full bg-crimson animate-pulse"
                    aria-hidden="true"
                />
            </section>
        </PopUp>
    );
}

export function PrintPrintedPopup() {
    const navigate = useNavigatePage();

    const handleClose = () => navigate(ROUTES.CASHIER.xRead);

    const handlePrintCopy = () => navigate(ROUTES.CASHIER.xReadPrintPrinting);

    return (
        <PopUp title="RECEIPT" handleCloseProp={handleClose} className="!w-[420px]">
            <section className="flex flex-col items-center gap-6 py-2">
                <Text size="big" weight="extraBold" variant="crimson" align="center">
                    RECEIPT PRINTED
                </Text>

                <div className="flex w-full gap-2">
                    <Button onClick={handlePrintCopy} className="flex-1" size="normal">
                        PRINT A COPY
                    </Button>
                    <Button onClick={handleClose} className="flex-1" size="normal">
                        DONE
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}

/* ---------- End Shift ---------- */

export function EndShiftPopup() {
    const navigate = useNavigatePage();

    const handleClose = () => navigate(ROUTES.CASHIER.xRead);

    const handleYes = () => {
        // UI only — closing the shift is out of scope for this issue
        handleClose();
    };

    return (
        <PopUp title="END SHIFT" handleCloseProp={handleClose} className="!w-[420px]">
            <section className="flex flex-col items-center gap-6 py-2">
                <Text size="big" weight="extraBold" variant="crimson" align="center">
                    END YOUR SHIFT?
                </Text>

                <div className="flex w-full gap-2">
                    <Button onClick={handleYes} className="flex-1" size="normal">
                        YES
                    </Button>
                    <Button onClick={handleClose} className="flex-1" size="normal">
                        CANCEL
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}
