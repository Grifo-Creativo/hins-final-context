// components/ui/performance-placeholder-card.tsx
// Layout de fila Performance: flows/performance/about-performance-layout.md
import { CardWithContent } from "@/components/ui/card-with-content"
import { cn } from "@/lib/utils"

type PerformancePlaceholderCardProps = {
  /** Paridad de altura con el chart de la misma fila (300 admin/GDD, 260 socio Mi Espacio). */
  minChartHeight?: 300 | 260
}

/** Card vacía 1/3 de la fila — reserva espacio para contenido futuro. */
export function PerformancePlaceholderCard({
  minChartHeight = 300,
}: PerformancePlaceholderCardProps) {
  return (
    <CardWithContent title="" className="h-full">
      <div
        className={cn("w-full flex-1", minChartHeight === 260 ? "min-h-[260px]" : "min-h-[300px]")}
        aria-hidden
      />
    </CardWithContent>
  )
}

/** Grid fila superior Performance admin/GDD: placeholder 1/3 + chart 2/3 + KPI 340px. */
export const PERFORMANCE_TOP_ROW_GRID =
  "grid grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_340px]"

/**
 * GDD Performance con `ParkDetailsCard`: columna parque ~38% del espacio flexible.
 * Intermedio entre `PERFORMANCE_TOP_ROW_GRID` (1:2 ≈ 33%) y layout ancho (1.3:1.7 ≈ 43%).
 */
export const GDD_PERFORMANCE_TOP_ROW_GRID =
  "grid grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)_340px]"

/**
 * Mi Espacio socio: parque | chart (flex, prioridad) | panel Abril (fijo estrecho).
 * Orden DOM = orden visual. Panel 340px (paridad KPI Performance admin).
 */
export const SOCIO_ENERGY_TOP_ROW_GRID =
  "grid grid-cols-1 items-stretch gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2.25fr)_340px] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,2.4fr)_340px]"

/** Performance del Parque socio — columnas igual altura; chart flex-1 en card izquierda. */
export const SOCIO_PARQUE_TOP_ROW_GRID =
  "grid grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-[minmax(0,1.85fr)_340px]"
