"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export type CartinEnqueteData = {
    id: string;
    Nom: string;
    Telephone: number;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string;
    q8: string;
    q9: string;
    q10: string;
    q11: string;
    q12: string;
    q13: string;
    q14: string;
    q15: string;
    q16: string;
    q17: string;
    q18: string;
    q19: string;
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
        accessorKey: "q1",
        header: "Duree utilisation",
    },
    {
        accessorKey: "q2",
        header: "Frequence utilisation",
    },
    {
        accessorKey: "q3",
        header: "Decouverte service",
    },
    {
        accessorKey: "q4",
        header: "Facilite utilisation",
    },
    {
        accessorKey: "q5",
        header: "Clarte informations",
    },
    {
        accessorKey: "q6",
        header: "Accompagnement agents",
    },
    {
        accessorKey: "q7",
        header: "Reponses claires",
    },
    {
        accessorKey: "q8",
        header: "Delais reception",
    },
    {
        accessorKey: "q9",
        header: "Retard rencontre",
    },
    {
        accessorKey: "q10",
        header: "Info retard",
    },
    {
        accessorKey: "q11",
        header: "Etat colis",
    },
    {
        accessorKey: "q12",
        header: "Suivi commandes",
    },
    {
        accessorKey: "q13",
        header: "Info evolution",
    },
    {
        accessorKey: "q14",
        header: "Disponibilite agents",
    },
    {
        accessorKey: "q15",
        header: "Probleme rencontre",
    },
    {
        accessorKey: "q16",
        header: "Type difficulte",
    },
    {
        accessorKey: "q17",
        header: "Solution obtenue",
    },
    {
        accessorKey: "q18",
        header: "Axes amelioration",
    },
    {
        accessorKey: "q19",
        header: "Satisfaction generale",
    },
    {
        accessorKey: "remarque",
        header: "Remarque",
    },
    {
        accessorKey: "date_enregistrement",
        header: "Date",
    },
    {
        accessorKey: "agent",
        header: "Agent",
    },
]
