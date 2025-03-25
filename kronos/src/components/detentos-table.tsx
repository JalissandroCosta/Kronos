// src/components/detentos-table.tsx
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";

interface Detento {
  id: string;
  nome: string;
  registro: string;
  dataNascimento: string;
  cela: string;
  status: "Ativo" | "Liberado" | "Transferido";
  crimes: string[];
}

const data: Detento[] = [
  {
    id: "1",
    nome: "João da Silva",
    registro: "2023-001",
    dataNascimento: "15/05/1985",
    cela: "C-102",
    status: "Ativo",
    crimes: ["Roubo qualificado", "Posse ilegal de arma"],
  },
  {
    id: "2",
    nome: "Carlos Alberto",
    registro: "2023-002",
    dataNascimento: "22/11/1990",
    cela: "B-205",
    status: "Ativo",
    crimes: ["Homicídio doloso"],
  },
  {
    id: "3",
    nome: "Marcos Antônio",
    registro: "2023-003",
    dataNascimento: "30/07/1978",
    cela: "A-301",
    status: "Transferido",
    crimes: ["Latrocínio", "Associação criminosa"],
  },
  {
    id: "4",
    nome: "Fernando Costa",
    registro: "2023-004",
    dataNascimento: "05/03/1995",
    cela: "D-104",
    status: "Liberado",
    crimes: ["Furto"],
  },
  {
    id: "5",
    nome: "Ricardo Oliveira",
    registro: "2023-005",
    dataNascimento: "18/09/1982",
    cela: "C-201",
    status: "Ativo",
    crimes: ["Tráfico de drogas", "Formação de quadrilha"],
  },
];

export const columns: ColumnDef<Detento>[] = [
  {
    accessorKey: "registro",
    header: "Registro",
    cell: ({ row }) => <div className="font-medium">{row.getValue("registro")}</div>,
  },
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => <div>{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "dataNascimento",
    header: "Data de Nascimento",
  },
  {
    accessorKey: "cela",
    header: "Cela",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let color = "";
      
      if (status === "Ativo") color = "bg-green-100 text-green-800";
      if (status === "Liberado") color = "bg-blue-100 text-blue-800";
      if (status === "Transferido") color = "bg-yellow-100 text-yellow-800";
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "crimes",
    header: "Crimes",
    cell: ({ row }) => {
      const crimes = row.getValue("crimes") as string[];
      return (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {crimes.map((crime, index) => (
            <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
              {crime}
            </span>
          ))}
        </div>
      );
    },
  },
];

export function DetentosTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar detento..."
            className="pl-10 max-w-sm"
            // Implementar filtro aqui
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum detento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}