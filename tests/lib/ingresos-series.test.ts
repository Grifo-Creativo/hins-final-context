import { describe, it, expect } from "vitest"

import { ingresosMensualesPorPeriodo } from "@/lib/ingresos-series"
import type { FilaResumenIngreso } from "@/lib/api/types"

const fila = (periodo: string, montoArs: string): FilaResumenIngreso => ({
  periodo,
  montoArs,
  energiaKwh: 1,
  registros: 1,
  valorInyeccionPromedio: 1,
})

describe("ingresosMensualesPorPeriodo", () => {
  it("indexa el monto (string) por período YYYY-MM", () => {
    const map = ingresosMensualesPorPeriodo([fila("2026-03", "242000.00"), fila("2026-04", "248143.00")])
    expect(map.get("2026-03")).toBe("242000.00")
    expect(map.get("2026-04")).toBe("248143.00")
  })
  it("conserva meses con ingreso cero (no se omiten)", () => {
    const map = ingresosMensualesPorPeriodo([fila("2026-02", "0.00")])
    expect(map.get("2026-02")).toBe("0.00")
  })
  it("ignora filas que no son mensuales (total, día)", () => {
    const map = ingresosMensualesPorPeriodo([fila("total", "1.00"), fila("2026-04-01", "2.00")])
    expect(map.size).toBe(0)
  })
  it("lista vacía → mapa vacío", () => {
    expect(ingresosMensualesPorPeriodo([]).size).toBe(0)
  })
})
