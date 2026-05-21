// components/gdcv/SocioEnergyViewV2.tsx
"use client"

import { useMemo, useState } from "react"

import { MonetaryBarChart } from "@/components/charts/MonetaryBarChart"
import { CHART_RANGE_TABS } from "@/components/gdd/chart-range-options"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CardWithContent } from "@/components/ui/card-with-content"
import { FeatureItem } from "@/components/ui/feature-item"
import { StatList } from "@/components/ui/stat-list"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getSocioAhorroSeries,
  getSocioAhorroEnergiaSeries,
  getSocioAhorroChartSubtitle,
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
  { value: "dinero", icon: DollarSignIcon, ariaLabel: "Dinero" },
  { value: "energia", icon: ZapIcon, ariaLabel: "Energía" },
]

const STAT_TABS = [
  { value: "dinero", label: "Dinero" },
  { value: "energia", label: "Energía" },
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

  const chartTitle = useMemo(
    () =>
      mainTab === "dinero" ? "Mi Ahorro Generado" : "Mi Energía Generada",
    [mainTab]
  )

  const ahorroSubtitle =
    ahorroRange === "1d"
      ? getSocioAhorroChartSubtitle("6m")
      : getSocioAhorroChartSubtitle(ahorroRange)

  const statItems =
    mainTab === "dinero" ? socioStatListInyeccion : socioStatListAhorroEnergia

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_340px]">
      {/* LEFT CARD: Mi Ahorro with dynamic title, icon tabs, and chart */}
      <CardWithContent
        title={chartTitle}
        className="h-full"
      >
        <div className="flex flex-col gap-4">
          {/* Tabs Row: Main tabs (icon-only) + Range tabs in same row */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            {/* Main tabs: Icon-only perspective switcher */}
            <Tabs
              value={mainTab}
              onValueChange={(v) => setMainTab(v as "dinero" | "energia")}
              className="shrink-0"
            >
              <TabsList className="grid w-auto grid-cols-2 gap-1">
                {MAIN_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="px-2 py-1.5"
                    aria-label={tab.ariaLabel}
                  >
                    <tab.icon className="h-5 w-5" />
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Divider for visual separation */}
            <div className="hidden h-6 w-px bg-border/50 md:block" />

            {/* Range tabs: Chart range selector */}
            <Tabs
              value={ahorroRange}
              onValueChange={(v) => setAhorroRange(v as ChartRangeChip)}
              className="flex-1"
            >
              <TabsList className="w-full justify-start overflow-x-auto md:w-auto">
                {CHART_RANGE_TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Chart */}
          <MonetaryBarChart
            data={chartData as any}
            chartConfig={ahorroChartConfig}
          />
        </div>
      </CardWithContent>

      {/* RIGHT CARD: header manual con badge inline + KPIs full width + Stats */}
      <Card className="bg-white shadow-xs ring-0 rounded-xl overflow-hidden h-full">
        <div className="flex flex-col gap-4 p-4">
          {/* Header: título + badge "En Curso" en la misma línea */}
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold leading-snug text-foreground">Abril 2026</h3>
            <Badge className="bg-green-100 text-green-700 border-transparent hover:bg-green-100">
              En Curso
            </Badge>
          </div>

          {/* KPI Grid: 2 items a todo el ancho, side-by-side */}
          <div className="grid grid-cols-2 gap-3">
            <FeatureItem
              icon={DollarSignIcon}
              label="Ahorro"
              value="$74.400"
              orientation="vertical"
            />
            <FeatureItem
              icon={ZapIcon}
              label="Energía Gen"
              value="830 kWh"
              orientation="vertical"
            />
          </div>

          {/* Desglose / Stats breakdown */}
          <StatList
            title="Desglose ahorro"
            items={statItems}
            tabs={STAT_TABS}
            defaultTab={mainTab}
            onTabChange={(v) => setMainTab(v as "dinero" | "energia")}
          />
        </div>
      </Card>
    </div>
  )
}
