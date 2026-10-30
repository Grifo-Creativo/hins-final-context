import { describe, it, expect } from "vitest"

import {
  emptyFranjasForm,
  franjasToForm,
  toCreateDto,
  toUpdateDto,
  validateFranjas,
  type EsquemaFormValues,
} from "@/lib/esquema-franjas"
import type { Esquema, FranjaEfectiva } from "@/lib/api/types"

const TARIFAS = ["Resto", "Pico", "Valle"]

function valid(): EsquemaFormValues {
  const f = emptyFranjasForm()
  f.vigenteDesde = "2026-11-01"
  f.franjas.RESTO = { ...f.franjas.RESTO, tarifaNombre: "Resto", horaInicio: "05:00", horaFin: "18:00" }
  f.franjas.PICO = { ...f.franjas.PICO, tarifaNombre: "Pico", horaInicio: "18:00", horaFin: "23:00" }
  f.franjas.VALLE = { ...f.franjas.VALLE, tarifaNombre: "Valle", horaInicio: "23:00", horaFin: "05:00" }
  return f
}

describe("validateFranjas", () => {
  it("acepta cobertura exacta de 24 h con cruce de medianoche", () => {
    expect(validateFranjas(valid(), TARIFAS)).toBeNull()
  })

  it("acepta las tres horas omitidas", () => {
    const f = valid()
    for (const t of ["RESTO", "PICO", "VALLE"] as const) {
      f.franjas[t].horaInicio = ""
      f.franjas[t].horaFin = ""
    }
    expect(validateFranjas(f, TARIFAS)).toBeNull()
  })

  it("rechaza si solo algunas horas se omiten", () => {
    const f = valid()
    f.franjas.PICO.horaInicio = ""
    f.franjas.PICO.horaFin = ""
    expect(validateFranjas(f, TARIFAS)).toMatch(/las tres franjas/i)
  })

  it("rechaza una franja con solo una de las dos horas", () => {
    const f = valid()
    f.franjas.PICO.horaFin = ""
    expect(validateFranjas(f, TARIFAS)).toMatch(/inicio y fin/i)
  })

  it("rechaza hueco", () => {
    const f = valid()
    f.franjas.PICO.horaFin = "22:00"
    expect(validateFranjas(f, TARIFAS)).toMatch(/24 horas/i)
  })

  it("rechaza solape", () => {
    const f = valid()
    f.franjas.PICO.horaInicio = "17:00"
    expect(validateFranjas(f, TARIFAS)).toMatch(/24 horas/i)
  })

  it("inicio inclusivo / fin exclusivo: franjas contiguas son válidas", () => {
    const f = valid()
    f.franjas.RESTO = { ...f.franjas.RESTO, horaInicio: "00:00", horaFin: "12:00" }
    f.franjas.PICO = { ...f.franjas.PICO, horaInicio: "12:00", horaFin: "20:00" }
    f.franjas.VALLE = { ...f.franjas.VALLE, horaInicio: "20:00", horaFin: "00:00" }
    expect(validateFranjas(f, TARIFAS)).toBeNull()
  })

  it("rechaza hora inválida", () => {
    const f = valid()
    f.franjas.RESTO.horaInicio = "25:00"
    expect(validateFranjas(f, TARIFAS)).toMatch(/HH:MM/)
  })

  it("rechaza inicio igual a fin", () => {
    const f = valid()
    f.franjas.RESTO.horaFin = "05:00"
    expect(validateFranjas(f, TARIFAS)).toMatch(/inicio y fin/i)
  })

  it("requiere fecha de vigencia", () => {
    const f = valid()
    f.vigenteDesde = ""
    expect(validateFranjas(f, TARIFAS)).toMatch(/vigencia/i)
  })

  it("requiere tarifa del catálogo en cada franja", () => {
    const f = valid()
    f.franjas.VALLE.tarifaNombre = ""
    expect(validateFranjas(f, TARIFAS)).toMatch(/tarifa/i)
    f.franjas.VALLE.tarifaNombre = "Inexistente"
    expect(validateFranjas(f, TARIFAS)).toMatch(/catálogo/i)
  })

  it("rechaza catálogo vacío", () => {
    expect(validateFranjas(valid(), [])).toMatch(/catálogo/i)
  })

  it("valor propio negativo inválido; 0 válido; vacío válido", () => {
    const f = valid()
    f.franjas.PICO.valorEnergia = "-1"
    expect(validateFranjas(f, TARIFAS)).toMatch(/≥ 0/)
    f.franjas.PICO.valorEnergia = "0"
    expect(validateFranjas(f, TARIFAS)).toBeNull()
    f.franjas.PICO.valorEnergia = ""
    expect(validateFranjas(f, TARIFAS)).toBeNull()
  })

  it("rechaza valor propio no numérico", () => {
    const f = valid()
    f.franjas.PICO.valorInyeccion = "abc"
    expect(validateFranjas(f, TARIFAS)).toMatch(/número/i)
  })
})

