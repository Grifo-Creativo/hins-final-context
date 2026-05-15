// components/ui/kpi-with-timeline.tsx (VERSIÓN SIMPLIFICADA)
import { Card } from "@/components/ui/card"
import { HinsTooltip } from "@/components/ui/hins-tooltip"

interface TimelineData {
  inicio: { label: string; fecha: string }
  hoy: { label: string; fecha: string; pct: number; tooltipText: string }
  payback: { label: string; fecha: string }
}

interface KpiWithTimelineProps {
  label: string
  value: string
  metricBadge?: string
  timelineData: TimelineData
}

/** Track filled, nodos y acento del timeline — alineado con `text-green-600` / `--color-green-600` (Tailwind theme). */
const timelineAccent = "var(--color-green-600)" as const

export function KpiWithTimeline({
  label,
  value,
  metricBadge,
  timelineData,
}: KpiWithTimelineProps) {
  const pct = timelineData.hoy.pct

  return (
    <Card className="flex min-h-0 h-full flex-col bg-white p-4 shadow-xs ring-0 rounded-xl overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col justify-between">
        {/* Bloque superior: label + valor + badge */}
        <div className="flex shrink-0 flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="text-sm font-normal text-[#737373]">{label}</p>
              <p className="text-xl font-semibold text-[#0A0A0A] tabular-nums">
                {value}
              </p>
            </div>
            {metricBadge && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground flex-shrink-0">
                {metricBadge}
              </span>
            )}
          </div>
        </div>

        {/* Bloque inferior: timeline anclado al fondo de la card */}
        <div className="flex shrink-0 flex-col gap-2">
          {/* Track + nodes */}
          <div className="relative flex items-center" style={{ height: 24 }}>
            {/* Track base (full) */}
            <div className="absolute inset-x-0 h-[3px] rounded-full bg-border" />

            {/* Track filled (Inicio → Hoy) */}
            <div
              className="absolute left-0 h-[3px] rounded-full"
              style={{ width: `${pct}%`, backgroundColor: timelineAccent }}
            />

            {/* Node: Inicio */}
            <div
              className="absolute left-0 -translate-x-1/2 size-[10px] rounded-full"
              style={{ backgroundColor: timelineAccent }}
            />

            {/* Node: Hoy (with HinsTooltip) */}
            <div className="absolute -translate-x-1/2" style={{ left: `${pct}%` }}>
              <HinsTooltip
                trigger={
                  <div
                    className="size-3 rounded-full cursor-pointer"
                    style={{
                      backgroundColor: timelineAccent,
                      border: "2px solid var(--background)",
                      boxShadow: `0 0 0 2px ${timelineAccent}`,
                    }}
                  />
                }
                content={timelineData.hoy.tooltipText}
              />
            </div>

            {/* Node: Payback */}
            <div className="absolute right-0 translate-x-1/2 size-[10px] rounded-full bg-border" />
          </div>

          {/* Labels */}
          <div className="relative flex justify-between px-0.5">
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] text-muted-foreground font-medium">Inicio:</p>
              <p className="text-[11px] text-muted-foreground">
                {timelineData.inicio.fecha}
              </p>
            </div>

            <p
              className="text-[11px] font-medium -translate-x-1/2 absolute"
              style={{ left: `${pct}%`, color: timelineAccent }}
            >
              {timelineData.hoy.fecha}
            </p>

            <div className="flex flex-col gap-0.5 items-end text-right">
              <p className="text-[11px] text-muted-foreground font-medium">Payback:</p>
              <p className="text-[11px] text-muted-foreground">
                {timelineData.payback.fecha}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
