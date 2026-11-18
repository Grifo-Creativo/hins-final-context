// components/gdd/RoiRealizadoContent.tsx
"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { TriangleAlertIcon } from "lucide-react"

import { BloqueConError } from "@/components/ingresos/BloqueConError"
import { EstadoNulo } from "@/components/ingresos/EstadoNulo"
import { GddRoiRecuperoTable, type GddRoiCurrency } from "@/components/gdd/GddRoiRecuperoTable"
import { ROIProjectionChart } from "@/components/charts/ROIProjectionChart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { CardWithContent } from "@/components/ui/card-with-content"
import { KpiProgressBar } from "@/components/ui/kpi-progress-bar"
import { KpiSecondaryMetric } from "@/components/ui/kpi-secondary-metric"
import { KpiWithAsset } from "@/components/ui/kpi-with-asset"
import { KpiWithTimeline } from "@/components/ui/kpi-with-timeline"
import type { GddRoiProyectadoRow, ROIDataPoint } from "@/data/gdd-roi-mock"
import { useIsMobile } from "@/hooks/use-is-mobile"
import type { RoiRealizado } from "@/lib/api/types"
import { formatCurrency, formatRoiFromUsdResponsive } from "@/lib/format-currency"
import { formatPeriodoLabel } from "@/lib/format-periodo"
import type { BloqueIngresos } from "@/lib/ingresos-bloque"
import { buildHistoricoRealRows, buildRoiChartData, buildRoiRealizadoView } from "@/lib/roi-realizado"

const NO_DISPONIBLE = "No disponible"

interface RoiRealizadoContentProps {
  /** ROI realizado (GET /roi/realizado). Falla aislada: no tumba la pantalla. */
  roi: BloqueIngresos<RoiRealizado>
  /** Tabla Proyectado: sin dato real (FR-018), se mantiene el mock estimativo. */
  proyectadoData?: GddRoiProyectadoRow[]
  /** Escenarios de la curva: estimativos, encadenados desde el último valor real. */
  proyeccionMock: ROIDataPoint[]
}

export function RoiRealizadoContent({ roi, proyectadoData, proyeccionMock }: RoiRealizadoContentProps) {
  const searchParams = useSearchParams()
  const currency = (searchParams.get("currency") ?? "usd") as GddRoiCurrency
  const isMobile = useIsMobile()
  const [tablaTab, setTablaTab] = useState<"proyectado" | "historico">("historico")

  const data = roi.status === "ok" ? roi.data : null
  const view = useMemo(() => (data ? buildRoiRealizadoView(data) : null), [data])
  const historicoReal = useMemo(() => (data ? buildHistoricoRealRows(data) : undefined), [data])
  const chart = useMemo(() => (data ? buildRoiChartData(data, proyeccionMock) : null), [data, proyeccionMock])

  if (roi.status === "error") return <BloqueConError titulo="el recupero de la inversión" />
  if (roi.status === "sin-acceso") return <EstadoNulo variant="sin-acceso" />
  if (!view || !view.hayDatos || !historicoReal || !chart) return <EstadoNulo variant="sin-ingresos" />

  // Importes ya expresados en la moneda elegida (tipo de cambio 1): la conversión por mes la hizo el backend.
  const fmt = (amount: number, mode: "full" | "axis" = "full") =>
    formatRoiFromUsdResponsive(amount, currency, 1, isMobile, mode)

  const recuperado = currency === "ars" ? view.recuperadoArs : view.recuperadoUsd
  // Meta y pendiente están en USD: en ARS se usa el último tipo de cambio REAL disponible.
  const aMoneda = (usd: number | null): number | null =>
    usd === null ? null : currency === "ars" ? (view.tipoCambioActual === null ? null : usd * view.tipoCambioActual) : usd
  const totalInvertido = aMoneda(view.totalInvertidoUsd)
  const pendiente = aMoneda(view.pendienteUsd)
  const fmtOrDash = (amount: number | null, mode: "full" | "axis" = "full") => (amount === null ? "—" : fmt(amount, mode))

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      {view.mesesSinTipoCambio.length > 0 && (
        <Alert variant="warning">
          <TriangleAlertIcon aria-hidden="true" />
          <AlertTitle>Recupero incompleto</AlertTitle>
          <AlertDescription>
            Sin tipo de cambio para {view.mesesSinTipoCambio.map(formatPeriodoLabel).join(", ")}. Esos meses no suman al
            acumulado en USD y no se estima su valor; en pesos sí están incluidos.
          </AlertDescription>
        </Alert>
      )}
      {view.sinInversionMeta && <EstadoNulo variant="sin-inversion-meta" />}

      <div className="grid min-h-0 grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1fr_1fr_auto]">
        <KpiWithAsset
          label="Inversión Recuperada"
          value={fmt(recuperado)}
          asset={
            <KpiProgressBar
              percent={view.porcentaje ?? 0}
              bottomLabels={{
                left: { value: formatCurrency(0, currency) },
                right: { label: "Total Invertido:", value: fmtOrDash(totalInvertido) },
              }}
            />
          }
          bottomLabel="Pendiente de recuperar"
          bottomValue={fmtOrDash(pendiente)}
        />

        {/* Payback, plazo y TIR proyectada: sin dato real (FR-018). */}
        <KpiWithTimeline
          label="Recupero Estimado"
          value={NO_DISPONIBLE}
          metricBadge="Payback"
          timelineData={{
            inicio: { label: "Inicio", fecha: view.timeline.inicio },
            hoy: { label: "Hoy", fecha: view.timeline.hoy, pct: view.timeline.pct ?? 0, elapsedYears: view.timeline.anios },
            payback: { label: "Payback", fecha: "—" },
          }}
        />

        <Card className="flex h-full min-h-0 flex-col bg-white p-6 shadow-xs ring-0 rounded-xl">
          <div className="grid min-h-0 flex-1 grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-6 lg:content-between">
            <KpiSecondaryMetric label="TIR" value={NO_DISPONIBLE} size="standard" className="min-w-0" />
            <KpiSecondaryMetric
              label="Plazo"
              value={NO_DISPONIBLE}
              size="standard"
              className="min-w-0 lg:items-start lg:text-left items-center text-center"
            />
            <KpiSecondaryMetric
              label="Invertido"
              value={fmtOrDash(totalInvertido, "axis")}
              size="standard"
              className="min-w-0 items-end text-right lg:items-start lg:text-left"
            />
          </div>
        </Card>
      </div>

      {tablaTab === "proyectado" && (
        <p role="note" className="text-sm text-muted-foreground">
          Proyección estimativa: sin datos reales todavía (valores de ejemplo).
        </p>
      )}
      <GddRoiRecuperoTable
        variant={tablaTab}
        onVariantChange={setTablaTab}
        currency={currency}
        proyectadoData={proyectadoData}
        historicoReal={historicoReal}
      />

      <CardWithContent title="Curva de Recuperación" className="flex min-h-0 flex-col">
        {totalInvertido === null || view.totalInvertidoUsd === null ? (
          <EstadoNulo variant="sin-inversion-meta" />
        ) : (
          <>
            <p role="note" className="mb-2 text-xs text-muted-foreground">
              Tramo histórico real; los escenarios son estimativos (sin datos reales).
            </p>
            <ROIProjectionChart
              data={chart.data}
              inversionMeta={view.totalInvertidoUsd}
              fechaHoy={chart.fechaHoy}
              showRangeChips={true}
              showScenarioBands={true}
              className="h-full min-h-[420px] w-full"
            />
          </>
        )}
      </CardWithContent>
    </div>
  )
}
