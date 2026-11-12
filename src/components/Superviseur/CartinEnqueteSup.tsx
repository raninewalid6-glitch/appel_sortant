"use client";
import React, { useState, useEffect } from "react";
import { CartinEnqueteData, CartinEnqueteSupColumns } from "./Culumns/CulumnsCartinEnquete";
import { DataTable } from "../DataTable";
import { FileUp } from "lucide-react";
import * as XLSX from "xlsx";

const CartinEnqueteSup = () => {
    const [data, setData] = useState<CartinEnqueteData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    "http://192.168.100.4:8080/Vox_Backend/api.php?method=AfficherCartinEnquetes"
                );

                const text = await res.text();
                let result: any = [];
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    console.error("Reponse non JSON :", text);
                }

                if (res.ok) {
                    setData(result);
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

    const exportToExcel = () => {
        const exportData = data.map((row) => ({
            Nom: row.Nom,
            Telephone: row.Telephone,
            "Duree utilisation": row.q1,
            "Frequence utilisation": row.q2,
            "Decouverte service": row.q3,
            "Facilite utilisation": row.q4,
            "Clarte informations": row.q5,
            "Accompagnement agents": row.q6,
            "Delais reception": row.q7,
            "Retard rencontre": row.q8,
            "Info retard": row.q9,
            "Etat colis": row.q10,
            "Info evolution": row.q11,
            "Probleme rencontre": row.q12,
            "Type difficulte": row.q13,
            "Solution obtenue": row.q14,
            "Axes amelioration": row.q15,
            "Satisfaction generale": row.q16,
            Remarque: row.remarque,
            Date: row.date_enregistrement,
            Agent: row.agent,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, "Cartin Enquetes");
        XLSX.writeFile(wb, "Cartin_Enquetes.xlsx");
    };

    return (
        <div className="w-full rounded-md bg-white p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-blue font-semibold text-lg">Cartin Enqueter</h2>
                <button
                    className="text-white bg-blue hover:bg-blue/90 duration-300 p-2 w-max flex justify-center items-center space-x-2 rounded-lg"
                    onClick={exportToExcel}
                >
                    <FileUp />
                    <span>Exportation</span>
                </button>
            </div>
            <div className="min-w-[2200px]">
                {loading ? (
                    <p className="text-center">Chargement...</p>
                ) : (
                    <DataTable data={data} columns={CartinEnqueteSupColumns} typeName="Nom" />
                )}
            </div>
        </div>
    );
};

export default CartinEnqueteSup;
