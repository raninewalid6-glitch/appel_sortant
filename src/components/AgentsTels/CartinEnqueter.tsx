"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppContext } from "@/components/context/AppContext";
import { DataTable } from "../DataTable";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSucces } from "../FormSucces";
import { FormError } from "../FormError";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { qualificationSchema } from "@/Schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

type User = {
    id: string;
    Nom: string;
    Telephone: number;
    Nombre_colis: string;
    localite: string;
    commande: string;
    Poids: string;
    Bp: string;
    Frais_Postaux: string;
    Frais_Douane: string;
    Provenance: string;
    Reference: string;
    Adresse: string;
    Date_Abonnement: string;
    Date_Enregistrement: string;
    Script: string;
};

type QualificationFormData = z.infer<typeof qualificationSchema>;

const questions: string[] = [
    "1. Utilisez-vous regulierement cet ouvrage hydraulique (puits, forage, etc.) pour vos besoins en eau ?",
    "2. A quelle distance se trouve l'ouvrage de votre domicile ?",
    "3. Combien de fois par jour vous rendez-vous a l'ouvrage ?",
    "4. Avez-vous rencontre des problemes techniques ou pannes sur l'ouvrage ?",
    "5. Depuis l'installation de l'ouvrage, votre acces a l'eau s'est-il ameliore ?",
    "6. Etes-vous satisfait(e) de la localisation de l'ouvrage ?",
    "7. Quel est votre niveau de satisfaction general vis-a-vis de l'ouvrage ?",
    "8. Avez-vous deja formule une plainte ou une demande d'amelioration concernant l'ouvrage ?",
    "9. Les intrants ont-ils bien ete recus dans votre localite ?",
    "10. Avez-vous observe des retards ou des difficultes pendant la distribution ?",
    "11. Est-ce que tous les menages beneficiaires identifies ont bien recu les intrants ?",
    "12. Avez-vous recu des plaintes ou des preoccupations de la part des beneficiaires ?",
    "13. Comment les plaintes ou preoccupations sont-elles traitees dans votre localite ?",
    "14. Selon vous, la qualite des intrants distribues etait-elle satisfaisante ?",
    "15. Comment les beneficiaires ont-ils ete informes de la distribution ?",
    "16. Y a-t-il eu des cas de favoritisme, de detournement ou de mauvaise gestion signales ?",
    "17. Que recommandez-vous pour ameliorer les prochaines distributions dans votre localite ?",
    "18. Avez-vous des suggestions pour ameliorer le mecanisme de gestion des plaintes ?",
    "19. Quel est le niveau de satisfaction general des beneficiaires que vous avez pu observer ou entendre ?",
];

interface CartinEnqueterProps {
    title: string;
}

