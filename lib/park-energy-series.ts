import type { RegistroEnergiaDia, RegistroEnergiaDiario, RegistroEnergiaMensual } from "@/lib/api/types"
import { formatCurrency } from "@/lib/format-currency"
import { formatPeriodoLabel } from "@/lib/format-periodo"
import type { ChartRangeChip } from "@/types/chart-range"
import type { ConsumptionHistoryRow } from "@/data/gdd-performance-mock"

export type ParkEnergyRow = {
  label: string
  generated: number
  hasData: boolean
}

function sortByPeriodoAscDeduped(registros: RegistroEnergiaMensual[]): RegistroEnergiaMensual[] {
  const byPeriodo = new Map<string, RegistroEnergiaMensual>()
  for (const registro of registros) {
    byPeriodo.set(registro.periodo, registro)
  }
  return [...byPeriodo.values()].sort((a, b) => a.periodo.localeCompare(b.periodo))
}

/**
 * Mapea registros mensuales reales a las filas que ya consume ParkEnergyBarChart,
 * acotando por rango. Cada registro es ya un punto mensual — no se agrega/suma
 * nada dentro de un bucket (ver research.md Decision 3).
 */
export function getRealParkEnergySeries(
  registros: RegistroEnergiaMensual[],
  range: ChartRangeChip
): ParkEnergyRow[] {
  const sorted = sortByPeriodoAscDeduped(registros)

  const sliced = (() => {
    switch (range) {
      case "6m":
        return sorted.slice(-6)
      case "1a":
        return sorted.slice(-12)
      case "todo":
        return sorted
      case "1m":
      case "1d":
      default:
        return []
    }
  })()

  return sliced.map((registro) => ({
    label: formatPeriodoLabel(registro.periodo),
    generated: registro.energiaMesKwh ?? 0,
    hasData: registro.energiaMesKwh !== null && registro.energiaMesKwh !== undefined,
  }))
}

function formatKwh(value: number): string {
  return `${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })} kWh`
}

/**
 * Filas de la tabla "Historial de Generación" (ConsumptionHistoryTable) con
 * datos reales para período, energía generada e ingresos por inyección
 * (GET /parques/{id}/ingresos/resumen agrupar=mes). Las columnas sin dato real
 * (adquirida, otras fuentes, total, porcentajes) se muestran con guion.
 */
export function getGenerationHistoryRows(
  registros: RegistroEnergiaMensual[],
  ingresosPorPeriodo: Map<string, string> | null = null
): ConsumptionHistoryRow[] {
  const sorted = sortByPeriodoAscDeduped(registros).reverse()

  return sorted.map((registro) => ({
    period: formatPeriodoLabel(registro.periodo),
    energyGenerated: formatKwh(registro.energiaMesKwh ?? 0),
    // Sin dato real (pendiente de definición de producto): guion, no cero.
    energyAcquired: "—",
    energyFromOtherSources: "—",
    totalEnergy: "—",
    acquiredPercent: "—",
    totalPercent: "—",
    // Ingresos por inyección reales; mes ausente = 0 (backend rellena ceros); sin datos = guion.
    estimatedSavings:
      ingresosPorPeriodo === null
        ? "—"
        : formatCurrency(Number(ingresosPorPeriodo.get(registro.periodo) ?? 0), "ars", "full"),
  }))
}

function sortByFechaAscDeduped(registros: RegistroEnergiaDiario[]): RegistroEnergiaDiario[] {
  const byFecha = new Map<string, RegistroEnergiaDiario>()
  for (const registro of registros) {
    byFecha.set(registro.fecha, registro)
  }
  return [...byFecha.values()].sort((a, b) => a.fecha.localeCompare(b.fecha))
}

/** Suma de energiaDiaKwh del mes (nulls tratados como 0) — total de la card destacada. */
export function getMonthlyGenerationTotal(registros: RegistroEnergiaDiario[]): number {
  return sortByFechaAscDeduped(registros).reduce(
    (total, registro) => total + (registro.energiaDiaKwh ?? 0),
    0
  )
}

/** Un punto por día real, orden cronológico — sparkline de la card destacada. */
export function getMonthlySparklinePoints(registros: RegistroEnergiaDiario[]): { value: number }[] {
  return sortByFechaAscDeduped(registros).map((registro) => ({
    value: registro.energiaDiaKwh ?? 0,
  }))
}

/**
 * Si el endpoint diario puntual devuelve más de un registro para el mismo día,
 * se usa el de `capturadoEn` más reciente — ver research.md Decision 2.
 */
export function getRegistroMasRecienteDelDia(registros: RegistroEnergiaDia[]): RegistroEnergiaDia | null {
  if (registros.length === 0) {
    return null
  }
  return [...registros].sort((a, b) => b.capturadoEn.localeCompare(a.capturadoEn))[0]
}

/** Registros del día ordenados por `capturadoEn` ascendente — serie horaria real para graficar. */
export function getRegistrosDelDiaOrdenados(registros: RegistroEnergiaDia[]): RegistroEnergiaDia[] {
  return [...registros].sort((a, b) => a.capturadoEn.localeCompare(b.capturadoEn))
}

/**
 * Registro mensual del mes calendario actual dentro de la misma serie ya
 * consultada para 6M/1A/TODO — sin pedido adicional al backend (research.md
 * Decision 4).
 */
export function getRegistroDelMesActual(
  registros: RegistroEnergiaMensual[],
  periodoActual: string
): RegistroEnergiaMensual | null {
  return registros.find((registro) => registro.periodo === periodoActual) ?? null
}
