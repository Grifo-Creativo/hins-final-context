// /components/charts/ROIProjectionChart.tsx
"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { chartColors } from "@/lib/chart-colors"
import { formatCurrency } from "@/lib/format-currency"
import {
  calcularFechaRecupero,
  type ROIDataPoint,
} from "@/data/gdcv-roi-mock"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { cn } from "@/lib/utils"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS_ES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
]

function formatFecha(fecha: string): string {
  const [year, month] = fecha.split("-")
  return `${MONTHS_ES[parseInt(month, 10) - 1]} ${year}`
}

/** Montos del chart en USD — locale `es-AR` vía `formatCurrency`. */
function formatMoney(v: number, mode: "full" | "axis" = "full"): string {
  return formatCurrency(v, "usd", mode)
}

/** Etiqueta dos líneas para la línea de inversión (sin prefijo "Meta:"). */
function MetaInvestmentLabel({
  viewBox,
  inversionMeta: meta,
}: {
  viewBox?: { x?: number; y?: number; width?: number; height?: number }
  inversionMeta: number
}) {
  if (viewBox == null || viewBox.x == null || viewBox.width == null) return null
  const x = viewBox.x + viewBox.width
  const y = viewBox.y ?? 0
  const amount = formatCurrency(meta, "usd", "compact")
  return (
    <text
      textAnchor="end"
      fill={chartColors.metaLine}
      fontSize={12}
      fontWeight={500}
    >
      <tspan x={x} y={y}>
        Inversión inicial
      </tspan>
      <tspan x={x} dy="1.15em">
        {amount}
      </tspan>
    </text>
  )
}

function useIsMobile(breakpoint = 640): boolean {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [breakpoint])
  return isMobile
}

// ─── Custom Dot — only on last real data point ────────────────────────────────

interface CustomRealDotProps {
  cx?: number
  cy?: number
  index?: number
  lastRealIdx: number
  color: string
}

