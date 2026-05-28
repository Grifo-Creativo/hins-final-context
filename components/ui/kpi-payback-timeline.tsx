// components/ui/kpi-payback-timeline.tsx
"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { cn } from "@/lib/utils"

export interface KpiPaybackTimelineHoy {
  label: string
  fecha: string
  pct: number
  /** Tiempo transcurrido desde inicio — ej. `"2.0"`, `"2.2"`. */
  elapsedYears: string
}

export interface KpiPaybackTimelineData {
  inicio: { label: string; fecha: string }
  hoy: KpiPaybackTimelineHoy
  payback: { label: string; fecha: string }
}

/** Formato unificado tooltip nodo Hoy — `[Mes año] · [tiempo transcurrido]`. */
export function formatPaybackTooltipText(fecha: string, elapsedYears: string): string {
  return `${fecha} · ${elapsedYears} Años`
}

/** Distancia tooltip ↔ asset cuando está abierto por defecto (mobile apilado). */
const MOBILE_TOOLTIP_SIDE_OFFSET = 0

export function KpiPaybackTimeline({
  timelineData,
}: {
  timelineData: KpiPaybackTimelineData
}) {
  const pct = timelineData.hoy.pct
  const tooltipText = formatPaybackTooltipText(
    timelineData.hoy.fecha,
    timelineData.hoy.elapsedYears
  )
  /** ROI cards apiladas bajo `lg` — tooltip visible sin interacción. */
  const tooltipOpenByDefault = useIsMobile(1023)

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex h-6 w-full items-center">
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-border" />
        <div
          className="absolute left-0 h-[3px] rounded-full bg-green-600"
          style={{ width: `${pct}%` }}
        />
        <div className="absolute left-0 size-[10px] -translate-x-1/2 rounded-full bg-green-600" />
        <div className="absolute -translate-x-1/2" style={{ left: `${pct}%` }}>
          <Tooltip open={tooltipOpenByDefault ? true : undefined}>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="size-3 cursor-pointer rounded-full border-2 border-background bg-green-600 p-0 shadow-[0_0_0_2px_var(--color-green-600)]"
                aria-label={tooltipText}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={tooltipOpenByDefault ? MOBILE_TOOLTIP_SIDE_OFFSET : 0}
              className={cn(
                "rounded-md bg-foreground px-3 py-1.5 text-xs font-normal text-background",
                tooltipOpenByDefault && "[&>svg]:hidden"
              )}
            >
              {tooltipText}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="absolute right-0 size-[10px] translate-x-1/2 rounded-full bg-border" />
      </div>

      <div className="relative flex justify-between px-0.5">
        <div className="flex flex-col gap-0.5">
          <p className="text-[11px] font-medium text-muted-foreground">Inicio:</p>
          <p className="text-[11px] text-muted-foreground">
            {timelineData.inicio.fecha}
          </p>
        </div>

        <p
          className="absolute -translate-x-1/2 text-[11px] font-medium text-green-600"
          style={{ left: `${pct}%` }}
        >
          {timelineData.hoy.label}
        </p>

        <div className="flex flex-col items-end gap-0.5 text-right">
          <p className="text-[11px] font-medium text-muted-foreground">Payback:</p>
          <p className="text-[11px] text-muted-foreground">
            {timelineData.payback.fecha}
          </p>
        </div>
      </div>
    </div>
  )
}
