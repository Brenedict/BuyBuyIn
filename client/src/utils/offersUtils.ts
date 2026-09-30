// TODO: Replace with prisma enums when available
export function formatDiscountValue(discountType: "PERCENTAGE" | "FIXED_VALUE", discountValue: number): string {
    return discountType === "PERCENTAGE" ? `${discountValue}%` : `₱${discountValue}`;
}

export function calculateDiscountedSubtotal(
    discountType: "PERCENTAGE" | "FIXED_VALUE",
    discountValue: number,
    quantity: number,
    shelfPrice: number
): string {
    let discountSubtract = 0;

    if (discountType == "PERCENTAGE") {
        // Even percentage discounts are represented as whole numbers (e.g. 10 => 0.10 => 10%)
        discountSubtract = shelfPrice * (discountValue / 100);
    } else if (discountType == "FIXED_VALUE") {
        // Fixed value discount is as is
        discountSubtract = discountValue;
    }
    const discountedSubtotal = (shelfPrice - discountSubtract) * quantity;
    return discountedSubtotal.toFixed(2);
}

export function calculateSubtotal(quantity: number, shelfPrice: number): string {
    const Subtotal = shelfPrice * quantity;
    return Subtotal.toFixed(2);
}
