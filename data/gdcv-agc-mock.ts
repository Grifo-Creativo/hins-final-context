// data/gdcv-agc-mock.ts — GDCV AGC (admin) ROI / curva recuperación

import type {
  GddRoiHistoricoRow,
  GddRoiProyectadoRow,
  RoiCurvePoint,
} from "@/data/gdd-roi-mock"

/** KPIs ROI — Parque Río Cuarto (base USD, alineado a GDCV_flow.md). */
export const gdcvRoiKpis = {
  totalInvertido: 38_000_000,
  inversionRecuperada: 14_200_000,
  porcentajeRecuperado: 37,
  pendienteRecuperar: 23_800_000,
  recuperoEstimado: "6.8 años",
  tir: "18.50%",
  plazo: "25 años",
  timeline: {
    inicio: { label: "Inicio", fecha: "Mar 2024" },
    hoy: {
      label: "Hoy",
      fecha: "May 2026",
      pct: 37,
      elapsedYears: "2.2",
    },
    payback: { label: "Payback", fecha: "Mar 2030" },
  },
} as const

export const gdcvRoiProyectado: GddRoiProyectadoRow[] = [
  {
    periodo: "Mayo 2026",
    ahorroEstimado: 326_000,
    pendienteRecuperar: 23_800_000,
    progresoEstimado: 37.0,
    estado: "En Curso",
  },
  {
    periodo: "Junio 2026",
    ahorroEstimado: 254_000,
    pendienteRecuperar: 23_474_000,
    progresoEstimado: 37.9,
    estado: "Estimado",
  },
  {
    periodo: "Julio 2026",
    ahorroEstimado: 272_000,
    pendienteRecuperar: 23_220_000,
    progresoEstimado: 38.6,
    estado: "Estimado",
  },
  {
    periodo: "Agosto 2026",
    ahorroEstimado: 344_000,
    pendienteRecuperar: 22_876_000,
    progresoEstimado: 39.3,
    estado: "Estimado",
  },
  {
    periodo: "Septiembre 2026",
    ahorroEstimado: 489_000,
    pendienteRecuperar: 22_532_000,
    progresoEstimado: 40.6,
    estado: "Estimado",
  },
  {
    periodo: "Octubre 2026",
    ahorroEstimado: 579_000,
    pendienteRecuperar: 22_093_000,
    progresoEstimado: 41.5,
    estado: "Estimado",
  },
]

export const gdcvRoiHistorico: GddRoiHistoricoRow[] = [
  {
    periodo: "Abril 2026",
    capRecuperado: 380_000,
    capRecuperadoAcumulado: 14_200_000,
    porcentajeRecuperacion: 37.0,
  },
  {
    periodo: "Marzo 2026",
    capRecuperado: 470_000,
    capRecuperadoAcumulado: 13_820_000,
    porcentajeRecuperacion: 36.4,
  },
  {
    periodo: "Febrero 2026",
    capRecuperado: 615_000,
    capRecuperadoAcumulado: 13_350_000,
    porcentajeRecuperacion: 35.1,
  },
  {
    periodo: "Enero 2026",
    capRecuperado: 705_000,
    capRecuperadoAcumulado: 12_735_000,
    porcentajeRecuperacion: 33.5,
  },
  {
    periodo: "Diciembre 2025",
    capRecuperado: 670_000,
    capRecuperadoAcumulado: 12_030_000,
    porcentajeRecuperacion: 31.7,
  },
  {
    periodo: "Noviembre 2025",
    capRecuperado: 560_000,
    capRecuperadoAcumulado: 11_360_000,
    porcentajeRecuperacion: 29.9,
  },
]

/** Serie alineada con KPIs; eje Y en miles ARS (consistente con RoiRecoveryLineChart). */
export const curvaRecuperacionData: RoiCurvePoint[] = [
  { label: "Mar 24", real: 2000, projected: 2500 },
  { label: "Dic 24", real: 5500, projected: 6000 },
  { label: "Jun 25", real: 9000, projected: 10000 },
  { label: "Dic 25", real: 12000, projected: 14000 },
  { label: "May 26", real: 14200, projected: 16000 },
  { label: "Dic 26", real: null, projected: 22000 },
  { label: "Jun 27", real: null, projected: 28000 },
  { label: "Mar 30", real: null, projected: 38000 },
]

/** Línea de referencia de inversión ($38.000.000 → 38.000 mil en escala del chart). */
export const curvaRecuperacionInversion = 38000
