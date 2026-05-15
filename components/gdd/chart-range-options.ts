// components/gdd/chart-range-options.ts
import type { ChartRangeChip } from "@/types/chart-range"

/** Opciones estándar 1M / 3M / 6M — mismas etiquetas para todos los charts con filtros de rango. */
export const CHART_RANGE_CHIP_OPTIONS: { id: ChartRangeChip; label: string }[] = [
  { id: "1m", label: "1M" },
  { id: "3m", label: "3M" },
  { id: "6m", label: "6M" },
]
