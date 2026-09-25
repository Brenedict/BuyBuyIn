import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { BuyBuyInWordmark } from "../../components/BuyBuyInWordmark";
import { BaseInput } from "../../components/inputs/BaseInput";
import PasswordInput from "../../components/inputs/PasswordInput";
import { ROUTES } from "../../routes/Routes";

const ROLE_OPTIONS = [
    { value: "cashier", label: "Cashier", path: ROUTES.CASHIER.dashboard },
    { value: "branch-manager", label: "Branch Manager", path: ROUTES.BRANCH_MANAGER.dashboard },
    { value: "hq-admin", label: "HQ Admin", path: ROUTES.HQ_ADMIN.dashboard },
    { value: "super-admin", label: "Super Admin", path: ROUTES.SUPER_ADMIN.plans },
] as const;

export function Login() {
    const navigate = useNavigate();
    const [role, setRole] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const selected = ROLE_OPTIONS.find((option) => option.value === role);
        if (selected) {
            navigate(selected.path);
        }
    };

    return (
        <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-[#e4e2d4] px-4 py-10 sm:px-8">
            <div aria-hidden className="login-bg-left" />
            <div aria-hidden className="login-bg-right" />

            <div className="relative z-10 flex w-full max-w-[68rem] flex-col items-center gap-6 overflow-hidden lg:block lg:h-[32rem] lg:rounded-[2rem]">
                <section className="login-panel relative z-[2] hidden h-full items-center overflow-hidden rounded-[2rem] lg:flex lg:w-[64%]">
                    <div className="relative z-20 flex h-full w-[78%] items-center justify-center px-6">
                        <BuyBuyInWordmark className="w-[min(25rem,92%)] translate-x-6 -translate-y-10" />
                    </div>
                </section>

                <div aria-hidden className="login-mover" />

                <BuyBuyInWordmark className="relative z-20 mb-2 w-[min(23rem,92vw)] lg:hidden" />

                <section className="login-card relative z-[3] flex w-full max-w-[26.5rem] items-center overflow-hidden rounded-[1.75rem] px-8 py-8 sm:px-10 lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-[50%] lg:max-w-none">
                    <div aria-hidden className="login-card-spot" />
                    <div aria-hidden className="login-card-wash" />
                    <form className="relative z-20 flex w-full flex-col gap-5" onSubmit={handleSubmit}>
                        <div className="w-full">
                            <label htmlFor="username" className="mb-2 block font-sans-flex text-normal font-bold text-crimson">
                                Username
                            </label>
                            <BaseInput
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                placeholder="Enter Username"
                                required
                                className="login-input"
                            />
                        </div>

                        <div className="login-password w-full">
                            <label htmlFor="password" className="mb-2 block font-sans-flex text-normal font-bold text-crimson">
                                Password
                            </label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                placeholder="Enter Password"
                                required
                                className="login-input"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="role" className="mb-2 block font-sans-flex text-normal font-bold text-crimson">
                                Role
                            </label>
                            <div className="relative">
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    value={role}
                                    onChange={(event) => setRole(event.target.value)}
                                    className={`login-input w-full appearance-none pr-12 text-medium font-regular ${role ? "text-black" : "text-slate-medium"}`}
                                >
                                    <option value="" disabled>
                                        -- Role --
                                    </option>
                                    {ROLE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[0.3rem] bg-crimson text-cream">
                                    <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-col items-center gap-4">
                            <button type="submit" className="login-submit">
                                LOG IN
                            </button>

                            <div className="text-center font-sans-flex text-small-description text-slate-dark">
                                <a href="#forgot-password" className="underline underline-offset-2">
                                    Forgot Password?
                                </a>
                                <br />
                                <a href="#help" className="underline underline-offset-2">
                                    Help?
                                </a>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default Login;
