// data/gdcv-socio-mock.ts
import {
  getChartRangeSubtitle,
  sliceChartRangeSeries,
} from "@/lib/chart-range-resolve"
import { gdcvParkDetails, GDCV_ENERGY_MONTHLY_CANONICAL } from "@/data/gdcv-mock"
import {
  getDailyGenerationData24,
  getDailyPeak,
  getDailyTotal,
  MOCK_TODAY,
  toDateKey,
  type DailyPoint,
} from "@/data/gdcv-daily-mock"
import type { ChartRangeChip } from "@/types/chart-range"
import type { RoiCurvePoint } from "@/data/gdd-roi-mock"
import type { StatListItem } from "@/components/ui/stat-list"
import { formatCurrency } from "@/lib/format-currency"
import { DollarSignIcon, WalletIcon, ZapIcon } from "lucide-react"

/** Inversión inicial del socio — canónico en USD (UI: `formatCurrency` → `u$s`). */
export const SOCIO_INVERSION_INICIAL_USD = 5_700_000

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
  value: "$74.400",
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
  { icon: DollarSignIcon, name: "Autoconsumo virtual", value: "$54.200" },
  { icon: DollarSignIcon, name: "Energía Inyectada", value: "$20.200" },
  {
    icon: WalletIcon,
    name: "Total Ahorro en Abril",
    value: "$74.400",
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
  { icon: DollarSignIcon, name: "Autoconsumo Virtual", value: "$54.200" },
  { icon: DollarSignIcon, name: "Energía Inyectada", value: "$20.200" },
  {
    icon: WalletIcon,
    name: "Total Ahorro Abril",
    value: "$74.400",
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
    value: "$74.400",
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
    value: "$2.13 M",
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
  inicioOperaciones: { label: "Inicio de operaciones", value: socioOperationsStartLabel },
}

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
    ahorroAutoconsumo: "$54.200",
    ahorroInyeccion: "$20.200",
    ahorroTotal: "$74.400",
    estado: "En Curso",
  },
  {
    periodo: "Marzo 2026",
    energiaGenerada: "23.6 kWh",
    ahorroAutoconsumo: "$47.200",
    ahorroInyeccion: "$0",
    ahorroTotal: "$47.200",
    estado: "Aplicado",
  },
  {
    periodo: "Febrero 2026",
    energiaGenerada: "25.6 kWh",
    ahorroAutoconsumo: "$51.200",
    ahorroInyeccion: "$0",
    ahorroTotal: "$51.200",
    estado: "Aplicado",
  },
  {
    periodo: "Enero 2026",
    energiaGenerada: "30.2 kWh",
    ahorroAutoconsumo: "$60.400",
    ahorroInyeccion: "$0",
    ahorroTotal: "$60.400",
    estado: "Aplicado",
  },
  {
    periodo: "Diciembre 2025",
    energiaGenerada: "36.1 kWh",
    ahorroAutoconsumo: "$72.200",
    ahorroInyeccion: "$0",
    ahorroTotal: "$72.200",
    estado: "Aplicado",
  },
  {
    periodo: "Noviembre 2025",
    energiaGenerada: "41.3 kWh",
    ahorroAutoconsumo: "$82.600",
    ahorroInyeccion: "$0",
    ahorroTotal: "$82.600",
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
