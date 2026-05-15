// components/ui/feature-item.tsx

import { IconBadge } from "@/components/ui/icon-badge"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FeatureItemProps {
  label: string
  value: string
  orientation?: "horizontal" | "vertical"
  icon?: LucideIcon
  className?: string
}

export function FeatureItem({
  label,
  value,
  orientation = "horizontal",
  icon: Icon,
  className,
}: FeatureItemProps) {
  if (orientation === "vertical") {
    return (
      <div className={cn("flex flex-col gap-3 rounded-md bg-[#F2ECE9]/36 p-4", className)}>
        {Icon && (
          <IconBadge icon={Icon} size="lg" className="bg-white text-green-600" />
        )}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tabular-nums text-[#0A0A0A]">{value}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex min-h-0 items-center justify-between gap-4 rounded-md bg-[#F2ECE9]/36 p-4",
        className
      )}
    >
      {!Icon ? (
        <>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xl font-semibold tabular-nums text-[#0A0A0A]">{value}</p>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <IconBadge icon={Icon} size="lg" className="bg-white text-green-600" />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xl font-semibold tabular-nums text-[#0A0A0A]">{value}</p>
          </div>
        </div>
      )}
    </div>
  )
}
