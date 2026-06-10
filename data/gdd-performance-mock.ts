// data/gdd-performance-mock.ts

import {
  getChartRangeSubtitle,
  sliceChartRangeSeries,
} from "@/lib/chart-range-resolve"
import { formatCurrency } from "@/lib/format-currency"
import type { ChartRangeChip } from "@/types/chart-range"

export type PerformancePeriod = ChartRangeChip

export type ParkEnergyRow = {
  label: string
  generated: number
}

/** Label canónico — ParkDetailsCard (GDD). */
export const GDD_OPERATIONS_START_METRIC_LABEL = "Fecha de Inicio"

/** Inicio de operaciones — Parque General Roca (GDD). */
export const gddOperationsStartLabel = "Mayo 2024"

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
    { label: "Capacidad Instalada", value: "1.250 kWp" },
    { label: "Potencia Acople", value: "1.020 kWp" },
    { label: "Equipamiento", value: "Jinko Tiger Neo 72HL4" },
    { label: GDD_OPERATIONS_START_METRIC_LABEL, value: gddOperationsStartLabel },
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
  amount: formatCurrency(66_400, "ars", "full"),
  deltaBadge: "+36% Mes",
}

export const tariffCardMock = {
  label: "Valor de Tarifa Actual",
  value: formatCurrency(80, "ars", "full"),
  unit: "/ kWh",
  deltaBadge: "+ 1.6% Mes",
}

export interface ConsumptionHistoryRow {
  period: string
  energyGenerated: string
  energyAcquired: string
  energyFromOtherSources: string
  totalEnergy: string
  acquiredPercent: string
  totalPercent: string
  estimatedSavings: string
}

export const consumptionHistoryMock: ConsumptionHistoryRow[] = [
  {
    period: "Abril 2026",
    energyGenerated: "830 kWh",
    energyAcquired: "60 kWh",
    energyFromOtherSources: "12 kWh",
    totalEnergy: "902 kWh",
    acquiredPercent: "6,6%",
    totalPercent: "93,4%",
    estimatedSavings: formatCurrency(74_400, "ars", "full"),
  },
  {
    period: "Marzo 2026",
    energyGenerated: "610 kWh",
    energyAcquired: "220 kWh",
    energyFromOtherSources: "15 kWh",
    totalEnergy: "845 kWh",
    acquiredPercent: "26,0%",
    totalPercent: "74,0%",
    estimatedSavings: formatCurrency(54_720, "ars", "full"),
  },
  {
    period: "Febrero 2026",
    energyGenerated: "690 kWh",
    energyAcquired: "189 kWh",
    energyFromOtherSources: "18 kWh",
    totalEnergy: "897 kWh",
    acquiredPercent: "21,1%",
    totalPercent: "78,9%",
    estimatedSavings: formatCurrency(61_920, "ars", "full"),
  },
  {
    period: "Enero 2026",
    energyGenerated: "780 kWh",
    energyAcquired: "20 kWh",
    energyFromOtherSources: "14 kWh",
    totalEnergy: "814 kWh",
    acquiredPercent: "2,5%",
    totalPercent: "97,5%",
    estimatedSavings: formatCurrency(70_080, "ars", "full"),
  },
  {
    period: "Diciembre 2025",
    energyGenerated: "870 kWh",
    energyAcquired: "0 kWh",
    energyFromOtherSources: "20 kWh",
    totalEnergy: "890 kWh",
    acquiredPercent: "0,0%",
    totalPercent: "100,0%",
    estimatedSavings: formatCurrency(78_120, "ars", "full"),
  },
  {
    period: "Noviembre 2025",
    energyGenerated: "920 kWh",
    energyAcquired: "4.2 kWh",
    energyFromOtherSources: "22 kWh",
    totalEnergy: "946 kWh",
    acquiredPercent: "0,4%",
    totalPercent: "99,6%",
    estimatedSavings: formatCurrency(82_720, "ars", "full"),
  },
]
