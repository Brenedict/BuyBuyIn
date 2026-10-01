// Shape of the HQ's current subscription plan
export interface SubscriptionPlan {
    planName: string;
    billingCycle: "MONTHLY" | "ANNUAL";
    nextBillingDate: string; // ISO date string, e.g. "2028-01-18"
    paymentMethod: string;
}

// Shape of a single branch's subscription row
export interface BranchSubscription {
    id: number;
    branchName: string;
    branchAddress: string;
    status: "active" | "inactive";
}

// Test data for the "HQ Current Plan" card
export const HQ_SUBSCRIPTION: SubscriptionPlan = {
    planName: "Enterprise Plan",
    billingCycle: "MONTHLY",
    nextBillingDate: "2028-01-18",
    paymentMethod: "Visa ending in 4562",
};

// Test data for the "Branch Subscription" table + stat cards
export const HQ_BRANCH_SUBSCRIPTIONS: BranchSubscription[] = [
    {
        id: 1,
        branchName: "Sta. Mesa, Manila",
        branchAddress: "PUP Main Campus",
        status: "active",
    },
    {
        id: 2,
        branchName: "Pasay",
        branchAddress: "G/F Mall of Asia, Seaside Blvd",
        status: "active",
    },
    {
        id: 3,
        branchName: "San Juan City",
        branchAddress: "2/F Greenhills Mall, Ortigas Ave, San Juan",
        status: "inactive",
    },
    {
        id: 4,
        branchName: "Pasig City",
        branchAddress: "Level 3, Estancia Mall, Capitol Commons, Pasig",
        status: "active",
    },
    {
        id: 5,
        branchName: "Quezon City",
        branchAddress: "UG/F SM North EDSA, EDSA cor. North Ave, Quezon City",
        status: "active",
    },
];