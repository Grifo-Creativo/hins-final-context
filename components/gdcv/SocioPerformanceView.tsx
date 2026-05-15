// components/gdcv/SocioPerformanceView.tsx
"use client"

import { useMemo, useState } from "react"

import { ParkEnergyBarChart } from "@/components/charts/ParkEnergyBarChart"
import { GenerationSparkline } from "@/components/charts/GenerationSparkline"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CardWithContent } from "@/components/ui/card-with-content"
import { FeatureItem } from "@/components/ui/feature-item"
import { IconBadge } from "@/components/ui/icon-badge"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SoftBadge } from "@/components/ui/soft-badge"
import { gdcvEnergyBarChartConfig, generationSparklineConfig } from "@/data/chart-config"
import {
  getSocioParqueSeries,
  getSocioParqueChartSubtitle,
  socioEnergiaPark,
  socioEnergiaParkSparkline,
  socioPotenciaInstalada,
  socioPotenciaAcople,
  participacionChartData,
  participacionSocios,
  socioTotalParticipantes,
} from "@/data/gdcv-socio-mock"
import type { ChartRangeChip } from "@/types/chart-range"
import { CircleDollarSignIcon, XIcon, ZapIcon } from "lucide-react"
import { Cell, Pie, PieChart, Tooltip, type TooltipContentProps } from "recharts"

const PERIOD_TABS = [
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
]

const PIE_CX = 80
const PIE_CY = 80

function renderParticipacionPieTooltip(props: TooltipContentProps) {
  if (!props.active || !props.payload?.length) return null
  const item = props.payload[0]
  const datum = item.payload as { name?: string; value?: number } | undefined
  const name = item.name ?? datum?.name
  const valueRaw = item.value ?? datum?.value
  const value = typeof valueRaw === "number" ? valueRaw : Number(valueRaw)
  if (name == null || Number.isNaN(value)) return null

  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-foreground">{String(name)}</p>
      <p className="text-muted-foreground">{value}% participación</p>
    </div>
  )
}

function ParticipacionDonut({
  cellKeyPrefix,
}: {
  cellKeyPrefix: string
}) {
  return (
    <div className="flex justify-center">
      <div className="relative flex items-center justify-center">
        <PieChart width={160} height={160} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={participacionChartData}
            cx={PIE_CX}
            cy={PIE_CY}
            innerRadius={50}
            outerRadius={72}
            paddingAngle={0}
            dataKey="value"
            strokeWidth={0}
          >
            {participacionChartData.map((entry, index) => (
              <Cell key={`${cellKeyPrefix}-${entry.name}-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={renderParticipacionPieTooltip} />
        </PieChart>

        <div className="pointer-events-none absolute text-center">
          <p className="text-lg font-semibold leading-none text-foreground">{socioTotalParticipantes}</p>
          <p className="text-xs text-muted-foreground">socios</p>
        </div>
      </div>
    </div>
  )
}

export function SocioPerformanceView() {
  const [chartRange, setChartRange] = useState<ChartRangeChip>("6m")
  const [sheetOpen, setSheetOpen] = useState(false)

  const chartData = useMemo(() => getSocioParqueSeries(chartRange), [chartRange])
  const chartSubtitle = getSocioParqueChartSubtitle(chartRange)
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left — Energía generada del parque */}
        <CardWithContent
          title="Energía generada del parque"
          subtitle={chartSubtitle}
          tabs={PERIOD_TABS}
          defaultTab="6m"
          onTabChange={(v) => setChartRange(v as ChartRangeChip)}
          className="h-full"
        >
          <div className="flex flex-1 flex-col gap-4">
            <ParkEnergyBarChart data={chartData} chartConfig={gdcvEnergyBarChartConfig} />

            <div className="flex flex-1 gap-4">
              <div className="flex-1">
                <FeatureItem
                  label="Potencia Instalada"
                  value={socioPotenciaInstalada}
                  icon={CircleDollarSignIcon}
                />
              </div>
              <div className="flex-1">
                <FeatureItem
                  label="Potencia de Acople"
                  value={socioPotenciaAcople}
                  icon={ZapIcon}
                />
              </div>
            </div>

            <div className="flex flex-1 gap-4">
              <div className="flex-1">
                <FeatureItem label="--" value="--" icon={CircleDollarSignIcon} />
              </div>
              <div className="flex-1">
                <FeatureItem label="--" value="--" icon={ZapIcon} />
              </div>
            </div>
          </div>
        </CardWithContent>

        {/* Right — Resumen del Parque */}
        <div className="flex flex-col gap-4">
          <Card className="bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-start gap-4">
                <IconBadge icon={ZapIcon} size="lg" />
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-lg font-semibold text-[#0A0A0A]">Generada en Abril</p>
                  <p className="text-4xl font-bold text-[#0A0A0A]">
                    {socioEnergiaPark.value}
                    <span className="ml-1 text-xl font-semibold">{socioEnergiaPark.unit}</span>
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

          {/* Participación por Socio */}
          <CardWithContent title="Participación por Socio" className="h-fit">
            <div className="flex flex-col gap-4">
              <ParticipacionDonut cellKeyPrefix="card" />

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

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex h-full max-h-dvh w-full max-w-sm flex-col gap-0 overflow-hidden p-0"
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <SheetHeader className="shrink-0 space-y-0 p-6 text-left">
              <div className="flex flex-row items-start justify-between gap-4">
                <SheetTitle className="pr-2 text-2xl font-semibold leading-tight text-foreground">
                  Participación por Socio
                </SheetTitle>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8 shrink-0 shadow-xs"
                    aria-label="Cerrar"
                  >
                    <XIcon className="size-4" aria-hidden />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-6 p-6 pt-0">
                <ParticipacionDonut cellKeyPrefix="sheet" />

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
                          <span className="text-xs text-muted-foreground">(tú)</span>
                        ) : null}
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                        {socio.participacion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-border bg-popover p-6">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setSheetOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
