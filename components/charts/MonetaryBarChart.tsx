// components/charts/MonetaryBarChart.tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { getChartBarDensity } from "@/lib/chart-bar-density"
import { cn } from "@/lib/utils"

type MonetaryBarChartProps = {
  data: { label: string; autoconsumo: number; inyectada: number }[]
  chartConfig: ChartConfig
  unit?: "dinero" | "energia"
  className?: string
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`
}

function formatEnergy(value: number): string {
  return `${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })} kWh`
}

function formatValue(value: number, unit: "dinero" | "energia"): string {
  return unit === "energia" ? formatEnergy(value) : formatMoney(value)
}

type CustomTooltipProps = {
  active?: boolean
  payload?: { dataKey?: string; value?: number }[]
  label?: string
  unit: "dinero" | "energia"
}

function getStackColor(
  chartConfig: ChartConfig,
  key: "autoconsumo" | "inyectada",
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
  chartConfig,
}: CustomTooltipProps & { chartConfig: ChartConfig }) {
  if (!active || !payload?.length) return null

  const autoconsumo =
    payload.find((p) => p.dataKey === "autoconsumo")?.value ?? 0
  const inyectada = payload.find((p) => p.dataKey === "inyectada")?.value ?? 0
  const total = autoconsumo + inyectada
  const totalLabel =
    unit === "energia" ? `Total kWh ${label}` : `Total Ahorro ${label}`
  const inyectadaColor = getStackColor(
    chartConfig,
    "inyectada",
    "var(--chart-stack-inyectada)"
  )
  const autoconsumoColor = getStackColor(
    chartConfig,
    "autoconsumo",
    "var(--chart-stack-autoconsumo)"
  )

  return (
    <div className="rounded-lg border border-border bg-popover p-3 text-sm shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: inyectadaColor }}
        />
        <span className="text-foreground">Energía Inyectada</span>
        <span className="ml-auto font-semibold text-foreground">
          {formatValue(inyectada, unit)}
        </span>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: autoconsumoColor }}
        />
        <span className="text-foreground">Autoconsumo virtual</span>
        <span className="ml-auto font-semibold text-foreground">
          {formatValue(autoconsumo, unit)}
        </span>
      </div>
      <div className="border-t border-border pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{totalLabel}</span>
          <span className="font-semibold text-foreground">
            {formatValue(total, unit)}
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
  className,
}: MonetaryBarChartProps) {
  const isMobile = useIsMobile()
  const n = data.length
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
        data={data}
        margin={{
          left: 4,
          right: 8,
          top: 8,
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
              ? v >= 1000
                ? `${(v / 1000).toLocaleString("es-AR", { maximumFractionDigits: 0 })}k`
                : `${v}`
              : v >= 1000
                ? `$${(v / 1000).toLocaleString("es-AR", { maximumFractionDigits: 0 })}k`
                : `$${v}`
          }
        />
        {density.showTooltip ? (
          <Tooltip
            content={<CustomTooltip unit={unit} chartConfig={chartConfig} />}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
        ) : null}
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
        />
      </BarChart>
    </ChartContainer>
  )
}
