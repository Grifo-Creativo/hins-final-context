// data/gdcv-socio-mock.ts
import {
  getChartRangeSubtitle,
  sliceChartRangeSeries,
} from "@/lib/chart-range-resolve"
import {
  gdcvParkDetails,
  GDCV_ENERGY_MONTHLY_CANONICAL,
  GDCV_OPERATIONS_START_METRIC_LABEL,
} from "@/data/gdcv-mock"
import {
  getDailyGenerationData24,
  getDailyPeak,
  getDailyTotal,
  MOCK_TODAY,
  toDateKey,
  type DailyPoint,
} from "@/data/gdcv-daily-mock"
import type { ChartRangeChip } from "@/types/chart-range"
import type {
  GddRoiHistoricoRow,
  GddRoiProyectadoRow,
  ROIDataPoint,
  RoiCurvePoint,
} from "@/data/gdd-roi-mock"
import type { StatListItem } from "@/components/ui/stat-list"
import { formatCurrency } from "@/lib/format-currency"
import { DollarSignIcon, WalletIcon, ZapIcon } from "lucide-react"

/** Inversión inicial del socio — canónico en USD (UI: `formatCurrency` → `u$s`). */
export const SOCIO_INVERSION_INICIAL_USD = 5_700_000

/** Capital recuperado (37% de inversión USD). */
export const SOCIO_CAPITAL_RECUPERADO_USD = 2_130_000

/** Pendiente de recuperar (USD). */
export const SOCIO_PENDIENTE_USD =
  SOCIO_INVERSION_INICIAL_USD - SOCIO_CAPITAL_RECUPERADO_USD

/** Total ahorrado acumulado en facturas (ARS). */
export const SOCIO_TOTAL_AHORRADO_ARS = 2_130_000

const fmtArs = (amount: number) => formatCurrency(amount, "ars", "full")
const fmtArsCompact = (amount: number) => formatCurrency(amount, "ars", "compact")

// ─── Identidad ──────────────────────────────────────────────────────────────

export const socioNombre = "Agro Sur Industrial"
export const socioPorcentaje = 15
export const socioParkName = "Parque Río Cuarto"

/** Subtitle StatList / KPIs — cuota del socio en el parque. */
export const socioCuotaDelParqueSubtitle = `De mi ${socioPorcentaje}% del parque`

/**
 * Terminología (prototipo):
 * - Totales 980/815 kWp (`gdcvParkDetails`) → `/gdcv/socio/parque` bajo el chart.
 * - 380/310 kWp (`socioPotencia*`) → Mi Espacio; potencia asignada al socio (no es 15% × total).
 * - Inversión bajo chart en parque = `socioRoiMetrics` (inversión del socio), no CAPEX AGC.
 */
export const socioOperationsStartLabel = "Marzo 2024"

/** Potencia asignada al socio — Mi Espacio (`socioParkDetails`). */
export const socioPotenciaInstalada = "380 kWp"
export const socioPotenciaAcople = "310 kWp"

/** Totales del parque (AGC) — `SocioPerformanceView` fila 1 bajo chart. */
export const socioParquePotenciaTotalInstalada = gdcvParkDetails.metrics[0].value
export const socioParquePotenciaTotalAcople = gdcvParkDetails.metrics[1].value

export type SocioParqueChartMetric = { label: string; value: string }

/** Copy corto de equipo en `ParkDetailsCard` Mi Espacio. */
export const socioParkEquipoLabel = "Solar HiKu7 655W"

/**
 * Detalle del parque — Mi Espacio (`/gdcv/socio`, columna 1).
 * Grid 2×2: participación + mi instalada | equipo + mi acople. Sin último mantenimiento.
 */
