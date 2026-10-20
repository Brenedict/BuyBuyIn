import { useState, type ReactNode } from "react";
import { PopUp } from "./PopUp";
import GeneralInput from "./inputs/GeneralInput";
import SelectInput from "./inputs/SelectInput";

type CalculatorDisplayMode = "discount" | "quantity";
type KeyboardField = "display" | "discountName" | "discountId" | "itemIdentifier" | "quantity";

const keyboardRows = [
    ["`~", "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)", "-_", "=+"],
    ["qQ", "wW", "eE", "rR", "tT", "yY", "uU", "iI", "oO", "pP", "[{", "]}", "\\|"],
    ["aA", "sS", "dD", "fF", "gG", "hH", "jJ", "kK", "lL", ";:", "'\""],
    ["zZ", "xX", "cC", "vV", "bB", "nN", "mM", ",<", ".>", "/?"],
] as const;

export type CalculatorDiscount = {
    type: "Senior Citizen" | "PWD";
    idNumber: string;
    name: string;
    percentage: 20;
};

const CalculatorDisplayModeLabels: Record<CalculatorDisplayMode, string> = {
    discount: "Discount",
    quantity: "Quantity",
};

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
        "cursor-pointer rounded-[5px] min-h-10 sm:min-h-11 w-full border border-1 font-bold px-1.5 sm:px-2 py-1.5 text-sm sm:text-base" +
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

