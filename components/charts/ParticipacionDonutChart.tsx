// components/charts/ParticipacionDonutChart.tsx
"use client"

import { Cell, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { participacionChartConfig } from "@/data/chart-config"
import { participacionChartData, socioTotalParticipantes } from "@/data/gdcv-socio-mock"

type ParticipacionDonutChartProps = {
  cellKeyPrefix: string
}

export function ParticipacionDonutChart({ cellKeyPrefix }: ParticipacionDonutChartProps) {
  return (
    <div className="flex justify-center overflow-visible py-1">
      <div className="relative flex size-40 items-center justify-center overflow-visible">
        <ChartContainer
          config={participacionChartConfig}
          className="aspect-square h-40 w-40 overflow-visible [&_.recharts-tooltip-wrapper]:z-[60]"
          initialDimension={{ width: 160, height: 160 }}
        >
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={participacionChartData}
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={0}
              dataKey="value"
              nameKey="name"
              strokeWidth={0}
            >
              {participacionChartData.map((entry, index) => (
                <Cell key={`${cellKeyPrefix}-${entry.name}-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ zIndex: 60 }}
              content={
                <ChartTooltipContent
                  nameKey="name"
                  hideLabel
                  formatter={(value, name, item) => {
                    const fill =
                      (item.payload as { fill?: string } | undefined)?.fill ?? item.color
                    return (
                      <>
                        <div
                          className="mt-0.5 h-2.5 w-2.5 shrink-0 self-start rounded-[2px] border-(--color-border) bg-(--color-bg)"
                          style={
                            {
                              "--color-bg": fill,
                              "--color-border": fill,
                            } as React.CSSProperties
                          }
                        />
                        <div className="grid min-w-0 gap-0.5 leading-tight">
                          <span className="font-medium text-foreground">{name}</span>
                          <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                            {value}%
                          </span>
                        </div>
                      </>
                    )
                  }}
                />
              }
            />
          </PieChart>
        </ChartContainer>

        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center text-center">
          <p className="text-lg font-semibold leading-none text-foreground">
            {socioTotalParticipantes}
          </p>
          <p className="text-xs text-muted-foreground">socios</p>
        </div>
      </div>
    </div>
  )
}
