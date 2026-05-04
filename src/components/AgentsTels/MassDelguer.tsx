"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DataTable } from "../DataTable";
import { MassDeleguercolumns } from "./MassDelgueCol";
import { ScrollArea } from "../ui/scroll-area";
import { useAppContext } from "../context/AppContext";

// Titre dynamique
interface TitleProps {
    title: string;
}

const MassDelguer = ({ title }: TitleProps) => {
    const { contacts, Data,loading } = useAppContext();
    console.log(Data)
    const { data: session, status } = useSession();

    // Utilisation de useEffect pour déclencher la récupération des contacts
    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            contacts(session.user.id, title);
        }
    }, [status, session?.user?.id, title]);

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
                            data={Data}
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
                        {Data && Data.length > 0 ? (
                            <div>{Data[0].Script}</div>
                        ) : (
                            <div>Il n&apos;y a aucun contact pour le moment.</div>
                        )}
                    </div>

                </ScrollArea>
            </div>
        </div>
    );
};

export default MassDelguer;
