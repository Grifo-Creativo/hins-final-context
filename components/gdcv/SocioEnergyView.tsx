// components/gdcv/SocioEnergyView.tsx
"use client"

import { useMemo, useState } from "react"

import { MonetaryBarChart } from "@/components/charts/MonetaryBarChart"
import { GenerationSparkline } from "@/components/charts/GenerationSparkline"
import { CHART_RANGE_TABS } from "@/components/gdd/chart-range-options"
import { CardWithContent } from "@/components/ui/card-with-content"
import { IconBadge } from "@/components/ui/icon-badge"
import { SoftBadge } from "@/components/ui/soft-badge"
import { StatList } from "@/components/ui/stat-list"
import { generationSparklineConfig } from "@/data/chart-config"
import {
  getSocioAhorroSeries,
  getSocioAhorroChartSubtitle,
  socioAhorroKpi,
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

const STAT_TABS = [
  { value: "inyeccion", label: "En Dinero" },
  { value: "energia", label: "En Energía" },
]

export function SocioEnergyView() {
  const [ahorroRange, setAhorroRange] = useState<ChartRangeChip>("6m")
  const [statTab, setStatTab] = useState("inyeccion")

  const ahorroData = useMemo(() => getSocioAhorroSeries(ahorroRange), [ahorroRange])
  const ahorroSubtitle = getSocioAhorroChartSubtitle(ahorroRange)
  const statItems =
    statTab === "inyeccion" ? socioStatListInyeccion : socioStatListEnergia
  const sparkline = useMemo(
    () => socioEnergiaSparkline.map((d, i) => ({ i, value: d.value })),
    []
  )

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_340px]">

      <CardWithContent
        title="Mi Ahorro en abril"
        subtitle={ahorroSubtitle}
        tabs={CHART_RANGE_TABS}
        defaultTab="6m"
        onTabChange={(v) => setAhorroRange(v as ChartRangeChip)}
        className="h-full"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:-mt-3">
            <p className="text-4xl font-bold text-foreground">$74.400,03</p>
            <SoftBadge>{socioAhorroKpi.delta}</SoftBadge>
          </div>

          <MonetaryBarChart
            data={ahorroData}
            chartConfig={ahorroChartConfig}
          />
        </div>
      </CardWithContent>

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
