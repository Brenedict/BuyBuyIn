// General Imports
import { Outlet, Link } from "react-router";
import "../../index.css";
import { useContext } from "react";

// Temporary
import testBg from "../../assets/testbg.png";

// Components
import { NavBar } from "../../components/NavBar";

// BuyBuyIn Shared Imports
import type { RoleType } from "@buybuyin/shared/prisma/enums";

// Context
import { UserGlobalContext } from "../../context/GlobalUserContext";

function StaticLayout() {
    // Temporary: Currently not using InMemoryStore
    const user = useContext(UserGlobalContext);
    let role: RoleType = "CASHIER";

    if (user) {
        role = user.role;
    }

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
            <NavBar role={role}></NavBar>

            <section className="p-8 grow overflow-y-auto overscroll-y-auto">
                <Outlet />
            </section>
        </main>
    );
}

export default StaticLayout;
