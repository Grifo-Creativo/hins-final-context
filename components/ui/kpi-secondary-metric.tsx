// components/ui/kpi-secondary-metric.tsx
import { cn } from "@/lib/utils"

export type KpiSecondaryMetricProps = {
  label: string
  value: string
  className?: string
}

/** Label + value only — misma tipografía que KpiSecondary, sin Card/icon/delta. */
export function KpiSecondaryMetric({
  label,
  value,
  className,
}: KpiSecondaryMetricProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <p className="text-sm font-normal text-[#737373]">{label}</p>
      <p className="text-base font-semibold tabular-nums text-[#0A0A0A] break-words">
        {value}
      </p>
    </div>
  )
}
