// components/charts/MonetaryBarChart.tsx
"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { getChartBarDensity } from "@/lib/chart-bar-density"

type MonetaryBarChartProps = {
  data: { label: string; generated: number }[]
  chartConfig: ChartConfig
  className?: string
}

function barFill(index: number, total: number): string {
  return index === total - 1 ? "var(--chart-1)" : "var(--chart-1-muted)"
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`
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
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  typeof value === "number" ? formatMoney(value) : String(value)
                }
              />
            }
          />
        ) : null}
        <Bar dataKey="generated" radius={[6, 6, 0, 0]} barSize={density.barSize}>
          {data.map((_, i) => (
            <Cell key={`cell-${i}`} fill={barFill(i, n)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
