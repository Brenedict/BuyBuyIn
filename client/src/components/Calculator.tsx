import { useState, type ReactElement, type ReactNode } from "react";
import { Text } from "./Text";
import { Button, type ButtonProps } from "./Button";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { VisibilityOffOutlined } from "@mui/icons-material";

const CalculatorBtnColorClasses = {
    cream: "border-crimson bg-cream text-brown card-glass-effect hover:bg-crimson hover:text-cream",
    red: "border-crimson bg-crimson text-cream hover:bg-cream hover:text-crimson",
    slate: "border-slate-medium bg-slate-medium text-cream hover:bg-cream hover:text-slate-medium",
} as const;
type CalculatorBtnColorClassesVariant = keyof typeof CalculatorBtnColorClasses;

function CalculatorBtn({
    className,
    handleClick,
    children,
    variant,
}: {
    className?: string;
    handleClick: () => void;
    children: ReactNode;
    variant: CalculatorBtnColorClassesVariant;
}) {
    const variantclass =
        "cursor-pointer rounded-[5px] py-3 px-2 w-full h-full border border-1 text-medium-big font-bold" +
        " " +
        className +
        " " +
        CalculatorBtnColorClasses[variant];

    return (
        <button className={variantclass} onClick={handleClick}>
            {children}
        </button>
    );
}

//TODO: add display functionality

export function Calculator({ handleToggle }: { handleToggle: React.Dispatch<React.SetStateAction<boolean>> }) {
    const calcClass =
        "flex flex-col justify-center items-center min-h-[680px] p-5 card-glass-effect min-w-[400px] max-w-[500px] bg-cream/50 rounded-[10px] border border-1 border-crimson card-drop-shadow";

    const [displayCurrent, setDisplayCurrent] = useState<string>("");
    const [displayHistory, setDisplayHistory] = useState<string>("");

    const handleNumber = (value: string) => {
        setDisplayCurrent((current) => {
            if (current === "0") {
                return value;
            }

            return current + value;
        });
    };

    const handleDelete = () => {
        setDisplayCurrent((current) => {
            if (current.length <= 1) {
                return "0";
            }

            return current.slice(0, -1);
        });
    };

    return (
        <div className={calcClass}>
            <section className="flex flex-col gap-3 justify-center items-center">
                <input
                    className="order border-1 border-crimson rounded-[5px] min-h-[120px] cursor-text text-slate-medium bg-off-white w-full"
                    type="text"
                    name="display"
                    value={displayCurrent}
                />

                <div className="grid grid-cols-4 gap-3 w-full">
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("7")}>
                        7
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("8")}>
                        8
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("9")}>
                        9
                    </CalculatorBtn>
                    <CalculatorBtn variant="red" handleClick={() => setDisplayCurrent("0")}>
                        C
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("4")}>
                        4
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("5")}>
                        5
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("6")}>
                        6
                    </CalculatorBtn>
                    <CalculatorBtn variant="slate" handleClick={handleDelete}>
                        DEL
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("1")}>
                        1
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("2")}>
                        2
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("3")}>
                        3
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="slate"
                        handleClick={() => {
                            return;
                        }}
                    >
                        DISC
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("0")}>
                        0
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => handleNumber("00")}>
                        00
                    </CalculatorBtn>
                    <CalculatorBtn variant="cream" handleClick={() => setDisplayCurrent((prev) => prev + ".")}>
                        .
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="slate"
                        handleClick={() => {
                            return;
                        }}
                    >
                        F-OVER
                    </CalculatorBtn>
                </div>
                <div className="flex justify-between gap-3 w-full">
                    <CalculatorBtn
                        variant="red"
                        handleClick={() => {
                            return;
                        }}
                    >
                        QTY
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        CHK PRC
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="red"
                        handleClick={() => {
                            return;
                        }}
                    >
                        RETAIL
                    </CalculatorBtn>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 w-full">
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        REPRINT
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        CASHOUT
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="red"
                        handleClick={() => {
                            return;
                        }}
                    >
                        SUBTOTAL
                    </CalculatorBtn>
                </div>
                <Button
                    onClick={() => handleToggle((e) => !e)}
                    className="mt-2 max-w-[30%]"
                    leftIcon={VisibilityOffOutlined}
                    variant="transparent"
                    size="small"
                >
                    hide
                </Button>
            </section>
        </div>
    );
}
