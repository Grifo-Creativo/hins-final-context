import type { IngresoPorSocio, IngresosPorSocio, Socio, TipoCargo } from "@/lib/api/types"
import type { MedidorDetalle, SocioRow } from "@/data/gdcv-mock"
import { formatCurrency } from "@/lib/format-currency"
import { parseMonto } from "@/lib/ingresos-kpis"

export const TIPO_CARGO_LABELS: Record<TipoCargo, string> = {
  CON_POTENCIA: "Con Potencia",
  SIN_POTENCIA: "Sin Potencia",
}

const NO_DATA = "—"

function formatKwh(value: number): string {
  return `${value.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kWh`
}

function formatKwp(value: number): string {
  return `${value.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kWp`
}

function formatIngreso(montoArs: string): string {
  return formatCurrency(parseMonto(montoArs), "ars", "full")
}

/**
 * Fila de la tabla de socios. Con `ingreso` (GET /ingresos/por-socio, alcance SOCIOS) usa
 * potencia, energía e ingreso por inyección reales; sin él (bloque no cargado) esas
 * columnas quedan en "—" en vez de inventar un valor. `ahorroGenerado` conserva su nombre
 * por compatibilidad del tipo, pero contiene el ingreso por inyección.
 * Un socio sin medidor muestra guion; sin ingresos en el período muestra cero real.
 */
export function mapSocioToRow(socio: Socio, ingreso?: IngresoPorSocio | null): SocioRow {
  const base: SocioRow = {
    id: socio.id,
    nombre: socio.nombre,
    medidor: socio.medidorNumero,
    participacion: `${socio.participacionPorcentaje}%`,
    potenciaAsociada: socio.potenciaAsociadaKwp !== undefined ? formatKwp(socio.potenciaAsociadaKwp) : NO_DATA,
    energiaGenerada: NO_DATA,
    ahorroGenerado: NO_DATA,
  }
  if (!ingreso) return base

  const row: SocioRow = {
    ...base,
    potenciaAsociada: formatKwp(ingreso.potenciaAsociadaKwp),
    esquema: ingreso.esquema,
  }

  if (ingreso.sinMedidor) return { ...row, estado: "sin-medidor" }

  row.energiaGenerada = formatKwh(ingreso.energiaKwh)
  row.ahorroGenerado = formatIngreso(ingreso.montoArs)
  if (ingreso.sinIngresos) row.estado = "sin-ingresos"

  if (ingreso.medidores.length > 1) {
    row.medidores = ingreso.medidores.map(
      (m): MedidorDetalle => ({
        numero: m.numeroSerie,
        // El backend no informa participación ni potencia por medidor.
        participacion: NO_DATA,
        potenciaAsociada: NO_DATA,
        energiaGenerada: formatKwh(m.energiaKwh),
        ahorroGenerado: formatIngreso(m.montoArs),
      })
    )
  }
  return row
}

export interface SociosTotals {
  participacion: string
  energiaGenerada: string
  ahorroGenerado: string
  /** La suma real de participaciones no es 100%: permite detectar la inconsistencia. */
  participacionInconsistente: boolean
}

/** Totales al pie de la tabla: los calcula el backend (suma exacta, redondeo único). */
export function buildSociosTotals(data: IngresosPorSocio): SociosTotals {
  const { participacionPorcentaje, energiaKwh, montoArs } = data.total
  return {
    participacion: `${participacionPorcentaje.toLocaleString("es-AR", { maximumFractionDigits: 2 })}%`,
    energiaGenerada: formatKwh(energiaKwh),
    ahorroGenerado: formatIngreso(montoArs),
    participacionInconsistente: Math.abs(participacionPorcentaje - 100) > 0.001,
  }
}
