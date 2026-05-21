// components/charts/MonetaryBarChart.tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { getChartBarDensity } from "@/lib/chart-bar-density"

type MonetaryBarChartProps = {
  data: { label: string; autoconsumo: number; inyectada: number }[]
  chartConfig: ChartConfig
  className?: string
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`
}

function CustomTooltip(props: any) {
  const { active, payload, label } = props
  if (!active || !payload || !payload.length) return null

  const autoconsumo = payload.find((p: any) => p.dataKey === "autoconsumo")?.value ?? 0
  const inyectada = payload.find((p: any) => p.dataKey === "inyectada")?.value ?? 0
  const total = autoconsumo + inyectada

  return (
    <div className="rounded-lg border border-border bg-popover p-3 text-sm shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#ffc872" }} />
        <span className="text-foreground">Energía Inyectada</span>
        <span className="font-semibold text-foreground ml-auto">{formatMoney(inyectada)}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#a8d976" }} />
        <span className="text-foreground">Autoconsumo virtual</span>
        <span className="font-semibold text-foreground ml-auto">{formatMoney(autoconsumo)}</span>
      </div>
      <div className="border-t border-border pt-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Total Ahorro {label}</span>
          <span className="font-semibold text-foreground">{formatMoney(total)}</span>
        </div>
      </div>
    </div>
  )
}

export function MonetaryBarChart({
  data,
  chartConfig,
  className = "aspect-auto h-[260px] w-full",
}: MonetaryBarChartProps) {
  const isMobile = useIsMobile()
  const n = data.length
  const density = getChartBarDensity(n, isMobile)

  return (
    <ChartContainer config={chartConfig} className={className}>
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
            v >= 1000
              ? `$${(v / 1000).toLocaleString("es-AR", { maximumFractionDigits: 0 })}k`
              : `$${v}`
          }
        />
        {density.showTooltip ? (
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
        ) : null}
        <Bar
          dataKey="autoconsumo"
          stackId="a"
          fill="#a8d976"
          radius={0}
          barSize={density.barSize}
        />
        <Bar
          dataKey="inyectada"
          stackId="a"
          fill="#ffc872"
          radius={n <= 16 ? [6, 6, 0, 0] : 0}
          barSize={density.barSize}
        />
      </BarChart>
    </ChartContainer>
  )
}
