// BuyBuyin Shared Imports
import type { BranchInventoryItemUncheckedCreateInput } from "@buybuyin/shared/prisma/models";

// ----------------------------- FIXTURES --------------------------------------------------

export const buildMockInventoryItem = (
    overrides: Partial<BranchInventoryItemUncheckedCreateInput> = {}
): BranchInventoryItemUncheckedCreateInput => ({
    quantity: 10,
    reorderThreshold: 5,
    ...overrides,
});
