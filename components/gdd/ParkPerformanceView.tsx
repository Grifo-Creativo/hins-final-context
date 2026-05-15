// components/gdd/ParkPerformanceView.tsx
"use client"

import { useMemo, useState } from "react"

import { ConsumptionHistoryTable } from "@/components/gdd/ConsumptionHistoryTable"
import { ParkEnergyBarChart } from "@/components/charts/ParkEnergyBarChart"
import { CHART_RANGE_CHIP_OPTIONS } from "@/components/gdd/chart-range-options"
import { CardWithContent } from "@/components/ui/card-with-content"
import { KpiPrimary } from "@/components/ui/kpi-primary"
import { KpiSecondary } from "@/components/ui/kpi-secondary"
import { parkEnergyBarChartConfig } from "@/data/chart-config"
import {
  consumptionHistoryMock,
  generationSparklinePoints,
  getParkEnergyChartSubtitle,
  getParkEnergySeries,
  highlightAprilCardMock,
  savingsCardMock,
  tariffCardMock,
  type PerformancePeriod,
} from "@/data/gdd-performance-mock"
import { DollarSignIcon, ZapIcon } from "lucide-react"

export function ParkPerformanceView() {
  const [period, setPeriod] = useState<PerformancePeriod>("6m")

  const chartData = useMemo(() => getParkEnergySeries(period), [period])
  const chartSubtitle = getParkEnergyChartSubtitle(period)

  return (
    <div className="flex flex-1 flex-col gap-6">

        {/* Top section: chart arriba, columna KPI abajo en mobile; dos columnas desde md */}
        <div className="grid grid-cols-1 gap-6 items-stretch md:grid-cols-[minmax(0,1fr)_340px]">

          {/* Left — bar chart card */}
          <CardWithContent
            title="Energía Generada del Parque"
            subtitle={chartSubtitle}
            tabs={CHART_RANGE_CHIP_OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
            defaultTab="6m"
            onTabChange={(v) => setPeriod(v as PerformancePeriod)}
            className="h-full"
          >
            <ParkEnergyBarChart
              data={chartData}
              chartConfig={parkEnergyBarChartConfig}
            />
          </CardWithContent>

          {/* Right column — KPI primary + 2× secondary */}
          <div className="flex flex-col gap-6">

            {/* KpiPrimary — generada en abril */}
            <KpiPrimary
              icon={ZapIcon}
              label={highlightAprilCardMock.title}
              value={highlightAprilCardMock.kwh.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              unit="kWh"
              delta={highlightAprilCardMock.compareBadge}
              sparklineData={generationSparklinePoints.map((p) => ({ value: p.value }))}
            />

            {/* KpiSecondary row */}
            <div className="grid grid-cols-2 gap-6">
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
