// components/gdcv/SocioV2BreakdownList.tsx
"use client"

import { IconBadge } from "@/components/ui/icon-badge"
import { SectionHeader } from "@/components/ui/section-header"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import type { StatListItem } from "@/components/ui/stat-list"
import { cn } from "@/lib/utils"

import {
  SOCIO_V2_UNIT_TEXT_TABS,
  type SocioV2Unit,
} from "@/components/gdcv/socio-v2-constants"

interface SocioV2BreakdownListProps {
  title?: string
  items: StatListItem[]
  unit: SocioV2Unit
  onUnitChange: (unit: SocioV2Unit) => void
  className?: string
}

export function SocioV2BreakdownList({
  title = "Desglose Ahorro",
  items,
  unit,
  onUnitChange,
  className,
}: SocioV2BreakdownListProps) {
  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <SectionHeader
        size="sm"
        title={title}
        action={
          <TabsForBlocks
            tabs={[...SOCIO_V2_UNIT_TEXT_TABS]}
            value={unit}
            onValueChange={(v) => onUnitChange(v as SocioV2Unit)}
          />
        }
        className="mb-3"
      />

      <div className="flex flex-col">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 py-3">
            {item.icon ? <IconBadge icon={item.icon} size="sm" /> : null}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              {item.subtitle ? (
                <p className="text-xs font-normal text-muted-foreground">
                  {item.subtitle}
                </p>
              ) : null}
            </div>
            <p className="ml-auto text-sm font-semibold tabular-nums text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
