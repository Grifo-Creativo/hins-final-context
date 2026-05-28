// components/ui/kpi-secondary-metric.tsx
import { cn } from "@/lib/utils"

export type KpiSecondaryMetricSize = "compact" | "standard"

export type KpiSecondaryMetricProps = {
  label: string
  value: string
  /** `compact` (text-base) — grids densos. `standard` (text-xl) — alineado a KpiSecondary. */
  size?: KpiSecondaryMetricSize
  align?: "left" | "right"
  valueClassName?: string
  className?: string
}

const valueSizeClass: Record<KpiSecondaryMetricSize, string> = {
  compact: "text-base font-semibold",
  standard: "text-xl font-semibold",
}

/** Label + value — primitiva tipográfica de KpiSecondary, sin Card/icon/delta. */
export function KpiSecondaryMetric({
  label,
  value,
  size = "compact",
  align = "left",
  valueClassName,
  className,
}: KpiSecondaryMetricProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1",
        align === "right" && "items-end text-right",
        className
      )}
    >
      <p className="text-sm font-normal text-[#737373]">{label}</p>
      <p
        className={cn(
          "tabular-nums text-[#0A0A0A] break-words",
          valueSizeClass[size],
          valueClassName
        )}
      >
        {value}
      </p>
    </div>
  )
}
