import { createContext, useContext } from "react";
import type { BranchInventoryProduct } from "@buybuyin/shared/schema/branchInventory";

export type PosCartLine = { product: BranchInventoryProduct; quantity: number };
export type SeniorDiscountCustomer = { id: string; name: string };
export type SuspendedPosSale = {
    id: string;
    cart: PosCartLine[];
    seniorDiscountCustomer: SeniorDiscountCustomer | null;
    createdAt: string;
    amountDue: number;
};

export type PosContextValue = {
    cart: PosCartLine[];
    quantityProduct: BranchInventoryProduct | null;
    subtotal: number;
    discount: number;
    seniorDiscountCustomer: SeniorDiscountCustomer | null;
    searchInventory: (search: string) => Promise<BranchInventoryProduct[]>;
    addProduct: (product: BranchInventoryProduct) => void;
    setQuantityProduct: (product: BranchInventoryProduct | null) => void;
    setProductQuantity: (product: BranchInventoryProduct, quantity: number) => void;
    setSeniorDiscountCustomer: (customer: SeniorDiscountCustomer | null) => void;
    suspendedSales: SuspendedPosSale[];
    suspendCurrentSale: () => void;
    resumeSuspendedSale: (saleId: string) => void;
    voidProduct: (productId: number) => void;
    voidCurrentSale: () => void;
};

const PosContext = createContext<PosContextValue | null>(null);

export const PosProvider = PosContext.Provider;

export const usePos = (): PosContextValue => {
    const context = useContext(PosContext);
    if (!context) throw new Error("POS popup must be rendered inside PosProvider");
    return context;
};