export const socioParkDetails = {
  imageSrc: "/images/png-assets/asset_gdcv.png",
  imageAlt: "Parque Río Cuarto",
  metrics: [
    { label: "Mi Potencia Instalada", value: socioPotenciaInstalada },
    { label: "Mi participación", value: `${socioPorcentaje}%` },
    { label: "Equipo", value: socioParkEquipoLabel },
    { label: "Potencia de Acople", value: socioPotenciaAcople },
  ],
} as const

const AHORRO_PER_KWH = 599
const PARQUE_KWH_FACTOR = 1.79

/** Cola mensual conocida (flow) — prioridad sobre derivación. */
const SOCIO_AHORRO_TAIL: Record<string, number> = {
  "Nov 25": 82600,
  "Dic 25": 72200,
  "Ene 26": 60400,
  "Feb 26": 51200,
  "Mar 26": 47200,
  "Abr 26": 74400,
}

const SOCIO_PARQUE_TAIL: Record<string, number> = {
  "Nov 25": 247.1,
  "Dic 25": 91.2,
  "Ene 26": 250,
  "Feb 26": 182.6,
  "Mar 26": 240.4,
  "Abr 26": 204.59,
}

function buildSocioAhorroMonthly(): SocioAhorroRow[] {
  return GDCV_ENERGY_MONTHLY_CANONICAL.map((row) => {
    const total = SOCIO_AHORRO_TAIL[row.label] ?? Math.round(row.generated * AHORRO_PER_KWH)
    const autoconsumo = Math.round(total * 0.68)
    const inyectada = total - autoconsumo
    return {
      label: row.label,
      autoconsumo,
      inyectada,
    }
  })
}

function buildSocioParqueMonthly(): SocioParqueRow[] {
  return GDCV_ENERGY_MONTHLY_CANONICAL.map((row) => ({
    label: row.label,
    generated:
      SOCIO_PARQUE_TAIL[row.label] ??
      Math.round(row.generated * PARQUE_KWH_FACTOR * 10) / 10,
  }))
}

// ─── Mi Ahorro Chart ────────────────────────────────────────────────────────

export type SocioAhorroRow = { label: string; autoconsumo: number; inyectada: number }

const SOCIO_AHORRO_MONTHLY = buildSocioAhorroMonthly()

const SOCIO_AHORRO_WEEKLY: readonly SocioAhorroRow[] = [
  { label: "1–7 Abr", autoconsumo: 12240, inyectada: 5760 },
  { label: "8–14 Abr", autoconsumo: 13600, inyectada: 6400 },
  { label: "15–21 Abr", autoconsumo: 11968, inyectada: 5632 },
  { label: "22–30 Abr", autoconsumo: 12784, inyectada: 6016 },
]

export function getSocioAhorroSeries(range: ChartRangeChip): SocioAhorroRow[] {
  return sliceChartRangeSeries(range, SOCIO_AHORRO_MONTHLY, SOCIO_AHORRO_WEEKLY)
}

export function getSocioAhorroChartSubtitle(range: ChartRangeChip): string {
  return getChartRangeSubtitle(range, socioOperationsStartLabel)
}

/** KPI resumido (abril) — alineado al bloque "Mi Ahorro en abril" del flow. */
export const socioAhorroKpi = {
  value: fmtArs(74_400),
  delta: "+12% vs mes anterior",
} as const

// ─── Mi Ahorro en Energía (kWh variant) ────────────────────────────────────
// Derived from SOCIO_AHORRO_MONTHLY using rate: $74.400 ÷ 830.17 kWh = $89.60/kWh
// Maintains same 68/32 autoconsumo/inyectada split as monetary data

export type SocioAhorroEnergiaRow = { label: string; autoconsumo: number; inyectada: number }

const SOCIO_AHORRO_ENERGIA_MONTHLY: SocioAhorroEnergiaRow[] = [
  { label: "Nov 25", autoconsumo: 627, inyectada: 295 },
  { label: "Dic 25", autoconsumo: 547, inyectada: 259 },
  { label: "Ene 26", autoconsumo: 458, inyectada: 216 },
  { label: "Feb 26", autoconsumo: 389, inyectada: 183 },
  { label: "Mar 26", autoconsumo: 358, inyectada: 169 },
  { label: "Abr 26", autoconsumo: 564, inyectada: 266 },
]

