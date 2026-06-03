// data/gdcv-mock.ts

import {
  getChartRangeSubtitle,
  sliceChartRangeSeries,
} from "@/lib/chart-range-resolve"
import { formatCurrency } from "@/lib/format-currency"
import type { ChartRangeChip } from "@/types/chart-range"

// ─── Park ──────────────────────────────────────────────────────────────────

export const gdcvParkName = "Parque Río Cuarto"

/** Capacidad total instalada del parque GDCV (kWp). Fuente única de verdad para cálculos de porcentaje. */
export const GDCV_TOTAL_POTENCIA = 980

/** Inicio de operaciones — Parque Río Cuarto (GDCV). */
export const gdcvOperationsStartLabel = "Marzo 2024"

/** Datos de la card de detalle del parque (GDCV Performance — columna 1/3). */
export const gdcvParkDetails = {
  imageSrc: "/images/png-assets/asset_gdcv.png",
  imageAlt: "Parque GDCV",
  metrics: [
    { label: "Cap. Instalada", value: "980 kWp" },
    { label: "Potencia Acople", value: "815 kWp" },
    { label: "Equipo", value: "Canadian Solar HiKu7 655W" },
    { label: "Inicio de operaciones", value: gdcvOperationsStartLabel },
  ],
} as const

// ─── Energy chart ──────────────────────────────────────────────────────────

export type GdcvEnergyRow = { label: string; generated: number }

/** Serie mensual desde Mar 24 → Abr 26 (mock realista; cola Nov 25+ alineada al flow). */
export const GDCV_ENERGY_MONTHLY_CANONICAL: readonly GdcvEnergyRow[] = [
  { label: "Mar 24", generated: 38 },
  { label: "Abr 24", generated: 44 },
  { label: "May 24", generated: 51 },
  { label: "Jun 24", generated: 48 },
  { label: "Jul 24", generated: 55 },
  { label: "Ago 24", generated: 62 },
  { label: "Sep 24", generated: 58 },
  { label: "Oct 24", generated: 64 },
  { label: "Nov 24", generated: 68 },
  { label: "Dic 24", generated: 72 },
  { label: "Ene 25", generated: 76 },
  { label: "Feb 25", generated: 82 },
  { label: "Mar 25", generated: 88 },
  { label: "Abr 25", generated: 92 },
  { label: "May 25", generated: 96 },
  { label: "Jun 25", generated: 100 },
  { label: "Jul 25", generated: 105 },
  { label: "Ago 25", generated: 110 },
  { label: "Sep 25", generated: 115 },
  { label: "Oct 25", generated: 120 },
  { label: "Nov 25", generated: 138 },
  { label: "Dic 25", generated: 121 },
  { label: "Ene 26", generated: 101 },
  { label: "Feb 26", generated: 85 },
  { label: "Mar 26", generated: 79 },
  { label: "Abr 26", generated: 124 },
]

const GDCV_ENERGY_WEEKLY: readonly GdcvEnergyRow[] = [
  { label: "1–7 Abr", generated: 28 },
  { label: "8–14 Abr", generated: 32 },
  { label: "15–21 Abr", generated: 30 },
  { label: "22–30 Abr", generated: 34 },
]

const GDCV_ENERGY_MONTHLY = GDCV_ENERGY_MONTHLY_CANONICAL

export function getGdcvEnergySeries(range: ChartRangeChip): GdcvEnergyRow[] {
  return sliceChartRangeSeries(range, GDCV_ENERGY_MONTHLY, GDCV_ENERGY_WEEKLY)
}

export function getGdcvEnergyChartSubtitle(range: ChartRangeChip): string {
  return getChartRangeSubtitle(range, gdcvOperationsStartLabel)
}

// ─── KPIs (performance) ────────────────────────────────────────────────────

export const gdcvGeneradaAbril = {
  title: "Generada en Abril",
  kwh: 124.2,
  compareBadge: "13.556 kWh desde el Inicio",
} as const

export const gdcvGenerationSparkline: { value: number }[] = [
  { value: 42 },
  { value: 58 },
  { value: 53 },
  { value: 67 },
  { value: 61 },
  { value: 74 },
  { value: 124 },
]

