// components/ui/kpi-card.tsx
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
  className?: string
}

/**
 * KPI Card — Wrapper con padding p-4 estandarizado para el design system.
 * Encapsula el Card de shadcn con padding consistente.
 * Usado en vistas de KPI (ROI, Performance, etc.)
 */
export function KpiCard({ children, className, ...props }: KpiCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full min-h-0 flex-col bg-white p-4 shadow-sm ring-0 rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
}
