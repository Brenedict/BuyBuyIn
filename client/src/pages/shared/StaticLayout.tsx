// General Imports
import { Outlet, Link } from "react-router";
import "../../index.css";

import testBg from "../../assets/testbg.png";
import { NavBar } from "../../components/NavBar";

// Components

function StaticLayout() {
    return (
        /**
         * NOTE FROM BINAS:
         * I temporarily set the background here as the one from figma.
         * This is temporary just so I could test the card components look.
         * Especially the glass variant of the card component.
         * For actual implementation of the bg, if you have an idea how to do it, please raise it.
         * */

        <main
            className="w-screen h-screen overflow-hidden flex antialiased bg-cover bg-center"
            style={{ backgroundImage: `url(${testBg})` }}
        >
            {/* Insert Nav */}
            <NavBar role="branchmanager"></NavBar>

            <section className="p-8 grow overflow-y-auto overscroll-y-auto">
                <Outlet />
            </section>
        </main>
    );
}

export default StaticLayout;
