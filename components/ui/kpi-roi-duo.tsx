// components/ui/kpi-roi-duo.tsx
import { KpiCard } from "@/components/ui/kpi-card"
import { GenerationSparkline } from "@/components/charts/GenerationSparkline"
import { generationSparklineConfig } from "@/data/chart-config"
import { type LucideIcon } from "lucide-react"

interface KpiRoiItem {
  icon: LucideIcon
  label: string
  value: string
}

interface KpiRoiDuoProps {
  // KPI 1: Inversión + Ahorrado
  items: KpiRoiItem[]
  badge?: string
  sparklineData?: { value: number }[]

  // KPI 2: Cap Recuperado + Pendiente + Progress
  capRecuperado: string
  pendiente: string
  porcentajeRecuperado: number
}

export function KpiRoiDuo({
  items,
  badge,
  sparklineData,
  capRecuperado,
  pendiente,
  porcentajeRecuperado,
}: KpiRoiDuoProps) {
  const indexed = sparklineData?.map((d, i) => ({ i, value: d.value })) ?? []

  return (
    <KpiCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Col 1: KPI 1 — Inversión + Ahorrado + Sparkline */}
        <div className="flex flex-col gap-4 sm:gap-6">
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
                ) : badge ? (
                  <span className="flex-shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                    {badge}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>

        {/* Col 2: KPI 2 — Cap Recuperado + Pendiente + Progress */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Cap Recuperado + Pendiente */}
          <div className="flex shrink-0 items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Cap. Recuperado</p>
              <p className="text-xl font-semibold text-foreground tabular-nums">
                {capRecuperado}
              </p>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <p className="text-sm text-muted-foreground">Pendiente</p>
              <p className="text-xl font-semibold text-foreground tabular-nums">
                {pendiente}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-auto flex shrink-0 flex-col gap-2">
            <p className="text-left text-sm text-muted-foreground">
              {porcentajeRecuperado}% recuperado
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${porcentajeRecuperado}%`,
                  backgroundColor: "var(--chart-3)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </KpiCard>
  )
}
