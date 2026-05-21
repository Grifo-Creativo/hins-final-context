// components/gdcv/SocioEnergyViewV2.tsx
"use client"

import { useMemo, useState } from "react"

import { MonetaryBarChart } from "@/components/charts/MonetaryBarChart"
import { CHART_RANGE_TABS } from "@/components/gdd/chart-range-options"
import { CardWithContent } from "@/components/ui/card-with-content"
import { IconBadge } from "@/components/ui/icon-badge"
import { KpiSecondary } from "@/components/ui/kpi-secondary"
import { SoftBadge } from "@/components/ui/soft-badge"
import { StatList } from "@/components/ui/stat-list"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import {
  getSocioAhorroSeries,
  getSocioAhorroEnergiaSeries,
  getSocioAhorroChartSubtitle,
  socioAhorroKpi,
  socioAhorroEnergiaKpi,
  socioStatListInyeccion,
  socioStatListAhorroEnergia,
} from "@/data/gdcv-socio-mock"
import type { ChartRangeChip } from "@/types/chart-range"
import { DollarSignIcon, ZapIcon } from "lucide-react"

const ahorroChartConfig = {
  autoconsumo: {
    label: "Autoconsumo Virtual",
    color: "#a8d976",
  },
  inyectada: {
    label: "Energía Inyectada",
    color: "#ffc872",
  },
}

const MAIN_TABS = [
  { value: "dinero", label: "Dinero 💵" },
  { value: "energia", label: "Energía ⚡" },
]

const STAT_TABS = [
  { value: "dinero", label: "En Dinero" },
  { value: "energia", label: "En Energía" },
]

export function SocioEnergyViewV2() {
  const [ahorroRange, setAhorroRange] = useState<ChartRangeChip>("6m")
  const [mainTab, setMainTab] = useState<"dinero" | "energia">("dinero")

  const ahorroBarRange: ChartRangeChip =
    ahorroRange === "1d" ? "6m" : ahorroRange

  const chartData = useMemo(
    () =>
      mainTab === "dinero"
        ? getSocioAhorroSeries(ahorroBarRange)
        : getSocioAhorroEnergiaSeries(ahorroBarRange),
    [ahorroBarRange, mainTab]
  )

  const ahorroSubtitle =
    ahorroRange === "1d"
      ? getSocioAhorroChartSubtitle("6m")
      : getSocioAhorroChartSubtitle(ahorroRange)

  const kpi = mainTab === "dinero" ? socioAhorroKpi : socioAhorroEnergiaKpi
  const statItems =
    mainTab === "dinero" ? socioStatListInyeccion : socioStatListAhorroEnergia

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_340px]">
      {/* LEFT CARD: Mi Ahorro with main tabs and range tabs */}
      <CardWithContent
        title="Mi Ahorro en Abril"
        tabs={CHART_RANGE_TABS}
        activeTab={ahorroRange}
        defaultTab="6m"
        onTabChange={(v) => setAhorroRange(v as ChartRangeChip)}
        className="h-full"
      >
        <div className="flex flex-col gap-4">
          {/* Main tabs: Dinero / Energía */}
          <div className="flex flex-col gap-2">
            <TabsForBlocks
              tabs={MAIN_TABS}
              value={mainTab}
              onValueChange={(v) => setMainTab(v as "dinero" | "energia")}
            />
          </div>

          {/* KPI display */}
          <div className="flex flex-col gap-2 md:-mt-1">
            <p className="text-4xl font-bold text-foreground">
              {kpi.value}
              {mainTab === "energia" && (
                <span className="text-xl font-semibold ml-2">{kpi.unit}</span>
              )}
            </p>
            <SoftBadge>{kpi.delta}</SoftBadge>
          </div>

          {/* Chart */}
          <MonetaryBarChart
            data={chartData as any}
            chartConfig={ahorroChartConfig}
          />
        </div>
      </CardWithContent>

      {/* RIGHT CARD: KPIs + Stats breakdown */}
      <CardWithContent title="" noPadding className="h-full">
        <div className="flex flex-col gap-4 p-4">
          {/* Badge "Abril 2026" */}
          <SoftBadge>Abril 2026</SoftBadge>

          {/* KPI Grid: 2 items (Ahorro + Energía) */}
          <div className="grid grid-cols-1 gap-3">
            <KpiSecondary
              icon={DollarSignIcon}
              label="Ahorro en Dinero"
              value="$74.400"
              delta="Abril 2026"
              layout="horizontal"
            />
            <KpiSecondary
              icon={ZapIcon}
              label="Energía Generada"
              value="830 kWh"
              delta="Abril 2026"
              layout="horizontal"
            />
          </div>

          {/* Desglose / Stats breakdown */}
          <StatList
            title="Desglose"
            items={statItems}
            tabs={STAT_TABS}
            defaultTab={mainTab}
            onTabChange={(v) => setMainTab(v as "dinero" | "energia")}
          />
        </div>
      </CardWithContent>
    </div>
  )
}
