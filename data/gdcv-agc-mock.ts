// data/gdcv-agc-mock.ts — GDCV AGC (admin) ROI / curva recuperación

import type {
  GddRoiHistoricoRow,
  GddRoiProyectadoRow,
  ROIDataPoint,
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

// ─── ROI Projection Chart ──────────────────────────────────────────────────────
//
// Datos reales: alineados con tabla Histórico visible en /gdcv/roi.
//   Confirmados desde la tabla: Nov 2025 → Abr 2026 (acumulados).
//   Meses anteriores: reconstruidos con patrón estacional fotovoltaico + curva de referencia.
//
// Proyecciones: generadas programáticamente desde el patrón mensual base.
//   Suma anual base ≈ $5.664.000 → payback base ~Jul 2030 (6.2 años desde inicio).
//   Favorable (+40%/mes): payback ~Mayo 2029.
//   Riesgo    (-30%/mes): payback ~Mayo 2032.

/**
 * Ahorro mensual base — valores extraídos directamente de las tablas del parque.
 * Nov–Abr (historico) + May–Oct (proyectado). Suma anual ≈ $5.664.000.
 */
const GDCV_MONTHLY_BASE: Readonly<Record<number, number>> = {
  1: 705_000,  // Enero   — historico confirmado
  2: 615_000,  // Febrero — historico confirmado
  3: 470_000,  // Marzo   — historico confirmado
  4: 380_000,  // Abril   — historico confirmado
  5: 326_000,  // Mayo    — proyectado confirmado
  6: 254_000,  // Junio   — proyectado confirmado
  7: 272_000,  // Julio   — proyectado confirmado
  8: 344_000,  // Agosto  — proyectado confirmado
  9: 489_000,  // Septiembre — proyectado confirmado
  10: 579_000, // Octubre    — proyectado confirmado
  11: 560_000, // Noviembre — historico confirmado
  12: 670_000, // Diciembre — historico confirmado
}

function buildGdcvRoiProjectionData(): ROIDataPoint[] {
  // Real data — confirmado contra tabla histórica + interpolado con curva de referencia
  const realData: ROIDataPoint[] = [
    { fecha: "2024-03", real: 0 },
    { fecha: "2024-04", real: 400_000 },
    { fecha: "2024-05", real: 850_000 },
    { fecha: "2024-06", real: 1_380_000 },
    { fecha: "2024-07", real: 1_800_000 },
    { fecha: "2024-08", real: 2_270_000 },
    { fecha: "2024-09", real: 2_890_000 },
    { fecha: "2024-10", real: 3_610_000 },
    { fecha: "2024-11", real: 4_460_000 },
    { fecha: "2024-12", real: 5_400_000 },
    { fecha: "2025-01", real: 6_270_000 },
    { fecha: "2025-02", real: 7_080_000 },
    { fecha: "2025-03", real: 7_650_000 },
    { fecha: "2025-04", real: 8_140_000 },
    { fecha: "2025-05", real: 8_530_000 },
    { fecha: "2025-06", real: 8_820_000 },
    { fecha: "2025-07", real: 9_140_000 },
    { fecha: "2025-08", real: 9_540_000 },
    { fecha: "2025-09", real: 10_120_000 },
    { fecha: "2025-10", real: 10_800_000 },
    { fecha: "2025-11", real: 11_360_000 }, // ← tabla histórica confirmado
    { fecha: "2025-12", real: 12_030_000 }, // ← tabla histórica confirmado
    { fecha: "2026-01", real: 12_735_000 }, // ← tabla histórica confirmado
    { fecha: "2026-02", real: 13_350_000 }, // ← tabla histórica confirmado
    { fecha: "2026-03", real: 13_820_000 }, // ← tabla histórica confirmado
    { fecha: "2026-04", real: 14_200_000 }, // ← tabla histórica confirmado (Hoy)
  ]

  const projData: ROIDataPoint[] = []
  let base      = 14_200_000
  let favorable = 14_200_000
  let riesgo    = 14_200_000

  for (let year = 2026; year <= 2032; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === 2026 && month < 5) continue
      const m = GDCV_MONTHLY_BASE[month]
      base      += m
      favorable += Math.round(m * 1.4)
      riesgo    += Math.round(m * 0.7)
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

export const gdcvRoiProjectionData = buildGdcvRoiProjectionData()
export const GDCV_ROI_FECHA_HOY = "2026-05"
