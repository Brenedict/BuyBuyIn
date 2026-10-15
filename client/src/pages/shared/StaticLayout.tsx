// General Imports
import { Outlet } from "react-router";
import "../../index.css";

// Temporary
import testBg from "../../assets/testbg.png";

// Components
import { NavBar } from "../../components/NavBar";

// Context
import { useGlobalContext } from "./AccessValidator";

function StaticLayout() {
    const { user } = useGlobalContext();
    const role = user?.role;

    // The auth layer already redirects anonymous visitors, so this is just a
    // safety net. Rendering nothing beats defaulting the role and handing an
    // unknown value to NavBar, which indexes NavItems by it.
    if (!role) return null;

    return (
        /**
         * NOTE FROM BINAS:
         * I temporarily set the background here as the one from figma.
         * This is temporary just so I could test the card components look.
         * Especially the glass variant of the card component.
         * For actual implementation of the bg, if you have an idea how to do it, please raise it.
         * */

        <main
            className="w-screen h-screen overflow-hidden flex antialiased bg-cover bg-center flex flex-col min-w-[1024px]"
            style={{ backgroundImage: `url(${testBg})` }}
        >
            {/* Insert Nav */}
            <NavBar role={role}></NavBar>

            <section className="p-8 grow overflow-y-auto overscroll-y-auto">
                <Outlet />
            </section>
        </main>
    );
}

export default StaticLayout;
