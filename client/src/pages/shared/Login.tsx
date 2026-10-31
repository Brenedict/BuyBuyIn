// General Imports
import { useEffect, useState } from "react";
import { Form, useSearchParams } from "react-router";

// Components
import { BuyBuyInWordmark } from "../../components/BuyBuyInWordmark";
import PasswordInput from "../../components/inputs/PasswordInput";
import GeneralInput from "../../components/inputs/GeneralInput";
import { Button } from "../../components/Button";
import { LoginNotifPopup } from "../../components/popups/global/AccountPopups";

// MAIN COMPONENT
export function Login() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loginNotif, setloginNotif] = useState<string>("");
    const [notifModalOpen, setNotifModalOpen] = useState(false);

    useEffect(() => {
        const statusKey = searchParams.get("NOTIF");

        if (statusKey) {
            setloginNotif(statusKey);
            setNotifModalOpen(true);

            // Clean up query param from URL
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("NOTIF");
            setSearchParams(newParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleCloseModal = () => {
        setNotifModalOpen(false);
        setloginNotif(""); // Reset string state on close
    };

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FEFCED] px-4 py-10 sm:px-8">
            <LoginBackground />
            <div className="relative z-10 flex w-full max-w-[96rem] flex-col items-center gap-6 overflow-hidden lg:block lg:h-[50rem] lg:rounded-[2rem]">
                <section className="login-panel relative z-[2] hidden h-full items-center overflow-hidden rounded-[2rem] lg:flex lg:w-[64%]">
                    <div className="relative z-20 flex h-full w-[78%] items-center justify-center px-6">
                        <BuyBuyInWordmark className="w-[min(29rem,92%)] translate-x-6 -translate-y-10" />
                    </div>
                </section>

                <div aria-hidden className="login-mover" />

                <BuyBuyInWordmark className="relative z-20 mb-2 w-[min(26rem,92vw)] lg:hidden" />

                <section className="login-card relative z-[3] flex w-full max-w-[34rem] items-center overflow-hidden rounded-[1.75rem] px-8 py-12 sm:px-14 lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-[50%] lg:max-w-none">
                    <div aria-hidden className="login-card-spot" />
                    <div aria-hidden className="login-card-wash" />

                    <Form method="post" className="relative z-20 flex w-full flex-col gap-6">
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

                    {notifModalOpen && <LoginNotifPopup handleClose={handleCloseModal} description={loginNotif} />}
                </section>
            </div>
        </main>
    );
}

export default Login;

// SUB-COMPONENTS
function LoginBackground() {
    return (
        <svg
            viewBox="0 0 1366 768"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            className="absolute top-1/2 left-1/2 w-[max(100vw,120rem)] h-[max(100vh,67.5rem)] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        >
            <g clipPath="url(#clip0_1908_496)">
                <rect width="1366" height="768" fill="#FEFCED" />
                <path
                    d="M1225.85 792.261C1114.86 737.32 837.056 853.193 991.584 657.321C1146.11 461.448 1103.88 408.887 1202.13 397.473C1300.37 386.059 1368.86 592.322 1436.76 763.557C1509.97 1098.27 1336.85 847.201 1225.85 792.261Z"
                    fill="url(#paint0_linear_1908_496)"
                    fillOpacity="0.78"
                />
                <path
                    d="M571.516 893.369C467.744 896.121 368.727 971.48 175.1 830.717C-18.5271 689.954 -354.546 666.518 -80.651 641.25C193.244 615.982 224.066 705.211 386.829 646.577C549.592 587.943 675.288 890.616 571.516 893.369Z"
                    fill="url(#paint1_linear_1908_496)"
                    fillOpacity="0.78"
                />
                <path
                    d="M1319.65 785.224C1180.07 709.773 1097.56 554.547 735.464 580.726C373.369 606.905 -101.14 399.611 254.726 619.357C610.592 839.103 714.789 758.467 895.873 938.968C1076.96 1119.47 1459.23 860.675 1319.65 785.224Z"
                    fill="url(#paint2_linear_1908_496)"
                    fillOpacity="0.78"
                />
                <path
                    d="M948.851 1117.26C837.855 1062.32 560.056 1178.19 714.584 982.321C869.112 786.448 826.883 733.887 925.126 722.473C1023.37 711.059 1091.86 917.322 1159.76 1088.56C1232.97 1423.27 1059.85 1172.2 948.851 1117.26Z"
                    fill="url(#paint3_linear_1908_496)"
                    fillOpacity="0.78"
                />
            </g>
            <defs>
                <linearGradient
                    id="paint0_linear_1908_496"
                    x1="1447.24"
                    y1="761.538"
                    x2="936.283"
                    y2="585.076"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.423145" stopColor="#C83A24" />
                    <stop offset="1" stopColor="#FEFCED" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_1908_496"
                    x1="437.962"
                    y1="634.341"
                    x2="309.997"
                    y2="910.115"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.423145" stopColor="#C83A24" />
                    <stop offset="1" stopColor="#FEFCED" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_1908_496"
                    x1="957.071"
                    y1="988.595"
                    x2="996.622"
                    y2="586.003"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.423145" stopColor="#C83A24" />
                    <stop offset="1" stopColor="#FEFCED" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_1908_496"
                    x1="1170.24"
                    y1="1086.54"
                    x2="659.283"
                    y2="910.076"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.423145" stopColor="#C83A24" />
                    <stop offset="1" stopColor="#FEFCED" />
                </linearGradient>
                <clipPath id="clip0_1908_496">
                    <rect width="1366" height="768" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
