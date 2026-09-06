// General Imports
import { Outlet, Link } from "react-router";
import "../../index.css";

import testBg from "../../assets/testbg.png";

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
            <div className="flex flex-col w-fit bg-red-300">
                <Link to="/branch-wide-offers" className="p-4 text-black-300 hover:bg-gray-200">
                    Offers
                </Link>
                <Link to="/page2" className="p-4 text-black-300 hover:bg-gray-200">
                    Page 2
                </Link>
            </div>

            <section className="p-8 grow overflow-y-auto overscroll-y-auto0">
                <Outlet />
            </section>
        </main>
    );
}

export default StaticLayout;
