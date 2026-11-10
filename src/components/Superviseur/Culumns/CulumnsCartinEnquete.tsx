"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export type CartinEnqueteData = {
    id: string;
    Nom: string;
    Telephone: number;
    question1: string;
    question2: string;
    question3: string;
    question4: string;
    question5: string;
    question6: string;
    question7: string;
    question8: string;
    question9: string;
    question10: string;
    question11: string;
    question12: string;
    question13: string;
    question14: string;
    question15: string;
    question16: string;
    question17: string;
    question18: string;
    question19: string;
    remarque: string;
    date_enregistrement: string;
    agent: string;
};

export const CartinEnqueteSupColumns: ColumnDef<CartinEnqueteData>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
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
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nom
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "Telephone",
        header: "Telephone",
    },
    {
        accessorKey: "question1",
        header: "Duree utilisation",
    },
    {
        accessorKey: "question2",
        header: "Frequence utilisation",
    },
    {
        accessorKey: "question3",
        header: "Decouverte service",
    },
    {
        accessorKey: "question4",
        header: "Facilite utilisation",
    },
    {
        accessorKey: "question5",
        header: "Clarte informations",
    },
    {
        accessorKey: "question6",
        header: "Accompagnement agents",
    },
    {
        accessorKey: "question7",
        header: "Reponses claires",
    },
    {
        accessorKey: "question8",
        header: "Delais reception",
    },
    {
        accessorKey: "question9",
        header: "Retard rencontre",
    },
    {
        accessorKey: "question10",
        header: "Info retard",
    },
    {
        accessorKey: "question11",
        header: "Etat colis",
    },
    {
        accessorKey: "question12",
        header: "Suivi commandes",
    },
    {
        accessorKey: "question13",
        header: "Info evolution",
    },
    {
        accessorKey: "question14",
        header: "Disponibilite agents",
    },
    {
        accessorKey: "question15",
        header: "Probleme rencontre",
    },
    {
        accessorKey: "question16",
        header: "Type difficulte",
    },
    {
        accessorKey: "question17",
        header: "Solution obtenue",
    },
    {
        accessorKey: "question18",
        header: "Axes amelioration",
    },
    {
        accessorKey: "question19",
        header: "Satisfaction generale",
    },
    {
        accessorKey: "remarque",
        header: "Remarque",
    },
    {
        accessorKey: "date_enregistrement",
        header: "Date enregistrement",
    },
    {
        accessorKey: "agent",
        header: "Agent",
    },
]
