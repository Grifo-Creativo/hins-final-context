// lib/format-chart-period-tooltip.ts

const MONTH_MAP: Record<string, string> = {
  Ene: "Enero",
  Feb: "Febrero",
  Mar: "Marzo",
  Abr: "Abril",
  May: "Mayo",
  Jun: "Junio",
  Jul: "Julio",
  Ago: "Agosto",
  Sep: "Septiembre",
  Oct: "Octubre",
  Nov: "Noviembre",
  Dic: "Diciembre",
}

/**
 * Formats a short period label (e.g. "Jun 25", "Abr 26") into a full
 * tooltip label (e.g. "Junio 2025", "Abril 2026").
 * If the input doesn't match the expected pattern it is returned as-is.
 */
export function formatChartPeriodTooltipLabel(value: string): string {
  const parts = value.trim().split(/\s+/)
  if (parts.length !== 2) return value

  const [abbr, yearShort] = parts
  const fullMonth = MONTH_MAP[abbr]
  if (!fullMonth) return value

  const year =
    yearShort.length === 2 ? `20${yearShort}` : yearShort

  return `${fullMonth} ${year}`
}
