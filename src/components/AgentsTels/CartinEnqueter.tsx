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

const SCRIPT_INTRO = `Bonjour Monsieur/Madame,
Je suis [Prenom], agente du service Cart'In de La Poste de Djibouti.
Dans le cadre de notre demarche d'amelioration continue, nous realisons actuellement une enquete de satisfaction aupres de nos clients afin de recueillir leurs avis sur les prestations proposees par notre service.
Cet echange prendra seulement quelques minutes. Vos reponses resteront confidentielles et nous permettront d'ameliorer la qualite de nos services.
Acceptez-vous de participer a cette enquete ?`;

interface QuestionDef {
    question: string;
    options: string[];
}

const questionnaire: QuestionDef[] = [
    {
        question: "1. Depuis combien de temps utilisez-vous le service Cart'In ?",
        options: ["Premiere utilisation", "Moins de 6 mois", "Entre 6 mois et 1 an", "Plus d'un an"],
    },
    {
        question: "2. A quelle frequence utilisez-vous le service Cart'In ?",
        options: ["Tres frequemment", "Une fois par mois", "Occasionnellement", "Rarement"],
    },
    {
        question: "3. Comment avez-vous connu le service Cart'In ?",
        options: ["Reseaux sociaux", "Bouche-a-oreille", "Agence de La Poste", "Famille ou amis", "Autre"],
    },
    {
        question: "4. Etes-vous satisfait(e) de la facilite d'utilisation du service Cart'In ?",
        options: ["Tres satisfait(e)", "Satisfait(e)", "Moyennement satisfait(e)", "Pas satisfait(e)"],
    },
    {
        question: "5. Trouvez-vous les informations concernant les commandes et les procedures suffisamment claires ?",
        options: ["Oui, tout a fait", "Plutot oui", "Pas vraiment", "Non"],
    },
    {
        question: "6. Etes-vous satisfait(e) de l'accompagnement fourni par les agents de Cart'In ?",
        options: ["Tres satisfait(e)", "Satisfait(e)", "Peu satisfait(e)", "Pas satisfait(e)"],
    },
    {
        question: "7. Lorsque vous contactez Cart'In pour obtenir des informations sur votre colis, recevez-vous des reponses claires et precises ?",
        options: ["Toujours", "Souvent", "Parfois", "Jamais", "Non concerne(e)"],
    },
    {
        question: "8. Comment evaluez-vous les delais de reception de vos colis ?",
        options: ["Tres satisfaisants", "Satisfaisants", "Acceptables", "Insatisfaisants"],
    },
    {
        question: "9. Avez-vous deja rencontre un retard dans la reception de votre commande ?",
        options: ["Oui", "Non"],
    },
    {
        question: "10. Si oui, avez-vous ete informe(e) du retard et de son motif ?",
        options: ["Oui, suffisamment", "Oui, mais insuffisamment", "Non, aucune information recue", "Non concerne(e)"],
    },
    {
        question: "11. Etes-vous satisfait(e) de l'etat dans lequel vous recevez vos colis ?",
        options: ["Tres satisfait(e)", "Satisfait(e)", "Peu satisfait(e)", "Pas satisfait(e)"],
    },
    {
        question: "12. Trouvez-vous que le suivi de vos commandes est suffisamment accessible et comprehensible ?",
        options: ["Tres satisfaisant", "Satisfaisant", "Peu satisfaisant", "Pas satisfaisant"],
    },
    {
        question: "13. Recevez-vous suffisamment d'informations concernant l'evolution de votre commande ?",
        options: ["Toujours", "Souvent", "Parfois", "Jamais"],
    },
    {
        question: "14. Comment appreciez-vous la disponibilite et la reactivite des agents lorsque vous sollicitez le service Cart'In ?",
        options: ["Tres satisfaisantes", "Satisfaisantes", "Moyennes", "Insatisfaisantes", "Non concerne(e)"],
    },
    {
        question: "15. Avez-vous deja rencontre un probleme avec le service Cart'In ?",
        options: ["Oui", "Non"],
    },
    {
        question: "16. Si oui, quel type de difficulte avez-vous rencontre ?",
        options: ["Retard de livraison", "Colis non recu", "Colis endommage", "Difficultes de suivi", "Frais supplementaires ou incompris", "Difficultes de communication", "Autre"],
    },
    {
        question: "17. Lorsque vous avez rencontre un probleme, avez-vous obtenu une solution satisfaisante ?",
        options: ["Oui", "Partiellement", "Non", "Non concerne(e)"],
    },
    {
        question: "18. Selon vous, quels aspects du service Cart'In devraient etre ameliores ?",
        options: ["Ameliorer le suivi des colis", "Ameliorer la communication avec les clients", "Reduire les delais de reception", "Ameliorer la prise en charge des reclamations", "Clarifier les informations relatives aux frais et aux procedures", "Autre"],
    },
    {
        question: "19. Globalement, quel est votre niveau de satisfaction concernant le service Cart'In ?",
        options: ["Tres satisfait(e)", "Satisfait(e)", "Moyennes"],
    },
];

