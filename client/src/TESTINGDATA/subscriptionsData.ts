
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
    {
        id: 6,
        branchName: "Makati City",
        branchAddress: "2/F Glorietta 4, Ayala Center, Makati",
        status: "active",
    },
    {
        id: 7,
        branchName: "Taguig City",
        branchAddress: "B1/F Market! Market!, McKinley Pkwy, Taguig",
        status: "active",
    },
    {
        id: 8,
        branchName: "Mandaluyong City",
        branchAddress: "3/F SM Megamall, Ortigas Center, Mandaluyong",
        status: "inactive",
    },
    {
        id: 9,
        branchName: "Caloocan City",
        branchAddress: "2/F Victory Central Mall, Rizal Ave, Caloocan",
        status: "active",
    },
    {
        id: 10,
        branchName: "Marikina City",
        branchAddress: "Level 2, Riverbanks Center, Marikina",
        status: "active",
    },
    {
        id: 11,
        branchName: "Parañaque City",
        branchAddress: "2/F SM City BF Parañaque, Dr. A Santos Ave",
        status: "inactive",
    },
    {
        id: 12,
        branchName: "Las Piñas City",
        branchAddress: "2/F SM Southmall, Alabang-Zapote Road, Las Piñas",
        status: "active",
    },
];

export const SAMPLE_BUSINESS_SUBSCRIPTIONS = Array.from({ length: 30 }, (_, i) => ({
    id: `mock-${i}`,
    businessSubscriptionLabel: "Santos, Maria",
    businessLabel: "Santos, Maria",
    statusLabel: "Santos, Maria",
}));

