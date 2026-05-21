// data/gdd-roi-mock.ts

import type { ChartRangeChip } from "@/types/chart-range"

export type RoiCurvePoint = {
  label: string
  real: number | null
  projected: number | null
  /** Si el backend provee escenario optimista por punto — si no, se deriva desde `projected`. */
  projectedOptimista?: number | null
  /** Si el backend provee escenario conservador por punto — si no, se deriva desde `projected`. */
  projectedConservador?: number | null
}

export const roiSummaryCards = {
  totalSavings: {
    label: "Ahorro total generado",
    value: "$14.200.000",
    badge: "+8% anual",
  },
  initialInvestment: {
    label: "Inversión inicial",
    value: "$38.000.000",
    recoveredPercent: 37,
  },
  payback: {
    label: "Payback estimado",
    value: "6,8 años",
    subtitle: "Desde Marzo 2024",
  },
}

export const roiSecondaryMetrics = {
  irr: {
    label: "TIR (actualizada)",
    value: "16.2%",
  },
  operationsStart: {
    label: "Inicio de operaciones",
    value: "Junio 2023",
  },
}

/**
 * Serie canónica mensual — valores en **miles de ARS** (coherente con KPIs: ÷1000 → $M en leyendas).
 * 6M = últimos 6 puntos; 3M = últimos 3; 1M = serie semanal aparte — §5 UX.
 */
const ROI_CURVE_MONTHLY_CANONICAL: readonly RoiCurvePoint[] = [
  { label: "SEP 24", real: 4472, projected: null },
  { label: "DIC 24", real: 7265, projected: null },
  { label: "MAR 25", real: 9246, projected: null },
  { label: "JUN 25", real: 11558, projected: null },
  { label: "SEP 25", real: 12879, projected: null },
  { label: "DIC 25", real: 14200, projected: 14200 },
  { label: "MAR 26", real: null, projected: 15500 },
  { label: "JUN 26", real: null, projected: 22000 },
  { label: "SEP 26", real: null, projected: 28000 },
  { label: "DIC 26", real: null, projected: 32000 },
  { label: "MAR 27", real: null, projected: 35000 },
  { label: "JUN 27", real: null, projected: 38500 },
]

/** Cuatro puntos semanales sobre el tramo **real** más reciente (diciembre hacia punta Mensual). */
const ROI_CURVE_WEEKLY_TRAILING: readonly RoiCurvePoint[] = [
  { label: "3–10 Dic", real: 13336, projected: null },
  { label: "11–17 Dic", real: 13605, projected: null },
  { label: "18–24 Dic", real: 13910, projected: null },
  { label: "25–31 Dic", real: 14200, projected: null },
]

function sliceLastMonths(points: readonly RoiCurvePoint[], count: 3 | 6): RoiCurvePoint[] {
  return points.slice(-count).map((p) => ({ ...p }))
}

export function getRoiCurveSeries(range: ChartRangeChip): RoiCurvePoint[] {
  switch (range) {
    case "1m":
      return ROI_CURVE_WEEKLY_TRAILING.map((p) => ({ ...p }))
    case "6m":
      return sliceLastMonths(ROI_CURVE_MONTHLY_CANONICAL, 6)
    default:
      return []
  }
}

/** Payback sobre el chart completo; ocultar en 1M (ventana solo real reciente). */
export function getRoiPaybackDotForRange(
  range: ChartRangeChip
): { label: string; value: number; text: string } | null {
  if (range === "1m") return null
  return paybackPoint
}

export function getRoiRecoveryChartSubtitle(range: ChartRangeChip): string {
  switch (range) {
    case "1m":
      return "Agregación semanal (cuatro semanas sobre crédito acumulado observado)."
    case "6m":
      return "Agregación mensual — últimos 6 meses hasta la proyección."
    default:
      return ""
  }
}

/** Compatibilidad: curva legacy de referencia = vista 6M. */
export const roiCurveData: RoiCurvePoint[] = getRoiCurveSeries("6m")

/**
 * Sparkline para KpiPrimary "Ahorro Total Generado" en GDD_02.
 * Derivado de los valores reales de la curva canónica — tendencia ascendente.
 */
export const roiSavingsSparklinePoints: { value: number }[] = [
  { value: 4472 },
  { value: 7265 },
  { value: 9246 },
  { value: 11558 },
  { value: 12879 },
  { value: 14200 },
]

export const investmentReferenceValue = 38000

export const paybackPoint = {
  label: "JUN 27",
  value: 38500,
  text: "Payback\n(6,8 años)",
}
