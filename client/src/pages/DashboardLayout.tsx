// General Imports
import { Outlet, Link } from "react-router";
import "../index.css";

// Components

function DashboardLayout() {
    return (
        <main className="w-screen h-screen overflow-hidden flex antialiased">
            {/* Insert Nav */}
            <div className="flex flex-col w-64 bg-red-300">
                <Link to="/page1" className="p-4 text-black-300 hover:bg-gray-200">
                    Page 1
                </Link>
                <Link to="/page2" className="p-4 text-black-300 hover:bg-gray-200">
                    Page 2
                </Link>
            </div>

            <section className="flex-1 flex flex-col min-w-0">
                <div className="p-8 bg-off-white grow overflow-y-auto overscroll-y-auto">
                    <Outlet />
                </div>
            </section>
        </main>
    );
}

export default DashboardLayout;
