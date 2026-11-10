"use client";
import React, { useState, useEffect } from "react";
import { CartinEnqueteData, CartinEnqueteSupColumns } from "./Culumns/CulumnsCartinEnquete";
import { DataTable } from "../DataTable";
import { ScrollArea } from "../ui/scroll-area";

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

    return (
        <div className="w-full rounded-md bg-white p-4">
            <ScrollArea className="w-full">
                {loading ? (
                    <p className="text-center">Chargement...</p>
                ) : (
                    <DataTable data={data} columns={CartinEnqueteSupColumns} typeName="Nom" />
                )}
            </ScrollArea>
        </div>
    );
};

export default CartinEnqueteSup;
