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

export function KpiWithTimeline({
  label,
  value,
  metricBadge,
  timelineData,
}: KpiWithTimelineProps) {
  return (
    <KpiWithAsset
      label={label}
      value={value}
      headerAction={
        metricBadge ? (
          <SoftBadge className="flex-shrink-0">{metricBadge}</SoftBadge>
        ) : undefined
      }
      asset={<KpiPaybackTimeline timelineData={timelineData} />}
    />
  )
}