const SOCIO_AHORRO_ENERGIA_WEEKLY: readonly SocioAhorroEnergiaRow[] = [
  { label: "1–7 Abr", autoconsumo: 83, inyectada: 39 },
  { label: "8–14 Abr", autoconsumo: 92, inyectada: 44 },
  { label: "15–21 Abr", autoconsumo: 81, inyectada: 38 },
  { label: "22–30 Abr", autoconsumo: 87, inyectada: 41 },
]

export function getSocioAhorroEnergiaSeries(range: ChartRangeChip): SocioAhorroEnergiaRow[] {
  return sliceChartRangeSeries(range, SOCIO_AHORRO_ENERGIA_MONTHLY, SOCIO_AHORRO_ENERGIA_WEEKLY)
}

/** Serie simple kWh para `ParkEnergyBarChart` — total por período (sin stack). */
export function getSocioEnergiaGeneradaSeries(
  range: ChartRangeChip
): { label: string; generated: number }[] {
  return getSocioAhorroEnergiaSeries(range).map(({ label, autoconsumo, inyectada }) => ({
    label,
    generated: autoconsumo + inyectada,
  }))
}

const SOCIO_ENERGIA_SHARE = socioPorcentaje / 100

/** Generación horaria del socio (cuotaparte) — vista DIA (chip `1d`) en Mi Energía Generada. */
export function getSocioEnergiaGeneradaDailySeries(day: Date): DailyPoint[] {
  return getSocioParqueDailySeries(day).map(({ hour, kw }) => ({
    hour,
    kw: Math.round(kw * SOCIO_ENERGIA_SHARE * 100) / 100,
  }))
}

export function getSocioEnergiaGeneradaDailyTotal(day: Date): string {
  return getDailyTotal(getSocioEnergiaGeneradaDailySeries(day))
}

export function getSocioEnergiaGeneradaDailyPeak(day: Date): {
  value: string
  hour: string
} {
  return getDailyPeak(getSocioEnergiaGeneradaDailySeries(day))
}

/** KPI for energy perspective (abril) — "830 kWh" */
export const socioAhorroEnergiaKpi = {
  value: "830",
  unit: "kWh",
  delta: "Total en Abril",
} as const

// ─── Mi Energía Generada (KPI) ──────────────────────────────────────────────

export const socioEnergiaGenerada = {
  value: "830.17",
  unit: "kWh",
  period: "Abril 2026",
}

export const socioEnergiaSparkline = [42, 58, 53, 67, 61, 74, 83].map((v) => ({ value: v }))

// ─── StatList Items (Inyección / Energía) ───────────────────────────────────

export const socioStatListInyeccion: StatListItem[] = [
  { icon: DollarSignIcon, name: "Autoconsumo virtual", value: fmtArs(54_200) },
  { icon: DollarSignIcon, name: "Energía Inyectada", value: fmtArs(20_200) },
  {
    icon: WalletIcon,
    name: "Total Ahorro en Abril",
    value: fmtArs(74_400),
    subtitle: socioCuotaDelParqueSubtitle,
  },
]

export const socioStatListEnergia: StatListItem[] = [
  { icon: ZapIcon, name: "Energía asignada", value: "207.5 kWh" },
  { icon: ZapIcon, name: "Energía neteada",  value: "185.3 kWh" },
  {
    icon: WalletIcon,
    name: "Total kWh en Abril",
    value: "207.5 kWh",
    subtitle: socioCuotaDelParqueSubtitle,
  },
]

