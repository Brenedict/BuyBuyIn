// ==============================================================
/**
 * Description: The account registration page opened via the emailed verification link.
 * It lets the user set a new password for their not-yet-activated account.
 * (1) Shows the masked / locked email from the verified token.
 * (2) Collects the new and confirmation passwords, then submits them.
 */
// ==============================================================

// General Imports
import { Form, Link, useActionData, useLoaderData } from "react-router";

// Components
import { BuyBuyInWordmark } from "../../components/BuyBuyInWordmark";
import GeneralInput from "../../components/inputs/GeneralInput";
import PasswordInput from "../../components/inputs/PasswordInput";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";

// Routes
import { ROUTES } from "../../routes/Routes";

// Services
import {
    type AccountVerificationActionData,
    type AccountVerificationLoaderData,
} from "../../api/registrationService";

function AccountRegistration() {
    const loaderData = useLoaderData<AccountVerificationLoaderData>();
    const actionData = useActionData<AccountVerificationActionData>();

    const isLinkExpired = loaderData.isTokenExpired;

    return (
        <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-[#e4e2d4] px-4 py-10 sm:px-8">
            <div aria-hidden className="login-bg-left" />
            <div aria-hidden className="login-bg-right" />

            <div className="relative z-10 flex w-full max-w-[68rem] items-center justify-center">
                <section className="login-card relative z-[3] flex w-full max-w-[28rem] items-center overflow-hidden rounded-[1.75rem] px-8 py-10 sm:px-10">
                    <div aria-hidden className="login-card-spot" />
                    <div aria-hidden className="login-card-wash" />

                    <div className="relative z-20 flex w-full flex-col items-center gap-6">
                        <BuyBuyInWordmark className="w-[min(15rem,80%)] mb-2" />

                        {isLinkExpired ? (
                            <div className="flex w-full flex-col items-center gap-4 text-center">
                                <Text size="big" variant="black" weight="bold">
                                    Link Expired or Invalid
                                </Text>
                                <Text size="description" variant="slate-dark">
                                    {loaderData.message ||
                                        "This verification link is no longer valid. Please contact your administrator for a new one."}
                                </Text>
                                <Link
                                    to={ROUTES.AUTH}
                                    className="font-sans-flex text-small-description text-slate-dark underline underline-offset-2"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="flex w-full flex-col gap-1 text-center">
                                    <Text size="big" variant="crimson" weight="bold">
                                        Verify Your Account
                                    </Text>
                                    <Text size="description" variant="slate-dark">
                                        Set your password to activate your account.
                                    </Text>
                                </div>

                                <Form method="post" className="flex w-full flex-col gap-5">
                                    {/* Email (locked + masked) */}
                                    <GeneralInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        label="Registered Email"
                                        value={loaderData.email}
                                        disabled
                                        autoComplete="off"
                                        className="login-input"
                                    />

                                    {/* Set New Password */}
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        label="Set a New Password"
                                        autoComplete="new-password"
                                        placeholder="Enter new password"
                                        required
                                        className="login-input"
                                    />

                                    {/* Confirm New Password */}
                                    <PasswordInput
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        label="Confirm New Password"
                                        autoComplete="new-password"
                                        placeholder="Re-enter new password"
                                        required
                                        className="login-input"
                                    />

                                    {actionData?.error && (
                                        <span className="block text-xs text-crimson">{actionData.error}</span>
                                    )}

                                    <div className="mt-3 flex justify-center">
                                        <Button type="submit" variant="login">
                                            SET PASSWORD
                                        </Button>
                                    </div>
                                </Form>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default AccountRegistration;