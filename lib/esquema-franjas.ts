// lib/esquema-franjas.ts — lógica pura del editor de esquemas tarifarios (specs/014)
import type { Esquema, Franja, FranjaDto, FranjaEfectiva, TipoFranja, UpdateEsquemaDto, CreateEsquemaDto } from "@/lib/api/types"

export const TIPOS: readonly TipoFranja[] = ["RESTO", "PICO", "VALLE"]

export interface FranjaFormValues {
  tarifaNombre: string
  horaInicio: string
  horaFin: string
  valorEnergia: string
  valorInyeccion: string
  unidad: string
}

export interface EsquemaFormValues {
  vigenteDesde: string
  franjas: Record<TipoFranja, FranjaFormValues>
}

const MINUTES_PER_DAY = 1440
const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/

const emptyFranja = (): FranjaFormValues => ({
  tarifaNombre: "",
  horaInicio: "",
  horaFin: "",
  valorEnergia: "",
  valorInyeccion: "",
  unidad: "",
})

export function emptyFranjasForm(): EsquemaFormValues {
  return { vigenteDesde: "", franjas: { RESTO: emptyFranja(), PICO: emptyFranja(), VALLE: emptyFranja() } }
}

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

const own = (v: unknown): string => (v === null || v === undefined ? "" : String(v))

function isEfectiva(f: Franja | FranjaEfectiva): f is FranjaEfectiva {
  return typeof f.valorEnergia === "object" && f.valorEnergia !== null
}

/** Convierte franjas del backend (esquema o efectivas) a valores de formulario. Valores no propios quedan vacíos. */
export function franjasToForm(franjas: readonly (Franja | FranjaEfectiva)[]): Record<TipoFranja, FranjaFormValues> {
  const result = emptyFranjasForm().franjas
  for (const f of franjas) {
    const base = { tarifaNombre: f.tarifaNombre, horaInicio: f.horaInicio, horaFin: f.horaFin }
    if (isEfectiva(f)) {
      const propio = (v: { valor: unknown; origen: string }) => (v.origen === "PROPIO" ? own(v.valor) : "")
      result[f.tipo] = {
        ...base,
        valorEnergia: propio(f.valorEnergia),
        valorInyeccion: propio(f.valorInyeccion),
        unidad: propio(f.unidad),
      }
    } else {
      result[f.tipo] = {
        ...base,
        valorEnergia: own(f.valorEnergia),
        valorInyeccion: own(f.valorInyeccion),
        unidad: own(f.unidad),
      }
    }
  }
  return result
}

function validateValor(raw: string, label: string, tipo: string): string | null {
  if (raw.trim() === "") return null
  const n = Number(raw)
  if (!Number.isFinite(n)) return `${label} de ${tipo} debe ser un número.`
  if (n < 0) return `${label} de ${tipo} debe ser ≥ 0.`
  return null
}

/** Valida el formulario; devuelve un mensaje de error o null. El backend sigue siendo la autoridad. */
export function validateFranjas(form: EsquemaFormValues, catalogo: readonly string[]): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.vigenteDesde)) return "Indica la fecha de vigencia."
  if (catalogo.length === 0) return "No hay tarifas en el catálogo: crea una tarifa antes de definir un esquema."

  for (const tipo of TIPOS) {
    const f = form.franjas[tipo]
    if (!f.tarifaNombre) return `Elige la tarifa de la franja ${tipo}.`
    if (!catalogo.includes(f.tarifaNombre)) return `La tarifa "${f.tarifaNombre}" no está en el catálogo.`
    for (const [raw, label] of [
      [f.valorEnergia, "El valor de energía"],
      [f.valorInyeccion, "El valor de inyección"],
    ] as const) {
      const err = validateValor(raw, label, tipo)
      if (err) return err
    }
  }

  const withHours = TIPOS.filter((t) => form.franjas[t].horaInicio || form.franjas[t].horaFin)
  if (withHours.length === 0) return null // el backend aplica los horarios habituales
  if (withHours.length !== TIPOS.length) return "Informa el horario de las tres franjas, o deja las tres vacías."

  const intervals: Array<[number, number]> = []
  for (const tipo of TIPOS) {
    const { horaInicio, horaFin } = form.franjas[tipo]
    if (!horaInicio || !horaFin) return `La franja ${tipo} necesita hora de inicio y fin.`
    if (!HHMM.test(horaInicio) || !HHMM.test(horaFin)) return `Las horas de ${tipo} deben tener formato HH:MM.`
    const start = toMinutes(horaInicio)
    const end = toMinutes(horaFin)
    if (start === end) return `La franja ${tipo} necesita hora de inicio y fin distintas.`
    if (start < end) intervals.push([start, end])
    else {
      intervals.push([start, MINUTES_PER_DAY])
      if (end > 0) intervals.push([0, end])
    }
  }

  intervals.sort((a, b) => a[0] - b[0])
  let cursor = 0
  for (const [start, end] of intervals) {
    if (start !== cursor) return "Los horarios deben cubrir las 24 horas sin huecos ni solapes."
    cursor = end
  }
  if (cursor !== MINUTES_PER_DAY) return "Los horarios deben cubrir las 24 horas sin huecos ni solapes."
  return null
}

function toFranjaDtos(form: EsquemaFormValues): FranjaDto[] {
  return TIPOS.map((tipo) => {
    const f = form.franjas[tipo]
    const dto: FranjaDto = { tipo, tarifaNombre: f.tarifaNombre }
    if (f.horaInicio) dto.horaInicio = f.horaInicio
    if (f.horaFin) dto.horaFin = f.horaFin
    if (f.valorEnergia.trim() !== "") dto.valorEnergia = Number(f.valorEnergia)
    if (f.valorInyeccion.trim() !== "") dto.valorInyeccion = Number(f.valorInyeccion)
    if (f.unidad.trim() !== "") dto.unidad = f.unidad.trim()
    return dto
  })
}

export function toCreateDto(form: EsquemaFormValues): CreateEsquemaDto {
  return { vigenteDesde: form.vigenteDesde, franjas: toFranjaDtos(form) }
}

/** `vigenteDesde` solo se envía en esquemas FUTUROS (en los vigentes no es editable). */
export function toUpdateDto(form: EsquemaFormValues, esquema: Esquema): UpdateEsquemaDto {
  const dto: UpdateEsquemaDto = { franjas: toFranjaDtos(form) }
  if (esquema.estado === "FUTURA") dto.vigenteDesde = form.vigenteDesde
  return dto
}
