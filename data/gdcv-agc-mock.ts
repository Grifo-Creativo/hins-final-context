// data/gdcv-agc-mock.ts — GDCV AGC (admin) ROI / curva recuperación

import type { RoiCurvePoint } from "@/data/gdd-roi-mock"

export const roiKpis = {
  inversionInicial: "$38.000.000",
  ahorradoTotal: "$8.933.000",
  capRecuperado: "$14.200.000",
  pendiente: "$23.800.000",
  porcentajeRecuperado: 37,
  recuperoEstimado: "6.8 años",
  tir: "18.5",
  timeline: {
    inicio: { label: "Inicio", fecha: "Mar 2024" },
    hoy: {
      label: "Hoy · 37%",
      fecha: "May 2026",
      pct: 37,
      tooltipText: "Hoy · 2.2 años · 37% recuperado",
    },
    payback: { label: "Payback", fecha: "Mar 2030" },
  },
} as const

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
