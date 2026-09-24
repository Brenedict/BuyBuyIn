import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";

/* ---------- Types ---------- */

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

// Form fields are strings so inputs stay controlled and can be empty.
type PlanForm = {
    name: string;
    description: string;
    price: string;
    durationDays: string;
    cashiers: string;
    branchManagers: string;
    hqAdmins: string;
    branches: string;
};

type ModalState =
    | { type: 'none' }
    | { type: 'add' }
    | { type: 'edit'; plan: Plan }
    | { type: 'delete'; plan: Plan };

const EMPTY_FORM: PlanForm = {
    name: '',
    description: '',
    price: '',
    durationDays: '',
    cashiers: '',
    branchManagers: '',
    hqAdmins: '',
    branches: '',
};

// TODO: replace with the API helper in client/src/api once the endpoint exists,
// or with the mock data in client/src/TESTINGDATA.
const MOCK_PLANS: Plan[] = [
    { id: 1, name: 'Basic', description: 'Description', price: 1999, durationDays: 30, branches: 1, hqAdmins: 1, cashiers: 2, branchManagers: 2 },
    { id: 2, name: 'Pro', description: 'Description', price: 4999, durationDays: 30, branches: 5, hqAdmins: 5, cashiers: 10, branchManagers: 5 },
    { id: 3, name: 'Enterprise', description: 'Description', price: 8999, durationDays: 30, branches: 10, hqAdmins: 10, cashiers: 20, branchManagers: 10 },
];

/* ---------- Helpers ---------- */

function formatPrice(n: number) {
    return `₱ ${n.toLocaleString('en-PH')}`;
}

function formatDuration(days: number) {
    if (days === 30) return '/ mo';
    if (days === 365) return '/ yr';
    return `/ ${days} days`;
}

function planToForm(p: Plan): PlanForm {
    return {
        name: p.name,
        description: p.description,
        price: String(p.price),
        durationDays: String(p.durationDays),
        cashiers: String(p.cashiers),
        branchManagers: String(p.branchManagers),
        hqAdmins: String(p.hqAdmins),
        branches: String(p.branches),
    };
}

// Returns an error message, or null if valid. Every field is required per the design.
function validate(f: PlanForm): string | null {
    if (!f.name.trim()) return 'Package name is required.';
    if (!f.description.trim()) return 'Description is required.';
    const nums: [string, string][] = [
        ['Price', f.price],
        ['Duration', f.durationDays],
        ['Cashier limit', f.cashiers],
        ['Branch manager limit', f.branchManagers],
        ['HQ admin limit', f.hqAdmins],
        ['Branches', f.branches],
    ];
    for (const [label, v] of nums) {
        if (v.trim() === '' || Number.isNaN(Number(v)) || Number(v) < 0) {
            return `${label} must be a number, 0 or greater.`;
        }
    }
    if (Number(f.durationDays) < 1) return 'Duration must be at least 1 day.';
    if (Number(f.branches) < 1) return 'A plan must include at least 1 branch.';
    return null;
}

/* ---------- Local UI pieces ---------- */
// If the repo already has Modal / Input components, swap these out.

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        // Lock page scroll while the modal is open.
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    // Portal to <body> so parent overflow/transform can't clip or offset the modal.
    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
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

// Outlined button for Cancel / Delete-in-edit, per Figma. Swap for a Button variant if one exists.
function SecondaryButton({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full rounded-lg border border-gray-800 bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-black/5"
        >
            {children}
        </button>
    );
}

function Field({
    label,
    required = true,
    ...input
}: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <label className="flex flex-col gap-1 text-sm">
            <span>
                {label} {required && <span className="text-red-600">*</span>}
            </span>
            <input
                {...input}
                className="rounded-lg border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-[#c93a23]"
            />
        </label>
    );
}

/* ---------- Plan form (shared by Add and Edit) ---------- */

