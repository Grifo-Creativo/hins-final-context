// components/charts/GenerationSparkline.tsx
"use client"

import { Area, AreaChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type GenerationSparklineProps = {
  data: { i: number; value: number }[]
  chartConfig: ChartConfig
  className?: string
  showTooltip?: boolean
}

export function GenerationSparkline({
  data,
  chartConfig,
  className,
  showTooltip = true,
}: GenerationSparklineProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? "aspect-auto h-14 w-full"}
    >
      <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 4 }}>
        <defs>
          <linearGradient id="fillSpark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        {showTooltip && <ChartTooltip content={<ChartTooltipContent hideLabel hideIndicator />} />}
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          fill="url(#fillSpark)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
