export interface PopupTransaction {
    transactionNo: string;
    amount: string;
    name: string;
}

export const TABLE_SUSPENDED_TRANSACTIONS: PopupTransaction[] = [
    {
        transactionNo: "#000000001",
        amount: "1,598.00",
        name: "Gab",
    },
    {
        transactionNo: "#000000002",
        amount: "2,397.00",
        name: "Rhomer",
    },
    {
        transactionNo: "#000000003",
        amount: "1,198.00",
        name: "Mark",
    },
];

export const TABLE_PREVIOUS_TRANSACTIONS: PopupTransaction[] = [
    {
        transactionNo: "RCP-PSG-0412",
        amount: "1,998.00",
        name: "Gab",
    },
    {
        transactionNo: "RCP-PSG-0413",
        amount: "2,397.00",
        name: "Rhomer",
    },
    {
        transactionNo: "RCP-PSG-0414",
        amount: "1,299.00",
        name: "Mark",
    },
];

export interface PopupItem {
    itemCode: string;
    itemName: string;
    retailPrice: string;
    wholesalePrice: string;
}

export const TABLE_POPUP_ITEMS: PopupItem[] = [
    {
        itemCode: "SKU-APP-003",
        itemName: "Classic Cotton Crewneck (Black - M)",
        retailPrice: "399.00",
        wholesalePrice: "180.00",
    },
    {
        itemCode: "SKU-APP-004",
        itemName: "Classic Cotton Crewneck (White - L)",
        retailPrice: "399.00",
        wholesalePrice: "180.00",
    },
    {
        itemCode: "SKU-APP-012",
        itemName: "Premium Pique Polo Shirt (Navy - L)",
        retailPrice: "599.00",
        wholesalePrice: "280.00",
    },
    {
        itemCode: "SKU-APP-088",
        itemName: "Oversized Streetwear Hoodie (Sage - L)",
        retailPrice: "1,499.00",
        wholesalePrice: "650.00",
    },
    {
        itemCode: "SKU-APP-162",
        itemName: "Athletic Mesh Gym Shorts (Black - XL)",
        retailPrice: "450.00",
        wholesalePrice: "200.00",
    },
    {
        itemCode: "SKU-APP-055",
        itemName: "High-Waisted Denim Shorts (Light Wash - 28)",
        retailPrice: "699.00",
        wholesalePrice: "320.00",
    },
    {
        itemCode: "SKU-APP-021",
        itemName: "Slim Fit Chino Pants (Khaki - 32)",
        retailPrice: "899.00",
        wholesalePrice: "420.00",
    },
    {
        itemCode: "SKU-APP-022",
        itemName: "Slim Fit Chino Pants (Navy - 34)",
        retailPrice: "899.00",
        wholesalePrice: "420.00",
    },
    {
        itemCode: "SKU-APP-031",
        itemName: "Linen Button-Up Shirt (White - M)",
        retailPrice: "749.00",
        wholesalePrice: "340.00",
    },
    {
        itemCode: "SKU-APP-037",
        itemName: "Graphic Print Tee (Black - L)",
        retailPrice: "349.00",
        wholesalePrice: "150.00",
    },
    {
        itemCode: "SKU-APP-041",
        itemName: "Zip-Up Windbreaker (Olive - L)",
        retailPrice: "1,199.00",
        wholesalePrice: "540.00",
    },
    {
        itemCode: "SKU-APP-047",
        itemName: "Fleece Jogger Pants (Gray - M)",
        retailPrice: "649.00",
        wholesalePrice: "300.00",
    },
    {
        itemCode: "SKU-APP-052",
        itemName: "Ribbed Tank Top (White - S)",
        retailPrice: "249.00",
        wholesalePrice: "110.00",
    },
    {
        itemCode: "SKU-APP-060",
        itemName: "Pleated Midi Skirt (Black - M)",
        retailPrice: "799.00",
        wholesalePrice: "360.00",
    },
    {
        itemCode: "SKU-APP-066",
        itemName: "Cropped Cardigan (Cream - M)",
        retailPrice: "899.00",
        wholesalePrice: "410.00",
    },
    {
        itemCode: "SKU-APP-072",
        itemName: "Relaxed Fit Jeans (Dark Wash - 32)",
        retailPrice: "1,099.00",
        wholesalePrice: "500.00",
    },
    {
        itemCode: "SKU-APP-079",
        itemName: "Long Sleeve Thermal Shirt (Gray - L)",
        retailPrice: "499.00",
        wholesalePrice: "220.00",
    },
    {
        itemCode: "SKU-APP-094",
        itemName: "Canvas Bucket Hat (Beige - Free Size)",
        retailPrice: "299.00",
        wholesalePrice: "130.00",
    },
    {
        itemCode: "SKU-APP-101",
        itemName: "Crew Socks 3-Pack (White - Free Size)",
        retailPrice: "199.00",
        wholesalePrice: "85.00",
    },
    {
        itemCode: "SKU-APP-115",
        itemName: "Leather Belt (Brown - 34)",
        retailPrice: "549.00",
        wholesalePrice: "250.00",
    },
];
