// components/gdcv/SociosTable.tsx
"use client"

import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SocioRow } from "@/data/gdcv-mock"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontalIcon,
  PlusIcon,
  TableIcon,
} from "lucide-react"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

// ─── Parsing helpers ──────────────────────────────────────────────────────────

function parseKwhDisplay(value: string): number {
  const m = value.match(/[\d]+(?:[.,][\d]+)?/)
  return m ? parseFloat(m[0].replace(",", ".")) : 0
}

function parsePercentDisplay(value: string): number {
  return parseFloat(value.replace("%", "").replace(",", ".")) || 0
}

function parseMoneyDisplay(value: string): number {
  const digits = value.replace(/[^\d]/g, "")
  return digits ? parseInt(digits, 10) : 0
}

// ─── Sortable header ──────────────────────────────────────────────────────────

function sortableHeader(
  column: Column<SocioRow, unknown>,
  label: string
) {
  const sorted = column.getIsSorted()
  return (
    <button
      type="button"
      className="flex items-center cursor-pointer select-none text-left"
      onClick={() => {
        if (sorted === false) {
          column.toggleSorting(false)
        } else if (sorted === "asc") {
          column.toggleSorting(true)
        } else {
          column.clearSorting()
        }
      }}
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUp className="ml-2 size-4 shrink-0 text-muted-foreground" aria-label="Ascendente" />
      ) : sorted === "desc" ? (
        <ArrowDown className="ml-2 size-4 shrink-0 text-muted-foreground" aria-label="Descendente" />
      ) : (
        <ArrowUpDown className="ml-2 size-4 shrink-0 text-muted-foreground" aria-label="No ordenado" />
      )}
    </button>
  )
}

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<SocioRow>[] = [
  {
    accessorKey: "nombre",
    enableHiding: false,
    enableSorting: false,
    meta: { label: "Socio" },
    header: "Socio",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar size="default" className="after:border-0">
          <AvatarFallback className="bg-green-100 text-green-700 text-xs font-medium">
            {getInitials(row.original.nombre)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground">
          {row.original.nombre}
        </span>
        {row.original.tipo === "Virtual" && (
          <Badge
            variant="secondary"
            className="shrink-0 border-transparent bg-[#FFFBEB] text-[#92400E] text-xs font-medium hover:bg-[#FFFBEB]"
          >
            Virtual
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "medidor",
    enableSorting: true,
    meta: { label: "Medidor" },
    header: ({ column }) => sortableHeader(column, "Medidor"),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {row.original.medidor}
      </span>
    ),
  },
  {
    accessorKey: "participacion",
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      parsePercentDisplay(rowA.original.participacion) -
      parsePercentDisplay(rowB.original.participacion),
    meta: { label: "Participación (%)" },
    header: ({ column }) => sortableHeader(column, "Participación (%)"),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.original.participacion}</span>
    ),
  },
  {
    accessorKey: "energiaGenerada",
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      parseKwhDisplay(rowA.original.energiaGenerada) -
      parseKwhDisplay(rowB.original.energiaGenerada),
    meta: { label: "Energía Generada" },
    header: ({ column }) => sortableHeader(column, "Energía Generada"),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.original.energiaGenerada}</span>
    ),
  },
  {
    accessorKey: "ahorroGenerado",
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      parseMoneyDisplay(rowA.original.ahorroGenerado) -
      parseMoneyDisplay(rowB.original.ahorroGenerado),
    meta: { label: "Ahorro Generado" },
    header: ({ column }) => sortableHeader(column, "Ahorro Generado"),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.original.ahorroGenerado}</span>
    ),
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
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`Acciones — ${row.original.nombre}`}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontalIcon className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              Ver detalle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface SociosTableProps {
  data: SocioRow[]
  onRowClick: (socio: SocioRow) => void
}

export function SociosTable({ data, onRowClick }: SociosTableProps) {
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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const fromRow = pageIndex * pageSize + 1
  const toRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* Section header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <h3 className="text-lg font-semibold text-foreground">
          Socios del Parque
        </h3>
        <div className="flex items-center gap-2">
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 shadow-sm">
                <TableIcon className="size-4" aria-hidden />
                Ver columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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

          {/* New socio */}
          <Button type="button" size="sm" className="gap-2 shadow-sm">
            <PlusIcon className="size-4" aria-hidden />
            Nuevo Socio
          </Button>
        </div>
      </div>

      {/* Table + pagination */}
      <div className="p-6 pt-4 space-y-6">
        <Table aria-label="Socios del parque">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="h-14 hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-sm font-medium text-muted-foreground"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="h-14 cursor-pointer"
                  onClick={() => onRowClick(row.original)}
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
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mostrando {fromRow} a {toRow} de {totalRows} registros
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
