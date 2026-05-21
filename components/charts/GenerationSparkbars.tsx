"use client"

import { Bar, BarChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type GenerationSparkbarsProps = {
  data: { i: number; value: number }[]
  chartConfig: ChartConfig
  className?: string
  showTooltip?: boolean
}

export function GenerationSparkbars({
  data,
  chartConfig,
  className,
  showTooltip = true,
}: GenerationSparkbarsProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? "aspect-auto h-14 w-full"}
    >
      <BarChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 4 }}>
        {showTooltip && <ChartTooltip content={<ChartTooltipContent hideLabel hideIndicator />} />}
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
