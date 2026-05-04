import React from "react";
import Navbar from "./Navbar";
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChildProps {
    children: React.ReactNode,
    onMenuClick: () => void,
}

export default function Maincontent({ children, onMenuClick }: ChildProps) {
    return (
        <div className="w-full h-screen">
            <Navbar onMenuClick={onMenuClick} />
            <ScrollArea className="w-full bg-gris h-[calc(100vh-72px)] p-4">
                {children}
            </ScrollArea>
        </div>
    )
}
