import type { FilaResumenIngreso } from "@/lib/api/types"

const PERIODO_MENSUAL = /^\d{4}-\d{2}$/

/**
 * Indexa el resumen mensual de ingresos por período `YYYY-MM`. El backend ya
 * rellena con ceros los meses sin ingresos (agrupar=mes); se conserva el monto
 * como string para no perder precisión.
 */
export function ingresosMensualesPorPeriodo(items: FilaResumenIngreso[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const item of items) {
    if (PERIODO_MENSUAL.test(item.periodo)) map.set(item.periodo, item.montoArs)
  }
  return map
}
