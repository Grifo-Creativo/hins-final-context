// components/gdd/GddRoiRecuperoTable.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  CopyIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  ShareIcon,
  TableIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
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
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import {
  gddRoiHistorico,
  gddRoiProyectado,
  TIPO_CAMBIO_ARS,
  type GddRoiHistoricoRow,
  type GddRoiProyectadoRow,
} from "@/data/gdd-roi-mock"
import { stickyStartCellClassName } from "@/lib/table-utils"
import { cn } from "@/lib/utils"

import {
  currencyColumnLabel,
  formatRoiFromUsd,
  type CurrencyCode,
} from "@/lib/format-currency"

export type GddRoiCurrency = CurrencyCode
export type GddRoiTableVariant = "proyectado" | "historico"

const variantTabs = [
  { value: "proyectado", label: "Proyectado" },
  { value: "historico", label: "Histórico" },
] as const

function actionsColumn<T extends { periodo: string }>(): ColumnDef<T> {
  return {
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
              aria-label={`Acciones — ${row.original.periodo}`}
            >
              <MoreHorizontalIcon className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <DownloadIcon className="mr-2 size-4" aria-hidden />
              Descargar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon className="mr-2 size-4" aria-hidden />
              Copiar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShareIcon className="mr-2 size-4" aria-hidden />
              Compartir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  }
}

function buildProyectadoColumns(currency: GddRoiCurrency): ColumnDef<GddRoiProyectadoRow>[] {
  const label = currencyColumnLabel(currency)
  return [
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
      accessorKey: "ahorroEstimado",
      enableSorting: false,
      meta: { label: `Ahorro Estimado (${label})` },
      header: `Ahorro Estimado (${label})`,
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatRoiFromUsd(
            row.original.ahorroEstimado,
            currency,
            TIPO_CAMBIO_ARS
          )}
        </span>
      ),
    },
    {
      accessorKey: "pendienteRecuperar",
      enableSorting: false,
      meta: { label: `Pendiente de Recuperar (${label})` },
      header: `Pendiente de Recuperar (${label})`,
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatRoiFromUsd(
            row.original.pendienteRecuperar,
            currency,
            TIPO_CAMBIO_ARS
          )}
        </span>
      ),
    },
    {
      accessorKey: "progresoEstimado",
      enableSorting: false,
      meta: { label: "Progreso Estimado (%)" },
      header: "Progreso Estimado (%)",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {row.original.progresoEstimado.toFixed(1)}%
        </span>
      ),
    },
    {
      accessorKey: "estado",
      enableSorting: false,
      meta: { label: "Estado" },
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.original.estado
        return estado === "En Curso" ? (
          <StatusBadge status="current">En Curso</StatusBadge>
        ) : (
          <span className="text-sm text-muted-foreground">Estimado</span>
        )
      },
    },
    actionsColumn<GddRoiProyectadoRow>(),
  ]
}

function buildHistoricoColumns(currency: GddRoiCurrency): ColumnDef<GddRoiHistoricoRow>[] {
  const label = currencyColumnLabel(currency)
  return [
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
      accessorKey: "capRecuperado",
      enableSorting: false,
      meta: { label: `Cap. Recuperado (${label})` },
      header: `Cap. Recuperado (${label})`,
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatRoiFromUsd(
            row.original.capRecuperado,
            currency,
            TIPO_CAMBIO_ARS
          )}
        </span>
      ),
    },
    {
      accessorKey: "capRecuperadoAcumulado",
      enableSorting: false,
      meta: { label: `Cap. Recuperado Acumulado (${label})` },
      header: `Cap. Recuperado Acumulado (${label})`,
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatRoiFromUsd(
            row.original.capRecuperadoAcumulado,
            currency,
            TIPO_CAMBIO_ARS
          )}
        </span>
      ),
    },
    {
      accessorKey: "porcentajeRecuperacion",
      enableSorting: false,
      meta: { label: "Porcentaje de Recuperación (%)" },
      header: "Porcentaje de Recuperación (%)",
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.porcentajeRecuperacion}%</span>
      ),
    },
    actionsColumn<GddRoiHistoricoRow>(),
  ]
}

interface GddRoiRecuperoTableProps {
  variant: GddRoiTableVariant
  onVariantChange: (variant: GddRoiTableVariant) => void
  currency: GddRoiCurrency
}

export function GddRoiRecuperoTable({
  variant,
  onVariantChange,
  currency,
}: GddRoiRecuperoTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  useEffect(() => {
    setColumnVisibility({})
  }, [variant])

  const columns = useMemo(
    () =>
      variant === "proyectado"
        ? buildProyectadoColumns(currency)
        : buildHistoricoColumns(currency),
    [variant, currency]
  )

  const data = variant === "proyectado" ? gddRoiProyectado : gddRoiHistorico

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<(typeof data)[number]>[],
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  const tableAriaLabel =
    variant === "proyectado"
      ? "Tabla recupero de inversión proyectado"
      : "Tabla recupero de inversión histórico"

  return (
    <div className="rounded-xl bg-white shadow-xs">
      <div className="flex flex-col gap-4 p-6 pb-0 sm:flex-row sm:items-center sm:justify-between">
        <Heading level="h3">Tabla Recupero de Inversión</Heading>
        <div className="flex w-full min-w-0 items-center gap-4 sm:w-auto">
          <TabsForBlocks
            className="min-w-0 flex-1 sm:flex-initial"
            tabs={[...variantTabs]}
            value={variant}
            onValueChange={(v) => onVariantChange(v as GddRoiTableVariant)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 shadow-xs md:w-auto md:gap-2 md:px-2.5"
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
      </div>

      <div className="space-y-6 p-6 pt-4">
        <Table aria-label={tableAriaLabel}>
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
              <PaginationLink href="#" isActive>
                3
              </PaginationLink>
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
