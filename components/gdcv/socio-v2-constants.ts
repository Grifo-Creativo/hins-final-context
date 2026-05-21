// components/gdcv/socio-v2-constants.ts
import type { ChartRangeChip } from "@/types/chart-range"
import { DollarSignIcon, ZapIcon } from "lucide-react"

export type SocioV2Unit = "dinero" | "energia"

/** Toggle $ / ⚡ — usar con `TabsForBlocks variant="icon"`. */
export const SOCIO_V2_UNIT_TABS = [
  {
    value: "dinero" as const,
    label: "Dinero",
    icon: DollarSignIcon,
    ariaLabel: "Dinero",
  },
  {
    value: "energia" as const,
    label: "Energía",
    icon: ZapIcon,
    ariaLabel: "Energía",
  },
]

/** Tabs de texto para desglose — perspectiva Dinero / Energía. */
export const SOCIO_V2_UNIT_TEXT_TABS = SOCIO_V2_UNIT_TABS.map(
  ({ value, label }) => ({ value, label })
)

/** Chips de rango alineados al mockup V2 (DIA = vista semanal / 1M interno). */
export const SOCIO_V2_RANGE_TABS: { value: ChartRangeChip; label: string }[] = [
  { value: "1m", label: "DIA" },
  { value: "6m", label: "6M" },
  { value: "1a", label: "1A" },
  { value: "todo", label: "TODO" },
]

export function getSocioV2ChartSubtitle(range: ChartRangeChip): string {
  if (range === "6m" || range === "1m") {
    return "Weekly overview"
  }
  if (range === "1a") {
    return "Últimos 12 meses"
  }
  if (range === "todo") {
    return "Desde Marzo 2024 — mensual"
  }
  return "Weekly overview"
}

export function getSocioV2ChartTitle(unit: "dinero" | "energia"): string {
  return unit === "dinero" ? "Mi Ahorro Generado" : "Mi Energía Generada"
}