/** StatList items for energy-based ahorro breakdown (V2 variant) */
export const socioStatListAhorroEnergia: StatListItem[] = [
  { icon: ZapIcon, name: "Autoconsumo virtual", value: "564 kWh" },
  { icon: ZapIcon, name: "Energía Inyectada", value: "266 kWh" },
  {
    icon: WalletIcon,
    name: "Total kWh en Abril",
    value: "830 kWh",
    subtitle: socioCuotaDelParqueSubtitle,
  },
]

/** StatList items — perspectiva V2 (mockup Desglose Ahorro) */
export const socioStatListV2Dinero: StatListItem[] = [
  { icon: DollarSignIcon, name: "Autoconsumo Virtual", value: fmtArs(54_200) },
  { icon: DollarSignIcon, name: "Energía Inyectada", value: fmtArs(20_200) },
  {
    icon: WalletIcon,
    name: "Total Ahorro Abril",
    value: fmtArs(74_400),
    subtitle: socioCuotaDelParqueSubtitle,
  },
]

export const socioStatListV2Energia: StatListItem[] = [
  { icon: ZapIcon, name: "Autoconsumo Virtual", value: "564 kWh" },
  { icon: ZapIcon, name: "Energía Inyectada", value: "266 kWh" },
  {
    icon: WalletIcon,
    name: "Total Ahorro Abril",
    value: "830 kWh",
    subtitle: socioCuotaDelParqueSubtitle,
  },
]

/** Sparklines del panel derecho V2 (últimos 6 meses). */
export const socioV2AhorroSparkline = SOCIO_AHORRO_MONTHLY.slice(-6).map(
  (row) => ({ value: row.autoconsumo + row.inyectada })
)

export const socioV2EnergiaSparkline = [...socioEnergiaSparkline]

/** KPIs fijos del panel derecho V2 (abril en curso) */
export const socioV2PanelKpis = {
  periodLabel: "Abril 2026",
  ahorro: {
    label: "Ahorro",
    value: fmtArs(74_400),
  },
  energiaGen: {
    label: "Energia Gen.",
    value: "830",
    unit: "kWh",
  },
} as const

// ─── ROI Cards ───────────────────────────────────────────────────────────────

export const socioRoiMetrics = {
  totalAhorrado: {
    label: "Ahorrado en Facturas",
    value: fmtArsCompact(SOCIO_TOTAL_AHORRADO_ARS),
    badge: "+8% anual",
  },
  inversionInicial: {
    label: "Inversión inicial",
    value: formatCurrency(SOCIO_INVERSION_INICIAL_USD, "usd", "compact"),
    recoveredPercent: 37,
    recoveredLabel: "37% recuperada",
  },
  payback: {
    label: "Payback estimado",
    value: "6.8 años",
    subtitle: "Desde Marzo 2024",
  },
}

export const socioRoiSecondaryMetrics = {
  tir: { label: "TIR (actualizada)", value: "18.5%" },
  inicioOperaciones: {
    label: GDCV_OPERATIONS_START_METRIC_LABEL,
    value: socioOperationsStartLabel,
  },
}

/** KPIs numéricos + timeline — `SocioRoiView` (misma forma que `gddRoiKpis` / `gdcvRoiKpis`). */
export const socioRoiKpis = {
  totalInvertido: SOCIO_INVERSION_INICIAL_USD,
  inversionRecuperada: SOCIO_CAPITAL_RECUPERADO_USD,
  porcentajeRecuperado: socioRoiMetrics.inversionInicial.recoveredPercent,
  pendienteRecuperar: SOCIO_PENDIENTE_USD,
  recuperoEstimado: socioRoiMetrics.payback.value,
  tir: socioRoiSecondaryMetrics.tir.value,
  plazo: "25 años",
  timeline: {
    inicio: { label: "Inicio", fecha: "Mar 2024" },
    hoy: {
      label: "Hoy",
      fecha: "Abr 2026",
      pct: socioRoiMetrics.inversionInicial.recoveredPercent,
      elapsedYears: "2.1",
    },
    payback: { label: "Payback", fecha: "Dic 2029" },
  },
} as const

