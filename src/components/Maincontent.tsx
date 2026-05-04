import React from "react";
import Navbar from "./Navbar";

interface ChildProps {
    children: React.ReactNode,
    onMenuClick: () => void,
}

export default function Maincontent({ children, onMenuClick }: ChildProps) {
    return (
        <div className="w-full min-h-screen md:min-h-0 md:h-screen flex flex-col">
            <Navbar onMenuClick={onMenuClick} />
            <main className="w-full bg-gris flex-1 overflow-y-auto p-3 sm:p-4 min-w-0">
                {children}
            </main>
        </div>
    )
}
