// data/gdd-roi-mock.ts

// Re-exportado: otros módulos (gdcv-agc-mock, lib/roi-curve-to-projection) dependen de este tipo
export type RoiCurvePoint = {
  label: string
  real: number | null
  projected: number | null
  projectedOptimista?: number | null
  projectedConservador?: number | null
}

export const gddRoiKpis = {
  totalInvertido: 21_000_000,
  inversionRecuperada: 6_000_000,
  porcentajeRecuperado: 28.5,
  pendienteRecuperar: 15_000_000,
  recuperoEstimado: "7.0 años",
  tir: "15.00%",
  plazo: "20 años",
  timeline: {
    inicio: { label: "Inicio", fecha: "Mayo 2024" },
    hoy: {
      label: "Hoy",
      fecha: "Mayo 2026",
      pct: 28.5,
      tooltipText: "Mayo 2026 · 2.0 Años",
    },
    payback: { label: "Payback", fecha: "Mayo 2031" },
  },
}

export type GddRoiProyectadoRow = {
  periodo: string
  ahorroEstimado: number
  pendienteRecuperar: number
  progresoEstimado: number
  estado: "En Curso" | "Estimado"
}

export const gddRoiProyectado: GddRoiProyectadoRow[] = [
  { periodo: "Mayo 2026", ahorroEstimado: 180_000, pendienteRecuperar: 15_000_000, progresoEstimado: 28.5, estado: "En Curso" },
  { periodo: "Junio 2026", ahorroEstimado: 140_000, pendienteRecuperar: 14_820_000, progresoEstimado: 29.4, estado: "Estimado" },
  { periodo: "Julio 2026", ahorroEstimado: 150_000, pendienteRecuperar: 14_680_000, progresoEstimado: 30.1, estado: "Estimado" },
  { periodo: "Agosto 2026", ahorroEstimado: 190_000, pendienteRecuperar: 14_530_000, progresoEstimado: 30.8, estado: "Estimado" },
  { periodo: "Septiembre 2026", ahorroEstimado: 270_000, pendienteRecuperar: 14_340_000, progresoEstimado: 32.1, estado: "Estimado" },
  { periodo: "Octubre 2026", ahorroEstimado: 320_000, pendienteRecuperar: 14_070_000, progresoEstimado: 33.0, estado: "Estimado" },
]

export type GddRoiHistoricoRow = {
  periodo: string
  capRecuperado: number
  capRecuperadoAcumulado: number
  porcentajeRecuperacion: number
}

export const gddRoiHistorico: GddRoiHistoricoRow[] = [
  { periodo: "Abril 2026", capRecuperado: 210_000, capRecuperadoAcumulado: 6_000_000, porcentajeRecuperacion: 28.5 },
  { periodo: "Marzo 2026", capRecuperado: 260_000, capRecuperadoAcumulado: 5_790_000, porcentajeRecuperacion: 27.6 },
  { periodo: "Febrero 2026", capRecuperado: 340_000, capRecuperadoAcumulado: 5_530_000, porcentajeRecuperacion: 26.3 },
  { periodo: "Enero 2026", capRecuperado: 390_000, capRecuperadoAcumulado: 5_190_000, porcentajeRecuperacion: 24.7 },
  { periodo: "Diciembre 2025", capRecuperado: 370_000, capRecuperadoAcumulado: 4_800_000, porcentajeRecuperacion: 22.9 },
  { periodo: "Noviembre 2025", capRecuperado: 310_000, capRecuperadoAcumulado: 4_430_000, porcentajeRecuperacion: 21.1 },
]

// Tasa de cambio fija para prototipo (ARS por USD)
export const TIPO_CAMBIO_ARS = 1200
