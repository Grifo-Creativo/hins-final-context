// components/gdd/chart-range-options.ts
import type { ChartRangeChip } from "@/types/chart-range"

/** Opciones estándar — mismas etiquetas para todos los bar charts con filtros de rango. */
export const CHART_RANGE_CHIP_OPTIONS: { id: ChartRangeChip; label: string }[] = [
  { id: "1m", label: "1M" },
  { id: "3m", label: "3M" },
  { id: "6m", label: "6M" },
  { id: "1a", label: "1A" },
  { id: "todo", label: "TODO" },
]

/** Tabs listos para `CardWithContent` / `TabsForBlocks`. */
export const CHART_RANGE_TABS = CHART_RANGE_CHIP_OPTIONS.map((o) => ({
  value: o.id,
  label: o.label,
}))
