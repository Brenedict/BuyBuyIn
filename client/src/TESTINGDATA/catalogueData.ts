import { TABLE_CURRENT_STOCK_ITEMS, TABLE_OUT_OF_STOCK_ITEMS } from "./inventoryData";

export interface CatalogueProduct {
    productId: string;
    productName: string;
    category: string;
    basePrice: number;
    shelfPrice: number;
    supplier: string;
}

// NOTE:: For temporary dummy data lang
export const INVENTORY_SOURCE = [...TABLE_CURRENT_STOCK_ITEMS, ...TABLE_OUT_OF_STOCK_ITEMS];

export const CATALOGUE_PRODUCTS: CatalogueProduct[] = INVENTORY_SOURCE.filter(
    (item, index, items) => items.findIndex((other) => other.itemName === item.itemName) === index
).map((item) => ({
    productId: item.itemId,
    productName: item.itemName,
    category: item.category,
    basePrice: Math.round(item.unitPrice * 0.6 * 100) / 100,
    shelfPrice: item.unitPrice,
    supplier: item.supplier,
}));

export const CATALOGUE_CATEGORIES: string[] = Array.from(
    new Set(CATALOGUE_PRODUCTS.map((product) => product.category))
);
export const CATALOGUE_SUPPLIERS: string[] = Array.from(new Set(CATALOGUE_PRODUCTS.map((product) => product.supplier)));

export const CATALOGUE_SUMMARY = {
    totalProducts: CATALOGUE_PRODUCTS.length,
    totalCategories: CATALOGUE_CATEGORIES.length,
    totalSuppliers: CATALOGUE_SUPPLIERS.length,
    averageShelfPrice:
        Math.round(
            (CATALOGUE_PRODUCTS.reduce((total, product) => total + product.shelfPrice, 0) / CATALOGUE_PRODUCTS.length) *
                100
        ) / 100,
};
