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
        header: "Utilisation reguliere",
    },
    {
        accessorKey: "q2",
        header: "Distance",
    },
    {
        accessorKey: "q3",
        header: "Frequence",
    },
    {
        accessorKey: "q4",
        header: "Problemes techniques",
    },
    {
        accessorKey: "q5",
        header: "Acces amelioration",
    },
    {
        accessorKey: "q6",
        header: "Satisfaction localisation",
    },
    {
        accessorKey: "q7",
        header: "Satisfaction general",
    },
    {
        accessorKey: "q8",
        header: "Plainte ou demande",
    },
    {
        accessorKey: "q9",
        header: "Intrants recus",
    },
    {
        accessorKey: "q10",
        header: "Retards difficultes",
    },
    {
        accessorKey: "q11",
        header: "Tous menages servis",
    },
    {
        accessorKey: "q12",
        header: "Plainte beneficiaires",
    },
    {
        accessorKey: "q13",
        header: "Traitement plaintes",
    },
    {
        accessorKey: "q14",
        header: "Qualite intrants",
    },
    {
        accessorKey: "q15",
        header: "Information distribution",
    },
    {
        accessorKey: "q16",
        header: "Problemes gestion",
    },
    {
        accessorKey: "q17",
        header: "Recommandations",
    },
    {
        accessorKey: "q18",
        header: "Suggestions plainte",
    },
    {
        accessorKey: "q19",
        header: "Satisfaction observee",
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