/** Tabla recupero — `SocioRoiView` sheet (base USD, alineado a `socioRoiKpis`). */
export const socioRoiProyectado: GddRoiProyectadoRow[] = [
  {
    periodo: "Abril 2026",
    ahorroEstimado: 95_000,
    pendienteRecuperar: SOCIO_PENDIENTE_USD,
    progresoEstimado: 37.0,
    estado: "En Curso",
  },
  {
    periodo: "Mayo 2026",
    ahorroEstimado: 88_000,
    pendienteRecuperar: 3_482_000,
    progresoEstimado: 38.0,
    estado: "Estimado",
  },
  {
    periodo: "Junio 2026",
    ahorroEstimado: 92_000,
    pendienteRecuperar: 3_390_000,
    progresoEstimado: 38.6,
    estado: "Estimado",
  },
  {
    periodo: "Julio 2026",
    ahorroEstimado: 98_000,
    pendienteRecuperar: 3_292_000,
    progresoEstimado: 39.3,
    estado: "Estimado",
  },
  {
    periodo: "Agosto 2026",
    ahorroEstimado: 105_000,
    pendienteRecuperar: 3_187_000,
    progresoEstimado: 40.1,
    estado: "Estimado",
  },
  {
    periodo: "Septiembre 2026",
    ahorroEstimado: 112_000,
    pendienteRecuperar: 3_075_000,
    progresoEstimado: 41.0,
    estado: "Estimado",
  },
]

export const socioRoiHistorico: GddRoiHistoricoRow[] = [
  {
    periodo: "Abril 2026",
    capRecuperado: 95_000,
    capRecuperadoAcumulado: SOCIO_CAPITAL_RECUPERADO_USD,
    porcentajeRecuperacion: 37.0,
  },
  {
    periodo: "Marzo 2026",
    capRecuperado: 118_000,
    capRecuperadoAcumulado: 2_035_000,
    porcentajeRecuperacion: 35.7,
  },
  {
    periodo: "Febrero 2026",
    capRecuperado: 142_000,
    capRecuperadoAcumulado: 1_917_000,
    porcentajeRecuperacion: 33.6,
  },
  {
    periodo: "Enero 2026",
    capRecuperado: 168_000,
    capRecuperadoAcumulado: 1_775_000,
    porcentajeRecuperacion: 31.1,
  },
  {
    periodo: "Diciembre 2025",
    capRecuperado: 155_000,
    capRecuperadoAcumulado: 1_607_000,
    porcentajeRecuperacion: 28.2,
  },
  {
    periodo: "Noviembre 2025",
    capRecuperado: 132_000,
    capRecuperadoAcumulado: 1_452_000,
    porcentajeRecuperacion: 25.5,
  },
]

/** Grid 2×2 bajo chart — `SocioPerformanceView` (`/gdcv/socio/parque`). */
export const socioParqueChartMetricRows: readonly [
  readonly [SocioParqueChartMetric, SocioParqueChartMetric],
  readonly [SocioParqueChartMetric, SocioParqueChartMetric],
] = [
  [
    { label: "Potencia total instalada", value: socioParquePotenciaTotalInstalada },
    { label: "Potencia total de acople", value: socioParquePotenciaTotalAcople },
  ],
  [
    {
      label: socioRoiMetrics.inversionInicial.label,
      value: socioRoiMetrics.inversionInicial.value,
    },
    {
      label: socioRoiSecondaryMetrics.inicioOperaciones.label,
      value: socioRoiSecondaryMetrics.inicioOperaciones.value,
    },
  ],
] as const

// ─── Curva de Recuperación ────────────────────────────────────────────────────
// Values in thousands of ARS (1 unit = $1.000)