function PlanFormModal({
    mode,
    initial,
    onClose,
    onSave,
    onDelete,
}: {
    mode: 'add' | 'edit';
    initial: PlanForm;
    onClose: () => void;
    onSave: (f: PlanForm) => void;
    onDelete?: () => void;
}) {
    const [form, setForm] = useState<PlanForm>(initial);
    const [error, setError] = useState<string | null>(null);

    const set = (k: keyof PlanForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [k]: e.target.value }));

    const submit = () => {
        const err = validate(form);
        setError(err);
        if (!err) onSave(form);
    };

    return (
        <Modal title={mode === 'add' ? 'Add New Plan' : 'Edit Plan'} onClose={onClose}>
            <div className="flex flex-col gap-3">
                <Field label="Package Name" placeholder="Enter Plan Name" value={form.name} onChange={set('name')} />
                <Field label="Description" placeholder="Short description about the plan" value={form.description} onChange={set('description')} />

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Price" type="number" min={0} placeholder="₱0.00" value={form.price} onChange={set('price')} />
                    <Field label="Duration" type="number" min={1} placeholder="Number of days" value={form.durationDays} onChange={set('durationDays')} />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold">
                        Base Account Limit <span className="text-red-600">*</span>
                    </span>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Field label="Cashier" required={false} type="number" min={0} placeholder="Number of cashier" value={form.cashiers} onChange={set('cashiers')} />
                        <Field label="Branch Manager" required={false} type="number" min={0} placeholder="Number of Branch Manager" value={form.branchManagers} onChange={set('branchManagers')} />
                        {/* Not in the Figma form, but the plan cards display it. Remove if intentionally excluded. */}
                        <Field label="HQ Admin" required={false} type="number" min={0} placeholder="Number of HQ Admin" value={form.hqAdmins} onChange={set('hqAdmins')} />
                    </div>
                </div>

                <Field label="Branches Included" type="number" min={1} placeholder="Number of Branches" value={form.branches} onChange={set('branches')} />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="grid grid-cols-2 gap-4">
                    {/* Figma: Add has Cancel, Edit has Delete in the same slot */}
                    {mode === 'add' ? (
                        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    ) : (
                        <SecondaryButton onClick={onDelete}>Delete</SecondaryButton>
                    )}
                    <Button onClick={submit}>Save</Button>
                </div>
            </div>
        </Modal>
    );
}

/* ---------- Page ---------- */

export function SuperAdmin_Plans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<ModalState>({ type: 'none' });

    useEffect(() => {
        // TODO: swap for real fetch, e.g. getPlans().then(setPlans)
        setPlans(MOCK_PLANS);
        setLoading(false);
    }, []);

    const close = () => setModal({ type: 'none' });

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
    const handleAdd = (f: PlanForm) => {
        const nextId = plans.reduce((max, p) => Math.max(max, p.id), 0) + 1;
        setPlans((prev) => [...prev, toPlan(f, nextId)]);
        close();
    };

    const handleEdit = (id: number, f: PlanForm) => {
        setPlans((prev) => prev.map((p) => (p.id === id ? toPlan(f, id) : p)));
        close();
    };

    const handleDelete = (id: number) => {
        setPlans((prev) => prev.filter((p) => p.id !== id));
        close();
    };

    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <h1 className="text-4xl font-bold text-[#c93a23] [text-shadow:0_4px_8px_rgba(0,0,0,0.15)]">
                    Plans
                </h1>

                <Card>
                    <Card.Body className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-[#c93a23]">Subscriptions</h2>
                            <Button onClick={() => setModal({ type: 'add' })}>Add Plan</Button>
                        </div>

                        {loading ? (
                            <Text>Loading plans…</Text>
                        ) : plans.length === 0 ? (
                            <Text>No plans yet. Click “Add Plan” to create one.</Text>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {plans.map((plan) => (
                                    <Card key={plan.id}>
                                        <Card.Body className="flex min-h-[26rem] flex-col gap-3">
                                            <h3 className="text-[22px] text-[#7a2214]">{plan.name}</h3>
                                            <p className="text-[9px] text-[#2b1a16]">{plan.description}</p>
                                            <p className="font-mono text-3xl font-bold text-[#2b1a16]">
                                                {formatPrice(plan.price)}{' '}
                                                <span className="text-base font-normal">{formatDuration(plan.durationDays)}</span>
                                            </p>
                                            <p className="text-[9px] text-[#2b1a16]">Get Started With:</p>
                                            <ul className="flex flex-col gap-2 text-[15px] text-[#2b1a16]">
                                                <li>✓ {plan.branches === 1 ? '1 Branch' : `Up to ${plan.branches} Branches`}</li>
                                                <li>✓ {plan.hqAdmins} HQ Admin</li>
                                                <li>✓ {plan.cashiers} Cashier</li>
                                                <li>✓ {plan.branchManagers} Branch Manager</li>
                                            </ul>
                                            <div className="mt-auto">
                                                <Button onClick={() => setModal({ type: 'edit', plan })}>Edit</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Card.Body>

            {modal.type === 'add' && (
                <PlanFormModal mode="add" initial={EMPTY_FORM} onClose={close} onSave={handleAdd} />
            )}

            {modal.type === 'edit' && (
                <PlanFormModal
                    mode="edit"
                    initial={planToForm(modal.plan)}
                    onClose={close}
                    onSave={(f) => handleEdit(modal.plan.id, f)}
                    onDelete={() => setModal({ type: 'delete', plan: modal.plan })}
                />
            )}

            {modal.type === 'delete' && (
                <Modal title="Delete Subscription Plan" onClose={close}>
                    <div className="flex flex-col gap-6">
                        <p className="text-center">
                            Are you sure you want to delete this subscription plan?
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <SecondaryButton onClick={close}>Cancel</SecondaryButton>
                            <Button onClick={() => handleDelete(modal.plan.id)}>Delete</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </Card>
    );
}

export default SuperAdmin_Plans;