import { useState } from "react";
import { Form } from "react-router";

import { BuyBuyInWordmark } from "../../components/BuyBuyInWordmark";
import PasswordInput from "../../components/inputs/PasswordInput";
import GeneralInput from "../../components/inputs/GeneralInput";
import { Button } from "../../components/Button";
import SelectInput from "../../components/inputs/SelectInput";

export function Login() {
    const [role, setRole] = useState("cashier");

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
                    <Form method="post" className="relative z-20 flex w-full flex-col gap-5">
                        <div className="w-full">
                            <label
                                htmlFor="email"
                                className="mb-2 block font-sans-flex text-normal font-bold text-crimson"
                            >
                                Email
                            </label>
                            <GeneralInput
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter Email"
                                required
                                className="login-input"
                            />
                        </div>

                        <div className="login-password w-full">
                            <label
                                htmlFor="password"
                                className="mb-2 block font-sans-flex text-normal font-bold text-crimson"
                            >
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
                            <label
                                htmlFor="role"
                                className="mb-2 block font-sans-flex text-normal font-bold text-crimson"
                            >
                                Role
                            </label>
                            <div className="relative">
                                <SelectInput
                                    id="role"
                                    name="role"
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                    defaultValue={role}
                                    options={{
                                        "Super Admin": "superadmin",
                                        "HQ Admin": "hqadmin",
                                        "Branch Manager": "branchmanager",
                                        Cashier: "cashier",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mt-3 flex flex-col items-center gap-4">
                            <Button type="submit" variant="login">
                                LOG IN
                            </Button>

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
                    </Form>
                </section>
            </div>
        </main>
    );
}

export default Login;