export function Calculator({
    handleToggle,
    onConfirmDiscount,
    onConfirmQuantity,
}: {
    handleToggle: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirmDiscount?: (discount: CalculatorDiscount) => void;
    onConfirmQuantity?: (itemIdentifier: string, quantity: number) => boolean;
}) {
    const [displayCurrent, setDisplayCurrent] = useState<string>("0");
    const [displayMode, setDisplayMode] = useState<CalculatorDisplayMode | null>(null);
    const [discountType, setDiscountType] = useState<CalculatorDiscount["type"]>("Senior Citizen");
    const [discountId, setDiscountId] = useState("");
    const [discountName, setDiscountName] = useState("");
    const [itemIdentifier, setItemIdentifier] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [priceMode, setPriceMode] = useState<"Wholesale" | "Retail">("Wholesale");
    const [keyboardField, setKeyboardField] = useState<KeyboardField>("display");
    const [shifted, setShifted] = useState(false);
    const [capsLock, setCapsLock] = useState(false);

    const openMode = (mode: CalculatorDisplayMode) => {
        setDisplayMode(mode);
        setKeyboardField(mode === "discount" ? "discountName" : "itemIdentifier");
        setConfirmationMessage("");
    };

    const handleConfirm = () => {
        if (displayMode === "discount") {
            if (!discountId.trim() || !discountName.trim()) {
                setConfirmationMessage("Enter the customer's name and ID number.");
                return;
            }

            onConfirmDiscount?.({
                type: discountType,
                idNumber: discountId.trim(),
                name: discountName.trim(),
                percentage: 20,
            });
            setConfirmationMessage(`${discountType} discount confirmed (20%).`);
            return;
        }

        if (displayMode === "quantity") {
            const parsedQuantity = Number(quantity);
            if (!itemIdentifier.trim() || !Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
                setConfirmationMessage("Enter an item and a whole-number quantity greater than zero.");
                return;
            }

            const itemWasFound = onConfirmQuantity?.(itemIdentifier.trim(), parsedQuantity) ?? true;
            setConfirmationMessage(
                itemWasFound ? `Quantity updated to ${parsedQuantity}.` : `No item matched "${itemIdentifier.trim()}".`
            );
        }
    };

    const handleNumber = (value: string) => {
        setDisplayCurrent((current) => {
            if (current === "0") {
                return value === "." ? "0." : value === "00" ? "0" : value;
            }

            if (value === "." && current.includes(".")) {
                return current;
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

    const appendToActiveField = (character: string) => {
        if (keyboardField === "display") {
            if (/^\d$/.test(character) || character === ".") {
                handleNumber(character);
            } else {
                setDisplayCurrent((current) => (current === "0" ? character : current + character));
            }
            return;
        }

        const updateField: Record<Exclude<KeyboardField, "display">, React.Dispatch<React.SetStateAction<string>>> = {
            discountName: setDiscountName,
            discountId: setDiscountId,
            itemIdentifier: setItemIdentifier,
            quantity: setQuantity,
        };
        updateField[keyboardField]((current) => current + character);
    };

    const handleKeyboardKey = (key: string) => {
        if (key === "Shift") {
            setShifted((value) => !value);
            return;
        }
        if (key === "Caps") {
            setCapsLock((value) => !value);
            return;
        }
        if (key === "Backspace") {
            if (keyboardField === "display") {
                handleDelete();
            } else {
                const updateField: Record<
                    Exclude<KeyboardField, "display">,
                    React.Dispatch<React.SetStateAction<string>>
                > = {
                    discountName: setDiscountName,
                    discountId: setDiscountId,
                    itemIdentifier: setItemIdentifier,
                    quantity: setQuantity,
                };
                updateField[keyboardField]((current) => current.slice(0, -1));
            }
            return;
        }
        if (key === "Space") {
            appendToActiveField(" ");
            return;
        }
        if (key === "Clear") {
            if (keyboardField === "display") {
                setDisplayCurrent("0");
            } else {
                const updateField: Record<
                    Exclude<KeyboardField, "display">,
                    React.Dispatch<React.SetStateAction<string>>
                > = {
                    discountName: setDiscountName,
                    discountId: setDiscountId,
                    itemIdentifier: setItemIdentifier,
                    quantity: setQuantity,
                };
                updateField[keyboardField]("");
            }
            return;
        }
        if (key === "Enter") {
            if (displayMode) handleConfirm();
            return;
        }

        const useShiftedCharacter = shifted || (capsLock && /^[a-z]$/i.test(key));
        const character = useShiftedCharacter ? key[1] : key[0];
        appendToActiveField(character);
        if (shifted) setShifted(false);
    };

    return (
        <PopUp
            title="POS Keyboard"
            className="w-[min(94vw,600px)]! max-h-[82dvh]! overflow-y-auto! md:w-[min(84vw,680px)]! md:max-h-[78dvh]! lg:w-[min(90vw,1040px)]! lg:max-h-[84dvh]!"
            handleCloseProp={() => handleToggle(false)}
        >
            <section
                className="grid w-full grid-cols-1 gap-2 md:grid-cols-[minmax(210px,0.65fr)_minmax(0,1.8fr)] lg:gap-3"
                data-no-drag
            >
                <div
                    className="flex min-w-0 flex-col gap-1.5 rounded-[5px] border border-crimson bg-off-white p-2 text-slate-medium"
                    role="status"
                    aria-live="polite"
                >
                    <div className="flex items-center justify-between">
                        <span className="font-bold">{displayMode ? CalculatorDisplayModeLabels[displayMode] : ""}</span>
                        {displayMode ? (
                            <button
                                className="cursor-pointer text-sm font-bold underline"
                                type="button"
                                onClick={() => {
                                    setDisplayMode(null);
                                    setConfirmationMessage("");
                                }}
                            >
                                BACK
                            </button>
                        ) : (
                            <span className="text-sm">{priceMode}</span>
                        )}
                    </div>
                    {displayMode === "discount" && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-end gap-2">
                                <SelectInput
                                    id="calculator-discount-type"
                                    name="discountType"
                                    label="Discount type"
                                    defaultValue={discountType}
                                    options={{ "Senior Citizen": "Senior Citizen", PWD: "PWD" }}
                                    onChange={(event) =>
                                        setDiscountType(event.target.value as CalculatorDiscount["type"])
                                    }
                                    className="min-w-0 rounded-md! px-2! py-1!"
                                />
                                <span className="pb-2 font-bold">20%</span>
                            </div>
                            <GeneralInput
                                id="calculator-discount-name"
                                name="discountName"
                                type="text"
                                label="Name"
                                placeholder="Customer name"
                                value={discountName}
                                onChange={(event) => setDiscountName(event.target.value)}
                                onFocus={() => setKeyboardField("discountName")}
                                autoComplete="name"
                                className="rounded-md! px-2! py-1!"
                            />
                            <GeneralInput
                                id="calculator-discount-id"
                                name="discountId"
                                type="text"
                                label="ID number"
                                placeholder="Senior/PWD ID number"
                                value={discountId}
                                onChange={(event) => setDiscountId(event.target.value)}
                                onFocus={() => setKeyboardField("discountId")}
                                autoComplete="off"
                                className="rounded-md! px-2! py-1!"
                            />
                        </div>
                    )}
                    {displayMode === "quantity" && (
                        <div className="flex flex-col gap-2">
                            <GeneralInput
                                id="calculator-item-identifier"
                                name="itemIdentifier"
                                type="text"
                                label="Item ID or name"
                                placeholder="Enter item ID or name"
                                value={itemIdentifier}
                                onChange={(event) => setItemIdentifier(event.target.value)}
                                onFocus={() => setKeyboardField("itemIdentifier")}
                                className="rounded-md! px-2! py-1!"
                            />
                            <GeneralInput
                                id="calculator-quantity"
                                name="quantity"
                                type="number"
                                label="Quantity"
                                min="1"
                                step="1"
                                value={quantity}
                                onChange={(event) => setQuantity(event.target.value)}
                                onFocus={() => setKeyboardField("quantity")}
                                className="rounded-md! px-2! py-1!"
                            />
                        </div>
                    )}
                    {!displayMode && (
                        <output
                            className="block w-full flex-1 self-end truncate text-right text-3xl font-bold"
                            aria-label="Calculator value"
                        >
                            {displayCurrent}
                        </output>
                    )}
                    {confirmationMessage && <span className="text-xs">{confirmationMessage}</span>}
                    {displayMode && (
                        <button
                            className="mt-auto cursor-pointer rounded-[5px] bg-crimson px-3 py-2 text-sm font-bold text-cream hover:bg-cream hover:text-crimson"
                            type="button"
                            onClick={handleConfirm}
                        >
                            Confirm
                        </button>
                    )}
                </div>

                <div className="flex min-w-0 flex-col justify-between gap-1.5">
                    <div className="min-w-0 overflow-x-auto pb-1">
                        <div className="flex min-w-140 flex-col gap-1 lg:min-w-0">
                            {keyboardRows.map((row, rowIndex) => (
                                <div className="flex w-full gap-1" key={rowIndex}>
                                    {rowIndex === 3 && (
                                        <CalculatorBtn
                                            className={`w-20! shrink-0 text-xs ${shifted ? "bg-crimson text-cream" : ""}`}
                                            variant="slate"
                                            handleClick={() => handleKeyboardKey("Shift")}
                                        >
                                            Shift
                                        </CalculatorBtn>
                                    )}
                                    {row.map((key) => (
                                        <CalculatorBtn
                                            className="min-w-0 flex-1 text-base"
                                            variant="cream"
                                            key={key}
                                            handleClick={() => handleKeyboardKey(key)}
                                        >
                                            {shifted || (capsLock && /^[a-z]$/i.test(key)) ? key[1] : key[0]}
                                        </CalculatorBtn>
                                    ))}
                                    {rowIndex === 0 && (
                                        <CalculatorBtn
                                            className="w-24! shrink-0 text-xs"
                                            variant="slate"
                                            handleClick={() => handleKeyboardKey("Backspace")}
                                        >
                                            Backspace
                                        </CalculatorBtn>
                                    )}
                                    {rowIndex === 2 && (
                                        <CalculatorBtn
                                            className={`w-20! shrink-0 text-xs ${capsLock ? "bg-crimson text-cream" : ""}`}
                                            variant="slate"
                                            handleClick={() => handleKeyboardKey("Caps")}
                                        >
                                            Caps
                                        </CalculatorBtn>
                                    )}
                                    {rowIndex === 3 && (
                                        <CalculatorBtn
                                            className="w-24! shrink-0 text-xs"
                                            variant="slate"
                                            handleClick={() => handleKeyboardKey("Enter")}
                                        >
                                            Enter
                                        </CalculatorBtn>
                                    )}
                                </div>
                            ))}
                            <div className="flex w-full gap-1">
                                <CalculatorBtn
                                    className="w-24! shrink-0 text-xs"
                                    variant="slate"
                                    handleClick={() => handleKeyboardKey("Clear")}
                                >
                                    Clear
                                </CalculatorBtn>
                                <CalculatorBtn
                                    className="min-w-40 flex-1 text-xs"
                                    variant="slate"
                                    handleClick={() => handleKeyboardKey("Space")}
                                >
                                    Space
                                </CalculatorBtn>
                                <CalculatorBtn
                                    className="w-24! shrink-0 text-xs"
                                    variant="slate"
                                    handleClick={() => handleKeyboardKey("Enter")}
                                >
                                    Enter
                                </CalculatorBtn>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                        <CalculatorBtn variant="red" handleClick={() => openMode("discount")}>
                            DISC
                        </CalculatorBtn>
                        <CalculatorBtn variant="red" handleClick={() => openMode("quantity")}>
                            QTY
                        </CalculatorBtn>
                        <CalculatorBtn variant="slate" handleClick={() => undefined}>
                            F-OVER
                        </CalculatorBtn>
                        <CalculatorBtn variant="cream" handleClick={() => undefined}>
                            CHK PRC
                        </CalculatorBtn>
                        <CalculatorBtn
                            variant="cream"
                            handleClick={() => setPriceMode((mode) => (mode === "Wholesale" ? "Retail" : "Wholesale"))}
                        >
                            {priceMode.toUpperCase()}
                        </CalculatorBtn>
                        <CalculatorBtn variant="cream" handleClick={() => undefined}>
                            REPRINT
                        </CalculatorBtn>
                        <CalculatorBtn variant="cream" handleClick={() => undefined}>
                            CASHOUT
                        </CalculatorBtn>
                        <CalculatorBtn variant="red" handleClick={() => undefined}>
                            SUBTOTAL
                        </CalculatorBtn>
                    </div>
                </div>
            </section>
        </PopUp>
    );
}
