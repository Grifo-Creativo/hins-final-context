// components/gdcv/SocioEnergyViewV2.tsx
"use client"

import { useMemo, useState } from "react"

import { MonetaryBarChart } from "@/components/charts/MonetaryBarChart"
import { SocioV2BreakdownList } from "@/components/gdcv/SocioV2BreakdownList"
import { SocioV2EnCursoBadge } from "@/components/gdcv/socio-v2-en-curso-badge"
import {
  getSocioV2ChartSubtitle,
  getSocioV2ChartTitle,
  SOCIO_V2_RANGE_TABS,
  SOCIO_V2_UNIT_TABS,
  type SocioV2Unit,
} from "@/components/gdcv/socio-v2-constants"
import { Card } from "@/components/ui/card"
import { KpiPrimaryCompact } from "@/components/ui/kpi-primary-compact"
import { SectionHeader } from "@/components/ui/section-header"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import {
  getSocioAhorroEnergiaSeries,
  getSocioAhorroSeries,
  socioStatListV2Dinero,
  socioStatListV2Energia,
  socioV2AhorroSparkline,
  socioV2EnergiaSparkline,
  socioV2PanelKpis,
} from "@/data/gdcv-socio-mock"
import { socioAhorroStackChartConfig } from "@/data/chart-config"
import type { ChartRangeChip } from "@/types/chart-range"
import { WalletIcon, ZapIcon } from "lucide-react"

export function SocioEnergyViewV2() {
  const [chartRange, setChartRange] = useState<ChartRangeChip>("6m")
  const [chartUnit, setChartUnit] = useState<SocioV2Unit>("dinero")
  const [breakdownUnit, setBreakdownUnit] = useState<SocioV2Unit>("dinero")

  const chartData = useMemo(() => {
    return chartUnit === "dinero"
      ? getSocioAhorroSeries(chartRange)
      : getSocioAhorroEnergiaSeries(chartRange)
  }, [chartRange, chartUnit])

  const breakdownItems = useMemo(
    () =>
      breakdownUnit === "dinero"
        ? socioStatListV2Dinero
        : socioStatListV2Energia,
    [breakdownUnit]
  )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_420px]">
      {/* Left card — mockup: title/subtitle left, range + unit toggle right */}
      <Card className="h-full overflow-hidden rounded-xl bg-white py-0 shadow-xs ring-0">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex min-w-0 flex-col gap-1">
              <h3 className="text-lg font-semibold leading-snug text-foreground">
                {getSocioV2ChartTitle(chartUnit)}
              </h3>
              <p className="text-sm font-normal text-muted-foreground">
                {getSocioV2ChartSubtitle(chartRange)}
              </p>
            </div>

            <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
              <TabsForBlocks
                variant="icon"
                tabs={[...SOCIO_V2_UNIT_TABS]}
                value={chartUnit}
                onValueChange={(v) => setChartUnit(v as SocioV2Unit)}
              />
              <TabsForBlocks
                className="min-w-0 flex-1 sm:flex-initial"
                tabs={SOCIO_V2_RANGE_TABS}
                value={chartRange}
                onValueChange={(v) => setChartRange(v as ChartRangeChip)}
              />
            </div>
          </div>

          <MonetaryBarChart
            data={chartData}
            chartConfig={socioAhorroStackChartConfig}
            unit={chartUnit}
            className="aspect-auto h-[280px] w-full [&_.recharts-responsive-container]:!h-full"
          />
        </div>
      </Card>

      {/* Right panel — header + KPIs libres; card solo para desglose */}
      <div className="flex flex-col gap-5 lg:gap-6">
        <SectionHeader
          size="md"
          title={socioV2PanelKpis.periodLabel}
          action={<SocioV2EnCursoBadge />}
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
          <div className="p-4 lg:p-6">
            <SocioV2BreakdownList
              items={breakdownItems}
              unit={breakdownUnit}
              onUnitChange={setBreakdownUnit}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
