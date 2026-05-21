// components/gdcv/SocioV2BarChart.tsx
"use client"

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { getChartBarDensity } from "@/lib/chart-bar-density"
import { cn } from "@/lib/utils"

export type SocioV2BarChartRow = {
  label: string
  total: number
}

type SocioV2BarChartProps = {
  data: SocioV2BarChartRow[]
  unit: "dinero" | "energia"
  className?: string
}

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function barFill(index: number, total: number): string {
  if (index === total - 1) {
    return "var(--chart-1)"
  }
  return "var(--chart-1-muted)"
}

function formatBarLabel(value: number, unit: "dinero" | "energia"): string {
  if (unit === "dinero") {
    return `$${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`
  }
  return `${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })} kWh`
}

export function SocioV2BarChart({
  data,
  unit,
  className = "aspect-auto h-[280px] w-full [&_.recharts-responsive-container]:!h-full",
}: SocioV2BarChartProps) {
  const isMobile = useIsMobile()
  const n = data.length
  const density = getChartBarDensity(n, isMobile)

  return (
    <ChartContainer config={chartConfig} className={cn(className)}>
      <BarChart
        data={data}
        margin={{
          left: 4,
          right: 8,
          top: 32,
          bottom: density.xAxisAngle ? 8 : 4,
        }}
      >
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
        <YAxis hide domain={[0, "auto"]} />
        <Bar
          dataKey="total"
          radius={n <= 16 ? [6, 6, 0, 0] : 0}
          barSize={density.barSize}
          background={false}
          minPointSize={0}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barFill(index, n)} />
          ))}
          <LabelList
            position="top"
            dataKey="total"
            className="fill-muted-foreground text-[10px] font-medium sm:text-xs"
            formatter={(value: unknown) =>
              typeof value === "number" ? formatBarLabel(value, unit) : ""
            }
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
