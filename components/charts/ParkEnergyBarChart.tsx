// components/charts/ParkEnergyBarChart.tsx
"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { getChartBarDensity } from "@/lib/chart-bar-density"
import { formatChartPeriodTooltipLabel } from "@/lib/format-chart-period-tooltip"

type ParkEnergyBarChartProps = {
  data: { label: string; generated: number }[]
  chartConfig: ChartConfig
}

function barFill(index: number, total: number): string {
  if (index === total - 1) {
    return "var(--chart-1)"
  }
  return "var(--chart-1-muted)"
}

export function ParkEnergyBarChart({
  data,
  chartConfig,
}: ParkEnergyBarChartProps) {
  const isMobile = useIsMobile()
  const n = data.length
  const density = getChartBarDensity(n, isMobile)

  const dataWithDelta = data.map((item, index) => ({
    ...item,
    deltaVsPrevious: index > 0 ? item.generated - data[index - 1].generated : 0,
  }))

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
      <BarChart
        data={dataWithDelta}
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
          tickFormatter={(v) => `${v}`}
        />
        {density.showTooltip ? (
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  formatChartPeriodTooltipLabel(String(value ?? ""))
                }
                formatter={(value, _name, item) => {
                  const numericValue =
                    typeof value === "number" ? value : Number(value)
                  const delta =
                    typeof item.payload?.deltaVsPrevious === "number"
                      ? item.payload.deltaVsPrevious
                      : 0

                  return (
                    <div className="grid gap-1">
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {numericValue.toLocaleString("es-AR", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        kWh
                      </span>
                      <span className="text-muted-foreground">
                        {`${delta >= 0 ? "+" : ""}${delta.toLocaleString("es-AR", {
                          maximumFractionDigits: 0,
                        })} kWh vs mes anterior`}
                      </span>
                    </div>
                  )
                }}
              />
            }
          />
        ) : null}
        <Bar dataKey="generated" radius={[6, 6, 0, 0]} barSize={density.barSize}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barFill(index, n)} />
          ))}
          {density.showBarLabels ? (
            <LabelList
              position="top"
              dataKey="generated"
              className="fill-foreground text-[10px] font-medium"
              formatter={(value: unknown) =>
                typeof value === "number"
                  ? `${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })} kWh`
                  : ""
              }
            />
          ) : null}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