const PARTIES = [
    { label: "PARTIE A - UTILISATION DU SERVICE CART'IN", start: 0, end: 3 },
    { label: "PARTIE B - QUALITE DU SERVICE", start: 3, end: 7 },
    { label: "PARTIE C - DELAIS ET RECEPTION DES COLIS", start: 7, end: 11 },
    { label: "PARTIE D - COMMUNICATION ET SUIVI DES COMMANDES", start: 11, end: 14 },
    { label: "PARTIE E - RECLAMATIONS ET AXES D'AMELIORATION", start: 14, end: 18 },
    { label: "PARTIE F - SATISFACTION GENERALE", start: 18, end: 19 },
];

interface CartinEnqueterProps {
    title: string;
}

export default function CartinEnqueter({ title }: CartinEnqueterProps) {
    const { contacts, Data, setData } = useAppContext();
    const { data: session, status } = useSession();
    const [selectedContact, setSelectedContact] = useState<User | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [remarque, setRemarque] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            contacts(session.user.id, title);
        }
    }, [status, session?.user?.id, title]);

    const handleSelectOption = (questionIndex: number, option: string) => {
        setAnswers((prev) => ({
            ...prev,
            [`question${questionIndex + 1}`]: option,
        }));
    };

    const handleSubmitEnquete = async () => {
        const id = session?.user?.id;
        if (!id || !selectedContact) {
            toast.error("Veuillez selectionner un contact.");
            return;
        }

        const api = `http://192.168.100.4:8080/Vox_Backend//api.php?method=EnregistrementCartinEnquet&iduser=${id}`;

        const payload: Record<string, string> = {
            id_contact: selectedContact.id,
            remarque,
        };

        questionnaire.forEach((_, index) => {
            const key = `question${index + 1}`;
            payload[key] = answers[key] || "";
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
                setAnswers({});
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
                            {/* Script d'introduction */}
                            <h1 className="text-center p-4 text-blue font-semibold">
                                ENQUETE DE SATISFACTION CLIENT
                            </h1>
                            <div className="w-full text-blue p-4 border-b border-blue/20 mb-4 bg-blue/5 rounded">
                                <h2 className="font-semibold mb-2">1. Introduction de l&apos;appel</h2>
                                <p className="text-sm whitespace-pre-line italic">{SCRIPT_INTRO}</p>
                            </div>

                            {/* Infos du client selectionne */}
                            <div className="flex flex-col gap-2 px-4 mb-4 border-b border-blue/20 pb-4">
                                <h2 className="text-blue font-semibold text-lg">Client selectionne</h2>
                                <p><strong className="text-black">Nom: </strong><span className="text-blue">{selectedContact.Nom}</span></p>
                                <p><strong className="text-black">Telephone: </strong><span className="text-blue">{selectedContact.Telephone}</span></p>
                                <p><strong className="text-black">Localite: </strong><span className="text-blue">{selectedContact.localite}</span></p>
                            </div>

                            {/* Questionnaire QCM par partie */}
                            <div className="px-4 mb-4">
                                <h2 className="text-blue font-semibold text-lg mb-3">2. Questionnaire de satisfaction</h2>
                                {PARTIES.map((partie) => (
                                    <div key={partie.label} className="mb-5">
                                        <h3 className="text-blue font-bold text-sm mb-3 bg-blue/10 p-2 rounded">
                                            {partie.label}
                                        </h3>
                                        {questionnaire.slice(partie.start, partie.end).map((q, idx) => {
                                            const globalIdx = partie.start + idx;
                                            const key = `question${globalIdx + 1}`;
                                            return (
                                                <div key={globalIdx} className="mb-4">
                                                    <p className="font-medium text-black text-sm mb-2">{q.question}</p>
                                                    <div className="space-y-1 pl-4">
                                                        {q.options.map((option) => (
                                                            <label
                                                                key={option}
                                                                className="flex items-center gap-2 cursor-pointer text-sm text-black hover:text-blue"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={key}
                                                                    value={option}
                                                                    checked={answers[key] === option}
                                                                    onChange={() => handleSelectOption(globalIdx, option)}
                                                                    disabled={loading}
                                                                    className="accent-blue-700"
                                                                />
                                                                {option}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                            {/* Champ remarque / commentaire pour Q19 */}
                            <div className="px-4 mb-4">
                                <label className="block text-blue font-semibold mb-2">Description / Commentaire</label>
                                <textarea
                                    value={remarque}
                                    onChange={(e) => setRemarque(e.target.value)}
                                    className="shadow border rounded-[10px] border-blue w-full py-2 px-3 text-blue mb-3 leading-tight focus:outline-none focus:shadow-outline min-h-[80px]"
                                    placeholder="Ajoutez un commentaire..."
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
