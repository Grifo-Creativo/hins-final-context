// components/ui/kpi-progress-bar.tsx
"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { cn } from "@/lib/utils"

/** Distancia tooltip ↔ asset cuando está abierto por defecto (mobile apilado). */
const MOBILE_TOOLTIP_SIDE_OFFSET = 0

export type KpiProgressBarFootnote = {
  label?: React.ReactNode
  value: React.ReactNode
  align?: "left" | "right"
}

interface KpiProgressBarProps {
  percent: number
  bottomLabels?: {
    left: KpiProgressBarFootnote
    right: KpiProgressBarFootnote
  }
}

function ProgressBarFootnote({
  label,
  value,
  align = "left",
}: KpiProgressBarFootnote) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-0.5",
        align === "right" && "items-end text-right"
      )}
    >
      {label != null && label !== "" ? (
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      ) : (
        <span
          className="text-[11px] font-medium leading-none invisible select-none"
          aria-hidden
        >
          ·
        </span>
      )}
      <p className="text-[11px] text-muted-foreground tabular-nums">{value}</p>
    </div>
  )
}

/**
 * KPI Progress Bar — Barra de progreso con nodo interactivo (tooltip).
 * Footnotes en dos líneas (label + value) para alinear con KpiPaybackTimeline.
 */
export function KpiProgressBar({
  percent,
  bottomLabels,
}: KpiProgressBarProps) {
  /** ROI cards apiladas bajo `lg` — tooltip visible sin interacción. */
  const tooltipOpenByDefault = useIsMobile(1023)

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-border">
        <Tooltip open={tooltipOpenByDefault ? true : undefined}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn(
                "absolute left-0 top-0 h-full min-w-0 rounded-full border-0 p-0",
                tooltipOpenByDefault
                  ? "cursor-default"
                  : "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              style={{
                width: `${percent}%`,
                backgroundColor: "var(--chart-3)",
              }}
              aria-label={`${percent}% recuperado`}
            />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            sideOffset={tooltipOpenByDefault ? MOBILE_TOOLTIP_SIDE_OFFSET : 0}
            className={cn(
              "rounded-md bg-foreground px-3 py-1.5 text-xs font-normal text-background",
              tooltipOpenByDefault && "[&>svg]:hidden"
            )}
          >
            {percent}% recuperado
          </TooltipContent>
        </Tooltip>
      </div>

      {bottomLabels && (
        <div className="relative flex justify-between px-0.5">
          <ProgressBarFootnote {...bottomLabels.left} />
          <ProgressBarFootnote {...bottomLabels.right} align="right" />
        </div>
      )}
    </div>
  )
}
