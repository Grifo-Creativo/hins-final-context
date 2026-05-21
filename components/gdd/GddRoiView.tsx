// components/gdd/GddRoiView.tsx
"use client"

import { RoiRecoveryLineChart } from "@/components/charts/RoiRecoveryLineChart"
import { Card } from "@/components/ui/card"
import { CardWithContent } from "@/components/ui/card-with-content"
import { SoftBadge } from "@/components/ui/soft-badge"
import { KpiWithTimeline } from "@/components/ui/kpi-with-timeline"
import { roiRecoveryChartConfig } from "@/data/chart-config"
import {
  curvaRecuperacionData,
  curvaRecuperacionInversion,
  roiKpis,
} from "@/data/gdcv-agc-mock"
import { DollarSignIcon, TrendingUpIcon } from "lucide-react"

export function GddRoiView() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Block 1 — ROI KPIs */}
      <div className="grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Col 1 — Inversión + Ahorrado en una card */}
        <Card className="flex h-full min-h-0 flex-col bg-white py-0 shadow-xs ring-0 rounded-xl">
          <div className="flex min-h-0 flex-1 flex-col gap-6 p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-md bg-background-subtle text-green-600">
                  <TrendingUpIcon className="size-5" aria-hidden />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-sm font-normal text-[#737373]">Inversión Inicial</p>
                  <p className="text-xl font-semibold text-[#0A0A0A] tabular-nums">
                    {roiKpis.inversionInicial}
                  </p>
                </div>
              </div>
              <SoftBadge className="flex-shrink-0">Marzo 2024</SoftBadge>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-md bg-background-subtle text-green-600">
                <DollarSignIcon className="size-5" aria-hidden />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-sm font-normal text-[#737373]">Ahorrado Total Acumulado</p>
                <p className="text-xl font-semibold text-[#0A0A0A] tabular-nums">
                  {roiKpis.ahorradoTotal}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Col 2 — métricas arriba, barra al borde inferior (mt-auto; sin flex-1 vacío) */}
        <Card className="flex h-full min-h-0 flex-col bg-white p-6 shadow-xs ring-0 rounded-xl">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Cap. Recuperado</p>
                <p className="text-xl font-semibold text-foreground tabular-nums">
                  {roiKpis.capRecuperado}
                </p>
              </div>

              <div className="flex flex-col gap-1 items-end">
                <p className="text-sm text-muted-foreground">Pendiente</p>
                <p className="text-xl font-semibold text-foreground tabular-nums">
                  {roiKpis.pendiente}
                </p>
              </div>
            </div>

            <div className="mt-auto flex shrink-0 flex-col gap-2">
              <p className="text-left text-sm text-muted-foreground">
                {roiKpis.porcentajeRecuperado}% recuperado
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${roiKpis.porcentajeRecuperado}%`,
                    backgroundColor: "var(--chart-3)",
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Col 3 — Recupero Estimado con Timeline */}
        <KpiWithTimeline
          label="Recupero Estimado"
          value={roiKpis.recuperoEstimado}
          metricBadge={`TIR ${roiKpis.tir}`}
          timelineData={{
            inicio: roiKpis.timeline.inicio,
            hoy: roiKpis.timeline.hoy,
            payback: roiKpis.timeline.payback,
          }}
        />
      </div>

      {/* Block 2 — Curva */}
      <CardWithContent
        title="Curva de Recuperación Acumulada"
      >
        <RoiRecoveryLineChart
          data={curvaRecuperacionData}
          chartConfig={roiRecoveryChartConfig}
          investmentReference={curvaRecuperacionInversion}
        />
      </CardWithContent>
    </div>
  )
}
