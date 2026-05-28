// data/gdd-performance-mock.ts

import {
  getChartRangeSubtitle,
  sliceChartRangeSeries,
} from "@/lib/chart-range-resolve"
import type { ChartRangeChip } from "@/types/chart-range"

export type PerformancePeriod = ChartRangeChip

export type ParkEnergyRow = {
  label: string
  generated: number
}

/** Inicio de operaciones — Parque General Roca (GDD). */
export const gddOperationsStartLabel = "Mayo 2025"

/**
 * Serie mensual canónica desde inicio de operaciones (May 25 → Abr 26).
 * 3M / 6M / 1A / TODO derivan por slice desde aquí.
 */
const PARK_ENERGY_MONTHLY: ParkEnergyRow[] = [
  { label: "May 25", generated: 410 },
  { label: "Jun 25", generated: 450 },
  { label: "Jul 25", generated: 490 },
  { label: "Ago 25", generated: 530 },
  { label: "Sep 25", generated: 570 },
  { label: "Oct 25", generated: 610 },
  { label: "Nov 25", generated: 920 },
  { label: "Dic 25", generated: 870 },
  { label: "Ene 26", generated: 780 },
  { label: "Feb 26", generated: 690 },
  { label: "Mar 26", generated: 610 },
  { label: "Abr 26", generated: 830 },
]

/** 1M: semanal — ventana reciente dentro de abril. */
const PARK_ENERGY_WEEKLY: ParkEnergyRow[] = [
  { label: "1–7 Abr", generated: 198 },
  { label: "8–14 Abr", generated: 205 },
  { label: "15–21 Abr", generated: 192 },
  { label: "22–30 Abr", generated: 235 },
]

export const highlightAprilCardMock = {
  title: "Generada en Abril",
  kwh: 830.17,
  compareBadge: "8.240 kWh desde el Inicio",
} as const

export const parkName = "Parque General Roca"

/** Datos de la card de detalle del parque (GDD Performance — columna 1/3). */
export const gddParkDetails = {
  imageSrc: "/images/png-assets/asset_gdd.png",
  imageAlt: "Ilustración del parque fotovoltaico Parque General Roca",
  metrics: [
    { label: "Cap. Instalada", value: "1.250 kWp" },
    { label: "Potencia Acople", value: "1.020 kWp" },
    { label: "Equipo", value: "Jinko Tiger Neo 72HL4" },
    { label: "Ultimo Mantenimiento", value: "12 Mar. 2026" },
  ],
} as const

export function getParkEnergySeries(period: PerformancePeriod): ParkEnergyRow[] {
  return sliceChartRangeSeries(period, PARK_ENERGY_MONTHLY, PARK_ENERGY_WEEKLY)
}

export function getParkEnergyChartSubtitle(period: PerformancePeriod): string {
  return getChartRangeSubtitle(period, gddOperationsStartLabel)
}

export const generationSparklinePoints = [
  { i: 0, value: 18 },
  { i: 1, value: 22 },
  { i: 2, value: 20 },
  { i: 3, value: 26 },
  { i: 4, value: 24 },
  { i: 5, value: 31 },
  { i: 6, value: 28 },
  { i: 7, value: 34 },
]

export const savingsCardMock = {
  label: "Ahorro acumulado en Abril",
  amount: "$66.400",
  deltaBadge: "+36% Mes",
}

export const tariffCardMock = {
  label: "Valor de Tarifa Actual",
  value: "$80",
  unit: "/ kWh",
  deltaBadge: "+ 1.6% Mes",
}

export interface ConsumptionHistoryRow {
  period: string
  energyGenerated: string
  energyPurchased: string
  coveragePercent: string
  totalConsumption: string
  coverageMoney: string
}

export const consumptionHistoryMock: ConsumptionHistoryRow[] = [
  {
    period: "Abril 2026",
    energyGenerated: "830 kWh",
    energyPurchased: "60 kWh",
    coveragePercent: "93%",
    totalConsumption: "890 Kwh",
    coverageMoney: "$66.400",
  },
  {
    period: "Marzo 2026",
    energyGenerated: "610 kWh",
    energyPurchased: "220 kWh",
    coveragePercent: "73%",
    totalConsumption: "830 Kwh",
    coverageMoney: "$48.800",
  },
  {
    period: "Febrero 2026",
    energyGenerated: "690 kWh",
    energyPurchased: "189 kWh",
    coveragePercent: "78.5%",
    totalConsumption: "879 Kwh",
    coverageMoney: "$55.200",
  },
  {
    period: "Enero 2026",
    energyGenerated: "780 kWh",
    energyPurchased: "20 kWh",
    coveragePercent: "97.5%",
    totalConsumption: "800 Kwh",
    coverageMoney: "$62.400",
  },
  {
    period: "Diciembre 2025",
    energyGenerated: "870 kWh",
    energyPurchased: "0 kWh",
    coveragePercent: "100%",
    totalConsumption: "870 Kwh",
    coverageMoney: "$69.600",
  },
  {
    period: "Noviembre 2025",
    energyGenerated: "920 kWh",
    energyPurchased: "4.2 kWh",
    coveragePercent: "99.5%",
    totalConsumption: "924 Kwh",
    coverageMoney: "$73.600",
  },
]
