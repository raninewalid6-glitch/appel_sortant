'use client';
import { useCallback, useEffect } from "react";
import CreateUser from "../FormUser";
import { ReUsableDataTableCrud } from "../ReUsableDataTableCrud";
import { AgentsColumns } from "../Superviseur/Culumns/CulumnsAgents";
import { useAppContext } from "../context/AppContext";

export default function CrudAgent() {
    //state 
    const {UsersData ,SetUsersData,onSubmitUtilisateur,successMessage,errorMessage} = useAppContext();
    //comportement
    //fonction qui permet de recupere les status des apples surtout les appelle positves 
    const FetchStatus = useCallback(async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherPourSuperviseur`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
            })
            const responseData = await response.json();

            if (!response.ok || responseData.error) {
                console.log(responseData.error || "Une erreur réseau a été détectée.");
            } else {
                SetUsersData(responseData);
                console.log(responseData);
            }

        } catch (error) {
            console.log('Erreur : ', error);
        }
    }, [SetUsersData])
    useEffect(() => {
        FetchStatus();
    }, [FetchStatus])
    //render
    return (
        <div>
            <ReUsableDataTableCrud data={UsersData} columns={AgentsColumns} typeName="Nom" poptitle="Ajouter un utilisateur"><CreateUser onSubmit={onSubmitUtilisateur} successMessage={successMessage} errorMessage={errorMessage} /></ReUsableDataTableCrud>
        </div>
    )
}