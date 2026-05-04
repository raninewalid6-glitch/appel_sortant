"use client";
import React, { useState, useEffect } from "react";
import { MassData, MassSupColumns } from "./Culumns/CulumnsMass";
import { DataTable } from "../DataTable";
import { ScrollArea } from "../ui/scroll-area";

const Mass = () => {
    const [data, setData] = useState<MassData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    "http://192.168.100.4:8080/Vox_Backend/api.php?method=AfficherTousLesEnquetes"
                );

                const text = await res.text(); // récupère brut
                let result: any = [];
                try {
                    result = JSON.parse(text); // tente le parse JSON
                } catch (e) {
                    console.error("Réponse non JSON :", text);
                }

                if (res.ok) {
                    setData(result); // ⚡ result doit correspondre à ton MassData[]
                } else {
                    console.error("Erreur API :", result);
                }
            } catch (error) {
                console.error("Erreur de connexion :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full rounded-md bg-white p-4">
            <ScrollArea className="w-full">
                {loading ? (
                    <p className="text-center">⏳ Chargement...</p>
                ) : (
                    <DataTable data={data} columns={MassSupColumns} typeName="Nom" />
                )}
            </ScrollArea>
        </div>
    );
};

export default Mass;
