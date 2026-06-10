// components/gdcv/SocioRoiView.tsx
"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HandCoinsIcon, TrendingUpIcon } from "lucide-react"

import {
  GddRoiRecuperoTable,
  type GddRoiCurrency,
  type GddRoiTableVariant,
} from "@/components/gdd/GddRoiRecuperoTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { KpiProgressBar } from "@/components/ui/kpi-progress-bar"
import { KpiSecondaryMetric } from "@/components/ui/kpi-secondary-metric"
import { KpiWithAsset } from "@/components/ui/kpi-with-asset"
import { KpiWithTimeline } from "@/components/ui/kpi-with-timeline"
import { SectionHeader } from "@/components/ui/section-header"
import { RoiCurrencyTabs } from "@/components/ui/roi-currency-tabs"
import { SheetContentTable } from "@/components/ui/sheet-ops"
import { ROIProjectionChart } from "@/components/charts/ROIProjectionChart"
import {
  socioRoiHistorico,
  socioRoiKpis,
  socioRoiProjectionData,
  socioRoiProyectado,
  SOCIO_ROI_FECHA_HOY,
} from "@/data/gdcv-socio-mock"
import { TIPO_CAMBIO_ARS } from "@/data/gdd-roi-mock"
import { useIsMobile } from "@/hooks/use-is-mobile"
import {
  formatCurrency,
  formatRoiFromUsdResponsive,
} from "@/lib/format-currency"

/** Col 3 = 340px — alineado a `SOCIO_ENERGY_TOP_ROW_GRID` (panel Abril arriba). */
const SOCIO_ROI_KPI_GRID =
  "grid min-h-0 grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_340px]"

export function SocioRoiView() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currency = (searchParams.get("currency") ?? "usd") as GddRoiCurrency
  const isMobile = useIsMobile()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [chartSheetOpen, setChartSheetOpen] = useState(false)
  const [tablaTab, setTablaTab] = useState<GddRoiTableVariant>("proyectado")

  const fmt = (valueUsd: number, desktopMode: "full" | "axis" = "full") =>
    formatRoiFromUsdResponsive(
      valueUsd,
      currency,
      TIPO_CAMBIO_ARS,
      isMobile,
      desktopMode
    )

  function handleCurrencyChange(newCurrency: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (newCurrency === "usd") {
      params.delete("currency")
    } else {
      params.set("currency", newCurrency)
    }
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const pct = socioRoiKpis.porcentajeRecuperado
  const totalInvertidoAmount =
    currency === "ars"
      ? socioRoiKpis.totalInvertido * TIPO_CAMBIO_ARS
      : socioRoiKpis.totalInvertido
  const totalInvertidoDisplay = formatCurrency(
    totalInvertidoAmount,
    currency,
    "compact"
  )

  return (
    <>
      <section className="flex flex-col gap-4 sm:gap-6">
        <SectionHeader
          level="h2"
          title="Retorno de Inversión (ROI)"
          action={<RoiCurrencyTabs value={currency} onValueChange={handleCurrencyChange} />}
        />

        <div className={SOCIO_ROI_KPI_GRID}>
          <KpiWithAsset
            label="Inversión Recuperada"
            value={fmt(socioRoiKpis.inversionRecuperada)}
            asset={
              <KpiProgressBar
                percent={pct}
                bottomLabels={{
                  left: { value: formatCurrency(0, currency) },
                  right: {
                    label: "Total Invertido:",
                    value: fmt(socioRoiKpis.totalInvertido),
                  },
                }}
              />
            }
            bottomLabel="Pendiente de recuperar"
            bottomValue={fmt(socioRoiKpis.pendienteRecuperar)}
          />

          <KpiWithTimeline
            label="Recupero Estimado"
            value={socioRoiKpis.recuperoEstimado}
            metricBadge="Payback"
            timelineData={socioRoiKpis.timeline}
          />

          <Card className="flex h-full min-h-0 w-full flex-col bg-white p-6 shadow-xs ring-0 rounded-xl">
            <div className="flex min-h-0 flex-1 flex-col gap-4 lg:gap-6">
              <div className="grid grid-cols-3 lg:grid-cols-2 gap-4 lg:gap-x-6 lg:gap-y-6">
                <KpiSecondaryMetric
                  label="TIR"
                  value={socioRoiKpis.tir}
                  size="standard"
                  valueClassName="text-green-600"
                  className="min-w-0 items-start text-left"
                />
                <KpiSecondaryMetric
                  label="Plazo"
                  value={socioRoiKpis.plazo}
                  size="standard"
                  className="min-w-0 items-center text-center lg:items-start lg:text-left"
                />
                <KpiSecondaryMetric
                  label="Mi Inversión"
                  value={totalInvertidoDisplay}
                  size="standard"
                  className="min-w-0 items-end text-right lg:items-start lg:text-left"
                />
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full shadow-xs"
                  onClick={() => setSheetOpen(true)}
                >
                  <HandCoinsIcon aria-hidden />
                  ROI Tabla
                </Button>
                <Button
                  type="button"
                  className="w-full shadow-xs"
                  onClick={() => setChartSheetOpen(true)}
                >
                  <TrendingUpIcon aria-hidden />
                  ROI Gráfico
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Sheet 1: Tabla */}
      <SheetContentTable
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Tabla Recupero de Inversión"
        showFooter={false}
      >
        <GddRoiRecuperoTable
          layout="embedded"
          showColumnVisibility={false}
          variant={tablaTab}
          onVariantChange={setTablaTab}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          proyectadoData={socioRoiProyectado}
          historicoData={socioRoiHistorico}
          tipoCambio={TIPO_CAMBIO_ARS}
        />
      </SheetContentTable>

      {/* Sheet 2: Gráfico */}
      <SheetContentTable
        open={chartSheetOpen}
        onOpenChange={setChartSheetOpen}
        title="Gráfico Recupero de Inversión"
        showFooter={false}
      >
        <ROIProjectionChart
          data={socioRoiProjectionData}
          inversionMeta={socioRoiKpis.totalInvertido}
          fechaHoy={SOCIO_ROI_FECHA_HOY}
          showRangeChips={true}
          showScenarioBands={true}
          className="min-h-[420px] w-full"
        />
      </SheetContentTable>
    </>
  )
}
