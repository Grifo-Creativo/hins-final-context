// components/ui/kpi-with-asset.tsx
import type { ReactNode } from "react"

import { Card } from "@/components/ui/card"
import { KpiSecondaryMetric } from "@/components/ui/kpi-secondary-metric"
import { cn } from "@/lib/utils"

/** Aire mínimo entre bloque KPI y asset — 2× gap intra-grupo (gap-4 → 32px / 48px). */
export const KPI_WITH_ASSET_SECTION_GAP =
  "min-h-8 flex-1 pt-8 md:min-h-12 md:pt-12"

interface KpiWithAssetProps {
  label: string
  value: string
  /** Acción/badge alineado arriba a la derecha (ej. Payback). */
  headerAction?: ReactNode
  asset: ReactNode
  bottomLabel?: string
  bottomValue?: string
  className?: string
}

/**
 * Card KPI + asset visual al fondo. Tipografía vía KpiSecondaryMetric (standard).
 * Spacer flexible + pt-8/pt-12 alinea assets entre cards hermanas en desktop.
 */
export function KpiWithAsset({
  label,
  value,
  headerAction,
  asset,
  bottomLabel,
  bottomValue,
  className,
}: KpiWithAssetProps) {
  const hasDualKpi = Boolean(bottomLabel && bottomValue)

  return (
    <Card
      className={cn(
        "flex h-full min-h-0 flex-col bg-white p-6 shadow-xs ring-0 rounded-xl",
        className
      )}
    >
      {hasDualKpi ? (
        <div className="flex justify-between gap-6">
          <KpiSecondaryMetric
            label={label}
            value={value}
            size="standard"
            className="min-w-0 flex-1"
          />
          <KpiSecondaryMetric
            label={bottomLabel!}
            value={bottomValue!}
            size="standard"
            align="right"
            className="min-w-0 shrink-0"
          />
        </div>
      ) : (
        <div className="flex items-start justify-between gap-2">
          <KpiSecondaryMetric
            label={label}
            value={value}
            size="standard"
            className="min-w-0 flex-1"
          />
          {headerAction ? (
            <div className="shrink-0">{headerAction}</div>
          ) : null}
        </div>
      )}

      <div className={KPI_WITH_ASSET_SECTION_GAP} aria-hidden />

      <div className="flex shrink-0 flex-col gap-2">{asset}</div>
    </Card>
  )
}
