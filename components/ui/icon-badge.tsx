// components/ui/icon-badge.tsx
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface IconBadgeProps {
  icon: LucideIcon
  size?: "sm" | "md" | "lg"
  className?: string
}

export function IconBadge({
  icon: Icon,
  size = "sm",
  className,
}: IconBadgeProps) {
  const sizeStyles = {
    sm: "size-6 rounded bg-green-600 text-white",
    md: "size-9 rounded-md bg-[#F2ECE9]/36 text-green-600",
    lg: "size-12 rounded-md bg-[#F2ECE9]/36 text-green-600",
  }

  const iconSizes = {
    sm: "size-3",
    md: "size-5",
    lg: "size-6",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center flex-shrink-0",
        sizeStyles[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} aria-hidden />
    </div>
  )
}
