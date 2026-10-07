// components/charts/MonetaryBarChart.tsx
"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { getChartBarDensity } from "@/lib/chart-bar-density"
import {
  formatCurrency,
  type CurrencyCode,
} from "@/lib/format-currency"
import { cn } from "@/lib/utils"

type MonetaryBarChartProps = {
  data: { label: string; autoconsumo: number; inyectada: number; impuestos: number }[]
  chartConfig: ChartConfig
  unit?: "dinero" | "energia"
  /** Ahorro socio / facturación en ARS por defecto. */
  currency?: CurrencyCode
  className?: string
}

function formatEnergy(value: number): string {
  return `${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })} kWh`
}

function formatEnergyAxis(value: number): string {
  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString("es-AR", { maximumFractionDigits: 0 })}k`
  }
  return `${value}`
}

function formatEnergyCompact(value: number): string {
  if (value >= 1_000) {
    const k = value / 1_000
    return `${k.toLocaleString("es-AR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}k`
  }
  return value.toLocaleString("es-AR", { maximumFractionDigits: 0 })
}

type MonetaryBarRow = {
  label: string
  autoconsumo: number
  inyectada: number
  impuestos: number
  total: number
}

type StackBarLabelProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  index?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function renderStackTotalLabel(
  unit: "dinero" | "energia",
  currency: CurrencyCode,
  rows: MonetaryBarRow[]
) {
  // eslint-disable-next-line react/display-name
  return (props: StackBarLabelProps) => {
    const index = props.index ?? -1
    const row = rows[index]
    if (
      !row ||
      props.x == null ||
      props.y == null ||
      props.width == null
    ) {
      return null
    }

    const label =
      unit === "dinero"
        ? formatCurrency(row.total, currency, "compact")
        : formatEnergyCompact(row.total)

    return (
      <text
        x={Number(props.x) + Number(props.width) / 2}
        y={Number(props.y) - 6}
        textAnchor="middle"
        fill="var(--foreground)"
        fontSize={10}
        fontWeight={500}
      >
        {label}
      </text>
    )
  }
}

type CustomTooltipProps = {
  active?: boolean
  payload?: { dataKey?: string; value?: number }[]
  label?: string
  unit: "dinero" | "energia"
  currency: CurrencyCode
}

function getStackColor(
  chartConfig: ChartConfig,
  key: "autoconsumo" | "inyectada" | "impuestos",
  fallback: string
): string {
  const entry = chartConfig[key]
  return entry && "color" in entry && entry.color ? String(entry.color) : fallback
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
  currency,
  chartConfig,
}: CustomTooltipProps & { chartConfig: ChartConfig }) {
  if (!active || !payload?.length) return null

  const autoconsumo =
    payload.find((p) => p.dataKey === "autoconsumo")?.value ?? 0
  const inyectada = payload.find((p) => p.dataKey === "inyectada")?.value ?? 0
  const impuestos = payload.find((p) => p.dataKey === "impuestos")?.value ?? 0
  const total = autoconsumo + inyectada + impuestos
  const totalLabel =
    unit === "energia" ? `Total kWh ${label}` : `Total Ahorro ${label}`
  const autoconsumoColor = getStackColor(
    chartConfig,
    "autoconsumo",
    "var(--chart-stack-autoconsumo)"
  )
  const inyectadaColor = getStackColor(
    chartConfig,
    "inyectada",
    "var(--chart-stack-inyectada)"
  )
  const impuestosColor = getStackColor(
    chartConfig,
    "impuestos",
    "var(--chart-stack-impuestos)"
  )

  const formatPart = (value: number) =>
    unit === "energia"
      ? formatEnergy(value)
      : formatCurrency(value, currency, "full")

  return (
    <div className="rounded-lg border border-border bg-popover p-3 text-sm shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: inyectadaColor }}
        />
        <span className="text-foreground">Energía Inyectada</span>
        <span className="ml-auto font-semibold text-foreground">
          {formatPart(inyectada)}
        </span>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: autoconsumoColor }}
        />
        <span className="text-foreground">Autoconsumo virtual</span>
        <span className="ml-auto font-semibold text-foreground">
          {formatPart(autoconsumo)}
        </span>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: impuestosColor }}
        />
        <span className="text-foreground">Ahorro de Impuestos</span>
        <span className="ml-auto font-semibold text-foreground">
          {formatPart(impuestos)}
        </span>
      </div>
      <div className="border-t border-border pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{totalLabel}</span>
          <span className="font-semibold text-foreground">
            {formatPart(total)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function MonetaryBarChart({
  data,
  chartConfig,
  unit = "dinero",
  currency = "ars",
  className,
}: MonetaryBarChartProps) {
  const isMobile = useIsMobile()
  const chartData = useMemo<MonetaryBarRow[]>(
    () =>
      data.map((row) => ({
        ...row,
        total: row.autoconsumo + row.inyectada + row.impuestos,
      })),
    [data]
  )
  const n = chartData.length
  const density = getChartBarDensity(n, isMobile)

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        "aspect-auto h-[260px] min-h-[260px] w-full [&_.recharts-responsive-container]:!h-full",
        className
      )}
    >
      <BarChart
        data={chartData}
        margin={{
          left: 4,
          right: 8,
          top: density.showBarLabels ? 28 : 8,
          bottom: density.xAxisAngle ? 8 : 4,
        }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          className="stroke-border/60"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          angle={density.xAxisAngle}
          textAnchor={density.xAxisAngle ? "end" : "middle"}
          height={density.xAxisHeight}
          interval={density.xAxisInterval}
          className="text-muted-foreground text-[10px] sm:text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-muted-foreground"
          tickFormatter={(v: number) =>
            unit === "energia"
              ? formatEnergyAxis(v)
              : formatCurrency(v, currency, "axis")
          }
        />
        {density.showTooltip ? (
          <Tooltip
            content={
              <CustomTooltip
                unit={unit}
                currency={currency}
                chartConfig={chartConfig}
              />
            }
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
        ) : null}
        <Bar
          dataKey="impuestos"
          stackId="a"
          fill={getStackColor(
            chartConfig,
            "impuestos",
            "var(--chart-stack-impuestos)"
          )}
          radius={0}
          barSize={density.barSize}
        />
        <Bar
          dataKey="autoconsumo"
          stackId="a"
          fill={getStackColor(
            chartConfig,
            "autoconsumo",
            "var(--chart-stack-autoconsumo)"
          )}
          radius={0}
          barSize={density.barSize}
        />
        <Bar
          dataKey="inyectada"
          stackId="a"
          fill={getStackColor(
            chartConfig,
            "inyectada",
            "var(--chart-stack-inyectada)"
          )}
          radius={n <= 16 ? [6, 6, 0, 0] : 0}
          barSize={density.barSize}
          label={
            density.showBarLabels
              ? renderStackTotalLabel(unit, currency, chartData)
              : false
          }
        />
      </BarChart>
    </ChartContainer>
  )
}
