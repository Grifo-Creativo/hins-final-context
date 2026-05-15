// components/ui/soft-badge.tsx
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface SoftBadgeProps {
  children: React.ReactNode
  icon?: LucideIcon
  className?: string
}

export function SoftBadge({ children, icon: Icon, className }: SoftBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5",
        "bg-[#F2ECE9]/36 text-foreground text-xs font-normal",
        className
      )}
    >
      {Icon && <Icon className="size-3 text-foreground" aria-hidden />}
      {children}
    </span>
  )
}
