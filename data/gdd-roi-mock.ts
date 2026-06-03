// data/gdd-roi-mock.ts

// Re-exportado: otros módulos (gdcv-agc-mock, lib/roi-curve-to-projection) dependen de este tipo
export type RoiCurvePoint = {
  label: string
  real: number | null
  projected: number | null
  projectedOptimista?: number | null
  projectedConservador?: number | null
}

export type ROIDataPoint = {
  fecha: string
  real?: number
  base?: number
  favorable?: number
  riesgo?: number
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
      elapsedYears: "2.0",
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

// ─── ROI Projection Chart ──────────────────────────────────────────────────────
//
// Datos reales: alineados con la tabla Histórico visible en /gdd/roi.
//   Confirmados desde la tabla: Nov 2025 → Abr 2026 (acumulados).
//   Meses anteriores: reconstruidos con patrón estacional fotovoltaico (Córdoba, AR).
//
// Proyecciones: generadas programáticamente desde el patrón mensual base.
//   Suma anual base = $3.000.000 → payback base en 5 años (Abr 2031, 7 años desde inicio).
//   Favorable (+35%/mes): payback ~Dic 2029.
//   Riesgo    (-25%/mes): payback ~Ene 2033.

/**
 * Ahorro mensual base — patrón estacional fotovoltaico hemisferio sur.
 * Verano (Nov–Feb): alto. Invierno (Jun–Ago): mínimo. Suma anual = $3.000.000.
 */
const GDD_MONTHLY_BASE: Readonly<Record<number, number>> = {
  1: 290_000, 2: 280_000, 3: 240_000, 4: 210_000,
  5: 180_000, 6: 140_000, 7: 150_000, 8: 190_000,
  9: 270_000, 10: 320_000, 11: 370_000, 12: 360_000,
}

function buildGddRoiProjectionData(): ROIDataPoint[] {
  // Real data — cada punto confirmado contra tabla histórica /gdd/roi
  const realData: ROIDataPoint[] = [
    { fecha: "2024-05", real: 0 },
    { fecha: "2024-06", real: 165_000 },
    { fecha: "2024-07", real: 315_000 },
    { fecha: "2024-08", real: 485_000 },
    { fecha: "2024-09", real: 740_000 },
    { fecha: "2024-10", real: 1_030_000 },
    { fecha: "2024-11", real: 1_360_000 },
    { fecha: "2024-12", real: 1_740_000 },
    { fecha: "2025-01", real: 2_125_000 },
    { fecha: "2025-02", real: 2_480_000 },
    { fecha: "2025-03", real: 2_730_000 },
    { fecha: "2025-04", real: 2_950_000 },
    { fecha: "2025-05", real: 3_135_000 },
    { fecha: "2025-06", real: 3_285_000 },
    { fecha: "2025-07", real: 3_435_000 },
    { fecha: "2025-08", real: 3_610_000 },
    { fecha: "2025-09", real: 3_865_000 },
    { fecha: "2025-10", real: 4_120_000 },
    { fecha: "2025-11", real: 4_430_000 }, // ← tabla histórica confirmado
    { fecha: "2025-12", real: 4_800_000 }, // ← tabla histórica confirmado
    { fecha: "2026-01", real: 5_190_000 }, // ← tabla histórica confirmado
    { fecha: "2026-02", real: 5_530_000 }, // ← tabla histórica confirmado
    { fecha: "2026-03", real: 5_790_000 }, // ← tabla histórica confirmado
    { fecha: "2026-04", real: 6_000_000 }, // ← tabla histórica confirmado (Hoy)
  ]

  // Proyecciones desde Mayo 2026 — generadas con patrón estacional
  const projData: ROIDataPoint[] = []
  let base = 6_000_000
  let favorable = 6_000_000
  let riesgo = 6_000_000

  for (let year = 2026; year <= 2033; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === 2026 && month < 5) continue
      const m = GDD_MONTHLY_BASE[month]
      base      += m
      favorable += Math.round(m * 1.35)
      riesgo    += Math.round(m * 0.75)
      projData.push({
        fecha: `${year}-${String(month).padStart(2, "0")}`,
        base,
        favorable,
        riesgo,
      })
    }
  }

  return [...realData, ...projData]
}

export const gddRoiProjectionData = buildGddRoiProjectionData()

// "Hoy" para el chart: último mes real es Abr 2026, proyecciones arrancan en May 2026.
export const GDD_ROI_FECHA_HOY = "2026-05"

// Tasa de cambio fija para prototipo (ARS por USD)
export const TIPO_CAMBIO_ARS = 1200
