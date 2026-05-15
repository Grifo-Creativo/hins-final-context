// components/charts/RoiRecoveryLineChart.tsx
"use client"

import { useMemo } from "react"

import type { ChartConfig } from "@/components/ui/chart"
import type { RoiCurvePoint } from "@/data/gdd-roi-mock"
import {
  convertRoiCurveToProjectionData,
  inferFechaHoyFromCurve,
  parseRoiLabelToFecha,
} from "@/lib/roi-curve-to-projection"
import { cn } from "@/lib/utils"

import { ROIProjectionChart } from "./ROIProjectionChart"

export type RoiRecoveryLineChartProps = {
  data: RoiCurvePoint[]
  chartConfig: ChartConfig
  /** Miles de ARS (misma unidad que la curva en mocks); se convierte a pesos para el chart de proyección. */
  investmentReference: number
  /** @deprecated Se mantiene por compatibilidad; las fechas de recupero salen de las series. */
  paybackPoint?: { label: string; value: number } | null
  scenarioSpread?: number
  /** @deprecated El chart unificado formatea el eje internamente. */
  formatYValue?: (value: number) => string
  className?: string
  showOptimistArea?: boolean
  showRangeChips?: boolean
  rangoAnios?: 1 | 3 | 5 | 7 | "todo"
}

export function RoiRecoveryLineChart({
  data,
  chartConfig: _chartConfig,
  investmentReference,
  paybackPoint: _paybackPoint,
  scenarioSpread = 0.14,
  formatYValue: _formatYValue,
  className,
  showOptimistArea = true,
  showRangeChips = true,
  rangoAnios = "todo",
}: RoiRecoveryLineChartProps) {
  void _chartConfig
  void _paybackPoint
  void _formatYValue

  const fechas = useMemo(
    () => data.map((d, i) => parseRoiLabelToFecha(d.label, i)),
    [data]
  )

  const projectionData = useMemo(
    () => convertRoiCurveToProjectionData(data, { scenarioSpread }),
    [data, scenarioSpread]
  )

  const fechaHoy = useMemo(
    () => inferFechaHoyFromCurve(data, fechas),
    [data, fechas]
  )

  const inversionMeta = investmentReference * 1000

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Sin datos para la curva de recuperación.
      </p>
    )
  }

  return (
    <div
      className={cn("w-full", className)}
      aria-label="Gráfico de curva de recuperación acumulada: real hasta hoy y proyección Base, Optimista y Conservador."
    >
      <ROIProjectionChart
        data={projectionData}
        inversionMeta={inversionMeta}
        fechaHoy={fechaHoy}
        rangoAnios={rangoAnios}
        showRangeChips={showRangeChips}
        showScenarioBands={showOptimistArea}
      />
    </div>
  )
}
