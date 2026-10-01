import wordmark from "../assets/buybuyin-wordmark.png";

interface BuyBuyInWordmarkProps {
    className?: string;
}

export function BuyBuyInWordmark({ className = "" }: BuyBuyInWordmarkProps) {
    return (
        <img
            src={wordmark}
            alt="BUYBUYIN. A Centralized Point of Sale Management System"
            className={`select-none ${className}`}
        />
    );
}
