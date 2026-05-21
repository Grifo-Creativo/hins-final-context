// components/ui/kpi-roi-card.tsx
import { KpiCard } from "@/components/ui/kpi-card"
import { GenerationSparkline } from "@/components/charts/GenerationSparkline"
import { generationSparklineConfig } from "@/data/chart-config"
import { type LucideIcon } from "lucide-react"

interface KpiRoiCardItem {
  icon: LucideIcon
  label: string
  value: string
  badge?: string
}

interface KpiRoiCardProps {
  items: KpiRoiCardItem[]
  sparklineData?: { value: number }[]
}

export function KpiRoiCard({ items, sparklineData }: KpiRoiCardProps) {
  const indexed = sparklineData?.map((d, i) => ({ i, value: d.value })) ?? []

  return (
    <KpiCard>
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        {items.map((item, idx) => {
          const Icon = item.icon
          const isLastItem = idx === items.length - 1

          return (
            <div
              key={idx}
              className="flex items-start justify-between gap-3"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-md bg-background-subtle text-green-600">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-sm font-normal text-[#737373]">
                    {item.label}
                  </p>
                  <p className="text-xl font-semibold text-[#0A0A0A] tabular-nums">
                    {item.value}
                  </p>
                </div>
              </div>

              {isLastItem && indexed.length > 0 ? (
                <div className="w-24 flex-shrink-0">
                  <GenerationSparkline
                    data={indexed}
                    chartConfig={generationSparklineConfig}
                    className="aspect-auto h-10 w-full"
                    showTooltip={false}
                  />
                </div>
              ) : item.badge ? (
                <span className="flex-shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                  {item.badge}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
    </KpiCard>
  )
}
