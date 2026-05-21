// components/charts/DailyGenerationChart.tsx
"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { dailyGenerationChartConfig } from "@/data/chart-config"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { formatChartHourTooltip } from "@/lib/chart-day-format"
import { cn } from "@/lib/utils"

const X_AXIS_TICKS = ["06:00", "09:00", "12:00", "15:00", "18:00"] as const

export const DAILY_CHART_MOUNT_ANIMATION_MS = 800
export const DAILY_CHART_DAY_CHANGE_ANIMATION_MS = 500

export interface DailyGenerationChartProps {
  /** Serie horaria — típicamente 25 puntos (00:00 … 24:00). */
  data: { hour: string; kw: number }[]
  className?: string
  /** Duración morph Recharts. Más lenta al entrar en tab 1D; ágil al cambiar día. */
  animationDuration?: number
}

function formatKwTooltip(value: unknown): string {
  const numeric = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(numeric)) {
    return ""
  }
  return `${numeric.toLocaleString("es-AR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} kW`
}

export function DailyGenerationChart({
  data,
  className,
  animationDuration = DAILY_CHART_DAY_CHANGE_ANIMATION_MS,
}: DailyGenerationChartProps) {
  const gradientId = useId().replace(/:/g, "")
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <ChartContainer
      config={dailyGenerationChartConfig}
      initialDimension={{ width: 320, height: 300 }}
      className={cn(
        "aspect-auto h-full min-h-[300px] w-full [&_.recharts-responsive-container]:!h-full [&_.recharts-responsive-container]:!w-full [&_.recharts-surface]:overflow-hidden",
        className
      )}
    >
      <AreaChart
        data={data}
        margin={{ left: 4, right: 8, top: 8, bottom: 20 }}
      >
        <defs>
          <linearGradient
            id={`fillDailyGen-${gradientId}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="var(--color-kw)" stopOpacity={0.15} />
            <stop offset="100%" stopColor="var(--color-kw)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          className="stroke-border/60"
        />
        <XAxis
          dataKey="hour"
          ticks={[...X_AXIS_TICKS]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-muted-foreground text-xs"
        />
        <YAxis
          hide
          tickLine={false}
          axisLine={false}
          domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15 * 10) / 10]}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label) => formatChartHourTooltip(String(label ?? ""))}
              formatter={(value) => formatKwTooltip(value)}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="kw"
          stroke="var(--color-kw)"
          fill={`url(#fillDailyGen-${gradientId})`}
          fillOpacity={1}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "var(--color-kw)" }}
          isAnimationActive={!prefersReducedMotion}
          animationDuration={animationDuration}
          animationBegin={0}
        />
      </AreaChart>
    </ChartContainer>
  )
}
