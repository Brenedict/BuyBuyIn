import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Outlet } from "react-router";

// Temp Types
import type { Plan, PlanForm } from "../../components/popups/super-admins/PlansPopups";

// Test Data
import { MOCK_PLANS } from "../../TESTINGDATA/subscriptionPlans";
import useNavigatePage from "../../hooks/useNavigatePage";
import { ROUTES } from "../../routes/Routes";

type ModalState = { type: "none" } | { type: "add" } | { type: "edit"; plan: Plan } | { type: "delete"; plan: Plan };

const EMPTY_FORM: PlanForm = {
    name: "",
    description: "",
    price: "",
    durationDays: "",
    cashiers: "",
    branchManagers: "",
    hqAdmins: "",
    branches: "",
};

/* ---------- Helpers ---------- */

function formatPrice(n: number) {
    return `₱ ${n.toLocaleString("en-PH")}`;
}

function formatDuration(days: number) {
    if (days === 30) return "/ mo";
    if (days === 365) return "/ yr";
    return `/ ${days} days`;
}

// Returns an error message, or null if valid. Every field is required per the design.
function validate(f: PlanForm): string | null {
    if (!f.name.trim()) return "Package name is required.";
    if (!f.description.trim()) return "Description is required.";
    const nums: [string, string][] = [
        ["Price", f.price],
        ["Duration", f.durationDays],
        ["Cashier limit", f.cashiers],
        ["Branch manager limit", f.branchManagers],
        ["HQ admin limit", f.hqAdmins],
        ["Branches", f.branches],
    ];
    for (const [label, v] of nums) {
        if (v.trim() === "" || Number.isNaN(Number(v)) || Number(v) < 0) {
            return `${label} must be a number, 0 or greater.`;
        }
    }
    if (Number(f.durationDays) < 1) return "Duration must be at least 1 day.";
    if (Number(f.branches) < 1) return "A plan must include at least 1 branch.";
    return null;
}

/* ---------- Local UI pieces ---------- */
// If the repo already has Modal / Input components, swap these out.

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        // Lock page scroll while the modal is open.
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    // Portal to <body> so parent overflow/transform can't clip or offset the modal.
    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#fffbee] shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex shrink-0 items-center justify-between bg-[#c93a23] px-6 py-4 text-white">
                    <span className="text-xl font-bold">{title}</span>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="rounded-md border border-white/40 px-2 text-lg leading-6"
                    >
                        ×
                    </button>
                </div>
                <div className="overflow-y-auto p-6">{children}</div>
            </div>
        </div>,
        document.body
    );
}

/* ---------- Page ---------- */

export function SuperAdmin_Plans() {
    // Used for redirecting
    const useNavigate = useNavigatePage();

    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: swap for real fetch, e.g. getPlans().then(setPlans)
        setPlans(MOCK_PLANS);
        setLoading(false);
    }, []);

    const toPlan = (f: PlanForm, id: number): Plan => ({
        id,
        name: f.name.trim(),
        description: f.description.trim(),
        price: Number(f.price),
        durationDays: Number(f.durationDays),
        cashiers: Number(f.cashiers),
        branchManagers: Number(f.branchManagers),
        hqAdmins: Number(f.hqAdmins),
        branches: Number(f.branches),
    });

    // TODO: each handler should call the API first, then update state on success.
    const handleAdd = () => {
        useNavigate(ROUTES.SUPER_ADMIN.plansAdd);
    };

    const handleEdit = (id: string) => {
        useNavigate(ROUTES.SUPER_ADMIN.plansEdit(id));
    };

    const handleDelete = (id: string) => {
        useNavigate(ROUTES.SUPER_ADMIN.plansDelete(id));
    };

    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <h1 className="text-4xl font-bold text-[#c93a23] [text-shadow:0_4px_8px_rgba(0,0,0,0.15)]">Plans</h1>

                <Card>
                    <Card.Body className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-[#c93a23]">Subscriptions</h2>
                            <Button onClick={handleAdd}>Add Plan</Button>
                        </div>

                        {loading ? (
                            <Text>Loading plans…</Text>
                        ) : plans.length === 0 ? (
                            <Text>No plans yet. Click “Add Plan” to create one.</Text>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {plans.map((plan) => (
                                    <Card key={plan.id}>
                                        <Card.Body className="flex flex-col gap-3">
                                            <h3 className="text-[22px] text-[#7a2214]">{plan.name}</h3>
                                            <p className="text-[9px] text-[#2b1a16]">{plan.description}</p>
                                            <p className="font-mono text-3xl font-bold text-[#2b1a16]">
                                                {formatPrice(plan.price)}{" "}
                                                <span className="text-base font-normal">
                                                    {formatDuration(plan.durationDays)}
                                                </span>
                                            </p>
                                            <p className="text-[9px] text-[#2b1a16]">Get Started With:</p>
                                            <ul className="flex flex-col gap-2 text-[15px] text-[#2b1a16]">
                                                <li>
                                                    ✓{" "}
                                                    {plan.branches === 1
                                                        ? "1 Branch"
                                                        : `Up to ${plan.branches} Branches`}
                                                </li>
                                                <li>✓ {plan.hqAdmins} HQ Admin</li>
                                                <li>✓ {plan.cashiers} Cashier</li>
                                                <li>✓ {plan.branchManagers} Branch Manager</li>
                                            </ul>
                                            <div className="flex gap-4">
                                                <Button
                                                    className="flex-1"
                                                    onClick={() => handleEdit(String(plan.id))}
                                                    variant="secondary"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    className="flex-1"
                                                    onClick={() => handleDelete(String(plan.id))}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Card.Body>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </Card>
    );
}

export default SuperAdmin_Plans;
