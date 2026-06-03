// components/ui/kpi-with-timeline.tsx
import { KpiPaybackTimeline, type KpiPaybackTimelineData } from "@/components/ui/kpi-payback-timeline"
import { KpiWithAsset } from "@/components/ui/kpi-with-asset"
import { SoftBadge } from "@/components/ui/soft-badge"

export type TimelineData = KpiPaybackTimelineData

interface KpiWithTimelineProps {
  label: string
  value: string
  metricBadge?: string
  timelineData: TimelineData
}

/**
 * Calcula los años restantes hasta el payback.
 * `value` = "7.0 años" (total); `elapsedYears` = "2.0" (transcurrido).
 * Devuelve p.ej. "5.0 años", o null si los datos no son parseables.
 */
function calcRemainingYears(value: string, elapsedYears: string): string | null {
  const total = parseFloat(value)
  const elapsed = parseFloat(elapsedYears)
  if (isNaN(total) || isNaN(elapsed)) return null
  const remaining = Math.max(0, total - elapsed)
  return `${remaining.toFixed(1)} años`
}

export function KpiWithTimeline({
  label,
  value,
  metricBadge,
  timelineData,
}: KpiWithTimelineProps) {
  const remaining = calcRemainingYears(value, timelineData.hoy.elapsedYears)

  return (
    <KpiWithAsset
      label={label}
      value={value}
      headerAction={
        metricBadge ? (
          <SoftBadge className="flex-shrink-0">{metricBadge}</SoftBadge>
        ) : undefined
      }
      bottomLabel={remaining ? "Faltan" : undefined}
      bottomValue={remaining ?? undefined}
      asset={<KpiPaybackTimeline timelineData={timelineData} />}
    />
  )
}