function CustomRealDot({ cx, cy, index, lastRealIdx, color }: CustomRealDotProps) {
  if (
    index !== lastRealIdx ||
    cx === undefined ||
    cy === undefined ||
    isNaN(cx) ||
    isNaN(cy)
  ) {
    return <g />
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="white"
      stroke={color}
      strokeWidth={2}
    />
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipPayloadEntry {
  dataKey: string
  value: number | undefined
  color: string
}

interface ROITooltipProps {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string
  isMobile?: boolean
}

const SERIES_LABELS: Record<string, string> = {
  real:      "Real Acumulado",
  base:      "Base",
  favorable: "Optimista",
  riesgo:    "Conservador",
}

function ROITooltip({ active, payload, label, isMobile }: ROITooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div
      className="rounded-xl border border-border bg-background p-3 text-xs shadow-md"
      style={{
        maxWidth: isMobile ? "min(90vw, 360px)" : undefined,
        fontSize: isMobile ? 13 : 12,
      }}
    >
      <p className="mb-2 font-medium text-muted-foreground">
        {label ? formatFecha(label) : ""}
      </p>
      {payload
        .filter((entry) => entry.value !== undefined && entry.value !== null)
        .filter((entry) => !String(entry.dataKey).startsWith("band"))
        .map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
            <span
              className="size-2 shrink-0 rounded-sm"
              style={{ background: entry.color }}
            />
            <span
              className="min-w-[120px] flex-1 text-muted-foreground"
            >
              {SERIES_LABELS[entry.dataKey] ?? entry.dataKey}
            </span>
            <span className="ml-auto whitespace-nowrap font-medium text-foreground">
              {formatMoney(entry.value as number)}
            </span>
          </div>
        ))}
    </div>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function LegendItem({
  label,
  color,
  dashed,
}: {
  label: string
  color: string
  dashed?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      {dashed ? (
        <span
          className="inline-block"
          style={{
            width: 16,
            height: 0,
            borderTop: `2px dashed ${color}`,
          }}
          aria-hidden
        />
      ) : (
        <span
          className="inline-block"
          style={{ width: 16, height: 2, background: color }}
          aria-hidden
        />
      )}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type Horizon = 1 | 3 | 5 | 7 | "todo"

/** Con chips solo 1A / 5A / TODO — 3 y 7 del mock se muestran como 5A. */
function chipInitialHorizon(prop: Horizon): Horizon {
  if (prop === 1 || prop === "todo") return prop
  return 5
}

interface ROIProjectionChartProps {
  data: ROIDataPoint[]
  inversionMeta: number
  fechaHoy: string
  /** Horizonte cuando `showRangeChips` es false; valor inicial de los chips cuando es true. */
  rangoAnios?: Horizon
  /** Chips 1A / 5A / TODO (por defecto false para usos directos en dev). */
  showRangeChips?: boolean
  /** Bandas entre optimista↔base (verde) y base↔conservador (coral), solo después de HOY. */
  showScenarioBands?: boolean
  className?: string
}

export function ROIProjectionChart({
  data,
  inversionMeta,
  fechaHoy,
  rangoAnios: rangoAniosProp = "todo",
  showRangeChips = false,
  showScenarioBands = true,
  className,
}: ROIProjectionChartProps) {
  const isMobile = useIsMobile(640)

  const [horizon, setHorizon] = useState<Horizon>(() =>
    showRangeChips ? chipInitialHorizon(rangoAniosProp) : rangoAniosProp
  )
  const rangoAnios = showRangeChips ? horizon : rangoAniosProp

  const chartHeight = useMemo(() => {
    switch (rangoAnios) {
      case 1:
        return 300
      case 3:
        return 280
      case 5:
        return 330
      case 7:
        return 360
      case "todo":
        return 420
      default:
        return 400
    }
  }, [rangoAnios])

  const paybackCalculado = useMemo(
    () => ({
      favorable: calcularFechaRecupero(data, "favorable", inversionMeta),
      base: calcularFechaRecupero(data, "base", inversionMeta),
      riesgo: calcularFechaRecupero(data, "riesgo", inversionMeta),
    }),
    [data, inversionMeta]
  )

  // ── Filter by range (sin puntos sintéticos en la meta: rompen el cono / Areas)
  const filteredData = useMemo(() => {
    const filtered =
      rangoAnios === "todo"
        ? [...data]
        : rangoAnios === 1
          ? (() => {
              const startDate = new Date(data[0].fecha + "-01")
              const endDate = new Date(startDate)
              endDate.setFullYear(endDate.getFullYear() + 1)
              return data.filter(
                (d) => new Date(d.fecha + "-01") < endDate
              )
            })()
          : (() => {
              const startDate = new Date(data[0].fecha + "-01")
              const endDate = new Date(
                startDate.getFullYear() + rangoAnios,
                startDate.getMonth()
              )
              return data.filter(
                (d) => new Date(d.fecha + "-01") <= endDate
              )
            })()

    return [...filtered].sort((a, b) => a.fecha.localeCompare(b.fecha))
  }, [data, rangoAnios])

  /** Último valor real antes o en HOY — para anclar las proyecciones */
  const lastRealValue = useMemo(
    () =>
      filteredData
        .filter((d) => d.fecha <= fechaHoy && d.real !== undefined)
        .pop()?.real ?? null,
    [filteredData, fechaHoy]
  )

  /** Serie de chart: proyecciones solo desde HOY (cono anclado en la vertical "Hoy"). */
  const chartData = useMemo(
    () =>
      filteredData.map((d, idx) => {
        const onOrAfterHoy = d.fecha >= fechaHoy
        let base = onOrAfterHoy ? d.base : undefined
        let favorable = onOrAfterHoy ? d.favorable : undefined
        let riesgo = onOrAfterHoy ? d.riesgo : undefined

        // En el primer punto >= HOY, anclar todas las proyecciones al último valor real
        const isFirstAfterHoy = idx > 0 && filteredData[idx - 1].fecha < fechaHoy && d.fecha >= fechaHoy
        if (isFirstAfterHoy && lastRealValue !== null) {
          base = lastRealValue
          favorable = lastRealValue
          riesgo = lastRealValue
        }

        const r = riesgo
        const b = base
        const f = favorable
        const showBand =
          showScenarioBands &&
          onOrAfterHoy &&
          r != null &&
          b != null &&
          f != null &&
          !Number.isNaN(r) &&
          !Number.isNaN(b) &&
          !Number.isNaN(f)

        return {
          ...d,
          base,
          favorable,
          riesgo,
          bandPeachStack1: showBand ? r : 0,
          bandPeachStack2: showBand ? Math.max(0, b - r) : 0,
          bandGreenStack1: showBand ? b : 0,
          bandGreenStack2: showBand ? Math.max(0, f - b) : 0,
        }
      }),
    [filteredData, fechaHoy, showScenarioBands]
  )

  // ── Last real index (for CustomDot) ──────────────────────────────────────
  const lastRealIdx = useMemo(
    () =>
      filteredData.reduce(
        (last, p, i) => (p.real !== undefined ? i : last),
        -1
      ),
    [filteredData]
  )

  // ── Year-change tick set (show year only at first occurrence) ─────────────
  const yearFirstFecha = useMemo(() => {
    const set = new Set<string>()
    filteredData.forEach((d, i) => {
      const year = d.fecha.split("-")[0]
      const prevYear = i > 0 ? filteredData[i - 1].fecha.split("-")[0] : null
      if (year !== prevYear) set.add(d.fecha)
    })
    return set
  }, [filteredData])

  const xAxisTickFormatter = (value: string) => {
    if (rangoAnios === 1 || rangoAnios === 3 || rangoAnios === 5) {
      return formatFecha(value)
    }
    return yearFirstFecha.has(value) ? value.split("-")[0] : ""
  }

  // ── Visible payback markers (basado en rango, no en fecha exacta) ─────────
  const minFecha = filteredData[0]?.fecha ?? ""
  const maxFecha = filteredData[filteredData.length - 1]?.fecha ?? ""

  const paybackFavorableVisible =
    paybackCalculado.favorable !== null &&
    paybackCalculado.favorable >= minFecha &&
    paybackCalculado.favorable <= maxFecha
  const paybackBaseVisible =
    paybackCalculado.base !== null &&
    paybackCalculado.base >= minFecha &&
    paybackCalculado.base <= maxFecha
  const paybackRiesgoVisible =
    paybackCalculado.riesgo !== null &&
    paybackCalculado.riesgo >= minFecha &&
    paybackCalculado.riesgo <= maxFecha

  const visibleFechas = useMemo(
    () => new Set(filteredData.map((d) => d.fecha)),
    [filteredData]
  )

  // HOY es visible si está dentro del rango de datos (no requiere fecha exacta)
  const hoyVisible = fechaHoy >= minFecha && fechaHoy <= maxFecha

  const endYearLabel =
    chartData[chartData.length - 1]?.fecha.split("-")[0] ?? "2034"

  const horizonTabs = useMemo(
    () =>
      [
        { value: "1", label: "1A" },
        { value: "5", label: "5A" },
        { value: "todo", label: "TODO" },
      ] as const,
    []
  )

  const ariaLabel = `Flujo acumulado proyectado con comparativa de escenarios: serie real hasta hoy; proyección base, optimista y conservadora. Horizonte hacia ${endYearLabel}. Inversión inicial: $${(inversionMeta / 1_000_000).toFixed(1)} millones`

  return (
    <div className={className}>
      <div
        className={
          isMobile
            ? "mb-3 flex flex-col gap-3 px-1"
            : "mb-3 flex flex-row flex-wrap items-start justify-between gap-3 px-1"
        }
      >
        <div
          className={
            isMobile
              ? "flex flex-col justify-start gap-2"
              : "flex flex-wrap justify-start gap-4"
          }
        >
          <LegendItem label="Real Acumulado" color={chartColors.real} />
          <LegendItem label="Optimista" color={chartColors.favorable} dashed />
          <LegendItem label="Base" color={chartColors.base} dashed />
          <LegendItem label="Conservador" color={chartColors.riesgo} dashed />
          <LegendItem label="Inversión inicial" color={chartColors.metaLine} />
        </div>
        {showRangeChips ? (
          <TabsForBlocks
            className={cn(isMobile ? "w-full shrink-0" : "w-auto shrink-0")}
            tabs={[...horizonTabs]}
            value={
              horizon === "todo" ? "todo" : horizon === 1 ? "1" : "5"
            }
            onValueChange={(v) => {
              if (v === "todo") setHorizon("todo")
              else if (v === "1") setHorizon(1)
              else setHorizon(5)
            }}
          />
        ) : null}
      </div>

      <div role="img" aria-label={ariaLabel}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ComposedChart
            data={chartData}
            margin={{ top: 16, right: 16, left: 8, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={chartColors.grid}
            />

            <XAxis
              dataKey="fecha"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              tickFormatter={xAxisTickFormatter}
              interval="preserveStartEnd"
              minTickGap={isMobile ? 8 : 4}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              tickFormatter={(v: number) => formatMoney(v, "axis")}
              width={56}
            />

            {/* Investment reference line — sólida */}
            <ReferenceLine
              y={inversionMeta}
              stroke={chartColors.metaLine}
              strokeWidth={2}
              label={(labelProps: {
                viewBox?: { x?: number; y?: number; width?: number; height?: number }
              }) => (
                <MetaInvestmentLabel
                  viewBox={labelProps.viewBox}
                  inversionMeta={inversionMeta}
                />
              )}
            />

            {/* Bandas entre escenarios (solo después de HOY; bases de stack transparentes). */}
            {showScenarioBands ? (
              <>
                <Area
                  type="monotone"
                  dataKey="bandPeachStack1"
                  stackId="peach"
                  stroke="none"
                  fill="var(--background)"
                  fillOpacity={0}
                  isAnimationActive={false}
                  legendType="none"
                />
                <Area
                  type="monotone"
                  dataKey="bandPeachStack2"
                  stackId="peach"
                  stroke="none"
                  fill={chartColors.paybackRiesgo}
                  fillOpacity={0.14}
                  isAnimationActive={false}
                  legendType="none"
                />
                <Area
                  type="monotone"
                  dataKey="bandGreenStack1"
                  stackId="green"
                  stroke="none"
                  fill="var(--background)"
                  fillOpacity={0}
                  isAnimationActive={false}
                  legendType="none"
                />
                <Area
                  type="monotone"
                  dataKey="bandGreenStack2"
                  stackId="green"
                  stroke="none"
                  fill="var(--chart-1)"
                  fillOpacity={0.12}
                  isAnimationActive={false}
                  legendType="none"
                />
              </>
            ) : null}

            {/* Series — riesgo → favorable → base → real (arriba) */}
            <Line
              type="monotone"
              dataKey="riesgo"
              stroke={chartColors.riesgo}
              strokeDasharray="4 4"
              strokeWidth={2.5}
              dot={false}
              connectNulls={true}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="favorable"
              stroke={chartColors.favorable}
              strokeDasharray="6 3"
              strokeWidth={2}
              dot={false}
              connectNulls={true}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="base"
              stroke={chartColors.base}
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              connectNulls={true}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="real"
              stroke={chartColors.real}
              strokeWidth={3}
              connectNulls={true}
              isAnimationActive={false}
              dot={(dotProps) => (
                <CustomRealDot
                  key={dotProps.index}
                  cx={dotProps.cx}
                  cy={dotProps.cy}
                  index={dotProps.index}
                  lastRealIdx={lastRealIdx}
                  color={chartColors.real}
                />
              )}
            />

            {/* Referencias verticales — encima de las series para legibilidad */}
            {hoyVisible && (
              <ReferenceLine
                x={fechaHoy}
                stroke={chartColors.hoyLine}
                strokeWidth={1.5}
                label={{
                  value: "Hoy",
                  position: "insideTopLeft",
                  fontSize: 11,
                  fontWeight: 600,
                  fill: chartColors.hoyLabel,
                }}
              />
            )}
            {/* paybackFavorableVisible && (
              <ReferenceLine
                x={paybackCalculado.favorable!}
                stroke={chartColors.paybackFavorable}
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: "Recup. optimista",
                  position: "insideTopLeft",
                  fontSize: 10,
                  fontWeight: 500,
                  fill: chartColors.paybackLabelFavorable,
                }}
              />
            ) */}
            {paybackBaseVisible && (
              <ReferenceLine
                x={paybackCalculado.base!}
                stroke={chartColors.paybackBase}
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: "Recup. estimado",
                  position: "insideTop",
                  fontSize: 10,
                  fontWeight: 500,
                  fill: chartColors.paybackLabelBase,
                }}
              />
            )}
            {/* paybackRiesgoVisible && (
              <ReferenceLine
                x={paybackCalculado.riesgo!}
                stroke={chartColors.paybackRiesgo}
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: "Recup. conservador",
                  position: "insideTopRight",
                  fontSize: 10,
                  fontWeight: 500,
                  fill: chartColors.paybackLabelRiesgo,
                }}
              />
            ) */}

            <Tooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              content={(props) => (
                <ROITooltip
                  active={props.active}
                  payload={
                    props.payload as unknown as
                      | TooltipPayloadEntry[]
                      | undefined
                  }
                  label={props.label as string | undefined}
                  isMobile={isMobile}
                />
              )}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
