import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type Transaction = {
    id: string;
    type: "deposit" | "withdraw";
    amount: number;
    iban: string;
    date: string;
};

export function SortDropdown({ onSort }: { onSort: (sortBy: { id: string; desc: boolean }) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Trier</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onSort({ id: "date", desc: true })}>
                    Du plus récent au plus ancien
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSort({ id: "date", desc: false })}>
                    Du plus ancien au plus récent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSort({ id: "amount", desc: true })}>
                    Du plus gros montant au plus petit montant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSort({ id: "amount", desc: false })}>
                    Du plus petit montant au plus gros montant
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns: ColumnDef<Transaction>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <div className="text-xs font-mono truncate max-w-[100px] lg:max-w-none">
                    {row.getValue("id")}
                </div>
            ),
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <div className="capitalize whitespace-nowrap">
                    {row.getValue("type")}
                </div>
            ),
        },
        {
            accessorKey: "amount",
            header: "Montant",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"));
                const formatted = new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                }).format(amount);

                return (
                    <div className="text-right font-medium whitespace-nowrap">
                        {formatted}
                    </div>
                );
            },
        },
        {
            accessorKey: "iban",
            header: "IBAN",
            cell: ({ row }) => (
                <div className="text-xs truncate max-w-[150px] lg:max-w-none">
                    {row.getValue("iban") || "-"}
                </div>
            ),
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => {
                const date = new Date(row.getValue("date"));
                return (
                    <div className="whitespace-nowrap">
                        {date.toLocaleString()}
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: transactions,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Historique des transactions</h2>
                <SortDropdown onSort={(sortBy) => setSorting([sortBy])} />
            </div>
            <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={`${
                                            header.column.id === "amount"
                                                ? "text-right"
                                                : "text-left"
                                        } px-6 py-4`}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.original.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`${
                                                cell.column.id === "amount"
                                                    ? "text-right"
                                                    : "text-left"
                                            } px-6 py-4`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucun résultat trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}