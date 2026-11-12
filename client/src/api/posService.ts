import type { BranchInventoryListResponse, BranchInventoryProduct } from "@buybuyin/shared/schema/branchInventory";
import type { TransactionFormCreateType } from "@buybuyin/shared/schema/transaction";
import { apiJson } from "./actionService";

export type PosTransactionResponse = {
    transaction: {
        id: number;
        totalPrice: number;
    };
    message: string;
};

const readError = async (response: Response, fallback: string): Promise<Error> => {
    try {
        const body = await response.json();
        return new Error(typeof body.error === "string" ? body.error : fallback);
    } catch {
        return new Error(fallback);
    }
};

export const searchPosInventory = async (search: string): Promise<BranchInventoryProduct[]> => {
    const query = new URLSearchParams({ search, page: "1", limit: "100" });
    const response = await apiJson(`/branch-inventory?${query}`, { method: "GET" });

    if (!response.ok) {
        throw await readError(response, "Unable to search this branch's inventory.");
    }

    const inventory: BranchInventoryListResponse = await response.json();
    return inventory.items.filter((item) => item.quantity > 0).map((item) => item.product);
};

export const createPosTransaction = async (
    transaction: TransactionFormCreateType
): Promise<PosTransactionResponse> => {
    const response = await apiJson("/transaction", {
        method: "POST",
        body: JSON.stringify(transaction),
    });

    if (!response.ok) {
        throw await readError(response, "Unable to complete this transaction.");
    }

    return response.json();
};