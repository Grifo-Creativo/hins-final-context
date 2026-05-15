// components/gdcv/GdcvPerformanceView.tsx
"use client"

import { useMemo, useState } from "react"

import { ParkEnergyBarChart } from "@/components/charts/ParkEnergyBarChart"
import { SocioDetailSheet } from "@/components/gdcv/SocioDetailSheet"
import { SociosTable } from "@/components/gdcv/SociosTable"
import { CardWithContent } from "@/components/ui/card-with-content"
import { KpiPrimary } from "@/components/ui/kpi-primary"
import { KpiSecondary } from "@/components/ui/kpi-secondary"
import { gdcvEnergyBarChartConfig } from "@/data/chart-config"
import {
  gdcvAhorroTotalAbril,
  gdcvGeneradaAbril,
  gdcvGenerationSparkline,
  gdcvPromedioPorUsuario,
  getGdcvEnergyChartSubtitle,
  getGdcvEnergySeries,
  sociosMock,
  type SocioRow,
} from "@/data/gdcv-mock"
import type { ChartRangeChip } from "@/types/chart-range"
import { DollarSignIcon, ZapIcon } from "lucide-react"

const CHART_CHIP_OPTIONS = [
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
]

export function GdcvPerformanceView() {
  const [chartRange, setChartRange] = useState<ChartRangeChip>("6m")
  const [selectedSocio, setSelectedSocio] = useState<SocioRow | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const chartData = useMemo(() => getGdcvEnergySeries(chartRange), [chartRange])
  const chartSubtitle = getGdcvEnergyChartSubtitle(chartRange)

  function handleRowClick(socio: SocioRow) {
    setSelectedSocio(socio)
    setSheetOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">

      {/* Top section: chart left + KPI column right */}
      <div className="grid grid-cols-1 gap-6 items-stretch md:grid-cols-[minmax(0,1fr)_340px]">

        {/* Left — bar chart card */}
        <CardWithContent
          title="Energía Generada del Parque"
          subtitle={chartSubtitle}
          tabs={CHART_CHIP_OPTIONS}
          defaultTab="6m"
          onTabChange={(v) => setChartRange(v as ChartRangeChip)}
          className="h-full"
        >
          <ParkEnergyBarChart
            data={chartData}
            chartConfig={gdcvEnergyBarChartConfig}
          />
        </CardWithContent>

        {/* Right column — KPI primary + 2× secondary */}
        <div className="flex flex-col gap-6">
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

          <div className="grid grid-cols-2 gap-6">
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
