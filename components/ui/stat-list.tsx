// components/ui/stat-list.tsx
import { IconBadge } from "@/components/ui/icon-badge"
import { SectionHeader } from "@/components/ui/section-header"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

export interface StatListItem {
  icon?: LucideIcon
  name: string
  subtitle?: string
  value: string
}

interface StatListTab {
  value: string
  label: string
}

interface StatListProps {
  title: string
  items: StatListItem[]
  tabs?: StatListTab[]
  defaultTab?: string
  onTabChange?: (value: string) => void
  className?: string
}

export function StatList({
  title,
  items,
  tabs,
  defaultTab,
  onTabChange,
  className,
}: StatListProps) {
  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <SectionHeader
        size="sm"
        title={title}
        action={tabs && tabs.length > 0 ? (
          <TabsForBlocks
            tabs={tabs}
            defaultValue={defaultTab ?? tabs[0]?.value}
            onValueChange={onTabChange}
          />
        ) : undefined}
        className="mb-3"
      />

      <div className="flex flex-col">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 py-3">
            {item.icon && <IconBadge icon={item.icon} size="sm" />}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              {item.subtitle && (
                <p className="text-xs font-normal text-muted-foreground">{item.subtitle}</p>
              )}
            </div>
            <p className="ml-auto text-sm font-semibold text-foreground tabular-nums">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
