"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DataTable } from "../DataTable";
import { MassDeleguercolumns } from "./MassDelgueCol";
import { ScrollArea } from "../ui/scroll-area";

// Titre dynamique
interface TitleProps {
    title: string;
}

const MassDelguer = ({ title }: TitleProps) => {
    const { data: session, status } = useSession();
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // ✅ Récupération des contacts depuis l’API
    const fetchContacts = async (id: string | number) => {
        setLoading(true);
        try {
            const apiUrl = `http://192.168.100.4:8080/Vox_Backend/api.php?method=GetContactsByAgent&id=${id}`;
            const response = await fetch(apiUrl, { method: "GET" });

            if (!response.ok) {
                console.error("❌ Erreur API");
                setContacts([]);
                return;
            }

            const result = await response.json();

            if (result.error) {
                console.error("❌ Erreur:", result.error);
                setContacts([]);
            } else if (result.success && Array.isArray(result.contacts)) {
                setContacts(result.contacts);
            } else {
                console.warn("ℹ️ Réponse inattendue:", result);
                setContacts([]);
            }
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des contacts:", error);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Charger les contacts quand la session est prête
    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            fetchContacts(session.user.id);
        }
    }, [status, session?.user?.id]);

    return (
        <div className=" w-full h-max rounded p-4 shadow-blue ">
            <h1 className="text-center capitalize p-4 text-blue font-semibold">
                Liste de contacts
            </h1>

            <div className="flex gap-4">
                {/* c'est la partie tableau  */}
                <div className="bg-white w-[50%] h-max rounded p-4 shadow-blue">
                    {loading || status === "loading" ? (
                        <div className="flex justify-center items-center py-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-slate-500 border-solid border-transparent"></div>
                            <small className="ml-2">Chargement...</small>
                        </div>
                    ) : (
                        <DataTable
                            data={contacts}
                            columns={MassDeleguercolumns}
                            typeName="Nom"
                        />
                    )}
                </div>
                {/* c'est la partie script */}
                <ScrollArea className="bg-white w-[50%] h-[446px] rounded shadow-blue overflow-hidden">
                    <h1 className="text-center capitalize p-4 text-blue font-semibold">
                        Script
                    </h1>
                    <div className="w-full h-full text-blue p-4">
                        {contacts && contacts.length > 0 ? (
                            <div>{contacts[0].script}</div>
                        ) : (
                            <div>Il n'y a aucun contact pour le moment.</div>
                        )}
                    </div>

                </ScrollArea>
            </div>
        </div>
    );
};

export default MassDelguer;
