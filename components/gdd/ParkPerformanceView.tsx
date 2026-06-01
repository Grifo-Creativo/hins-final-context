// components/gdd/ParkPerformanceView.tsx
"use client"

import { useMemo, useState } from "react"

import { ConsumptionHistoryTable } from "@/components/gdd/ConsumptionHistoryTable"
import { DailyGenerationChartBlock } from "@/components/charts/DailyGenerationChartBlock"
import { ParkEnergyBarChart } from "@/components/charts/ParkEnergyBarChart"
import { CHART_RANGE_TABS } from "@/components/gdd/chart-range-options"
import { CardWithResponsiveTabs } from "@/components/ui/card-with-responsive-tabs"
import { ParkDetailsCard } from "@/components/ui/park-details-card"
import { GDD_PERFORMANCE_TOP_ROW_GRID } from "@/components/ui/performance-placeholder-card"
import { KpiPrimary } from "@/components/ui/kpi-primary"
import { KpiSecondary } from "@/components/ui/kpi-secondary"
import { parkEnergyBarChartConfig } from "@/data/chart-config"
import {
  consumptionHistoryMock,
  gddParkDetails,
  generationSparklinePoints,
  getParkEnergyChartSubtitle,
  getParkEnergySeries,
  highlightAprilCardMock,
  savingsCardMock,
  tariffCardMock,
  type PerformancePeriod,
} from "@/data/gdd-performance-mock"
import {
  getDailyGenerationData24,
  getDailyPeak,
  getDailyTotal,
  MOCK_TODAY,
  toDateKey,
} from "@/data/gdcv-daily-mock"
import { formatChartDayLong, formatDailyPeakLabel } from "@/lib/chart-day-format"
import { DollarSignIcon, ZapIcon } from "lucide-react"

export function ParkPerformanceView() {
  const [period, setPeriod] = useState<PerformancePeriod>("6m")
  const [activeDay, setActiveDay] = useState<Date>(MOCK_TODAY)

  const chartData = useMemo(
    () => (period === "1d" ? [] : getParkEnergySeries(period)),
    [period]
  )

  const dailyChartData = useMemo(
    () => getDailyGenerationData24(toDateKey(activeDay)),
    [activeDay]
  )

  const dailyTotal = useMemo(
    () => getDailyTotal(dailyChartData),
    [dailyChartData]
  )

  const dailyPeak = useMemo(
    () => getDailyPeak(dailyChartData),
    [dailyChartData]
  )

  const chartSubtitle =
    period === "1d"
      ? formatChartDayLong(activeDay)
      : getParkEnergyChartSubtitle(period)

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className={GDD_PERFORMANCE_TOP_ROW_GRID}>
        <ParkDetailsCard
          imageSrc={gddParkDetails.imageSrc}
          imageAlt={gddParkDetails.imageAlt}
          metrics={gddParkDetails.metrics}
          className="h-full"
        />
        <CardWithResponsiveTabs
          title="Energía Generada del Parque"
          tabs={CHART_RANGE_TABS}
          activeTab={period}
          defaultTab="6m"
          onTabChange={(v) => setPeriod(v as PerformancePeriod)}
          className="h-full"
        >
          {period === "1d" ? (
            <div className="min-h-[300px] w-full flex-1">
              <DailyGenerationChartBlock
                activeDay={activeDay}
                today={MOCK_TODAY}
                onActiveDayChange={setActiveDay}
                data={dailyChartData}
                totalLabel={dailyTotal}
                peakLabel={formatDailyPeakLabel(dailyPeak.value, dailyPeak.hour)}
                className="h-full min-h-[300px]"
              />
            </div>
          ) : (
            <div className="min-h-[300px] w-full flex-1">
              <ParkEnergyBarChart
                data={chartData}
                chartConfig={parkEnergyBarChartConfig}
                className="h-full min-h-[300px]"
              />
            </div>
          )}
        </CardWithResponsiveTabs>

        <div className="flex h-full flex-col gap-4 sm:gap-6">
          <KpiPrimary
            icon={ZapIcon}
            label={highlightAprilCardMock.title}
            value={highlightAprilCardMock.kwh.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            unit="kWh"
            delta={highlightAprilCardMock.compareBadge}
            sparklineData={generationSparklinePoints.map((p) => ({
              value: p.value,
            }))}
          />

          <div className="grid flex-1 grid-cols-2 gap-4 sm:gap-6">
            <KpiSecondary
              icon={DollarSignIcon}
              label={savingsCardMock.label}
              value={savingsCardMock.amount}
              delta={savingsCardMock.deltaBadge}
            />
            <KpiSecondary
              icon={DollarSignIcon}
              label={tariffCardMock.label}
              value={`${tariffCardMock.value} ${tariffCardMock.unit}`}
              delta={tariffCardMock.deltaBadge}
              infoTooltip={{ content: "Ver tarifas vigentes", href: "#" }}
            />
          </div>
        </div>
      </div>

      <ConsumptionHistoryTable data={consumptionHistoryMock} />
    </div>
  )
}
