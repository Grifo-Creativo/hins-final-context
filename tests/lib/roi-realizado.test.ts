import { describe, it, expect } from "vitest"

import { buildHistoricoRealRows, buildRoiChartData, buildRoiRealizadoView } from "@/lib/roi-realizado"
import type { MesRoiRealizado, RoiRealizado } from "@/lib/api/types"
import type { ROIDataPoint } from "@/data/gdd-roi-mock"

const mes = (over: Partial<MesRoiRealizado> & { periodo: string }): MesRoiRealizado => ({
  ingresoArs: "120000.00",
  tipoCambio: { valor: 1200, tipo: "REAL", periodicidad: "MENSUAL" },
  ingresoUsd: "100.00",
  acumuladoUsd: "100.00",
  porcentajeRecuperado: 10,
  tipoCambioFaltante: false,
  ...over,
})

function roi(over: Partial<RoiRealizado> = {}): RoiRealizado {
  return {
    parqueId: "p1",
    socioId: null,
    fechaPuestaEnMarcha: "2024-03-01",
    inversionMeta: { valor: 1000, moneda: "USD", periodoRegistro: "2026-04" },
    sinInversionMeta: false,
    meses: [
      mes({ periodo: "2024-03", acumuladoUsd: "100.00", porcentajeRecuperado: 10 }),
      mes({ periodo: "2024-04", ingresoArs: "240000.00", ingresoUsd: "200.00", acumuladoUsd: "300.00", porcentajeRecuperado: 30 }),
    ],
    resumen: {
      acumuladoUsd: "300.00",
      pendienteUsd: "700.00",
      porcentajeRecuperado: 30,
      mesesTranscurridos: 2,
      aniosTranscurridos: 0.2,
      mesesSinTipoCambio: [],
    },
    ...over,
  }
}

describe("buildRoiRealizadoView", () => {
  it("toma acumulado, pendiente y porcentaje del backend", () => {
    const v = buildRoiRealizadoView(roi())
    expect(v.recuperadoUsd).toBe(300)
    expect(v.pendienteUsd).toBe(700)
    expect(v.porcentaje).toBe(30)
    expect(v.totalInvertidoUsd).toBe(1000)
    expect(v.sinInversionMeta).toBe(false)
  })

  it("sinInversionMeta: muestra acumulado pero no pendiente ni porcentaje", () => {
    const v = buildRoiRealizadoView(
      roi({
        inversionMeta: null,
        sinInversionMeta: true,
        resumen: { ...roi().resumen, pendienteUsd: null, porcentajeRecuperado: null },
      })
    )
    expect(v.recuperadoUsd).toBe(300)
    expect(v.pendienteUsd).toBeNull()
    expect(v.porcentaje).toBeNull()
    expect(v.totalInvertidoUsd).toBeNull()
  })

  it("meses sin tipo de cambio: se informan, no se estiman en USD y sí suman en ARS", () => {
    const v = buildRoiRealizadoView(
      roi({
        meses: [
          mes({ periodo: "2024-03", tipoCambio: null, ingresoUsd: null, tipoCambioFaltante: true, acumuladoUsd: "0.00" }),
          mes({ periodo: "2024-04", ingresoArs: "240000.00", acumuladoUsd: "200.00" }),
        ],
        resumen: { ...roi().resumen, acumuladoUsd: "200.00", mesesSinTipoCambio: ["2024-03"] },
      })
    )
    expect(v.mesesSinTipoCambio).toEqual(["2024-03"])
    expect(v.recuperadoArs).toBe(360000)
    expect(v.recuperadoUsd).toBe(200)
  })

  it("tipo de cambio actual = el del último mes que lo tiene", () => {
    const v = buildRoiRealizadoView(
      roi({
        meses: [
          mes({ periodo: "2024-03", tipoCambio: { valor: 1000, tipo: "REAL", periodicidad: "MENSUAL" } }),
          mes({ periodo: "2024-04", tipoCambio: { valor: 1100, tipo: "REAL", periodicidad: "MENSUAL" } }),
          mes({ periodo: "2024-05", tipoCambio: null, ingresoUsd: null, tipoCambioFaltante: true }),
        ],
      })
    )
    expect(v.tipoCambioActual).toBe(1100)
  })

  it("timeline: inicio, hoy (último mes) y años transcurridos del backend", () => {
    const v = buildRoiRealizadoView(roi())
    expect(v.timeline).toEqual({ inicio: "Marzo 2024", hoy: "Abril 2024", anios: "0.2", pct: 30 })
  })

  it("sin meses: no hay datos", () => {
    expect(buildRoiRealizadoView(roi({ meses: [] })).hayDatos).toBe(false)
  })
})

describe("buildHistoricoRealRows", () => {
  it("ordena del más reciente al más antiguo, con ARS acumulado propio", () => {
    const rows = buildHistoricoRealRows(roi())
    expect(rows.map((r) => r.periodo)).toEqual(["Abril 2024", "Marzo 2024"])
    expect(rows[0]).toMatchObject({
      capRecuperadoUsd: 200,
      capRecuperadoArs: 240000,
      acumuladoUsd: 300,
      acumuladoArs: 360000,
      porcentaje: 30,
      tipoCambioFaltante: false,
    })
  })

  it("mes sin tipo de cambio: capital USD null y marcado", () => {
    const rows = buildHistoricoRealRows(
      roi({ meses: [mes({ periodo: "2024-03", tipoCambio: null, ingresoUsd: null, tipoCambioFaltante: true })] })
    )
    expect(rows[0].capRecuperadoUsd).toBeNull()
    expect(rows[0].tipoCambioFaltante).toBe(true)
  })
})

describe("buildRoiChartData", () => {
  const proy: ROIDataPoint[] = [
    { fecha: "2026-04", real: 6_000_000 },
    { fecha: "2026-05", base: 6_100_000, favorable: 6_200_000, riesgo: 6_050_000 },
    { fecha: "2026-06", base: 6_300_000, favorable: 6_500_000, riesgo: 6_100_000 },
  ]

  it("el tramo real usa acumuladoUsd por mes y fechaHoy es el último mes real", () => {
    const { data, fechaHoy } = buildRoiChartData(roi(), proy)
    expect(data.filter((d) => d.real !== undefined)).toEqual([
      { fecha: "2024-03", real: 100 },
      { fecha: "2024-04", real: 300 },
    ])
    expect(fechaHoy).toBe("2024-04")
  })

  it("la proyección estimativa arranca desde el último valor real (deltas del mock)", () => {
    const { data } = buildRoiChartData(roi(), proy)
    const proj = data.filter((d) => d.base !== undefined)
    expect(proj.map((d) => d.fecha)).toEqual(["2024-05", "2024-06"])
    expect(proj[0].base).toBe(300 + 100_000)
    expect(proj[1].favorable).toBe(300 + 500_000)
  })

  it("sin meses reales devuelve serie vacía", () => {
    expect(buildRoiChartData(roi({ meses: [] }), proy).data).toEqual([])
  })
})
