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
import { currencyTabsForBlocks } from "@/components/ui/currency-context-indicator"
import {
  gddRoiHistorico,
  gddRoiProyectado,
  TIPO_CAMBIO_ARS,
  type GddRoiHistoricoRow,
  type GddRoiProyectadoRow,
} from "@/data/gdd-roi-mock"
import { stickyStartCellClassName } from "@/lib/table-utils"
import { cn } from "@/lib/utils"

import { formatRoiFromUsdResponsive, type CurrencyCode } from "@/lib/format-currency"
import { useIsMobile } from "@/hooks/use-is-mobile"

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

function buildProyectadoColumns(
  currency: GddRoiCurrency,
  tipoCambio: number,
  isMobile: boolean
): ColumnDef<GddRoiProyectadoRow>[] {
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
      meta: { label: "Ahorro Estimado" },
      header: "Ahorro Estimado",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatRoiFromUsdResponsive(
            row.original.ahorroEstimado,
            currency,
            tipoCambio,
            isMobile
          )}
        </span>
      ),
    },
    {
      accessorKey: "pendienteRecuperar",
      enableSorting: false,
      meta: { label: "Pendiente de Recuperar" },
      header: "Pendiente de Recuperar",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatRoiFromUsdResponsive(
            row.original.pendienteRecuperar,
            currency,
            tipoCambio,
            isMobile
          )}
        </span>
      ),
    },
    {
      accessorKey: "progresoEstimado",
      enableSorting: false,
      meta: { label: "Avance de Recuperación" },
      header: "Avance de Recuperación",
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

function buildHistoricoColumns(
  currency: GddRoiCurrency,
  tipoCambio: number,
  isMobile: boolean
): ColumnDef<GddRoiHistoricoRow>[] {
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
      meta: { label: "Cap. Recuperado" },
      header: "Cap. Recuperado",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatRoiFromUsdResponsive(
            row.original.capRecuperado,
            currency,
            tipoCambio,
            isMobile
          )}
        </span>
      ),
    },
    {
      accessorKey: "capRecuperadoAcumulado",
      enableSorting: false,
      meta: { label: "Recupero Acumulado" },
      header: "Recupero Acumulado",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatRoiFromUsdResponsive(
            row.original.capRecuperadoAcumulado,
            currency,
            tipoCambio,
            isMobile
          )}
        </span>
      ),
    },
    {
      accessorKey: "porcentajeRecuperacion",
      enableSorting: false,
      meta: { label: "Avance de Recuperación" },
      header: "Avance de Recuperación",
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.porcentajeRecuperacion}%</span>
      ),
    },
    actionsColumn<GddRoiHistoricoRow>(),
  ]
}

export type GddRoiRecuperoTableLayout = "page" | "embedded"

interface GddRoiRecuperoTableProps {
  variant: GddRoiTableVariant
  onVariantChange: (variant: GddRoiTableVariant) => void
  currency: GddRoiCurrency
  proyectadoData?: GddRoiProyectadoRow[]
  historicoData?: GddRoiHistoricoRow[]
  tipoCambio?: number
  /**
   * `page` (default): bloque en vista ROI — superficie blanca + sombra.
   * `embedded`: dentro de Sheet (sin shell de página; título externo).
   */
  layout?: GddRoiRecuperoTableLayout
  /**
   * @deprecated Usar `layout="embedded"`.
   * Oculta el título del bloque (p. ej. sheet con `SheetTitle` propio).
   */
  hideTitle?: boolean
  /** Menú «Ver columnas» (visibilidad TanStack). Default `true` — GDD/GDCV ROI. */
  showColumnVisibility?: boolean
  /**
   * Tabs DOLAR|ARS clickeables en la toolbar (mismo contenedor que Proyectado|Histórico).
   * Convierte los valores de la tabla. Si se omite, no se muestra (GDD/GDCV ROI heredan moneda del heading).
   */
  onCurrencyChange?: (currency: GddRoiCurrency) => void
}

export function GddRoiRecuperoTable({
  variant,
  onVariantChange,
  currency,
  proyectadoData = gddRoiProyectado,
  historicoData = gddRoiHistorico,
  tipoCambio = TIPO_CAMBIO_ARS,
  layout = "page",
  hideTitle = false,
  showColumnVisibility = true,
  onCurrencyChange,
}: GddRoiRecuperoTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const isMobile = useIsMobile()

  useEffect(() => {
    setColumnVisibility({})
  }, [variant])

  const columns = useMemo(
    () =>
      variant === "proyectado"
        ? buildProyectadoColumns(currency, tipoCambio, isMobile)
        : buildHistoricoColumns(currency, tipoCambio, isMobile),
    [variant, currency, tipoCambio, isMobile]
  )

  const data = variant === "proyectado" ? proyectadoData : historicoData

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

  const isEmbedded = layout === "embedded" || hideTitle
  const stickySurface = isEmbedded ? "popover" : "background"

  const variantTabsControl = (
    <TabsForBlocks
      width="fill"
      className={cn(
        "h-8 w-full min-w-0 shrink-0",
        showColumnVisibility && !isEmbedded && "flex-1 sm:flex-initial"
      )}
      tabs={[...variantTabs]}
      value={variant}
      onValueChange={(v) => onVariantChange(v as GddRoiTableVariant)}
    />
  )

  const currencyControl = onCurrencyChange ? (
    <TabsForBlocks
      width="fit"
      className="h-8 shrink-0"
      tabs={currencyTabsForBlocks}
      value={currency}
      onValueChange={(v) => onCurrencyChange(v as GddRoiCurrency)}
    />
  ) : null

  const toolbar = isEmbedded ? (
    <div
      className={cn(
        "pb-4",
        currencyControl &&
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      )}
    >
      {variantTabsControl}
      {currencyControl}
    </div>
  ) : (
    <div className="flex flex-col gap-4 p-6 pb-0 sm:flex-row sm:items-center sm:justify-between">
      <Heading level="h3">Tabla Recupero de Inversión</Heading>
      <div
        className={cn(
          "flex w-full min-w-0 items-center gap-4",
          showColumnVisibility ? "sm:ml-auto sm:w-auto" : "w-full"
        )}
      >
        {variantTabsControl}
        {showColumnVisibility ? (
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
        ) : null}
      </div>
    </div>
  )

  const tableBlock = (
    <div className={cn("space-y-6", isEmbedded ? "pt-0" : "p-6 pt-4")}>
      <div className={cn(isEmbedded && "min-w-0 overflow-x-auto")}>
        <Table aria-label={tableAriaLabel}>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="h-14 hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-sm font-medium text-muted-foreground",
                      stickyStartCellClassName(
                        header.column.columnDef.meta,
                        { surface: stickySurface }
                      )
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
                    className={stickyStartCellClassName(
                      cell.column.columnDef.meta,
                      { surface: stickySurface }
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
  )

  if (isEmbedded) {
    return (
      <div className="flex min-h-0 flex-col">
        {toolbar}
        {tableBlock}
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white shadow-xs">
      {toolbar}
      {tableBlock}
    </div>
  )
}
