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
      <div className={cn("flex flex-col gap-3 rounded-md bg-background-subtle p-4", className)}>
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
        "flex w-full min-w-0 rounded-md bg-background-subtle p-3 md:p-4",
        Icon
          ? "flex-col gap-4 md:flex-row md:items-center"
          : "items-center justify-between gap-3 md:gap-4",
        className
      )}
    >
      {!Icon ? (
        <>
          <p className="min-w-0 text-sm font-medium text-foreground">{label}</p>
          <p className="shrink-0 text-lg font-semibold tabular-nums text-[#0A0A0A] md:text-xl">
            {value}
          </p>
        </>
      ) : (
        <>
          <IconBadge
            icon={Icon}
            size="lg"
            className="size-9 shrink-0 bg-white text-green-600 md:size-12 [&_svg]:size-5 md:[&_svg]:size-6"
          />
          <div className="flex min-w-0 flex-col gap-0.5 md:flex-1 md:gap-1">
            <p className="text-xs font-medium leading-snug text-foreground md:text-sm">
              {label}
            </p>
            <p className="text-lg font-semibold tabular-nums text-[#0A0A0A] md:text-xl">
              {value}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
