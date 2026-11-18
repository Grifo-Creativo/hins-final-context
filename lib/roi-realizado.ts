import type { ROIDataPoint } from "@/data/gdd-roi-mock"
import type { RoiRealizado } from "@/lib/api/types"
import { formatPeriodoLabel } from "@/lib/format-periodo"
import { parseMonto } from "@/lib/ingresos-kpis"

const toNumberOrNull = (v: string | null): number | null => (v === null ? null : parseMonto(v))

export interface RoiRealizadoView {
  hayDatos: boolean
  sinInversionMeta: boolean
  totalInvertidoUsd: number | null
  recuperadoUsd: number
  /** Σ ingresos ARS de todos los meses: no requiere conversión, así que incluye los meses sin tipo de cambio. */
  recuperadoArs: number
  pendienteUsd: number | null
  porcentaje: number | null
  /** Tipo de cambio REAL del último mes que lo tiene; null si ninguno. */
  tipoCambioActual: number | null
  mesesSinTipoCambio: string[]
  timeline: { inicio: string; hoy: string; anios: string; pct: number | null }
}

/** KPIs de ROI realizado: acumulado/pendiente/% los calcula el backend; el front solo los adapta. */
export function buildRoiRealizadoView(roi: RoiRealizado): RoiRealizadoView {
  const { meses, resumen } = roi
  const ultimo = meses[meses.length - 1]
  const ultimoConTc = [...meses].reverse().find((m) => m.tipoCambio !== null)

  return {
    hayDatos: meses.length > 0,
    sinInversionMeta: roi.sinInversionMeta,
    totalInvertidoUsd: roi.inversionMeta?.valor ?? null,
    recuperadoUsd: parseMonto(resumen.acumuladoUsd),
    recuperadoArs: meses.reduce((sum, m) => sum + parseMonto(m.ingresoArs), 0),
    pendienteUsd: toNumberOrNull(resumen.pendienteUsd),
    porcentaje: resumen.porcentajeRecuperado,
    tipoCambioActual: ultimoConTc?.tipoCambio?.valor ?? null,
    mesesSinTipoCambio: resumen.mesesSinTipoCambio,
    timeline: {
      inicio: formatPeriodoLabel(roi.fechaPuestaEnMarcha.slice(0, 7)),
      hoy: ultimo ? formatPeriodoLabel(ultimo.periodo) : "—",
      anios: resumen.aniosTranscurridos.toFixed(1),
      pct: resumen.porcentajeRecuperado,
    },
  }
}

export interface RoiHistoricoRow {
  periodo: string
  /** null cuando el mes no tiene tipo de cambio (no se estima). */
  capRecuperadoUsd: number | null
  capRecuperadoArs: number
  acumuladoUsd: number
  /** Suma corrida de ingresos ARS del mes (sin conversión). */
  acumuladoArs: number
  porcentaje: number | null
  tipoCambioFaltante: boolean
}

/** Filas de la tabla Histórico, del mes más reciente al más antiguo. */
export function buildHistoricoRealRows(roi: RoiRealizado): RoiHistoricoRow[] {
  let corridoArs = 0
  const asc = roi.meses.map((m) => {
    const ars = parseMonto(m.ingresoArs)
    corridoArs += ars
    return {
      periodo: formatPeriodoLabel(m.periodo),
      capRecuperadoUsd: toNumberOrNull(m.ingresoUsd),
      capRecuperadoArs: ars,
      acumuladoUsd: parseMonto(m.acumuladoUsd),
      acumuladoArs: corridoArs,
      porcentaje: m.porcentajeRecuperado,
      tipoCambioFaltante: m.tipoCambioFaltante,
    }
  })
  return asc.reverse()
}

function addMonths(periodo: string, n: number): string {
  const [y, m] = periodo.split("-").map(Number)
  const idx = y * 12 + (m - 1) + n
  return `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, "0")}`
}

/**
 * Serie de la curva: tramo real con `acumuladoUsd`; los escenarios (base/favorable/riesgo)
 * siguen siendo estimativos sin dato real (FR-018): se reusan los incrementos del mock
 * encadenados desde el último valor real, para que el cono nazca en el dato real.
 */
export function buildRoiChartData(
  roi: RoiRealizado,
  proyeccionMock: ROIDataPoint[]
): { data: ROIDataPoint[]; fechaHoy: string } {
  if (roi.meses.length === 0) return { data: [], fechaHoy: "" }

  const real: ROIDataPoint[] = roi.meses.map((m) => ({ fecha: m.periodo, real: parseMonto(m.acumuladoUsd) }))
  const ultimo = real[real.length - 1]
  const ref = [...proyeccionMock].reverse().find((p) => p.real !== undefined)?.real ?? 0
  const proj = proyeccionMock.filter((p) => p.base !== undefined)

  const estimativo: ROIDataPoint[] = proj.map((p, i) => ({
    fecha: addMonths(ultimo.fecha, i + 1),
    base: (ultimo.real ?? 0) + ((p.base ?? 0) - ref),
    favorable: (ultimo.real ?? 0) + ((p.favorable ?? 0) - ref),
    riesgo: (ultimo.real ?? 0) + ((p.riesgo ?? 0) - ref),
  }))

  return { data: [...real, ...estimativo], fechaHoy: ultimo.fecha }
}