export const socioCurvaRecuperacion: RoiCurvePoint[] = [
  { label: "Mar 24", real: 213, projected: 250 },
  { label: "Dic 24", real: 630, projected: 900 },
  { label: "Jun 25", real: 1_350, projected: 1_500 },
  { label: "Dic 25", real: 1_830, projected: 2_100 },
  { label: "Abr 26", real: 2_130, projected: 2_400 },
  { label: "Dic 26", real: null, projected: 3_300 },
  { label: "Jun 27", real: null, projected: 4_200 },
]

export const SOCIO_INVERSION_REFERENCIA = 5_700

// ─── ROI Projection Chart ─────────────────────────────────────────────────────
//
// Datos reales: confirmados desde tabla Histórico (Nov 2025 → Abr 2026).
//   Meses anteriores: ramp-up gradual desde Mar 2024 (inicio operaciones).
//   El parque operó a menor capacidad en 2024 (tarifa inicial + ramp-up técnico).
//
// Proyecciones: patrón mensual base extraído de tablas de la vista del socio.
//   Suma anual ≈ $1.430.000 → payback base ~Nov 2028 (4.9 años desde inicio).
//   Favorable (+40%/mes): payback ~Jul 2028.
//   Riesgo    (-30%/mes): payback ~Jun 2030.

/**
 * Ahorro mensual base del socio — extraído de tablas proyectado + histórico.
 * Verano (Nov–Feb): alto. Invierno (May–Ago): mínimo. Suma anual ≈ $1.430.000.
 */
const SOCIO_MONTHLY_BASE: Readonly<Record<number, number>> = {
  1: 168_000,  // Enero   — historico confirmado
  2: 142_000,  // Febrero — historico confirmado
  3: 118_000,  // Marzo   — historico confirmado
  4: 95_000,   // Abril   — historico confirmado
  5: 88_000,   // Mayo    — proyectado confirmado
  6: 92_000,   // Junio   — proyectado confirmado
  7: 98_000,   // Julio   — proyectado confirmado
  8: 105_000,  // Agosto  — proyectado confirmado
  9: 112_000,  // Septiembre — proyectado confirmado
  10: 125_000, // Octubre    — interpolado
  11: 132_000, // Noviembre — historico confirmado
  12: 155_000, // Diciembre — historico confirmado
}

