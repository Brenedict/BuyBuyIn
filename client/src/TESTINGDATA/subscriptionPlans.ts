type Plan = {
    id: number;
    name: string;
    description: string;
    price: number;
    durationDays: number;
    branches: number;
    hqAdmins: number;
    cashiers: number;
    branchManagers: number;
};

export const MOCK_PLANS: Plan[] = [
    {
        id: 1,
        name: "Basic",
        description: "Description",
        price: 1999,
        durationDays: 30,
        branches: 1,
        hqAdmins: 1,
        cashiers: 2,
        branchManagers: 2,
    },
    {
        id: 2,
        name: "Pro",
        description: "Description",
        price: 4999,
        durationDays: 30,
        branches: 5,
        hqAdmins: 5,
        cashiers: 10,
        branchManagers: 5,
    },
    {
        id: 3,
        name: "Enterprise",
        description: "Description",
        price: 8999,
        durationDays: 30,
        branches: 10,
        hqAdmins: 10,
        cashiers: 20,
        branchManagers: 10,
    },
];
