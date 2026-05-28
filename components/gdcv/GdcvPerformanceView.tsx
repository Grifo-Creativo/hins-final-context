// components/gdcv/GdcvPerformanceView.tsx
"use client"

import { useMemo, useState } from "react"

import { DailyGenerationChartBlock } from "@/components/charts/DailyGenerationChartBlock"
import { ParkEnergyBarChart } from "@/components/charts/ParkEnergyBarChart"
import { SocioDetailSheet } from "@/components/gdcv/SocioDetailSheet"
import { SociosTable } from "@/components/gdcv/SociosTable"
import { CardWithContent } from "@/components/ui/card-with-content"
import { ParkDetailsCard } from "@/components/ui/park-details-card"
import { GDD_PERFORMANCE_TOP_ROW_GRID } from "@/components/ui/performance-placeholder-card"
import { KpiPrimary } from "@/components/ui/kpi-primary"
import { KpiSecondary } from "@/components/ui/kpi-secondary"
import { gdcvEnergyBarChartConfig } from "@/data/chart-config"
import {
  gdcvAhorroTotalAbril,
  gdcvGeneradaAbril,
  gdcvGenerationSparkline,
  gdcvParkDetails,
  gdcvPromedioPorUsuario,
  getGdcvEnergyChartSubtitle,
  getGdcvEnergySeries,
  sociosMock,
  type SocioRow,
} from "@/data/gdcv-mock"
import { CHART_RANGE_TABS } from "@/components/gdd/chart-range-options"
import type { ChartRangeChip } from "@/types/chart-range"
import {
  getDailyGenerationData24,
  getDailyPeak,
  getDailyTotal,
  MOCK_TODAY,
  toDateKey,
} from "@/data/gdcv-daily-mock"
import { formatChartDayLong, formatDailyPeakLabel } from "@/lib/chart-day-format"
import { DollarSignIcon, ZapIcon } from "lucide-react"

export function GdcvPerformanceView() {
  const [chartRange, setChartRange] = useState<ChartRangeChip>("6m")
  const [activeDay, setActiveDay] = useState<Date>(MOCK_TODAY)
  const [selectedSocio, setSelectedSocio] = useState<SocioRow | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const chartData = useMemo(
    () => (chartRange === "1d" ? [] : getGdcvEnergySeries(chartRange)),
    [chartRange]
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
    chartRange === "1d"
      ? formatChartDayLong(activeDay)
      : getGdcvEnergyChartSubtitle(chartRange)

  function handleRowClick(socio: SocioRow) {
    setSelectedSocio(socio)
    setSheetOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">

      <div className={GDD_PERFORMANCE_TOP_ROW_GRID}>
        <ParkDetailsCard
          imageSrc={gdcvParkDetails.imageSrc}
          imageAlt={gdcvParkDetails.imageAlt}
          metrics={gdcvParkDetails.metrics}
          className="h-full"
        />
        <CardWithContent
          title="Energía Generada del Parque"
          tabs={CHART_RANGE_TABS}
          activeTab={chartRange}
          defaultTab="6m"
          onTabChange={(v) => setChartRange(v as ChartRangeChip)}
          className="h-full"
        >
          {chartRange === "1d" ? (
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
                chartConfig={gdcvEnergyBarChartConfig}
                className="h-full min-h-[300px]"
              />
            </div>
          )}
        </CardWithContent>

        {/* Right column — KPI primary + 2× secondary */}
        <div className="flex flex-col gap-6 h-full">
          <KpiPrimary
            icon={ZapIcon}
            label={gdcvGeneradaAbril.title}
            value={gdcvGeneradaAbril.kwh.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            unit="kWh"
            delta={gdcvGeneradaAbril.compareBadge}
            sparklineData={gdcvGenerationSparkline}
          />

          <div className="grid grid-cols-2 gap-6 flex-1">
            <KpiSecondary
              icon={DollarSignIcon}
              label={gdcvAhorroTotalAbril.label}
              value={gdcvAhorroTotalAbril.amount}
              delta={gdcvAhorroTotalAbril.deltaBadge}
            />
            <KpiSecondary
              icon={DollarSignIcon}
              label={gdcvPromedioPorUsuario.label}
              value={gdcvPromedioPorUsuario.amount}
              delta={gdcvPromedioPorUsuario.deltaBadge}
            />
          </div>
        </div>
      </div>

      {/* Socios del Parque table */}
      <SociosTable data={sociosMock} onRowClick={handleRowClick} />

      {/* Socio detail sheet */}
      <SocioDetailSheet
        socio={selectedSocio}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
