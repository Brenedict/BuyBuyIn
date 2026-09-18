export const TABLE_BRANCHES = [
    ...[...Array(10)].flatMap(() => [
        {
            branchId: "7a2b9c8de12f-4a3b-8c5d-9e6f1a2b3c4d",
            location: "Sta. Mesa, Manila",
            subLocation: "PUP Main Campus",
            employees: 14,
            totalSales: 72300,
        },
        {
            branchId: "1f2e3d4c-5b6a-7b8c-9d0e-1f2e3d4c5b6a",
            location: "Pasay",
            subLocation: "G/F Mall of Asia, Seaside Blvd",
            employees: 22,
            totalSales: 64800,
        },
        {
            branchId: "a1b2c3d4e5f6-7a8b-9c0d-e1f2a3b4c5d6",
            location: "San Juan City",
            subLocation: "2/F Greenhills Mall, Ortigas Ave., San Juan",
            employees: 12,
            totalSales: 43100,
        },
        {
            branchId: "9f8e7d6c-5b4a-3f2e-1d0c-9f8e7d6c5b4a",
            location: "Pasig City",
            subLocation: "Level 3, Estancia Mall, Capitol Commons, Pasig",
            employees: 18,
            totalSales: 88650,
        },
        {
            branchId: "b2c3d4e5f6a7-8b9c-0d1e-2f3a4b5c6d7e",
            location: "Quezon City",
            subLocation: "UG/F SM North EDSA, EDSA cor. North Ave, Quezon City",
            employees: 26,
            totalSales: 115400,
        },
    ]),
];

export const SALES_OVERVIEW_LABELS = ["Sta. Mesa", "Pasay", "San Juan", "Pasig", "Quezon City"];

export const SALES_OVERVIEW_DATA = [72300, 64800, 43100, 88650, 115400];

export const PERFORMANCE_LABELS = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM"];

export const PERFORMANCE_DATA = [
    {
        label: "Sta. Mesa",
        data: [650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 150, 100],
        borderColor: "#8a9a7b",
        backgroundColor: "#8a9a7b",
    },
    {
        label: "Pasay",
        data: [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650],
        borderColor: "#7a1f2b",
        backgroundColor: "#7a1f2b",
    },
    {
        label: "San Juan",
        data: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],
        borderColor: "#5a9bc4",
        backgroundColor: "#5a9bc4",
    },
    {
        label: "Pasig",
        data: [300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850],
        borderColor: "#d4a9a9",
        backgroundColor: "#d4a9a9",
    },
    {
        label: "Quezon City",
        data: [400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950],
        borderColor: "#a0522d",
        backgroundColor: "#a0522d",
    },
];

export const INTER_BRANCH_PERFORMANCE_LABELS = PERFORMANCE_LABELS;

export const INTER_BRANCH_PERFORMANCE_DATA = [3000, 3500, 4000, 7000, 6500, 5000, 4500, 5500, 5000, 6000, 11000, 8500];

export const BRANCH_LEGEND = [
    { name: "Sta. Mesa", color: "#8a9a7b" },
    { name: "Pasay", color: "#7a1f2b" },
    { name: "San Juan", color: "#5a9bc4" },
    { name: "Pasig", color: "#d4a9a9" },
    { name: "Quezon City", color: "#a0522d" },
];
