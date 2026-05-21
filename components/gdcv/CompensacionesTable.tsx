// components/gdcv/CompensacionesTable.tsx
"use client"

import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CopyIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  ShareIcon,
  TableIcon,
} from "lucide-react"

import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type CompensacionRow } from "@/data/gdcv-socio-mock"
import { stickyStartCellClassName } from "@/lib/table-utils"
import { cn } from "@/lib/utils"

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc")  return <ArrowUp   className="ml-2 size-4 text-muted-foreground" aria-label="Ascendente" />
  if (sorted === "desc") return <ArrowDown  className="ml-2 size-4 text-muted-foreground" aria-label="Descendente" />
  return <ArrowUpDown className="ml-2 size-4 text-muted-foreground" aria-label="Sin orden" />
}

const columns: ColumnDef<CompensacionRow>[] = [
  {
    accessorKey: "periodo",
    enableHiding: false,
    enableSorting: false,
    meta: { label: "Período", sticky: "start" },
    header: "Período",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground">
        {row.getValue("periodo")}
      </span>
    ),
  },
  {
    accessorKey: "energiaGenerada",
    enableSorting: true,
    meta: { label: "Energía Generada" },
    header: ({ column }) => (
      <button
        type="button"
        className="flex items-center cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Energía Generada
        <SortIcon sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("energiaGenerada")}</span>
    ),
  },
  {
    accessorKey: "ahorroAutoconsumo",
    enableSorting: true,
    meta: { label: "Ahorro por Autoconsumo" },
    header: ({ column }) => (
      <button
        type="button"
        className="flex items-center cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ahorro por Autoconsumo
        <SortIcon sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("ahorroAutoconsumo")}</span>
    ),
  },
  {
    accessorKey: "ahorroInyeccion",
    enableSorting: true,
    meta: { label: "Ahorro por Inyección" },
    header: ({ column }) => (
      <button
        type="button"
        className="flex items-center cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ahorro por Inyección
        <SortIcon sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("ahorroInyeccion")}</span>
    ),
  },
  {
    accessorKey: "ahorroTotal",
    enableSorting: true,
    meta: { label: "Ahorro Total" },
    header: ({ column }) => (
      <button
        type="button"
        className="flex items-center cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ahorro Total
        <SortIcon sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">{row.getValue("ahorroTotal")}</span>
    ),
  },
  {
    accessorKey: "estado",
    enableSorting: true,
    meta: { label: "Estado" },
    header: ({ column }) => (
      <button
        type="button"
        className="flex items-center cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Estado
        <SortIcon sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const estado = row.getValue("estado") as CompensacionRow["estado"]
      return estado === "En Curso" ? (
        <StatusBadge status="current">En Curso</StatusBadge>
      ) : (
        <span className="text-sm text-muted-foreground">Aplicado</span>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-8 shadow-xs"
              aria-label={`Acciones — ${row.getValue("periodo")}`}
            >
              <MoreHorizontalIcon className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <DownloadIcon className="size-4 mr-2" aria-hidden />
              Descargar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon className="size-4 mr-2" aria-hidden />
              Copiar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShareIcon className="size-4 mr-2" aria-hidden />
              Compartir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

interface CompensacionesTableProps {
  data: CompensacionRow[]
}

export function CompensacionesTable({ data }: CompensacionesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="bg-white rounded-xl shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <h3 className="text-lg font-semibold text-foreground">
          Historial de Compensaciones
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:w-auto md:px-2.5 md:gap-2 shadow-xs"
              title="Ver columnas"
            >
              <TableIcon className="size-4" aria-hidden />
              <span className="hidden md:inline">Ver columnas</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(val) => col.toggleVisibility(val)}
                >
                  {(col.columnDef.meta as { label?: string })?.label ?? col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="p-6 pt-4 space-y-6">
        <Table aria-label="Historial de compensaciones del socio">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="h-14 hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-sm font-medium text-muted-foreground",
                      header.column.getCanSort() && "cursor-pointer select-none",
                      stickyStartCellClassName(header.column.columnDef.meta)
                    )}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="group h-14">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={stickyStartCellClassName(cell.column.columnDef.meta)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
