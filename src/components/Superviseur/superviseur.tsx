"use client";
import Sidebar from "../Sidebar";
import { ArrowRight, Building2, ClipboardPen, Database, FileChartColumnIncreasing, FileX2, Handshake, LayoutDashboard, LayoutList, Megaphone, RefreshCcw, Users, } from 'lucide-react';
import Maincontent from "../Maincontent";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SupContent from "./SupContent";

const Menu = [
    { title: "Dashbord", icon: <LayoutDashboard />, link: "/Superviseur/Dashbord" },
    // { title: "Test", icon: <LayoutDashboard />, link: "/Superviseur/Test" },
    { title: "Affectation", icon: <ArrowRight />, link: "/Superviseur/Affectation" },
    { title: "ReAffectation", icon: <RefreshCcw />, link: "/Superviseur/ReAffectation" },
    { title: "Répartition des Contacts", icon: <LayoutList />, link: "/Superviseur/Repartition_des_Contacts" },
    { title: "Agents", icon: <Users />, link: "/Superviseur/Agents" },
    { title: "Mass Enqueter", icon: <Handshake />, link: "/Superviseur/Mass" },
    { title: "Affectation Mass deleguer", icon: <ArrowRight />, link: "/Superviseur/Affectation_Mass_deleguer" },
    { title: "Compagner", icon: <Megaphone />, link: "/Superviseur/Compagner" },
    { title: "Donne importer", icon: <Database />, link: "/Superviseur/Donne_importer" },
    { title: "status des appelles", icon: <FileChartColumnIncreasing />, link: "/Superviseur/status_des_appelles" },
    { title: "Rapport", icon: <Building2 />, link: "/Superviseur/Rapport" },
    { title: "Quick Poste", icon: <ClipboardPen />, link: "/Superviseur/QuicPoste" },
    { title: "Historique", icon: <FileX2 />, link: "/Superviseur/Historique" },
];

export default function Superviseur() {
    const path = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsSidebarOpen(mobile ? false : true);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex min-h-screen">
            {isMobile && isSidebarOpen && (
                <button
                    className="fixed inset-0 bg-black/50 z-30"
                    aria-label="Fermer le menu"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <Sidebar menu={Menu} titre="Superviseur" isOpen={isSidebarOpen} onLinkClick={() => isMobile && setIsSidebarOpen(false)} />
            <Maincontent onMenuClick={() => setIsSidebarOpen((prev) => !prev)}>
                <h1 className="text-xl font-medium py-4 text-blue">{path.replace(/^\/+/, '')}</h1>
                <SupContent />
            </Maincontent>
        </div>
    )
}
