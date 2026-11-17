import { describe, it, expect } from "vitest"

import { buildSociosTotals, mapSocioToRow, TIPO_CARGO_LABELS } from "@/lib/socio-presentation"
import type { IngresoPorSocio, IngresosPorSocio, Socio } from "@/lib/api/types"

function socio(overrides: Partial<Socio> = {}): Socio {
  return {
    id: "s1",
    parqueId: "p1",
    nombre: "Alfredo Isaac SA",
    participacionPorcentaje: 15,
    tipoCargo: "SIN_POTENCIA",
    medidorNumero: "3543871",
    suministroNumero: "",
    contratoNumero: "",
    usuarioId: null,
    ...overrides,
  }
}

describe("mapSocioToRow", () => {
  it("maps nombre, medidorNumero and participacionPorcentaje", () => {
    const row = mapSocioToRow(socio())
    expect(row.id).toBe("s1")
    expect(row.nombre).toBe("Alfredo Isaac SA")
    expect(row.medidor).toBe("3543871")
    expect(row.participacion).toBe("15%")
  })

  it("sin datos de ingresos (no cargados) las columnas quedan en guion", () => {
    const row = mapSocioToRow(socio())
    expect(row.potenciaAsociada).toBe("—")
    expect(row.energiaGenerada).toBe("—")
    expect(row.ahorroGenerado).toBe("—")
  })

  it("never sets medidores (multi-medidor) or tipo — no backend equivalent", () => {
    const row = mapSocioToRow(socio())
    expect(row.medidores).toBeUndefined()
    expect(row.tipo).toBeUndefined()
  })
})

function ingreso(over: Partial<IngresoPorSocio> = {}): IngresoPorSocio {
  return {
    socioId: "s1",
    nombre: "Alfredo Isaac SA",
    participacionPorcentaje: 15,
    potenciaAsociadaKwp: 147,
    medidores: [{ medidorId: "m1", numeroSerie: "354904", energiaKwh: 17.1, montoArs: "34200.00" }],
    energiaKwh: 17.1,
    montoArs: "34200.00",
    esquema: "PARQUE",
    sinMedidor: false,
    sinIngresos: false,
    ...over,
  }
}

describe("mapSocioToRow con ingresos reales", () => {
  it("mapea potencia, energía e ingreso por inyección", () => {
    const row = mapSocioToRow(socio(), ingreso())
    expect(row.potenciaAsociada).toBe("147 kWp")
    expect(row.energiaGenerada).toBe("17,1 kWh")
    expect(row.ahorroGenerado).toBe("$ 34.200")
    expect(row.esquema).toBe("PARQUE")
    expect(row.estado).toBeUndefined()
  })

  it("socio con un solo medidor no expone desglose", () => {
    expect(mapSocioToRow(socio(), ingreso()).medidores).toBeUndefined()
  })

  it("socio con dos medidores expone desglose y la suma coincide con la fila", () => {
    const row = mapSocioToRow(
      socio(),
      ingreso({
        medidores: [
          { medidorId: "m1", numeroSerie: "354904", energiaKwh: 11.4, montoArs: "22800.00" },
          { medidorId: "m2", numeroSerie: "354906", energiaKwh: 5.7, montoArs: "11400.00" },
        ],
      })
    )
    expect(row.medidores).toHaveLength(2)
    expect(row.medidores?.[0]).toMatchObject({ numero: "354904", energiaGenerada: "11,4 kWh", ahorroGenerado: "$ 22.800" })
    expect(row.medidores?.[1].ahorroGenerado).toBe("$ 11.400")
  })

  it("socio sin medidor: estado sin-medidor y valores en guion", () => {
    const row = mapSocioToRow(socio(), ingreso({ sinMedidor: true, sinIngresos: true, medidores: [], energiaKwh: 0, montoArs: "0.00" }))
    expect(row.estado).toBe("sin-medidor")
    expect(row.energiaGenerada).toBe("—")
    expect(row.ahorroGenerado).toBe("—")
  })

  it("socio con medidor sin ingresos: estado sin-ingresos y cero real", () => {
    const row = mapSocioToRow(socio(), ingreso({ sinIngresos: true, energiaKwh: 0, montoArs: "0.00" }))
    expect(row.estado).toBe("sin-ingresos")
    expect(row.ahorroGenerado).toBe("$ 0")
  })

  it("usa potenciaAsociadaKwp del socio cuando no hay ingresos cargados", () => {
    expect(mapSocioToRow(socio({ potenciaAsociadaKwp: 98 })).potenciaAsociada).toBe("98 kWp")
  })
})

describe("buildSociosTotals", () => {
  const data: IngresosPorSocio = {
    desde: "2026-04-01T00:00:00-03:00",
    hasta: "2026-05-01T00:00:00-03:00",
    items: [],
    total: { energiaKwh: 34.2, montoArs: "68400.00", participacionPorcentaje: 90 },
  }
  it("usa los totales del backend y muestra la participación real (detecta ≠ 100%)", () => {
    expect(buildSociosTotals(data)).toEqual({
      participacion: "90%",
      energiaGenerada: "34,2 kWh",
      ahorroGenerado: "$ 68.400",
      participacionInconsistente: true,
    })
  })
  it("participación 100% es consistente", () => {
    expect(buildSociosTotals({ ...data, total: { ...data.total, participacionPorcentaje: 100 } }).participacionInconsistente).toBe(false)
  })
})

describe("TIPO_CARGO_LABELS", () => {
  it("maps CON_POTENCIA and SIN_POTENCIA to Spanish labels", () => {
    expect(TIPO_CARGO_LABELS.CON_POTENCIA).toBe("Con Potencia")
    expect(TIPO_CARGO_LABELS.SIN_POTENCIA).toBe("Sin Potencia")
  })
})
