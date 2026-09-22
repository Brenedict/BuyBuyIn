import { useState, type ReactElement, type ReactNode } from "react";
import { Text } from "./Text";
import { Button, type ButtonProps } from "./Button";

const CalculatorBtnColorClasses = {
    cream: "border-crimson bg-cream text-brown card-glass-effect hover:bg-crimson hover:text-cream",
    red: "border-crimson bg-crimson text-cream hover:bg-cream hover:text-crimson",
    slate: "border-slate-medium bg-slate-medium text-cream hover:bg-cream hover:hover:text-slate-medium",
} as const;
type CalculatorBtnColorClassesVariant = keyof typeof CalculatorBtnColorClasses;

function CalculatorBtn({
    handleClick,
    children,
    variant,
}: {
    handleClick: () => void;
    children: ReactNode;
    variant: CalculatorBtnColorClassesVariant;
}) {
    const variantclass =
        "rounded-[5px] py-3 px-2 w-full h-full border border-1 text-medium-big font-bold" +
        " " +
        CalculatorBtnColorClasses[variant];

    return (
        <button className={variantclass} onClick={handleClick}>
            {children}
        </button>
    );
}

//TODO: add display functionality
function Display() {
    const [displayCurrent, setDisplayCurrent] = useState<string>("");

    return (
        <div className="border border-1 border-crimson rounded-[5px] min-h-[120px] cursor-text text-slate-medium bg-white">
            <input type="text" name="display" value={displayCurrent} />
        </div>
    );
}

export function Calculator() {
    const calcClass =
        "flex flex-col cursor-pointer justify-center items-center min-h-[680px] p-5 card-glass-effect min-w-[400px] max-w-[500px] bg-cream/50 rounded-[10px] border border-1 border-crimson card-drop-shadow";
    const [displayCurrent, setDisplayCurrent] = useState<string>("");

    return (
        <div className={calcClass}>
            <section className="flex flex-col gap-3">
                <input
                    className="order border-1 border-crimson rounded-[5px] min-h-[120px] cursor-text text-slate-medium bg-white w-full"
                    type="text"
                    name="display"
                    value={displayCurrent}
                />

                <div className="grid grid-cols-4 gap-3 w-full">
                    <CalculatorBtn variant="cream" handleClick={() => setDisplayCurrent("Hey ya")}>
                        7
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        8
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        9
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="red"
                        handleClick={() => {
                            return;
                        }}
                    >
                        C
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        4
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        5
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        6
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="slate"
                        handleClick={() => {
                            return;
                        }}
                    >
                        DEL
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        1
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        2
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
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
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        0
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
                        00
                    </CalculatorBtn>
                    <CalculatorBtn
                        variant="cream"
                        handleClick={() => {
                            return;
                        }}
                    >
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
                <div className="flex justify-between gap-3">
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
                <div className="flex flex-col items-center justify-center gap-3">
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
            </section>
        </div>
    );
}