export const gdcvAhorroTotalAbril = {
  label: "Ahorro Total en Abril",
  amount: formatCurrency(248_143, "ars", "full"),
  deltaBadge: "+2.3% Mes",
}

export const gdcvPromedioPorUsuario = {
  label: "Promedio por usuario",
  amount: formatCurrency(21_836, "ars", "full"),
  deltaBadge: "+1.6% Mes",
}

// ─── Socios ────────────────────────────────────────────────────────────────

/** Detalle de un medidor individual — usado cuando un socio tiene +1 medidor. */
export interface MedidorDetalle {
  numero: string
  participacion: string
  potenciaAsociada: string
  energiaGenerada: string
  ahorroGenerado: string
}

export interface SocioRow {
  id: string
  nombre: string
  medidor: string
  /** Presente solo cuando el socio tiene múltiples medidores con distinta participación. */
  medidores?: MedidorDetalle[]
  participacion: string
  potenciaAsociada: string
  energiaGenerada: string
  ahorroGenerado: string
  tipo?: "Virtual"
}

export const sociosMock: SocioRow[] = [
  {
    id: "AI",
    nombre: "Alfredo Isaac SA",
    medidor: "3543871",
    participacion: "15%",
    potenciaAsociada: "147 kWp",
    energiaGenerada: "15.9 kWh",
    ahorroGenerado: formatCurrency(31_800, "ars", "full"),
  },
  {
    id: "AS",
    nombre: "Agro Sur Industrial",
    medidor: "354904",
    participacion: "15%",
    potenciaAsociada: "147 kWp",
    energiaGenerada: "17.1 kWh",
    ahorroGenerado: formatCurrency(34_200, "ars", "full"),
    medidores: [
      {
        numero: "354904",
        participacion: "10%",
        potenciaAsociada: "98 kWp",
        energiaGenerada: "11.4 kWh",
        ahorroGenerado: formatCurrency(22_800, "ars", "full"),
      },
      {
        numero: "354906",
        participacion: "5%",
        potenciaAsociada: "49 kWp",
        energiaGenerada: "5.7 kWh",
        ahorroGenerado: formatCurrency(11_400, "ars", "full"),
      },
    ],
  },
  {
    id: "FC",
    nombre: "Ferretería Catalán",
    medidor: "3551118",
    participacion: "25%",
    potenciaAsociada: "245 kWp",
    energiaGenerada: "33.1 kWh",
    ahorroGenerado: formatCurrency(66_200, "ars", "full"),
    tipo: "Virtual",
  },
  {
    id: "AS2",
    nombre: "Avícola del Sur",
    medidor: "355451",
    participacion: "20%",
    potenciaAsociada: "196 kWp",
    energiaGenerada: "23.9 kWh",
    ahorroGenerado: formatCurrency(47_800, "ars", "full"),
  },
  {
    id: "CV",
    nombre: "Campo Vita Alimentos",
    medidor: "355778",
    participacion: "20%",
    potenciaAsociada: "196 kWp",
    energiaGenerada: "25.3 kWh",
    ahorroGenerado: formatCurrency(50_600, "ars", "full"),
  },
  {
    id: "RF",
    nombre: "Rio Fértil SRL",
    medidor: "355262",
    participacion: "5%",
    potenciaAsociada: "49 kWp",
    energiaGenerada: "4.9 kWh",
    ahorroGenerado: formatCurrency(9_800, "ars", "full"),
  },
]

// ─── Socio detail (Sheet) ──────────────────────────────────────────────────

export interface SocioDetalle {
  nombre: string
  tipo?: "Virtual"
  descripcion: string
  medidor: string
  participacion: string
  potenciaAsociada: string
  porcentajePotencia: string
  energiaGeneradaKwh: string
  energiaGeneradaMes: string
  autoconsumoVirtual: string
  inyectada: string
  autoconsumoKwh: number
  inyectadaKwh: number
  totalKwh: number
  ahorroGenerado: string
  potenciaUtilizada: string
  fechaDeAlta: string
  nombreResponsable: string
  telefonoContacto: string
  ahorroEmisiones: string
}

