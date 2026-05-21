// lib/chart-bar-density.ts

/** Tooltip habilitado en desktop hasta esta cantidad de barras. */
export const CHART_BAR_TOOLTIP_MAX_DESKTOP = 12

/** Tooltip habilitado en mobile hasta esta cantidad de barras. */
export const CHART_BAR_TOOLTIP_MAX_MOBILE = 6

/** LabelList sobre barras solo hasta esta cantidad. */
export const CHART_BAR_LABELS_MAX = 6

export type ChartBarDensity = {
  barSize: number
  showTooltip: boolean
  showBarLabels: boolean
  xAxisAngle: number
  xAxisHeight: number
  /** Recharts `interval` en XAxis — 0 = todas, 1 = cada 2ª etiqueta. */
  xAxisInterval: number
}

export function getChartBarDensity(
  barCount: number,
  isMobile: boolean
): ChartBarDensity {
  const showTooltip = isMobile
    ? barCount <= CHART_BAR_TOOLTIP_MAX_MOBILE
    : barCount <= CHART_BAR_TOOLTIP_MAX_DESKTOP

  return {
    barSize:
      barCount <= 6 ? 56 : barCount <= 12 ? 28 : barCount <= 20 ? 14 : 8,
    showTooltip,
    showBarLabels: barCount <= CHART_BAR_LABELS_MAX,
    xAxisAngle: barCount > 8 ? -40 : 0,
    xAxisHeight: barCount > 8 ? 56 : 32,
    xAxisInterval: barCount > 24 ? 2 : barCount > 16 ? 1 : 0,
  }
}
