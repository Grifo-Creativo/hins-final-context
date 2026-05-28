// components/gdcv/GdcvRoiView.tsx
"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import {
  GddRoiRecuperoTable,
  type GddRoiCurrency,
} from "@/components/gdd/GddRoiRecuperoTable"
import { Card } from "@/components/ui/card"
import { KpiProgressBar } from "@/components/ui/kpi-progress-bar"
import { KpiSecondaryMetric } from "@/components/ui/kpi-secondary-metric"
import { KpiWithAsset } from "@/components/ui/kpi-with-asset"
import { KpiWithTimeline } from "@/components/ui/kpi-with-timeline"

import {
  gdcvRoiHistorico,
  gdcvRoiKpis,
  gdcvRoiProyectado,
} from "@/data/gdcv-agc-mock"
import { TIPO_CAMBIO_ARS } from "@/data/gdd-roi-mock"
import { useIsMobile } from "@/hooks/use-is-mobile"
import {
  formatCurrency,
  formatRoiFromUsdResponsive,
} from "@/lib/format-currency"

export function GdcvRoiView() {
  const searchParams = useSearchParams()
  const currency = (searchParams.get("currency") ?? "usd") as GddRoiCurrency
  const isMobile = useIsMobile()
  const [tablaTab, setTablaTab] = useState<"proyectado" | "historico">("proyectado")

  const fmt = (valueUsd: number, desktopMode: "full" | "axis" = "full") =>
    formatRoiFromUsdResponsive(
      valueUsd,
      currency,
      TIPO_CAMBIO_ARS,
      isMobile,
      desktopMode
    )

  const pct = gdcvRoiKpis.porcentajeRecuperado
  const totalInvertidoCompact = fmt(gdcvRoiKpis.totalInvertido, "axis")

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_auto]">
        <KpiWithAsset
          label="Inversión Recuperada"
          value={fmt(gdcvRoiKpis.inversionRecuperada)}
          asset={
            <KpiProgressBar
              percent={pct}
              bottomLabels={{
                left: { value: formatCurrency(0, currency) },
                right: {
                  label: "Total Invertido:",
                  value: fmt(gdcvRoiKpis.totalInvertido),
                },
              }}
            />
          }
          bottomLabel="Pendiente de recuperar"
          bottomValue={fmt(gdcvRoiKpis.pendienteRecuperar)}
        />

        <KpiWithTimeline
          label="Recupero Estimado"
          value={gdcvRoiKpis.recuperoEstimado}
          metricBadge="Payback"
          timelineData={gdcvRoiKpis.timeline}
        />

        <Card className="flex h-full min-h-0 flex-col bg-white p-6 shadow-xs ring-0 rounded-xl">
          <div className="grid min-h-0 flex-1 grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-6 lg:content-between">
            <KpiSecondaryMetric
              label="TIR"
              value={gdcvRoiKpis.tir}
              size="standard"
              valueClassName="text-green-600"
              className="min-w-0"
            />
            <KpiSecondaryMetric
              label="Plazo"
              value={gdcvRoiKpis.plazo}
              size="standard"
              className="min-w-0 lg:items-start lg:text-left items-center text-center"
            />
            <KpiSecondaryMetric
              label="Invertido"
              value={totalInvertidoCompact}
              size="standard"
              className="min-w-0 items-end text-right lg:items-start lg:text-left"
            />
          </div>
        </Card>
      </div>

      <GddRoiRecuperoTable
        variant={tablaTab}
        onVariantChange={setTablaTab}
        currency={currency}
        proyectadoData={gdcvRoiProyectado}
        historicoData={gdcvRoiHistorico}
        tipoCambio={TIPO_CAMBIO_ARS}
      />
    </div>
  )
}
