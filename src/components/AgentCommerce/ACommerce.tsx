"use client";
import Sidebar from "../Sidebar";
import { Database, LayoutDashboard ,  Truck,  Users , } from 'lucide-react';
import Maincontent from "../Maincontent";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ContentCommerce from "./ContentCommerce";

const Menu = [
    { title: "Importation", icon: <LayoutDashboard  />, link: "/Commercial/importation" },
    { title: "Exportation", icon: < Users  />, link: "/Commercial/Exportation" },
    { title: "Demande livraison", icon: < Truck  />, link: "/Commercial/Demande_livraison" },
    { title: "Quick Poste", icon: < Truck  />, link: "/Commercial/Quick_Poste" },
    { title: "Donne importer", icon: <Database />, link: "/Commercial/Donne_importer" },
   
];

export default function ACommerce() {
    const path = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className="flex min-h-screen">
            <Sidebar menu={Menu} titre="Commercial" isOpen={isSidebarOpen} />
            <Maincontent onMenuClick={() => setIsSidebarOpen((prev) => !prev)}>
                <h1 className="text-xl font-medium py-4 text-blue">{path.replace(/^\/+/, '')}</h1>
                {Menu.map((item) => (
                    path === item.link && <ContentCommerce key={item.link} />
                ))}
            </Maincontent>
        </div>
    )
}