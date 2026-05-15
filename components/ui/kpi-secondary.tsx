// components/ui/kpi-secondary.tsx
// Behaves as KpiSecondaryStacked — export name `KpiSecondary` kept for backward compatibility.
import { Card } from "@/components/ui/card"
import { HinsTooltip } from "@/components/ui/hins-tooltip"
import { IconBadge } from "@/components/ui/icon-badge"
import { SoftBadge } from "@/components/ui/soft-badge"
import { InfoIcon, type LucideIcon } from "lucide-react"

interface KpiSecondaryProps {
  icon: LucideIcon
  label: string
  value: string
  delta: string
  /** Si se pasa, muestra un InfoIcon con tooltip al lado del value */
  infoTooltip?: {
    content: string
    href?: string
  }
  /** Layout de la KPI: vertical (default) o horizontal */
  layout?: "vertical" | "horizontal"
}

export function KpiSecondary({
  icon,
  label,
  value,
  delta,
  infoTooltip,
  layout = "vertical",
}: KpiSecondaryProps) {
  const showDelta = Boolean(delta.trim())

  if (layout === "horizontal") {
    return (
      <Card className="bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden h-full">
        <div className="flex items-start gap-3 p-4">
          <IconBadge icon={icon} size="sm" className="flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-sm font-normal text-[#737373]">{label}</p>
            <div className="flex items-center gap-1">
              <p className="text-xl font-semibold text-[#0A0A0A] break-words">
                {value}
              </p>
              {infoTooltip && (
                <HinsTooltip
                  trigger={
                    <InfoIcon
                      className="size-4 text-muted-foreground flex-shrink-0"
                      aria-hidden
                    />
                  }
                  content={infoTooltip.content}
                  href={infoTooltip.href}
                />
              )}
            </div>
            {showDelta ? <SoftBadge>{delta}</SoftBadge> : null}
          </div>
        </div>
      </Card>
    )
  }

  // Default: vertical layout (KpiSecondaryStacked behavior)
  return (
    <Card className="bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden h-full">
      <div className="flex flex-col gap-2 p-4 h-full justify-between">
        <div className="flex flex-col gap-2">
          <IconBadge icon={icon} size="sm" />
          <p className="text-sm font-normal text-[#737373]">{label}</p>
          <div className="flex items-center gap-1">
            <p className="text-xl font-semibold text-[#0A0A0A]">{value}</p>
            {infoTooltip && (
              <HinsTooltip
                trigger={<InfoIcon className="size-4 text-muted-foreground" aria-hidden />}
                content={infoTooltip.content}
                href={infoTooltip.href}
              />
            )}
          </div>
        </div>
        {showDelta ? <SoftBadge>{delta}</SoftBadge> : null}
      </div>
    </Card>
  )
}
