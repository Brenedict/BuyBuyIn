export interface InventoryItem {
    itemId: string;
    sku: string;
    itemName: string;
    category: string;
    stockLevel: number;
    reorderThreshold: number;
    unitPrice: number;
    supplier: string;
}

export interface Supplier {
    supplierId: string;
    supplierName: string;
    contactPerson: string;
    contactNumber: string;
    email: string;
    address: string;
}

export const INVENTORY_SUMMARY = {
    totalItems: 248,
    totalCategories: 6,
    totalStockValue: 123456,
    lowStockCount: 14,
    outOfStockCount: 10,
};

export const TABLE_OUT_OF_STOCK_ITEMS: InventoryItem[] = [
    {
        itemId: "oos-001",
        sku: "SKU-0002",
        itemName: "Ballpen Black (Box/12)",
        category: "General",
        stockLevel: 0,
        reorderThreshold: 10,
        unitPrice: 72.0,
        supplier: "OfficeWorld PH",
    },
    {
        itemId: "oos-002",
        sku: "SKU-APP-003",
        itemName: "Classic Cotton Crewneck (Black - M)",
        category: "T-Shirts",
        stockLevel: 0,
        reorderThreshold: 50,
        unitPrice: 399.0,
        supplier: "Taytay Garments Co.",
    },
    {
        itemId: "oos-003",
        sku: "SKU-APP-042",
        itemName: "Slim Fit Denim Jeans (Dark Wash - 32)",
        category: "Jeans",
        stockLevel: 0,
        reorderThreshold: 20,
        unitPrice: 1299.0,
        supplier: "Manila Textile Distributors",
    },
    {
        itemId: "oos-004",
        sku: "SKU-APP-088",
        itemName: "Oversized Streetwear Hoodie (Sage - L)",
        category: "Hoodies",
        stockLevel: 0,
        reorderThreshold: 15,
        unitPrice: 1499.0,
        supplier: "Vivas Apparel Manufacturing",
    },
    {
        itemId: "oos-005",
        sku: "SKU-APP-115",
        itemName: "Floral Summer Midi Dress (Pastel - S)",
        category: "Dresses",
        stockLevel: 0,
        reorderThreshold: 15,
        unitPrice: 899.0,
        supplier: "Island Styles Garments",
    },
];

// Current Stock Levels Table Data
export const TABLE_CURRENT_STOCK_ITEMS: InventoryItem[] = [
    {
        itemId: "stk-001",
        sku: "SKU-0001",
        itemName: "Thermal Receipt Paper 80mm",
        category: "Printing",
        stockLevel: 144,
        reorderThreshold: 30,
        unitPrice: 48.0,
        supplier: "Printex PH",
    },
    {
        itemId: "stk-002",
        sku: "SKU-0002",
        itemName: "Ballpen Black (Box/12)",
        category: "General",
        stockLevel: 0,
        reorderThreshold: 10,
        unitPrice: 72.0,
        supplier: "OfficeWorld PH",
    },
    {
        itemId: "stk-003",
        sku: "SKU-APP-012",
        itemName: "Premium Pique Polo Shirt (Navy - L)",
        category: "Polo Shirts",
        stockLevel: 18,
        reorderThreshold: 25,
        unitPrice: 599.0,
        supplier: "Taytay Garments Co.",
    },
    {
        itemId: "stk-004",
        sku: "SKU-APP-154",
        itemName: "Performance Jogger Pants (Charcoal - M)",
        category: "Activewear",
        stockLevel: 85,
        reorderThreshold: 20,
        unitPrice: 799.0,
        supplier: "Vivas Apparel Manufacturing",
    },
    {
        itemId: "stk-005",
        sku: "SKU-APP-162",
        itemName: "Athletic Mesh Gym Shorts (Black - XL)",
        category: "Activewear",
        stockLevel: 12,
        reorderThreshold: 30,
        unitPrice: 450.0,
        supplier: "Vivas Apparel Manufacturing",
    },
    {
        itemId: "stk-006",
        sku: "SKU-APP-201",
        itemName: "Knitted Crop Cardigan (Beige - FS)",
        category: "Jackets",
        stockLevel: 62,
        reorderThreshold: 15,
        unitPrice: 699.0,
        supplier: "Island Styles Garments",
    },
    {
        itemId: "stk-007",
        sku: "SKU-APP-234",
        itemName: "Canvas Tote Bag (Eco Cream)",
        category: "Accessories",
        stockLevel: 110,
        reorderThreshold: 40,
        unitPrice: 250.0,
        supplier: "Manila Textile Distributors",
    },
    {
        itemId: "stk-008",
        sku: "SKU-APP-055",
        itemName: "High-Waisted Denim Shorts (Light Wash - 28)",
        category: "Shorts",
        stockLevel: 40,
        reorderThreshold: 20,
        unitPrice: 699.0,
        supplier: "Manila Textile Distributors",
    },
    {
        itemId: "stk-009",
        sku: "SKU-APP-004",
        itemName: "Classic Cotton Crewneck (White - L)",
        category: "T-Shirts",
        stockLevel: 120,
        reorderThreshold: 50,
        unitPrice: 399.0,
        supplier: "Taytay Garments Co.",
    },
    {
        itemId: "stk-010",
        sku: "SKU-APP-099",
        itemName: "Waterproof Windbreaker Jacket (Navy - M)",
        category: "Jackets",
        stockLevel: 5,
        reorderThreshold: 15,
        unitPrice: 1899.0,
        supplier: "Vivas Apparel Manufacturing",
    },
];

// Suppliers Table Data
export const TABLE_SUPPLIERS: Supplier[] = [
    {
        supplierId: "sup-001",
        supplierName: "OfficeWorld PH",
        contactPerson: "John Doe",
        contactNumber: "09817929146",
        email: "restock@officeworldph.net",
        address: "123 Ayala Avenue, Makati City, Metro Manila, 1226",
    },
    {
        supplierId: "sup-002",
        supplierName: "Printex PH",
        contactPerson: "Jane Doe",
        contactNumber: "09957222447",
        email: "order@printexph.com",
        address: "45 Quezon Avenue, Diliman, Quezon City, 1101",
    },
    {
        supplierId: "sup-003",
        supplierName: "Taytay Garments Co.",
        contactPerson: "Mateo Santos",
        contactNumber: "09175558899",
        email: "b2b@taytaygarments.ph",
        address: "Block 4, Lot 12, Kadalagahan St., Taytay, Rizal, 1920",
    },
    {
        supplierId: "sup-004",
        supplierName: "Manila Textile Distributors",
        contactPerson: "Sofia Reyes",
        contactNumber: "09183334455",
        email: "wholesale@manilatextile.com",
        address: "842 Juan Luna St., Binondo, Manila, 1006",
    },
    {
        supplierId: "sup-005",
        supplierName: "Vivas Apparel Manufacturing",
        contactPerson: "Carlos Vivas",
        contactNumber: "09227776611",
        email: "factory@vivasapparel.com.ph",
        address: "12 Industrial Highway, Bagumbayan, Taguig City, 1630",
    },
];