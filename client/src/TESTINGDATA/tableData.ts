export const TABLE_SAMPLE_USERS = [
    ...[...Array(10)].flatMap(() => [
        {
            name: "Benidict",
            contact: "09123456789",
            role: "Manager",
            branch: "Branch North, Manila",
            status: "Active",
        },
        {
            name: "Kenken",
            contact: "09223456789",
            role: "Cashier",
            branch: "Branch South, Quezon",
            status: "Active",
        },
        {
            name: "Romir",
            contact: "09323456789",
            role: "Supervisor",
            branch: "Branch East, Makati",
            status: "Inactive",
        },
        {
            name: "Richbert",
            contact: "09423456789",
            role: "Cashier",
            branch: "Branch West, Pasay",
            status: "Active",
        },
        {
            name: "Mark",
            contact: "09523456789",
            role: "Manager",
            branch: "Branch North, Manila",
            status: "Active",
        },
        {
            name: "Zyryl",
            contact: "09623456789",
            role: "Cashier",
            branch: "Branch South, Quezon",
            status: "Pending",
        },
    ]),
];
