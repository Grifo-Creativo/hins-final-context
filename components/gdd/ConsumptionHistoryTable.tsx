// components/gdd/ConsumptionHistoryTable.tsx
"use client"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type Column,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  TableIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  CopyIcon,
  ShareIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import { type ConsumptionHistoryRow } from "@/data/gdd-performance-mock"
import { parseKwhDisplay, parsePercentDisplay } from "@/lib/format-energy"
import { stickyStartCellClassName } from "@/lib/table-utils"
import { cn } from "@/lib/utils"

function parseMoneyDisplay(value: string): number {
  const digits = value.replace(/[^\d]/g, "")
  return digits ? parseInt(digits, 10) : 0
}

function sortableHeader(
  column: Column<ConsumptionHistoryRow, unknown>,
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

const columns: ColumnDef<ConsumptionHistoryRow>[] = [
  {
    accessorKey: "period",
    enableHiding: false,
    enableSorting: false,
    meta: { label: "Período", sticky: "start" },
    header: "Período",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground">
        {row.getValue("period")}
      </span>
    ),
  },
  {
    accessorKey: "energyGenerated",
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      parseKwhDisplay(rowA.original.energyGenerated) -
      parseKwhDisplay(rowB.original.energyGenerated),
    meta: { label: "Energía generada" },
    header: ({ column }) => sortableHeader(column, "Energía generada"),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("energyGenerated")}</span>
    ),
  },
  {
    accessorKey: "energyAcquired",
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      parseKwhDisplay(rowA.original.energyAcquired) -
      parseKwhDisplay(rowB.original.energyAcquired),
    meta: { label: "Energía adquirida" },
    header: ({ column }) => sortableHeader(column, "Energía adquirida"),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("energyAcquired")}</span>
    ),
  },
  {
    accessorKey: "energyFromOtherSources",
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      parseKwhDisplay(rowA.original.energyFromOtherSources) -
      parseKwhDisplay(rowB.original.energyFromOtherSources),
    meta: { label: "Energía de otras fuentes" },
    header: ({ column }) => sortableHeader(column, "Energía de otras fuentes"),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("energyFromOtherSources")}</span>
    ),
  },
  {
    accessorKey: "totalEnergy",
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      parseKwhDisplay(rowA.original.totalEnergy) -
      parseKwhDisplay(rowB.original.totalEnergy),
    meta: { label: "Energía total" },
    header: ({ column }) => sortableHeader(column, "Energía total"),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("totalEnergy")}</span>
    ),
  },
  {
    accessorKey: "acquiredPercent",
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      parsePercentDisplay(rowA.original.acquiredPercent) -
      parsePercentDisplay(rowB.original.acquiredPercent),
    meta: { label: "Porcentaje adquirida" },
    header: ({ column }) => sortableHeader(column, "Porcentaje adquirida"),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("acquiredPercent")}</span>
    ),
  },
  {
    accessorKey: "totalPercent",
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      parsePercentDisplay(rowA.original.totalPercent) -
      parsePercentDisplay(rowB.original.totalPercent),
    meta: { label: "Porcentaje total" },
    header: ({ column }) => sortableHeader(column, "Porcentaje total"),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("totalPercent")}</span>
    ),
  },
  {
    accessorKey: "estimatedSavings",
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      parseMoneyDisplay(rowA.original.estimatedSavings) -
      parseMoneyDisplay(rowB.original.estimatedSavings),
    meta: { label: "Ahorro estimado" },
    header: ({ column }) => sortableHeader(column, "Ahorro estimado"),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("estimatedSavings")}</span>
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
              variant="outline"
              size="icon"
              className="size-8 shadow-xs"
              aria-label={`Acciones — ${row.getValue("period")}`}
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

interface ConsumptionHistoryTableProps {
  data: ConsumptionHistoryRow[]
}

export function ConsumptionHistoryTable({ data }: ConsumptionHistoryTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    totalEnergy: false,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility, sorting },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="bg-white rounded-xl shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <Heading level="h3">
          Historial de Generación
        </Heading>
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
      </div>

      {/* Table */}
      <div className="p-6 pt-4 space-y-6">
        <Table aria-label="Historial de generación del parque">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="h-14 hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-sm font-medium text-muted-foreground",
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
