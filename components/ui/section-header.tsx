// components/ui/section-header.tsx
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  /** Jerarquía semántica. md = h3 (card principal). sm = h4 (sub-sección). */
  size?: "md" | "sm"
  /** Slot libre — TabsForBlocks, DropdownMenu, Button, Select, etc. */
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({
  title,
  size = "md",
  action,
  className,
}: SectionHeaderProps) {
  const isMd = size === "md"

  const titleClass = isMd
    ? "text-base font-semibold md:text-lg text-foreground"
    : "text-sm font-medium text-foreground"

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {isMd ? (
        <h3 className={titleClass}>{title}</h3>
      ) : (
        <h4 className={titleClass}>{title}</h4>
      )}
      {action && (
        <div className="ml-auto flex-shrink-0">{action}</div>
      )}
    </div>
  )
}
