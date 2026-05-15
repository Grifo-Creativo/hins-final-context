// lib/roi-curve-to-projection.ts
/** Adapt RoiCurvePoint (miles ARS + labels de período) → ROIDataPoint (pesos + YYYY-MM) para ROIProjectionChart. */

import type { RoiCurvePoint } from "@/data/gdd-roi-mock"
import type { ROIDataPoint } from "@/data/gdcv-roi-mock"

const MONTH_TOKEN: Record<string, string> = {
  ENE: "01",
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  ABR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AGO: "08",
  AUG: "08",
  SEP: "09",
  SET: "09",
  OCT: "10",
  OKT: "10",
  NOV: "11",
  DIC: "12",
  DEC: "12",
}

/** Parse "Mar 24" / "DIC 24" → "2024-03". Fallback secuencial por índice si el label no matchea. */
export function parseRoiLabelToFecha(label: string, index: number): string {
  const compact = label
    .trim()
    .toUpperCase()
    .replace(/\./g, "")
    .replace(/–|—/g, " ")
  const m = compact.match(/^([A-Z]{3})\s+(\d{2})$/)
  if (m) {
    const mon = MONTH_TOKEN[m[1]]
    if (mon) {
      const yy = parseInt(m[2], 10)
      const year = 2000 + yy
      return `${year}-${mon}`
    }
  }
  const y = 2024 + Math.floor(index / 12)
  const mo = (index % 12) + 1
  return `${y}-${String(mo).padStart(2, "0")}`
}

function lastRealIndex(data: RoiCurvePoint[]): number {
  let last = -1
  for (let i = 0; i < data.length; i++) {
    if (data[i].real != null && !Number.isNaN(data[i].real as number)) last = i
  }
  return last
}

export function inferFechaHoyFromCurve(data: RoiCurvePoint[], fechas: string[]): string {
  const idx = lastRealIndex(data)
  if (idx >= 0) return fechas[idx]
  return fechas[0] ?? "2024-01"
}

/**
 * Valores en `RoiCurvePoint` están en **miles** de ARS; salida en pesos para ROIProjectionChart.
 */
export function convertRoiCurveToProjectionData(
  data: RoiCurvePoint[],
  opts: { scenarioSpread?: number } = {}
): ROIDataPoint[] {
  const scenarioSpread = opts.scenarioSpread ?? 0.14
  const fechas = data.map((d, i) => parseRoiLabelToFecha(d.label, i))
  const lastRealIx = lastRealIndex(data)
  const scenarioStartIx = lastRealIx + 1
  const n = data.length
  const lastIx = Math.max(n - scenarioStartIx - 1, 1)

  return data.map((d, ix) => {
    const fecha = fechas[ix]
    const toAbs = (v: number | null | undefined) =>
      v == null || Number.isNaN(v) ? undefined : Math.round(v * 1000)

    const real = toAbs(d.real)

    let base: number | undefined
    let favorable: number | undefined
    let riesgo: number | undefined

    const projected = d.projected
    if (
      projected != null &&
      !Number.isNaN(projected) &&
      (ix === lastRealIx || ix >= scenarioStartIx)
    ) {
      const t = Math.max(0, (ix - scenarioStartIx) / lastIx)
      const baseK = projected
      base = Math.round(baseK * 1000)
      favorable = Math.round(
        (d.projectedOptimista ?? baseK * (1 + scenarioSpread * t)) * 1000
      )
      riesgo = Math.round(
        (d.projectedConservador ?? baseK * (1 - scenarioSpread * t)) * 1000
      )
    }

    return { fecha, real, base, favorable, riesgo }
  })
}
