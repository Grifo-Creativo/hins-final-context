// components/gdd/GddRoiView.tsx
"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { GddRoiRecuperoTable, type GddRoiCurrency } from "@/components/gdd/GddRoiRecuperoTable"
import { Card } from "@/components/ui/card"
import { KpiCard } from "@/components/ui/kpi-card"
import { KpiWithTimeline } from "@/components/ui/kpi-with-timeline"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { gddRoiKpis, TIPO_CAMBIO_ARS } from "@/data/gdd-roi-mock"
import { formatRoiFromUsd } from "@/lib/format-currency"

export function GddRoiView() {
  const searchParams = useSearchParams()
  const currency = (searchParams.get("currency") ?? "usd") as GddRoiCurrency
  const [tablaTab, setTablaTab] = useState<"proyectado" | "historico">("proyectado")

  const label = currency === "usd" ? "DOLAR" : "ARS"
  const pct = gddRoiKpis.porcentajeRecuperado

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_auto]">
        <KpiCard>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  Inversión Recuperada ({label})
                </p>
                <p className="text-xl font-semibold tabular-nums text-foreground">
                  {formatRoiFromUsd(
                    gddRoiKpis.inversionRecuperada,
                    currency,
                    TIPO_CAMBIO_ARS
                  )}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-sm text-muted-foreground">
                  Pendiente de recuperar ({label})
                </p>
                <p className="text-xl font-semibold tabular-nums text-foreground">
                  {formatRoiFromUsd(
                    gddRoiKpis.pendienteRecuperar,
                    currency,
                    TIPO_CAMBIO_ARS
                  )}
                </p>
              </div>
            </div>

            <div className="mt-auto flex shrink-0 flex-col gap-2">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: "var(--chart-3)",
                  }}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-0 bg-transparent p-0"
                      style={{ left: `${pct}%` }}
                      aria-label={`${pct}% recuperado`}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    align="center"
                    className="rounded-md bg-foreground px-3 py-2 text-xs font-normal text-background"
                  >
                    {pct}% recuperado
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground">$ 0</p>
                <p className="text-xs text-muted-foreground">
                  Total Invertido:{" "}
                  {formatRoiFromUsd(
                    gddRoiKpis.totalInvertido,
                    currency,
                    TIPO_CAMBIO_ARS
                  )}
                </p>
              </div>
            </div>
          </div>
        </KpiCard>

        <KpiWithTimeline
          label="Recupero Estimado"
          value={gddRoiKpis.recuperoEstimado}
          metricBadge="Payback"
          timelineData={gddRoiKpis.timeline}
        />

        <Card className="flex h-full min-h-0 flex-col rounded-xl bg-white shadow-xs ring-0">
          <div className="flex min-h-0 flex-1 items-start justify-between gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal text-muted-foreground">TIR</p>
              <p
                className="text-2xl font-bold tabular-nums"
                style={{ color: "var(--color-green-600)" }}
              >
                {gddRoiKpis.tir}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-sm font-normal text-muted-foreground">Plazo</p>
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {gddRoiKpis.plazo}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <GddRoiRecuperoTable
        variant={tablaTab}
        onVariantChange={setTablaTab}
        currency={currency}
      />
    </div>
  )
}
