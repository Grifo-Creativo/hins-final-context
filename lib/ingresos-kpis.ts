import type { CoberturaIngresos, KpisIngresos } from "@/lib/api/types"
import { formatCurrency } from "@/lib/format-currency"
import type { BloqueIngresos } from "@/lib/ingresos-bloque"

/** Montos decimales del backend llegan como string; se interpretan solo para mostrar. */
export function parseMonto(value: string | null | undefined): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export type VariacionDireccion = "up" | "down" | "flat" | "none"

/** La variación la calcula el backend; null (mes anterior sin valor) → guion, nunca ∞ ni 0%. */
export function formatVariacionPct(pct: number | null | undefined): { label: string; direction: VariacionDireccion } {
  if (pct === null || pct === undefined || !Number.isFinite(pct)) return { label: "—", direction: "none" }
  const body = Math.abs(pct).toLocaleString("es-AR", { maximumFractionDigits: 1 })
  if (pct > 0) return { label: `+${body}%`, direction: "up" }
  if (pct < 0) return { label: `-${body}%`, direction: "down" }
  return { label: "0%", direction: "flat" }
}

/** registrosSinIngreso > 0 ⇒ los importes pueden ser parciales (FR-023). */
export function hayDatosIncompletos(cobertura: CoberturaIngresos | null | undefined): boolean {
  return (cobertura?.registrosSinIngreso ?? 0) > 0
}

export type EstadoIngresosKpis = "ok" | "sin-ingresos"

export function estadoIngresosKpis(kpis: KpisIngresos): EstadoIngresosKpis {
  const sinMes = kpis.mes.registros === 0
  const sinAcumulado = kpis.acumulado.desde === null && parseMonto(kpis.acumulado.montoArs) === 0
  return sinMes && sinAcumulado ? "sin-ingresos" : "ok"
}

/** "Promedio por usuario" solo en GDCV y solo si el backend lo informa (privacidad, FR-021). */
export function mostrarPromedioPorUsuario(modelo: "gdd" | "gdcv", kpis: KpisIngresos): boolean {
  return modelo === "gdcv" && kpis.promedioPorSocio !== null
}

export function formatEnergiaAcumuladaTexto(kpis: KpisIngresos): string {
  const { energiaKwh, desde } = kpis.acumulado
  if (desde === null && energiaKwh === 0) return "—"
  return `${energiaKwh.toLocaleString("es-AR", { maximumFractionDigits: 0 })} kWh desde el inicio`
}

// ── View-models de tarjetas KPI (texto ya resuelto, sin lógica en el componente) ──

export interface KpiCardModel {
  label: string
  value: string
  delta: string
}

function deltaMes(pct: number | null | undefined): string {
  const { label, direction } = formatVariacionPct(pct)
  return direction === "none" ? "—" : `${label} Mes`
}

/** Tarjeta "Ingresos por inyección" del mes (FR-001, FR-002, FR-025). */
export function ingresosMesCard(kpis: KpisIngresos): KpiCardModel {
  return {
    label: "Ingresos por inyección del mes",
    value: formatCurrency(parseMonto(kpis.mes.montoArs), "ars", "full"),
    delta: deltaMes(kpis.variacion.montoPct),
  }
}

/** Tarjeta de tarifa de inyección vigente; null ⇒ estado "Sin tarifa vigente" (FR-003). */
export function tarifaVigenteCard(kpis: KpiCardModelSource): KpiCardModel {
  const t = kpis.tarifaInyeccionVigente
  if (!t) return { label: "Tarifa de inyección vigente", value: "Sin tarifa vigente", delta: "" }
  const unidad = t.unidad.includes("/") ? t.unidad.split("/")[1] : t.unidad
  return {
    label: `Tarifa de inyección vigente (${t.franja.toLowerCase()})`,
    value: `${formatCurrency(t.valor, "ars", "full", { decimals: 2 })} / ${unidad}`,
    delta: deltaMes(t.variacionPct),
  }
}

type KpiCardModelSource = Pick<KpisIngresos, "tarifaInyeccionVigente">

/** Promedio por usuario (GDCV): el backend ya lo calcula; null ⇒ no se muestra (FR-005, FR-021). */
export function promedioPorUsuarioCard(kpis: KpisIngresos): KpiCardModel | null {
  const p = kpis.promedioPorSocio
  if (!p) return null
  return {
    label: "Promedio por usuario",
    value: formatCurrency(parseMonto(p.montoArs), "ars", "full"),
    delta: `${p.sociosConIngreso} ${p.sociosConIngreso === 1 ? "socio con ingresos" : "socios con ingresos"}`,
  }
}

// ── Adaptadores desde el resultado de carga de un bloque ──

function cardNoOk(label: string, status: Exclude<BloqueIngresos<unknown>["status"], "ok">): KpiCardModel {
  switch (status) {
    case "vacio":
      return { label, value: "Sin ingresos todavía", delta: "" }
    case "sin-acceso":
      return { label, value: "No disponible", delta: "" }
    default:
      return { label, value: "—", delta: "No se pudo cargar" }
  }
}

export function ingresosMesCardFromBloque(b: BloqueIngresos<KpisIngresos>): KpiCardModel {
  if (b.status !== "ok") return cardNoOk("Ingresos por inyección del mes", b.status)
  if (estadoIngresosKpis(b.data) === "sin-ingresos") return cardNoOk("Ingresos por inyección del mes", "vacio")
  return ingresosMesCard(b.data)
}

export function tarifaCardFromBloque(b: BloqueIngresos<KpisIngresos>): KpiCardModel {
  if (b.status !== "ok") return cardNoOk("Tarifa de inyección vigente", b.status === "vacio" ? "error" : b.status)
  return tarifaVigenteCard(b.data)
}

export function energiaAcumuladaFromBloque(b: BloqueIngresos<KpisIngresos>): string {
  return b.status === "ok" ? formatEnergiaAcumuladaTexto(b.data) : "—"
}
