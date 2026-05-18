// lib/chart-range-resolve.ts
import type { ChartRangeChip } from "@/types/chart-range"

type ResolveChartRangeOptions<T> = {
  weekly: readonly T[]
  monthly: readonly T[]
  /** Etiqueta legible del inicio de operaciones del parque (p. ej. "Mayo 2025"). */
  operationsStartLabel: string
}

export function sliceChartRangeSeries<T>(
  range: ChartRangeChip,
  monthly: readonly T[],
  weekly: readonly T[]
): T[] {
  switch (range) {
    case "1m":
      return weekly.map((r) => ({ ...r }))
    case "3m":
      return monthly.slice(-3).map((r) => ({ ...r }))
    case "6m":
      return monthly.slice(-6).map((r) => ({ ...r }))
    case "1a":
      return monthly.slice(-12).map((r) => ({ ...r }))
    case "todo":
      return monthly.map((r) => ({ ...r }))
    default:
      return []
  }
}

export function getChartRangeSubtitle(
  range: ChartRangeChip,
  operationsStartLabel: string
): string {
  switch (range) {
    case "1m":
      return "Períodos semanales"
    case "3m":
    case "6m":
      return "Períodos mensuales"
    case "1a":
      return "Últimos 12 meses"
    case "todo":
      return `Desde ${operationsStartLabel} — mensual`
    default:
      return ""
  }
}

export function resolveChartRange<T>(
  range: ChartRangeChip,
  opts: ResolveChartRangeOptions<T>
): { data: T[]; subtitle: string } {
  return {
    data: sliceChartRangeSeries(range, opts.monthly, opts.weekly),
    subtitle: getChartRangeSubtitle(range, opts.operationsStartLabel),
  }
}
