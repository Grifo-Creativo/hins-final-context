// components/ui/kpi-primary-compact.tsx
import { GenerationSparkline } from "@/components/charts/GenerationSparkline"
import { CardWire } from "@/components/ui/card-wire"
import { IconBadge } from "@/components/ui/icon-badge"
import { SoftBadge } from "@/components/ui/soft-badge"
import { generationSparklineConfig } from "@/data/chart-config"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface KpiPrimaryCompactProps {
  icon: LucideIcon
  label: string
  value: string
  unit?: string
  delta?: string
  sparklineData?: { value: number }[]
  className?: string
}

/**
 * Variante compacta de KpiPrimary — misma familia (Card + shadow-xs + sparkline con tooltip).
 * Varios por vista en grid (ej. panel socio: Ahorro + Energía Gen.).
 */
export function KpiPrimaryCompact({
  icon,
  label,
  value,
  unit,
  delta,
  sparklineData,
  className,
}: KpiPrimaryCompactProps) {
  const indexed = sparklineData?.map((d, i) => ({ i, value: d.value })) ?? []
  const showDelta = Boolean(delta?.trim())

  return (
    <CardWire
      className={cn(
        "h-full flex flex-col gap-3 shadow-sm",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <IconBadge icon={icon} size="lg" className="shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {label}
          </p>
          <p className="text-lg font-semibold tabular-nums leading-tight text-[#0A0A0A] sm:text-xl">
            {value}
            {unit ? (
              <span className="ml-1 text-sm font-semibold text-[#0A0A0A] sm:text-base">
                {unit}
              </span>
            ) : null}
          </p>
        </div>
      </div>

      {indexed.length > 0 ? (
        <div className="mx-[-16px]">
          <GenerationSparkline
            data={indexed}
            chartConfig={generationSparklineConfig}
            className="aspect-auto h-14 w-full"
          />
        </div>
      ) : null}

      {showDelta ? <SoftBadge>{delta}</SoftBadge> : null}
    </CardWire>
  )
}