describe("toCreateDto / toUpdateDto", () => {
  it("omite campos vacíos y respeta 0", () => {
    const f = valid()
    f.franjas.PICO.valorEnergia = "0"
    f.franjas.PICO.unidad = "ARS/kWh"
    const dto = toCreateDto(f)
    expect(dto.vigenteDesde).toBe("2026-11-01")
    expect(dto.franjas).toHaveLength(3)
    const pico = dto.franjas.find((x) => x.tipo === "PICO")!
    expect(pico).toEqual({
      tipo: "PICO",
      tarifaNombre: "Pico",
      horaInicio: "18:00",
      horaFin: "23:00",
      valorEnergia: 0,
      unidad: "ARS/kWh",
    })
    expect("valorInyeccion" in pico).toBe(false)
  })

  it("omite horas cuando están vacías", () => {
    const f = valid()
    f.franjas.RESTO.horaInicio = ""
    f.franjas.RESTO.horaFin = ""
    const resto = toCreateDto(f).franjas.find((x) => x.tipo === "RESTO")!
    expect("horaInicio" in resto).toBe(false)
  })

  it("toUpdateDto envía vigenteDesde solo si el esquema es FUTURO", () => {
    const f = valid()
    const base = { id: "1", destino: { tipo: "PARQUE", id: "p" }, vigenteDesde: "2026-11-01", vigenteHasta: null, franjas: [] }
    expect(toUpdateDto(f, { ...base, estado: "VIGENTE" } as unknown as Esquema).vigenteDesde).toBeUndefined()
    expect(toUpdateDto(f, { ...base, estado: "FUTURA" } as unknown as Esquema).vigenteDesde).toBe("2026-11-01")
    expect(toUpdateDto(f, { ...base, estado: "FUTURA" } as unknown as Esquema).franjas).toHaveLength(3)
  })
})

describe("franjasToForm", () => {
  it("desde efectivas: CATÁLOGO queda vacío, PROPIO conserva valor", () => {
    const efectivas: FranjaEfectiva[] = [
      {
        tipo: "PICO",
        horaInicio: "18:00",
        horaFin: "23:00",
        tarifaNombre: "Pico",
        versionCatalogoDesde: null,
        valorEnergia: { valor: 120, origen: "PROPIO" },
        valorInyeccion: { valor: 5, origen: "CATALOGO" },
        unidad: { valor: "ARS/kWh", origen: "CATALOGO" },
      },
    ]
    const form = franjasToForm(efectivas)
    expect(form.PICO).toMatchObject({ tarifaNombre: "Pico", horaInicio: "18:00", valorEnergia: "120", valorInyeccion: "", unidad: "" })
    expect(form.RESTO.tarifaNombre).toBe("")
  })

  it("desde franjas de un esquema: null queda vacío", () => {
    const form = franjasToForm([
      { tipo: "VALLE", horaInicio: "23:00", horaFin: "05:00", tarifaNombre: "Valle", valorEnergia: null, valorInyeccion: 3, unidad: null },
    ])
    expect(form.VALLE).toMatchObject({ valorEnergia: "", valorInyeccion: "3", unidad: "" })
  })
})
