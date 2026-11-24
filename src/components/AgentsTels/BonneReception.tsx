"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppContext } from "@/components/context/AppContext";
import { DataTable } from "../DataTable";
import { BonneReceptionColumns, BonneReceptionUser } from "./BonneReceptionCol";
import { ScrollArea } from "../ui/scroll-area";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface BonneReceptionProps {
    title: string;
}

export default function BonneReception({ title }: BonneReceptionProps) {
    const { contacts, Data, setData } = useAppContext();
    const { data: session, status } = useSession();
    const [selectedContact, setSelectedContact] = useState<BonneReceptionUser | null>(null);
    const [adresse, setAdresse] = useState("");
    const [etage, setEtage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            contacts(session.user.id, title);
        }
    }, [status, session?.user?.id, title]);

    const handleSelectContact = (contact: BonneReceptionUser) => {
        setSelectedContact(contact);
        setAdresse(contact.Adresse || "");
        setEtage(contact.Etage || "");
    };

    const handleSubmitAdresse = async () => {
        const id = session?.user?.id;
        if (!id || !selectedContact) {
            toast.error("Veuillez selectionner un contact.");
            return;
        }

        const api = `http://192.168.100.4:8080/Vox_Backend//api.php?method=MiseAJourAdresseContact&id=${selectedContact.id}`;

        try {
            setLoading(true);
            const res = await fetch(api, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Adresse: adresse,
                    Etage: etage,
                }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                toast.success("Adresse mise a jour avec succes !");
                setData((prev: BonneReceptionUser[]) =>
                    prev.map((c: BonneReceptionUser) =>
                        c.id === selectedContact.id
                            ? { ...c, Adresse: adresse, Etage: etage }
                            : c
                    )
                );
                setSelectedContact({ ...selectedContact, Adresse: adresse, Etage: etage });
            } else {
                toast.error(result.error || "Une erreur est survenue !");
            }
        } catch (error) {
            toast.error("Erreur de connexion au serveur !");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const columnsWithClick = BonneReceptionColumns.map((col) => {
        if ("accessorKey" in col && col.accessorKey === "Nom") {
            return {
                ...col,
                cell: ({ row }: any) => (
                    <button
                        className="text-blue hover:underline cursor-pointer font-medium"
                        onClick={() => handleSelectContact(row.original)}
                    >
                        {row.getValue("Nom")}
                    </button>
                ),
            };
        }
        return col;
    });

    return (
        <>
            <ToastContainer position="top-center" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Tableau des contacts a gauche */}
                <div className="bg-white w-full h-max rounded p-4 shadow-blue max-w-full overflow-hidden">
                    <h1 className="text-center capitalize p-4 text-blue font-semibold">
                        Liste de contacts
                    </h1>

                    {status === "loading" ? (
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-slate-500 border-solid border-transparent"></div>
                            <small className="ml-2">Chargement...</small>
                        </div>
                    ) : (
                        <DataTable data={Data} columns={columnsWithClick} typeName="Nom" />
                    )}
                </div>

                {/* Script + Formulaire a droite */}
                <ScrollArea className="bg-white w-full h-[500px] md:h-[600px] rounded shadow-blue overflow-hidden max-w-full">
                    <h1 className="text-center capitalize p-4 text-blue font-semibold">
                        Script
                    </h1>
                    <div className="w-full text-blue p-4">
                        {Data && Data.length > 0 ? (
                            <div className="break-words">{Data[0].Script}</div>
                        ) : (
                            <div>Il n&apos;y a aucun contact pour le moment.</div>
                        )}
                    </div>

                    {selectedContact && (
                        <div className="p-4 border-t border-blue/20">
                            <h2 className="text-blue font-semibold text-lg mb-3">
                                Client : {selectedContact.Nom}
                            </h2>

                            <div className="mb-4">
                                <label className="block text-blue font-semibold mb-2">
                                    Adresse / Localisation
                                </label>
                                <input
                                    type="text"
                                    value={adresse}
                                    onChange={(e) => setAdresse(e.target.value)}
                                    className="shadow border rounded-[10px] border-blue w-full py-2 px-3 text-blue leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Saisir l'adresse du client..."
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-blue font-semibold mb-2">
                                    Etage / Nom de porte
                                </label>
                                <input
                                    type="text"
                                    value={etage}
                                    onChange={(e) => setEtage(e.target.value)}
                                    className="shadow border rounded-[10px] border-blue w-full py-2 px-3 text-blue leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Saisir l'etage ou le nom de porte..."
                                    disabled={loading}
                                />
                            </div>

                            <button
                                onClick={handleSubmitAdresse}
                                className="bg-blue hover:bg-blue/80 text-white font-bold py-2 px-4 rounded-[10px] w-full focus:outline-none focus:shadow-outline disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "Envoi en cours..." : "Soumettre"}
                            </button>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </>
    );
}