export default function CartinEnqueter({ title }: CartinEnqueterProps) {
    const { contacts, Data, setData } = useAppContext();
    const { data: session, status } = useSession();
    const [selectedContact, setSelectedContact] = useState<User | null>(null);
    const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
    const [remarque, setRemarque] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            contacts(session.user.id, title);
        }
    }, [status, session?.user?.id, title]);

    const handleCheckQuestion = (index: number) => {
        setCheckedQuestions((prev) => ({
            ...prev,
            [`question${index + 1}`]: !prev[`question${index + 1}`],
        }));
    };

    const handleSubmitEnquete = async () => {
        const id = session?.user?.id;
        if (!id || !selectedContact) {
            toast.error("Veuillez selectionner un contact.");
            return;
        }

        const api = `http://192.168.100.4:8080/Vox_Backend//api.php?method=EnregistrementEnquet&iduser=${id}`;

        const payload: Record<string, string> = {
            id_contact: selectedContact.id,
            remarque,
        };

        questions.forEach((_, index) => {
            const key = `question${index + 1}`;
            payload[key] = checkedQuestions[key] ? "Oui" : "Non";
        });

        try {
            setLoading(true);
            const res = await fetch(api, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                toast.success("Enquete enregistree avec succes !");
                setCheckedQuestions({});
                setRemarque("");
                setData((prevContacts: User[]) =>
                    prevContacts.filter((contact: User) => contact.id !== selectedContact.id)
                );
                setSelectedContact(null);
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

    function ActionCell({ row }: { row: Row<User> }) {
        const user = row.original;
        const { onSubmit, successMessage, errorMessage, isPending } = useAppContext();
        const form = useForm<QualificationFormData>({
            resolver: zodResolver(qualificationSchema),
            defaultValues: {
                qualifier: "",
                commentaire: "",
            },
        });

        return (
            <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger className="w-full bg-blue text-blanc hover:bg-blue/90 hover:text-blanc duration-500 rounded-lg p-1">
                        Qualifier
                    </DialogTrigger>
                    <DialogContent className="bg-blanc">
                        <DialogHeader>
                            <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Qualification</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            <div className="w-full max-w-xs mx-auto">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit((values) => onSubmit(values, user.id))}>
                                        <div className="mb-4">
                                            <FormField
                                                control={form.control}
                                                name="qualifier"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-blue py-4">Qualifier</FormLabel>
                                                        <FormControl>
                                                            <Select {...field} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                                                <SelectTrigger className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue leading-tight focus:outline-none focus:shadow-outline">
                                                                    <SelectValue placeholder="Selectionner une qualification" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="indisponible">Indisponible</SelectItem>
                                                                    <SelectItem value="abouti">Abouti</SelectItem>
                                                                    <SelectItem value="repondu">Repondu</SelectItem>
                                                                    <SelectItem value="rappeller">Rappeler</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <FormField
                                                control={form.control}
                                                name="commentaire"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-blue">Commentaire</FormLabel>
                                                        <FormControl>
                                                            <textarea
                                                                {...field}
                                                                className="shadow border rounded-[10px] border-blue w-full py-2 px-3 text-blue mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                                                placeholder="Commentaire"
                                                                disabled={isPending}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <FormSucces message={successMessage} />
                                            <FormError message={errorMessage} />
                                        </div>
                                        <div className="flex items-center">
                                            <button className="bg-blue hover:bg-blue/80 text-white font-bold py-2 px-4 rounded-[10px] w-full focus:outline-none focus:shadow-outline" type="submit" disabled={isPending}>
                                                Enregistrer
                                            </button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    const cartinColumns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "Nom",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nom
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <button
                    className="text-blue hover:underline cursor-pointer font-medium"
                    onClick={() => setSelectedContact(row.original)}
                >
                    {row.getValue("Nom")}
                </button>
            ),
        },
        {
            accessorKey: "Telephone",
            header: "Telephone",
        },
        {
            accessorKey: "localite",
            header: "Localite/Region",
        },
        {
            accessorKey: "Date_Enregistrement",
            header: "Date",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => <ActionCell row={row} />,
        },
    ];

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
                        <DataTable data={Data} columns={cartinColumns} typeName="Nom" />
                    )}
                </div>

                {/* Formulaire a droite */}
                <ScrollArea className="bg-white w-full h-[600px] md:h-[700px] rounded shadow-blue overflow-hidden max-w-full">
                    {selectedContact ? (
                        <div className="p-4">
                            {/* Script en haut */}
                            <h1 className="text-center capitalize p-4 text-blue font-semibold">
                                Script
                            </h1>
                            <div className="w-full text-blue p-4 border-b border-blue/20 mb-4">
                                {Data && Data.length > 0 ? (
                                    <div className="break-words">{Data[0].Script}</div>
                                ) : (
                                    <div>Aucun script disponible.</div>
                                )}
                            </div>

                            {/* Infos du client selectionne */}
                            <div className="flex flex-col gap-2 px-4 mb-4 border-b border-blue/20 pb-4">
                                <h2 className="text-blue font-semibold text-lg">Client selectionne</h2>
                                <p><strong className="text-black">Nom: </strong><span className="text-blue">{selectedContact.Nom}</span></p>
                                <p><strong className="text-black">Telephone: </strong><span className="text-blue">{selectedContact.Telephone}</span></p>
                                <p><strong className="text-black">Localite: </strong><span className="text-blue">{selectedContact.localite}</span></p>
                            </div>

                            {/* Questions a cocher */}
                            <div className="px-4 mb-4">
                                <h2 className="text-blue font-semibold text-lg mb-3">Questions (optionnel)</h2>
                                <div className="space-y-3">
                                    {questions.map((q, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Checkbox
                                                id={`q-${index}`}
                                                checked={!!checkedQuestions[`question${index + 1}`]}
                                                onCheckedChange={() => handleCheckQuestion(index)}
                                                disabled={loading}
                                            />
                                            <label
                                                htmlFor={`q-${index}`}
                                                className="text-sm text-black cursor-pointer leading-5"
                                            >
                                                {q}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Champ remarque */}
                            <div className="px-4 mb-4">
                                <label className="block text-blue font-semibold mb-2">Remarque</label>
                                <textarea
                                    value={remarque}
                                    onChange={(e) => setRemarque(e.target.value)}
                                    className="shadow border rounded-[10px] border-blue w-full py-2 px-3 text-blue mb-3 leading-tight focus:outline-none focus:shadow-outline min-h-[80px]"
                                    placeholder="Ajoutez une remarque..."
                                    disabled={loading}
                                />
                            </div>

                            {/* Bouton soumettre */}
                            <div className="px-4 mb-4">
                                <button
                                    onClick={handleSubmitEnquete}
                                    className="bg-blue hover:bg-blue/80 text-white font-bold py-2 px-4 rounded-[10px] w-full focus:outline-none focus:shadow-outline disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? "Envoi en cours..." : "Soumettre"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full p-8">
                            <div className="text-center text-blue/60">
                                <h2 className="text-lg font-semibold mb-2">Aucun client selectionne</h2>
                                <p className="text-sm">Cliquez sur le nom d&apos;un client dans la liste pour afficher le formulaire d&apos;enquete.</p>
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </>
    );
}
