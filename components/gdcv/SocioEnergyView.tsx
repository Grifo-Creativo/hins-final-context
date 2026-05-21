// components/gdcv/SocioEnergyView.tsx
"use client"

import { useMemo, useState } from "react"

import { DailyGenerationChartBlock } from "@/components/charts/DailyGenerationChartBlock"
import { MonetaryBarChart } from "@/components/charts/MonetaryBarChart"
import { ParkEnergyBarChart } from "@/components/charts/ParkEnergyBarChart"
import {
  getSocioV2ChartTitle,
  SOCIO_V2_UNIT_TABS,
  type SocioV2Unit,
} from "@/components/gdcv/socio-v2-constants"
import { StatusBadge } from "@/components/ui/status-badge"
import { CHART_RANGE_TABS } from "@/components/gdd/chart-range-options"
import { Card } from "@/components/ui/card"
import { CardWithContent } from "@/components/ui/card-with-content"
import { KpiPrimaryCompact } from "@/components/ui/kpi-primary-compact"
import { SectionHeader } from "@/components/ui/section-header"
import { StatList } from "@/components/ui/stat-list"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import {
  parkEnergyBarChartConfig,
  socioAhorroStackChartConfig,
} from "@/data/chart-config"
import {
  getSocioAhorroSeries,
  getSocioEnergiaGeneradaDailyPeak,
  getSocioEnergiaGeneradaDailySeries,
  getSocioEnergiaGeneradaDailyTotal,
  getSocioEnergiaGeneradaSeries,
  socioMockToday,
  socioStatListInyeccion,
  socioStatListEnergia,
  socioV2AhorroSparkline,
  socioV2EnergiaSparkline,
  socioV2PanelKpis,
} from "@/data/gdcv-socio-mock"
import { formatDailyPeakLabel } from "@/lib/chart-day-format"
import type { ChartRangeChip } from "@/types/chart-range"
import { WalletIcon, ZapIcon } from "lucide-react"

const ahorroChartConfig = socioAhorroStackChartConfig

const STAT_TABS = [
  { value: "inyeccion", label: "En Dinero" },
  { value: "energia", label: "En Energía" },
]

const DINERO_CHART_RANGE_TABS = CHART_RANGE_TABS.filter((tab) => tab.value !== "1d")

export function SocioEnergyView() {
  const [ahorroRange, setAhorroRange] = useState<ChartRangeChip>("6m")
  const [chartUnit, setChartUnit] = useState<SocioV2Unit>("dinero")
  const [activeDay, setActiveDay] = useState<Date>(socioMockToday)
  const [statTab, setStatTab] = useState("inyeccion")

  const chartRangeTabs =
    chartUnit === "dinero" ? DINERO_CHART_RANGE_TABS : CHART_RANGE_TABS

  const ahorroStackData = useMemo(
    () => getSocioAhorroSeries(ahorroRange === "1d" ? "6m" : ahorroRange),
    [ahorroRange]
  )

  const energiaBarData = useMemo(
    () => getSocioEnergiaGeneradaSeries(ahorroRange),
    [ahorroRange]
  )

  const dailyChartData = useMemo(
    () => getSocioEnergiaGeneradaDailySeries(activeDay),
    [activeDay]
  )

  const dailyTotal = useMemo(
    () => getSocioEnergiaGeneradaDailyTotal(activeDay),
    [activeDay]
  )

  const dailyPeak = useMemo(
    () => getSocioEnergiaGeneradaDailyPeak(activeDay),
    [activeDay]
  )

  const statItems =
    statTab === "inyeccion" ? socioStatListInyeccion : socioStatListEnergia

  const handleChartUnitChange = (value: string) => {
    const unit = value as SocioV2Unit
    setChartUnit(unit)
    if (unit === "dinero" && ahorroRange === "1d") {
      setAhorroRange("6m")
    }
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
      <CardWithContent
        title={getSocioV2ChartTitle(chartUnit)}
        tabs={chartRangeTabs}
        activeTab={ahorroRange}
        defaultTab="6m"
        onTabChange={(v) => setAhorroRange(v as ChartRangeChip)}
        headerActions={
          <TabsForBlocks
            variant="icon"
            tabs={[...SOCIO_V2_UNIT_TABS]}
            value={chartUnit}
            onValueChange={handleChartUnitChange}
          />
        }
        className="h-full lg:order-2"
      >
        <div className="min-h-[260px] w-full flex-1">
          {chartUnit === "dinero" ? (
            <MonetaryBarChart
              data={ahorroStackData}
              chartConfig={ahorroChartConfig}
              unit="dinero"
              className="h-full min-h-[260px]"
            />
          ) : ahorroRange === "1d" ? (
            <DailyGenerationChartBlock
              activeDay={activeDay}
              today={socioMockToday}
              onActiveDayChange={setActiveDay}
              data={dailyChartData}
              totalLabel={dailyTotal}
              peakLabel={formatDailyPeakLabel(dailyPeak.value, dailyPeak.hour)}
              className="h-full min-h-[260px]"
            />
          ) : (
            <ParkEnergyBarChart
              data={energiaBarData}
              chartConfig={parkEnergyBarChartConfig}
              className="h-full min-h-[260px]"
            />
          )}
        </div>
      </CardWithContent>

      <div className="flex flex-col gap-5 lg:order-1 lg:gap-6">
        <SectionHeader
          size="md"
          title={socioV2PanelKpis.periodLabel}
          action={<StatusBadge status="active">En Curso</StatusBadge>}
        />

        <div className="grid grid-cols-2 gap-4">
          <KpiPrimaryCompact
            icon={WalletIcon}
            label={socioV2PanelKpis.ahorro.label}
            value={socioV2PanelKpis.ahorro.value}
            sparklineData={socioV2AhorroSparkline}
          />
          <KpiPrimaryCompact
            icon={ZapIcon}
            label={socioV2PanelKpis.energiaGen.label}
            value={socioV2PanelKpis.energiaGen.value}
            unit={socioV2PanelKpis.energiaGen.unit}
            sparklineData={socioV2EnergiaSparkline}
          />
        </div>

        <Card className="overflow-hidden rounded-xl bg-white py-0 shadow-xs ring-0">
          <div className="p-4">
            <StatList
              title="Ahorro"
              items={statItems}
              tabs={STAT_TABS}
              defaultTab="inyeccion"
              onTabChange={setStatTab}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
