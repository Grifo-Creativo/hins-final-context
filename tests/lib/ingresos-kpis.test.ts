import { describe, it, expect } from "vitest"

import {
  formatEnergiaAcumuladaTexto,
  formatVariacionPct,
  hayDatosIncompletos,
  mostrarPromedioPorUsuario,
  parseMonto,
  estadoIngresosKpis,
  ingresosMesCard,
  promedioPorUsuarioCard,
  tarifaVigenteCard,
} from "@/lib/ingresos-kpis"
import type { CoberturaIngresos, KpisIngresos } from "@/lib/api/types"

const cobertura = (over: Partial<CoberturaIngresos> = {}): CoberturaIngresos => ({
  registrosConEnergia: 100,
  registrosSinIngreso: 0,
  ultimoIngresoCalculadoEn: null,
  ...over,
})

function kpis(over: Partial<KpisIngresos> = {}): KpisIngresos {
  return {
    periodo: "2026-04",
    alcance: "PARQUE",
    mes: { montoArs: "248143.00", energiaKwh: 124.2, registros: 2880 },
    mesAnterior: { periodo: "2026-03", montoArs: "242000.00", energiaKwh: 120.1 },
    variacion: { montoPct: 2.3, energiaPct: 3.4 },
    acumulado: { desde: "2024-03-05", montoArs: "900000.00", energiaKwh: 13556 },
    tarifaInyeccionVigente: null,
    promedioPorSocio: null,
    cobertura: cobertura(),
    ...over,
  }
}

describe("parseMonto", () => {
  it("convierte string decimal a número", () => {
    expect(parseMonto("248143.00")).toBe(248143)
    expect(parseMonto("0.00")).toBe(0)
  })
  it("devuelve 0 ante valores inválidos", () => {
    expect(parseMonto("")).toBe(0)
    expect(parseMonto("abc")).toBe(0)
  })
})

describe("formatVariacionPct", () => {
  it("devuelve guion y sin dirección cuando es null (nunca ∞ ni 0%)", () => {
    expect(formatVariacionPct(null)).toEqual({ label: "—", direction: "none" })
  })
  it("marca subida con signo +", () => {
    expect(formatVariacionPct(2.3)).toEqual({ label: "+2,3%", direction: "up" })
  })
  it("marca bajada", () => {
    expect(formatVariacionPct(-5)).toEqual({ label: "-5%", direction: "down" })
  })
  it("0 es una variación válida sin dirección", () => {
    expect(formatVariacionPct(0)).toEqual({ label: "0%", direction: "flat" })
  })
})

describe("hayDatosIncompletos", () => {
  it("es true solo si registrosSinIngreso > 0", () => {
    expect(hayDatosIncompletos(cobertura({ registrosSinIngreso: 20 }))).toBe(true)
    expect(hayDatosIncompletos(cobertura())).toBe(false)
  })
})

describe("estadoIngresosKpis", () => {
  it("sin ingresos todavía cuando no hay registros ni acumulado", () => {
    const k = kpis({
      mes: { montoArs: "0.00", energiaKwh: 0, registros: 0 },
      acumulado: { desde: null, montoArs: "0.00", energiaKwh: 0 },
    })
    expect(estadoIngresosKpis(k)).toBe("sin-ingresos")
  })
  it("ok con ingresos", () => {
    expect(estadoIngresosKpis(kpis())).toBe("ok")
  })
  it("mes en cero pero con acumulado es ok (no es parque nuevo)", () => {
    const k = kpis({ mes: { montoArs: "0.00", energiaKwh: 0, registros: 0 } })
    expect(estadoIngresosKpis(k)).toBe("ok")
  })
})

describe("mostrarPromedioPorUsuario", () => {
  const promedio = { montoArs: "21836.00", sociosConIngreso: 11 }
  it("solo en GDCV y cuando el backend lo informa", () => {
    expect(mostrarPromedioPorUsuario("gdcv", kpis({ promedioPorSocio: promedio }))).toBe(true)
    expect(mostrarPromedioPorUsuario("gdd", kpis({ promedioPorSocio: promedio }))).toBe(false)
    expect(mostrarPromedioPorUsuario("gdcv", kpis({ promedioPorSocio: null }))).toBe(false)
  })
})

describe("formatEnergiaAcumuladaTexto", () => {
  it("usa la energía acumulada real", () => {
    expect(formatEnergiaAcumuladaTexto(kpis())).toBe("13.556 kWh desde el inicio")
  })
  it("devuelve guion si no hay acumulado", () => {
    const k = kpis({ acumulado: { desde: null, montoArs: "0.00", energiaKwh: 0 } })
    expect(formatEnergiaAcumuladaTexto(k)).toBe("—")
  })
})

describe("tarjetas KPI", () => {
  it("ingresosMesCard usa rótulo Ingresos por inyección y variación del backend", () => {
    const c = ingresosMesCard(kpis())
    expect(c.label).toContain("Ingresos por inyección")
    expect(c.label).not.toMatch(/ahorro/i)
    expect(c.delta).toBe("+2,3% Mes")
    expect(c.value).toContain("248.143")
  })
  it("variación null → delta guion", () => {
    expect(ingresosMesCard(kpis({ variacion: { montoPct: null, energiaPct: null } })).delta).toBe("—")
  })
  it("tarifaVigenteCard sin tarifa muestra estado Sin tarifa vigente", () => {
    expect(tarifaVigenteCard(kpis()).value).toBe("Sin tarifa vigente")
  })
  it("tarifaVigenteCard con tarifa muestra valor, franja y variación", () => {
    const c = tarifaVigenteCard(
      kpis({
        tarifaInyeccionVigente: {
          valor: 80,
          unidad: "ARS/kWh",
          franja: "PICO",
          vigenteDesde: "2026-04-01",
          origen: "PROPIO",
          variacionPct: 1.6,
        },
      })
    )
    expect(c.value).toContain("/ kWh")
    expect(c.label).toContain("pico")
    expect(c.delta).toBe("+1,6% Mes")
  })
  it("promedioPorUsuarioCard null cuando el backend no lo informa", () => {
    expect(promedioPorUsuarioCard(kpis())).toBeNull()
    expect(promedioPorUsuarioCard(kpis({ promedioPorSocio: { montoArs: "21836.00", sociosConIngreso: 11 } }))?.delta).toBe(
      "11 socios con ingresos"
    )
  })
})

import { energiaAcumuladaFromBloque, ingresosMesCardFromBloque, tarifaCardFromBloque } from "@/lib/ingresos-kpis"

describe("adaptadores de bloque", () => {
  it("ok usa datos reales", () => {
    expect(ingresosMesCardFromBloque({ status: "ok", data: kpis() }).value).toContain("248.143")
    expect(energiaAcumuladaFromBloque({ status: "ok", data: kpis() })).toBe("13.556 kWh desde el inicio")
  })
  it("parque sin ingresos → Sin ingresos todavía", () => {
    const vacio = kpis({
      mes: { montoArs: "0.00", energiaKwh: 0, registros: 0 },
      acumulado: { desde: null, montoArs: "0.00", energiaKwh: 0 },
    })
    expect(ingresosMesCardFromBloque({ status: "ok", data: vacio }).value).toBe("Sin ingresos todavía")
  })
  it("error → guion con mensaje, sin valor inventado", () => {
    const c = ingresosMesCardFromBloque({ status: "error" })
    expect(c.value).toBe("—")
    expect(c.delta).toBe("No se pudo cargar")
    expect(tarifaCardFromBloque({ status: "error" }).value).toBe("—")
    expect(energiaAcumuladaFromBloque({ status: "error" })).toBe("—")
  })
})