function buildSocioRoiProjectionData(): ROIDataPoint[] {
  // Real data — ramp-up 2024 + confirmado contra tabla histórica /gdcv/socio
  const realData: ROIDataPoint[] = [
    { fecha: "2024-03", real: 0 },
    { fecha: "2024-04", real: 30_000 },
    { fecha: "2024-05", real: 65_000 },
    { fecha: "2024-06", real: 103_000 },
    { fecha: "2024-07", real: 145_000 },
    { fecha: "2024-08", real: 190_000 },
    { fecha: "2024-09", real: 245_000 },
    { fecha: "2024-10", real: 310_000 },
    { fecha: "2024-11", real: 390_000 },
    { fecha: "2024-12", real: 485_000 },
    { fecha: "2025-01", real: 590_000 },
    { fecha: "2025-02", real: 685_000 },
    { fecha: "2025-03", real: 765_000 },
    { fecha: "2025-04", real: 830_000 },
    { fecha: "2025-05", real: 888_000 },
    { fecha: "2025-06", real: 948_000 },
    { fecha: "2025-07", real: 1_013_000 },
    { fecha: "2025-08", real: 1_085_000 },
    { fecha: "2025-09", real: 1_175_000 },
    { fecha: "2025-10", real: 1_320_000 },
    { fecha: "2025-11", real: 1_452_000 }, // ← tabla histórica confirmado
    { fecha: "2025-12", real: 1_607_000 }, // ← tabla histórica confirmado
    { fecha: "2026-01", real: 1_775_000 }, // ← tabla histórica confirmado
    { fecha: "2026-02", real: 1_917_000 }, // ← tabla histórica confirmado
    { fecha: "2026-03", real: 2_035_000 }, // ← tabla histórica confirmado
    { fecha: "2026-04", real: 2_130_000 }, // ← tabla histórica confirmado (Hoy)
  ]

  const projData: ROIDataPoint[] = []
  let base      = 2_130_000
  let favorable = 2_130_000
  let riesgo    = 2_130_000

  for (let year = 2026; year <= 2031; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === 2026 && month < 5) continue
      const m = SOCIO_MONTHLY_BASE[month]
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

export const socioRoiProjectionData = buildSocioRoiProjectionData()
export const SOCIO_ROI_FECHA_HOY = "2026-05"

// ─── Historial de Compensaciones ─────────────────────────────────────────────

export interface CompensacionRow {
  periodo: string
  energiaGenerada: string
  ahorroAutoconsumo: string
  ahorroInyeccion: string
  ahorroTotal: string
  estado: "En Curso" | "Aplicado"
}

export const compensacionesMock: CompensacionRow[] = [
  {
    periodo: "Abril 2026",
    energiaGenerada: "37.2 kWh",
    ahorroAutoconsumo: fmtArs(54_200),
    ahorroInyeccion: fmtArs(20_200),
    ahorroTotal: fmtArs(74_400),
    estado: "En Curso",
  },
  {
    periodo: "Marzo 2026",
    energiaGenerada: "23.6 kWh",
    ahorroAutoconsumo: fmtArs(47_200),
    ahorroInyeccion: fmtArs(0),
    ahorroTotal: fmtArs(47_200),
    estado: "Aplicado",
  },
  {
    periodo: "Febrero 2026",
    energiaGenerada: "25.6 kWh",
    ahorroAutoconsumo: fmtArs(51_200),
    ahorroInyeccion: fmtArs(0),
    ahorroTotal: fmtArs(51_200),
    estado: "Aplicado",
  },
  {
    periodo: "Enero 2026",
    energiaGenerada: "30.2 kWh",
    ahorroAutoconsumo: fmtArs(60_400),
    ahorroInyeccion: fmtArs(0),
    ahorroTotal: fmtArs(60_400),
    estado: "Aplicado",
  },
  {
    periodo: "Diciembre 2025",
    energiaGenerada: "36.1 kWh",
    ahorroAutoconsumo: fmtArs(72_200),
    ahorroInyeccion: fmtArs(0),
    ahorroTotal: fmtArs(72_200),
    estado: "Aplicado",
  },
  {
    periodo: "Noviembre 2025",
    energiaGenerada: "41.3 kWh",
    ahorroAutoconsumo: fmtArs(82_600),
    ahorroInyeccion: fmtArs(0),
    ahorroTotal: fmtArs(82_600),
    estado: "Aplicado",
  },
]

// ─── Energía del Parque Chart ────────────────────────────────────────────────

export type SocioParqueRow = { label: string; generated: number }

const SOCIO_PARQUE_MONTHLY = buildSocioParqueMonthly()

const SOCIO_PARQUE_WEEKLY: readonly SocioParqueRow[] = [
  { label: "1–7 Abr", generated: 48.3 },
  { label: "8–14 Abr", generated: 52.1 },
  { label: "15–21 Abr", generated: 50.7 },
  { label: "22–30 Abr", generated: 53.49 },
]

export function getSocioParqueDailySeries(day: Date): DailyPoint[] {
  return getDailyGenerationData24(toDateKey(day))
}

export function getSocioParqueDailyTotal(day: Date): string {
  return getDailyTotal(getSocioParqueDailySeries(day))
}

export function getSocioParqueDailyPeak(day: Date): { value: string; hour: string } {
  return getDailyPeak(getSocioParqueDailySeries(day))
}

export function getSocioParqueSeries(range: ChartRangeChip): SocioParqueRow[] {
  return sliceChartRangeSeries(range, SOCIO_PARQUE_MONTHLY, SOCIO_PARQUE_WEEKLY)
}

export type SocioParqueShareRow = SocioParqueRow & {
  miParte: number
  resto: number
}

/** Cuotaparte del socio sobre la serie del parque — `ParkEnergyBarChart` modo share. */
export function mapSocioParqueShareRows(
  rows: SocioParqueRow[]
): SocioParqueShareRow[] {
  const share = SOCIO_ENERGIA_SHARE
  return rows.map(({ label, generated }) => {
    const miParte = Math.round(generated * share * 100) / 100
    const resto = Math.round((generated - miParte) * 100) / 100
    return { label, generated, miParte, resto }
  })
}

export function getSocioParqueShareSeries(
  range: ChartRangeChip
): SocioParqueShareRow[] {
  return mapSocioParqueShareRows(getSocioParqueSeries(range))
}

export function getSocioParqueChartSubtitle(range: ChartRangeChip): string {
  return getChartRangeSubtitle(range, socioOperationsStartLabel)
}

export { MOCK_TODAY as socioMockToday }

// ─── KPI Parque ───────────────────────────────────────────────────────────────

export const socioEnergiaPark = {
  value: "204.59",
  unit: "kWh",
  delta: "+10 kWh vs mes anterior",
}

export const socioEnergiaParkSparkline = [75, 92, 88, 110, 105, 130, 204].map((v) => ({ value: v }))

export const socioCantidadSocios = "6 Cuotapartes"

/** Total de socios en el parque — donut centro / KPI cantidad */
export const socioTotalParticipantes = 6

// ─── Participación por Socio ──────────────────────────────────────────────────

export interface ParticipacionSocio {
  nombre: string
  participacion: string
  color: string
  /** Vista como usuario actual — aparece primero en la leyenda compacta */
  isCurrent?: boolean
}

export interface ParticipacionChartSlice {
  name: string
  value: number
  /** Hex definidos en mock — únicos colores para este chart */
  color: string
}

export const participacionChartData: ParticipacionChartSlice[] = [
  { name: "Agro Sur Industrial", value: 15, color: "#2dd4bf" },
  { name: "Ferretería Catalán", value: 20, color: "#86efac" },
  { name: "Avícola del Sur", value: 20, color: "#10b981" },
  { name: "Campo Vita Alimentos", value: 20, color: "#84cc16" },
  { name: "Socio 5", value: 15, color: "#059669" },
  { name: "Socio 6", value: 10, color: "#bef264" },
]

export const participacionSocios: ParticipacionSocio[] = [
  { nombre: "Agro Sur Industrial", participacion: "15%", color: "#2dd4bf", isCurrent: true },
  { nombre: "Ferretería Catalán", participacion: "20%", color: "#86efac" },
  { nombre: "Avícola del Sur", participacion: "20%", color: "#10b981" },
  { nombre: "Campo Vita Alimentos", participacion: "20%", color: "#84cc16" },
  { nombre: "Socio 5", participacion: "15%", color: "#059669" },
  { nombre: "Socio 6", participacion: "10%", color: "#bef264" },
]

// ─── Historial de Generación ──────────────────────────────────────────────────

export interface GeneracionRow {
  periodo: string
  energiaGenerada: string
  columnN: string
}

export const generacionMock: GeneracionRow[] = [
  { periodo: "Abril 2026",     energiaGenerada: "204.59 kWh", columnN: "—" },
  { periodo: "Marzo 2026",     energiaGenerada: "nn kWh",     columnN: "—" },
  { periodo: "Febrero 2026",   energiaGenerada: "nn kWh",     columnN: "—" },
  { periodo: "Enero 2026",     energiaGenerada: "nn kWh",     columnN: "—" },
  { periodo: "Diciembre 2025", energiaGenerada: "nn kWh",     columnN: "—" },
  { periodo: "Noviembre 2025", energiaGenerada: "nn kWh",     columnN: "—" },
]
