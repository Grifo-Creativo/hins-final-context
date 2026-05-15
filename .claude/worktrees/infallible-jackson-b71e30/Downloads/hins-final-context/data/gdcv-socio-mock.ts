// data/gdcv-socio-mock.ts
import type { ChartRangeChip } from "@/types/chart-range"
import type { RoiCurvePoint } from "@/data/gdd-roi-mock"
import type { StatListItem } from "@/components/ui/stat-list"
import { DollarSignIcon, WalletIcon, ZapIcon } from "lucide-react"

// ─── Identidad ──────────────────────────────────────────────────────────────

export const socioNombre = "Agro Sur Industrial"
export const socioPorcentaje = 15
export const socioParkName = "Parque Río Cuarto"

// ─── Mi Ahorro Chart ────────────────────────────────────────────────────────

export type SocioAhorroRow = { label: string; generated: number }

const SOCIO_AHORRO_MONTHLY: readonly SocioAhorroRow[] = [
  { label: "Nov 25", generated: 82600 },
  { label: "Dic 25", generated: 72200 },
  { label: "Ene 26", generated: 60400 },
  { label: "Feb 26", generated: 51200 },
  { label: "Mar 26", generated: 47200 },
  { label: "Abr 26", generated: 74400 },
]

const SOCIO_AHORRO_WEEKLY: readonly SocioAhorroRow[] = [
  { label: "1–7 Abr", generated: 18000 },
  { label: "8–14 Abr", generated: 20000 },
  { label: "15–21 Abr", generated: 17600 },
  { label: "22–30 Abr", generated: 18800 },
]

function latestAhorroMonths(count: 3 | 6): SocioAhorroRow[] {
  const arr = SOCIO_AHORRO_MONTHLY as SocioAhorroRow[]
  return arr.slice(arr.length - count).map((r) => ({ ...r }))
}

export function getSocioAhorroSeries(range: ChartRangeChip): SocioAhorroRow[] {
  switch (range) {
    case "1m": return SOCIO_AHORRO_WEEKLY.map((r) => ({ ...r }))
    case "3m": return latestAhorroMonths(3)
    case "6m": return latestAhorroMonths(6)
    default:   return []
  }
}

export function getSocioAhorroChartSubtitle(range: ChartRangeChip): string {
  switch (range) {
    case "1m": return "Períodos semanales"
    case "3m":
    case "6m": return "Períodos mensuales"
    default:   return ""
  }
}

/** KPI resumido (abril) — alineado al bloque "Mi Ahorro en abril" del flow. */
export const socioAhorroKpi = {
  value: "$74.400",
  delta: "+12% vs mes anterior",
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
    subtitle: "De mi 15% del parque",
  },
]

export const socioStatListEnergia: StatListItem[] = [
  { icon: ZapIcon, name: "Energía asignada", value: "207.5 kWh" },
  { icon: ZapIcon, name: "Energía neteada",  value: "185.3 kWh" },
  {
    icon: WalletIcon,
    name: "Total kWh en Abril",
    value: "207.5 kWh",
    subtitle: "De mi 15% del parque",
  },
]

// ─── ROI Cards ───────────────────────────────────────────────────────────────

export const socioRoiMetrics = {
  totalAhorrado: {
    label: "Ahorrado en Facturas",
    value: "$2.13 M",
    badge: "+8% anual",
  },
  inversionInicial: {
    label: "Inversión inicial",
    value: "$5.70 M",
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
  inicioOperaciones: { label: "Inicio de operaciones", value: "Marzo 2024" },
}

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

const SOCIO_PARQUE_MONTHLY: readonly SocioParqueRow[] = [
  { label: "Nov 25", generated: 247.1 },
  { label: "Dic 25", generated: 91.2 },
  { label: "Ene 26", generated: 250 },
  { label: "Feb 26", generated: 182.6 },
  { label: "Mar 26", generated: 240.4 },
  { label: "Abr 26", generated: 204.59 },
]

const SOCIO_PARQUE_WEEKLY: readonly SocioParqueRow[] = [
  { label: "1–7 Abr",  generated: 48.3 },
  { label: "8–14 Abr", generated: 52.1 },
  { label: "15–21 Abr",generated: 50.7 },
  { label: "22–30 Abr",generated: 53.49 },
]

function latestParqueMonths(count: 3 | 6): SocioParqueRow[] {
  const arr = SOCIO_PARQUE_MONTHLY as SocioParqueRow[]
  return arr.slice(arr.length - count).map((r) => ({ ...r }))
}

export function getSocioParqueSeries(range: ChartRangeChip): SocioParqueRow[] {
  switch (range) {
    case "1m": return SOCIO_PARQUE_WEEKLY.map((r) => ({ ...r }))
    case "3m": return latestParqueMonths(3)
    case "6m": return latestParqueMonths(6)
    default:   return []
  }
}

export function getSocioParqueChartSubtitle(range: ChartRangeChip): string {
  switch (range) {
    case "1m": return "Períodos semanales"
    case "3m":
    case "6m": return "Períodos mensuales"
    default:   return ""
  }
}

// ─── KPI Parque ───────────────────────────────────────────────────────────────

export const socioEnergiaPark = {
  value: "204.59",
  unit: "kWh",
  delta: "13.556 kWh desde el Inicio",
}

export const socioEnergiaParkSparkline = [75, 92, 88, 110, 105, 130, 204].map((v) => ({ value: v }))

export const socioPotenciaInstalada = "380 kWp"
export const socioPotenciaAcople = "310 kWp"

/** Segunda fila del bloque KPI bajo el chart — reemplazar labels/values cuando estén definidos */
export const socioParqueKpiRow2 = {
  leftLabel: "—",
  leftValue: "—",
  rightLabel: "—",
  rightValue: "—",
} as const

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