/** Static detail for the "Ferretería Catalán" demo socio. */
export const socioDetalleMock: SocioDetalle = {
  nombre: "Ferretería Catalán",
  tipo: "Virtual",
  descripcion: "Dispone de Autoconsumo y Crédito por Inyección a red.",
  medidor: "3551118",
  participacion: "25%",
  potenciaAsociada: "245 kWp",
  porcentajePotencia: "25%",
  energiaGeneradaKwh: "33.1",
  energiaGeneradaMes: "Abril 2026",
  autoconsumoVirtual: "22.5 kWh",
  inyectada: "10.6 kWh",
  autoconsumoKwh: 22.5,
  inyectadaKwh: 10.6,
  totalKwh: 33.1,
  ahorroGenerado: formatCurrency(66_200, "ars", "full"),
  potenciaUtilizada: "15 kW",
  fechaDeAlta: "Marzo 2024",
  nombreResponsable: "Carlos Catalán",
  telefonoContacto: "+54 358 412-0000",
  ahorroEmisiones: "15.5 kg CO₂",
}

// ─── ROI ──────────────────────────────────────────────────────────────────

export const gdcvRoiMetrics = {
  totalEnergiaGenerada: { label: "Total de Energía Generada", value: "13.556 kWh" },
  totalAhorrado: { label: "Total Ahorrado", value: formatCurrency(1_238_300, "ars", "full") },
  ahorroXkWh: {
    label: "Ahorro por kWh",
    value: `${formatCurrency(91.35, "ars", "full", { decimals: 2 })} /kWh`,
  },
  inversionInicial: {
    label: "Inversión inicial",
    value: formatCurrency(4_270_000, "ars", "full"),
    recoveredPercent: 29,
  },
  payback: { label: "Payback estimado", value: "5.5 años", subtitle: "Desde Marzo 2024" },
}

export const gdcvSecondaryMetrics = {
  tir: { label: "TIR (actualizada)", value: "18.5%" },
  inicioOperaciones: { label: "Inicio de operaciones", value: "Marzo 2024" },
  kpi4: { label: "KPI [4]", value: "Valor de KPI [4]" },
}

export type GdcvCurvePoint = { label: string; real: number | null; projected: number | null }

const GDCV_CURVE_CANONICAL: readonly GdcvCurvePoint[] = [
  { label: "Mar 24", real: 1100, projected: null },
  { label: "DIC 24", real: 1800, projected: null },
  { label: "JUN 25", real: 2400, projected: null },
  { label: "DIC 25", real: 3200, projected: 3200 },
  { label: "JUN 26", real: null, projected: 4300 },
  { label: "DIC 26", real: null, projected: 4800 },
  { label: "JUN 27", real: null, projected: 5600 },
]

const GDCV_CURVE_WEEKLY: readonly GdcvCurvePoint[] = [
  { label: "3–10 Dic", real: 3000, projected: null },
  { label: "11–17 Dic", real: 3060, projected: null },
  { label: "18–24 Dic", real: 3140, projected: null },
  { label: "25–31 Dic", real: 3200, projected: null },
]

export function getGdcvCurveSeries(range: ChartRangeChip): GdcvCurvePoint[] {
  switch (range) {
    case "1m":
      return GDCV_CURVE_WEEKLY.map((p) => ({ ...p }))
    case "6m":
      return GDCV_CURVE_CANONICAL.slice(-6).map((p) => ({ ...p }))
    default:
      return []
  }
}

export function getGdcvPaybackDot(
  range: ChartRangeChip
): { label: string; value: number } | null {
  if (range === "1m") return null
  return { label: "JUN 27", value: 5600 }
}

export function getGdcvCurveSubtitle(range: ChartRangeChip): string {
  switch (range) {
    case "1m":
      return "Agregación semanal (cuatro semanas sobre crédito acumulado observado)."
    case "6m":
      return "Agregación mensual — últimos 6 meses hasta la proyección."
    default:
      return ""
  }
}

export const gdcvInvestmentReference = 4270

// ─── Mantenimiento (AGC) — re-export desde mock compartido ─────────────────

export type { MantenimientoHistorialRow } from "@/data/mantenimiento-mock"
export {
  gdcvMantenimientoHistorialMock as mantenimientoHistorialMock,
} from "@/data/mantenimiento-mock"
