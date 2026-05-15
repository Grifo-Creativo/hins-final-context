// components/gdcv/SocioEnergyView.tsx
"use client"

import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts"

import { GenerationSparkline } from "@/components/charts/GenerationSparkline"
import { CardWithContent } from "@/components/ui/card-with-content"
import { IconBadge } from "@/components/ui/icon-badge"
import { SoftBadge } from "@/components/ui/soft-badge"
import { StatList } from "@/components/ui/stat-list"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { generationSparklineConfig } from "@/data/chart-config"
import {
  getSocioAhorroSeries,
  getSocioAhorroChartSubtitle,
  socioEnergiaGenerada,
  socioEnergiaSparkline,
  socioStatListInyeccion,
  socioStatListEnergia,
} from "@/data/gdcv-socio-mock"
import type { ChartRangeChip } from "@/types/chart-range"
import { ZapIcon } from "lucide-react"

const ahorroChartConfig = {
  generated: {
    label: "Ahorro ($)",
    color: "var(--chart-1)",
  },
}

const PERIOD_TABS = [
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
]

const STAT_TABS = [
  { value: "inyeccion", label: "En Dinero" },
  { value: "energia", label: "En Energía" },
]

function barFill(index: number, total: number): string {
  return index === total - 1 ? "var(--chart-1)" : "var(--chart-1-muted)"
}

export function SocioEnergyView() {
  const [ahorroRange, setAhorroRange] = useState<ChartRangeChip>("6m")
  const [statTab, setStatTab] = useState("inyeccion")

  const ahorroData = useMemo(() => getSocioAhorroSeries(ahorroRange), [ahorroRange])
  const ahorroSubtitle = getSocioAhorroChartSubtitle(ahorroRange)
  const statItems     = statTab === "inyeccion" ? socioStatListInyeccion : socioStatListEnergia
  const sparkline     = useMemo(
    () => socioEnergiaSparkline.map((d, i) => ({ i, value: d.value })),
    []
  )

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_340px]">

      {/* Left — Mi Ahorro en abril */}
      <CardWithContent
        title="Mi Ahorro en abril"
        tabs={PERIOD_TABS}
        defaultTab="6m"
        onTabChange={(v) => setAhorroRange(v as ChartRangeChip)}
        className="h-full"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:-mt-3">
            <p className="text-4xl font-bold text-foreground">$74.400,03</p>
            <SoftBadge>{ahorroSubtitle}</SoftBadge>
          </div>

          <ChartContainer config={ahorroChartConfig} className="aspect-auto h-[260px] w-full">
            <BarChart
              data={ahorroData}
              margin={{ left: 4, right: 8, top: 8, bottom: 4 }}
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
                className="text-muted-foreground"
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
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      typeof value === "number"
                        ? `$${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`
                        : String(value)
                    }
                  />
                }
              />
              <Bar dataKey="generated" radius={[6, 6, 0, 0]} barSize={48}>
                {ahorroData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={barFill(i, ahorroData.length)} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardWithContent>

      {/* Right — Mi Energía Generada */}
      <CardWithContent title="" noPadding className="h-full">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-start gap-4">
            <IconBadge icon={ZapIcon} size="lg" />
            <div className="flex flex-col gap-1 flex-1">
              <p className="text-lg font-semibold text-foreground">Mi Energía Generada</p>
              <p className="text-4xl font-bold text-foreground">
                {socioEnergiaGenerada.value}
                <span className="text-xl font-semibold ml-1">{socioEnergiaGenerada.unit}</span>
              </p>
            </div>
          </div>

          <div className="mx-[-16px]">
            <GenerationSparkline
              data={sparkline}
              chartConfig={generationSparklineConfig}
              className="aspect-auto h-14 w-full"
            />
          </div>

          <SoftBadge>{socioEnergiaGenerada.period}</SoftBadge>

          <StatList
            title="Ahorro"
            items={statItems}
            tabs={STAT_TABS}
            defaultTab="inyeccion"
            onTabChange={setStatTab}
          />
        </div>
      </CardWithContent>
    </div>
  )
}
