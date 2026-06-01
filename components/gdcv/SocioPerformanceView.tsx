// components/gdcv/SocioPerformanceView.tsx
"use client"

import { useMemo, useState } from "react"

import { DailyGenerationChartBlock } from "@/components/charts/DailyGenerationChartBlock"
import { ParkEnergyBarChart } from "@/components/charts/ParkEnergyBarChart"
import { GenerationSparkline } from "@/components/charts/GenerationSparkline"
import { ParticipacionDonutChart } from "@/components/charts/ParticipacionDonutChart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CardWithContent } from "@/components/ui/card-with-content"
import { CardWithResponsiveTabs } from "@/components/ui/card-with-responsive-tabs"
import { SOCIO_PARQUE_TOP_ROW_GRID } from "@/components/ui/performance-placeholder-card"
import { FeatureItem } from "@/components/ui/feature-item"
import { IconBadge } from "@/components/ui/icon-badge"
import { SheetContentDetail } from "@/components/ui/sheet-ops"
import { Label } from "@/components/ui/label"
import { SoftBadge } from "@/components/ui/soft-badge"
import { Switch } from "@/components/ui/switch"
import {
  gdcvEnergyBarChartConfig,
  generationSparklineConfig,
  parkEnergyShareChartConfig,
} from "@/data/chart-config"
import {
  getSocioParqueSeries,
  getSocioParqueShareSeries,
  getSocioParqueChartSubtitle,
  getSocioParqueDailySeries,
  getSocioParqueDailyTotal,
  getSocioParqueDailyPeak,
  socioMockToday,
  socioEnergiaPark,
  socioEnergiaParkSparkline,
  socioParqueChartMetricRows,
  participacionSocios,
} from "@/data/gdcv-socio-mock"
import { CHART_RANGE_TABS } from "@/components/gdd/chart-range-options"
import { formatChartDayLong, formatDailyPeakLabel } from "@/lib/chart-day-format"
import type { ChartRangeChip } from "@/types/chart-range"
import {
  CircleDollarSignIcon,
  CalendarIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

const TODAY = socioMockToday

/** Íconos FeatureItem — ver `components.md` → FeatureItem → Íconos (lucide). */
const SOCIO_PARQUE_FEATURE_ICONS: Record<string, LucideIcon> = {
  "Potencia total instalada": ZapIcon,
  "Potencia total de acople": ZapIcon,
  "Inversión inicial": CircleDollarSignIcon,
  "Inicio de operaciones": CalendarIcon,
}

export function SocioPerformanceView() {
  const [chartRange, setChartRange] = useState<ChartRangeChip>("6m")
  const [activeDay, setActiveDay] = useState<Date>(TODAY)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [showMiParte, setShowMiParte] = useState(false)

  const chartData = useMemo(
    () => (chartRange === "1d" ? [] : getSocioParqueSeries(chartRange)),
    [chartRange]
  )

  const chartShareData = useMemo(
    () => (chartRange === "1d" ? [] : getSocioParqueShareSeries(chartRange)),
    [chartRange]
  )

  const dailyChartData = useMemo(
    () => getSocioParqueDailySeries(activeDay),
    [activeDay]
  )

  const dailyTotal = useMemo(
    () => getSocioParqueDailyTotal(activeDay),
    [activeDay]
  )

  const dailyPeak = useMemo(
    () => getSocioParqueDailyPeak(activeDay),
    [activeDay]
  )

  const chartSubtitle =
    chartRange === "1d"
      ? formatChartDayLong(activeDay)
      : getSocioParqueChartSubtitle(chartRange)

  const parkSparkline = useMemo(
    () => socioEnergiaParkSparkline.map((d, i) => ({ i, value: d.value })),
    []
  )

  const legendPreview = useMemo(() => {
    const current = participacionSocios.find((s) => s.isCurrent)
    const rest = participacionSocios.filter((s) => !s.isCurrent).slice(0, 2)
    return current ? [current, ...rest] : participacionSocios.slice(0, 3)
  }, [])

  return (
    <>
      <div className={SOCIO_PARQUE_TOP_ROW_GRID}>
        <CardWithResponsiveTabs
          title="Energía generada del parque"
          subtitle={chartRange === "1d" ? undefined : chartSubtitle}
          tabs={CHART_RANGE_TABS}
          activeTab={chartRange}
          defaultTab="6m"
          onTabChange={(v) => setChartRange(v as ChartRangeChip)}
          className="h-full"
          headerActionsBeforeRangeTabs
          headerActions={
            <div className="flex items-center gap-2 sm:gap-4">
              <Label
                htmlFor="socio-parque-mi-parte"
                className="gap-1.5 text-sm font-medium text-muted-foreground"
              >
                {showMiParte ? (
                  <span
                    className="size-2 shrink-0 rounded-sm"
                    style={{ backgroundColor: "var(--chart-stack-inyectada)" }}
                    aria-hidden
                  />
                ) : null}
                Mi parte
              </Label>
              <Switch
                id="socio-parque-mi-parte"
                checked={showMiParte}
                onCheckedChange={setShowMiParte}
                disabled={chartRange === "1d"}
                aria-label="Mostrar mi parte de la energía generada del parque"
              />
            </div>
          }
          mobileContentAfterTabs={
            <div className="flex flex-col gap-4">
              {socioParqueChartMetricRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid shrink-0 grid-cols-2 gap-4"
                >
                  {row.map((metric) => (
                    <FeatureItem
                      key={metric.label}
                      label={metric.label}
                      value={metric.value}
                      icon={SOCIO_PARQUE_FEATURE_ICONS[metric.label]}
                    />
                  ))}
                </div>
              ))}
            </div>
          }
        >
          <div className="flex h-full min-h-0 flex-col gap-4">
            {chartRange === "1d" ? (
              <div className="min-h-[300px] w-full flex-1">
                <DailyGenerationChartBlock
                  activeDay={activeDay}
                  today={TODAY}
                  onActiveDayChange={setActiveDay}
                  data={dailyChartData}
                  totalLabel={dailyTotal}
                  peakLabel={formatDailyPeakLabel(dailyPeak.value, dailyPeak.hour)}
                  className="h-full min-h-[300px] w-full"
                />
              </div>
            ) : (
              <div className="min-h-[300px] w-full flex-1">
                {showMiParte ? (
                  <ParkEnergyBarChart
                    variant="share"
                    data={chartShareData}
                    chartConfig={parkEnergyShareChartConfig}
                    className="h-full min-h-[300px]"
                  />
                ) : (
                  <ParkEnergyBarChart
                    data={chartData}
                    chartConfig={gdcvEnergyBarChartConfig}
                    className="h-full min-h-[300px]"
                  />
                )}
              </div>
            )}

            {/* FeatureItems — visible solo en desktop (≥640px) */}
            <div className="hidden sm:flex sm:flex-col gap-4">
              {socioParqueChartMetricRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid shrink-0 grid-cols-2 gap-4"
                >
                  {row.map((metric) => (
                    <FeatureItem
                      key={metric.label}
                      label={metric.label}
                      value={metric.value}
                      icon={SOCIO_PARQUE_FEATURE_ICONS[metric.label]}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardWithResponsiveTabs>

        <div className="flex h-full min-h-0 flex-col gap-4">
          <Card className="shrink-0 overflow-hidden rounded-xl bg-white py-0 shadow-xs ring-0">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-start gap-4">
                <IconBadge icon={ZapIcon} size="lg" />
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-lg font-semibold text-[#0A0A0A]">
                    Generada en Abril
                  </p>
                  <p className="text-4xl font-bold text-[#0A0A0A]">
                    {socioEnergiaPark.value}
                    <span className="ml-1 text-xl font-semibold">
                      {socioEnergiaPark.unit}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mx-[-16px]">
                <GenerationSparkline
                  data={parkSparkline}
                  chartConfig={generationSparklineConfig}
                  className="aspect-auto h-14 w-full"
                />
              </div>
              <SoftBadge>{socioEnergiaPark.delta}</SoftBadge>
            </div>
          </Card>

          <CardWithContent
            title="Participación por Socio"
            className="flex min-h-0 flex-1 flex-col"
            allowTooltipOverflow
          >
            <div className="flex flex-col gap-4">
              <ParticipacionDonutChart cellKeyPrefix="card" />

              <div className="flex flex-col">
                {legendPreview.map((socio) => (
                  <div
                    key={socio.nombre}
                    className="flex items-center justify-between border-b border-border py-2.5 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="size-2 shrink-0 rounded-sm"
                        style={{ backgroundColor: socio.color }}
                      />
                      <span
                        className={
                          socio.isCurrent
                            ? "text-sm font-semibold text-foreground"
                            : "text-sm font-medium text-foreground"
                        }
                      >
                        {socio.nombre}
                      </span>
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                      {socio.participacion}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full shadow-xs"
                aria-label="Ver todos los socios"
                onClick={() => setSheetOpen(true)}
              >
                Ver todos los socios
              </Button>
            </div>
          </CardWithContent>
        </div>
      </div>

      <SheetContentDetail
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Participación por Socio"
        scrollVariant="flush"
      >
        <div className="flex flex-col gap-4 sm:gap-6 p-6 pt-0">
                <ParticipacionDonutChart cellKeyPrefix="sheet" />

                <div className="flex flex-col">
                  {participacionSocios.map((socio) => (
                    <div
                      key={socio.nombre}
                      className="flex items-center justify-between border-b border-border py-3 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="size-2 shrink-0 rounded-sm"
                          style={{ backgroundColor: socio.color }}
                        />
                        <span
                          className={
                            socio.isCurrent
                              ? "text-sm font-semibold text-foreground"
                              : "text-sm font-medium text-foreground"
                          }
                        >
                          {socio.nombre}
                        </span>
                        {socio.isCurrent ? (
                          <span className="text-xs text-muted-foreground">
                            (tú)
                          </span>
                        ) : null}
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                        {socio.participacion}
                      </span>
                    </div>
                  ))}
                </div>
        </div>
      </SheetContentDetail>
    </>
  )
}
