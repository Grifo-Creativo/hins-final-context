// components/ui/currency-context-indicator.tsx
"use client"

import {
  TabsForBlocksTab,
  tabsForBlocksFitChipClassName,
  tabsForBlocksFitTrackClassName,
} from "@/components/ui/tabs-for-blocks"
import {
  currencyTabLabel,
  type CurrencyCode,
} from "@/lib/format-currency"
import { cn } from "@/lib/utils"

/** Misma definición que header ROI (`SocioRoiView`, `GddPageHeading`). */
export const currencyTabsForBlocks: TabsForBlocksTab[] = [
  { value: "usd", label: "DOLAR" },
  { value: "ars", label: "ARS" },
]

const CURRENCY_OPTIONS: CurrencyCode[] = ["usd", "ars"]

interface CurrencyContextIndicatorProps {
  /** Moneda activa (heredada del heading / URL de la vista). */
  currency: CurrencyCode
  className?: string
}

/**
 * DOLAR | ARS de solo lectura — misma píldora que `TabsForBlocks` `width="fit"`,
 * sin `role="tab"` (no compite con Proyectado | Histórico ni parece clickeable).
 */
export function CurrencyContextIndicator({
  currency,
  className,
}: CurrencyContextIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Moneda activa: ${currencyTabLabel(currency)}`}
      className={cn(tabsForBlocksFitTrackClassName, className)}
    >
      {CURRENCY_OPTIONS.map((code) => (
        <span
          key={code}
          aria-hidden={code !== currency}
          className={tabsForBlocksFitChipClassName(code === currency)}
        >
          {currencyTabLabel(code)}
        </span>
      ))}
    </div>
  )
}
