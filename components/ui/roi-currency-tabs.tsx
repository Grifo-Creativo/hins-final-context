// components/ui/roi-currency-tabs.tsx
"use client"

import { currencyTabsForBlocks } from "@/components/ui/currency-context-indicator"
import { HinsTooltip } from "@/components/ui/hins-tooltip"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { ROI_CURRENCY_CONVERSION_TOOLTIP } from "@/data/roi-currency-disclaimer"
import { cn } from "@/lib/utils"
import { InfoIcon } from "lucide-react"

interface RoiCurrencyTabsProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

/** DOLAR | ARS en vistas ROI + aclaración de conversión (HinsTooltip). */
export function RoiCurrencyTabs({
  value,
  onValueChange,
  className,
}: RoiCurrencyTabsProps) {
  return (
    <div className={cn("flex shrink-0 items-center gap-1", className)}>
      <TabsForBlocks
        width="fit"
        className="shrink-0"
        tabs={currencyTabsForBlocks}
        value={value}
        onValueChange={onValueChange}
      />
      <HinsTooltip
        trigger={
          <InfoIcon className="size-4 text-muted-foreground" aria-hidden />
        }
        content={ROI_CURRENCY_CONVERSION_TOOLTIP}
        side="bottom"
        className="max-w-xs text-pretty sm:max-w-sm"
      />
    </div>
  )
}
