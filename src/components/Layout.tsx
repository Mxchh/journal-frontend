import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";
import "./Layout.css";

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`app-shell ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((open) => !open)} />
            <div className="app-main">
                <Header title="My Journal" />
                <main className="app-content"><Outlet /></main>
            </div>
        </div>
    );
}
