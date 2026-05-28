// components/gdcv/SocioRoiView.tsx
"use client"

import { RoiRecoveryLineChart } from "@/components/charts/RoiRecoveryLineChart"
import { Card } from "@/components/ui/card"
import { KpiCard } from "@/components/ui/kpi-card"
import { KpiRoiCard } from "@/components/ui/kpi-roi-card"
import { KpiWithTimeline } from "@/components/ui/kpi-with-timeline"
import { roiRecoveryChartConfig } from "@/data/chart-config"
import {
  SOCIO_INVERSION_INICIAL_USD,
  SOCIO_INVERSION_REFERENCIA,
  socioCurvaRecuperacion,
  socioRoiMetrics,
  socioRoiSecondaryMetrics,
} from "@/data/gdcv-socio-mock"
import { DollarSignIcon, TrendingUpIcon } from "lucide-react"

export function SocioRoiView() {
  // Calcular métricas derivadas
  const inversionInicial = SOCIO_INVERSION_INICIAL_USD
  const capitalRecuperado = 2_130_000 // $2.13M (37% de inversión)
  const pendiente = inversionInicial - capitalRecuperado // $3.57M
  const porcentajeRecuperado = 37

  return (
    <div className="grid min-h-0 grid-cols-1 gap-6 md:grid-cols-2">
      {/* Col 1 — ROI KPIs con Cards individuales */}
      <div className="flex h-full flex-col gap-6">
        {/* Título fuera de la Card */}
        <h2 className="text-lg font-semibold text-foreground">
          Retorno de la Inversión (ROI)
        </h2>

        {/* Grid de Cards: KPI1 | KPI2 (2 cols), KPI3 (full width) */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
          {/* KPI 1 — Inversión + Ahorrado con Sparkline */}
          <KpiRoiCard
            items={[
              {
                icon: TrendingUpIcon,
                label: "Inversión Inicial",
                value: socioRoiMetrics.inversionInicial.value,
                badge: "Marzo 2024",
              },
              {
                icon: DollarSignIcon,
                label: socioRoiMetrics.totalAhorrado.label,
                value: socioRoiMetrics.totalAhorrado.value,
              },
            ]}
            sparklineData={[
              { value: 0.41 },
              { value: 0.65 },
              { value: 0.89 },
              { value: 1.22 },
              { value: 1.53 },
              { value: 2.13 },
            ]}
          />

          {/* KPI 2 — Recupero + Pendiente + % */}
          <KpiCard>
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Cap. Recuperado</p>
                  <p className="text-xl font-semibold text-foreground tabular-nums">
                    $2.13 M
                  </p>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  <p className="text-sm text-muted-foreground">Pendiente</p>
                  <p className="text-xl font-semibold text-foreground tabular-nums">
                    $3.57 M
                  </p>
                </div>
              </div>

              <div className="mt-auto flex shrink-0 flex-col gap-2">
                <p className="text-left text-sm text-muted-foreground">
                  {porcentajeRecuperado}% recuperado
                </p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${porcentajeRecuperado}%`,
                      backgroundColor: "var(--chart-3)",
                    }}
                  />
                </div>
              </div>
            </div>
          </KpiCard>

          {/* KPI 3 — Payback con Timeline (full width) */}
          <div className="col-span-1 min-h-0 sm:col-span-2">
            <KpiWithTimeline
              label="Payback Estimado"
              value={socioRoiMetrics.payback.value}
              metricBadge={`TIR ${socioRoiSecondaryMetrics.tir.value}`}
              timelineData={{
                inicio: { label: "Inicio", fecha: "Mar 2024" },
                hoy: {
                  label: "Hoy · 37%",
                  fecha: "Abr 2026",
                  pct: 37,
                  tooltipText: "Hoy · 2.1 años · 37% recuperado",
                },
                payback: { label: "Payback", fecha: "Dic 2029" },
              }}
            />
          </div>
        </div>
      </div>

      {/* Col 2 — Curva de Recuperación */}
      <div className="flex h-full flex-col gap-6">
        {/* Título fuera de la Card */}
        <h2 className="text-lg font-semibold text-foreground">
          Curva de Recuperación Acumulada
        </h2>

        {/* Card con el Chart */}
        <Card className="flex flex-1 min-h-0 flex-col bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden">
          <div className="p-4">
            <RoiRecoveryLineChart
              data={socioCurvaRecuperacion}
              chartConfig={roiRecoveryChartConfig}
              investmentReference={SOCIO_INVERSION_REFERENCIA}
              rangoAnios={5}
              showRangeChips={false}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
