// components/ui/tabs-for-blocks.tsx
"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export type TabsForBlocksVariant = "text" | "icon" | "icon-label"

export interface TabsForBlocksTab {
  value: string
  label?: string
  /** Label corto en mobile (`max-sm`) — ej. "ROI" vs "Retorno de Inversión". */
  labelMobile?: string
  icon?: LucideIcon
  /** Obligatorio en `variant="icon"` si no hay label visible. */
  ariaLabel?: string
}

export type TabsForBlocksWidth = "fill" | "fit"

interface TabsForBlocksProps {
  tabs: TabsForBlocksTab[]
  variant?: TabsForBlocksVariant
  /** `fill` (default): ancho disponible en mobile. `fit`: contenido — ej. DOLAR | ARS en header ROI. */
  width?: TabsForBlocksWidth
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  /**
   * Solo muestra el tab activo — sin cambiar valor (p. ej. moneda heredada en sheet).
   * Usar con `width="fit"` y `value` controlado desde la vista padre.
   */
  readOnly?: boolean
  /** Accesibilidad cuando `readOnly` (ej. "Moneda activa: DOLAR"). */
  readOnlyAriaLabel?: string
}

const triggerActive =
  "data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs data-active:!bg-white data-active:!text-foreground data-[state=inactive]:text-muted-foreground"

/** Track + chips `width="fit"` — `CurrencyContextIndicator` (sin Radix). */
export const tabsForBlocksFitTrackClassName =
  "inline-flex shrink-0 items-center gap-1 rounded-md bg-stone-200/75 p-1"

export function tabsForBlocksFitChipClassName(active: boolean): string {
  return cn(
    "inline-flex items-center justify-center rounded-md px-2.5 py-2 text-sm font-medium sm:px-4 sm:py-2",
    active
      ? "bg-white text-foreground shadow-xs"
      : "text-muted-foreground"
  )
}

function getTabsListClassName(
  variant: TabsForBlocksVariant,
  width: TabsForBlocksWidth
): string {
  const base = "gap-1 rounded-md bg-stone-200/75 p-1"

  if (variant === "text") {
    if (width === "fit") {
      return cn(base, "inline-flex h-full w-fit shrink-0")
    }
    return cn(
      base,
      "h-full w-full min-w-0 max-md:overflow-x-auto max-md:flex-nowrap justify-stretch sm:inline-flex sm:w-fit"
    )
  }

  return cn(base, "inline-flex h-full w-fit shrink-0")
}

function getTabsTriggerClassName(
  variant: TabsForBlocksVariant,
  width: TabsForBlocksWidth
): string {
  if (variant === "icon") {
    return cn(
      triggerActive,
      "flex aspect-square h-[calc(100%-1px)] flex-none items-center justify-center rounded-md border-transparent p-0 text-sm"
    )
  }

  if (variant === "icon-label") {
    return cn(
      triggerActive,
      "flex h-full flex-none items-center gap-1.5 rounded-md border-transparent px-2.5 py-2 text-sm sm:px-3 sm:py-2.5"
    )
  }

  return cn(
    triggerActive,
    width === "fit"
      ? "h-full shrink-0 rounded-md border-transparent px-2 py-2 text-sm font-medium max-md:px-2.5 sm:px-4 sm:py-2.5"
      : "h-full min-w-0 flex-1 shrink-0 rounded-md border-transparent px-2 py-2 text-center text-sm font-medium sm:flex-initial sm:shrink sm:px-5 sm:py-2.5"
  )
}

export function TabsForBlocks({
  tabs,
  variant = "text",
  width = "fill",
  defaultValue,
  value,
  onValueChange,
  className,
  readOnly = false,
  readOnlyAriaLabel,
}: TabsForBlocksProps) {
  return (
    <Tabs
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={value}
      onValueChange={readOnly ? undefined : onValueChange}
      className={cn(
        "h-full min-w-0 sm:w-auto",
        width === "fit" ? "w-auto shrink-0" : "w-full",
        readOnly && "pointer-events-none select-none",
        className
      )}
      {...(readOnly && readOnlyAriaLabel
        ? { "aria-label": readOnlyAriaLabel }
        : {})}
    >
      <TabsList className={getTabsListClassName(variant, width)}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const ariaLabel = tab.ariaLabel ?? tab.label

          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              tabIndex={readOnly ? -1 : undefined}
              aria-label={
                variant === "icon"
                  ? ariaLabel
                  : tab.labelMobile
                    ? tab.label
                    : undefined
              }
              className={getTabsTriggerClassName(variant, width)}
            >
              {Icon && variant !== "text" ? (
                <Icon className="size-4 shrink-0" aria-hidden />
              ) : null}
              {variant !== "icon" ? (
                tab.labelMobile ? (
                  <>
                    <span className="sm:hidden">{tab.labelMobile}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </>
                ) : (
                  tab.label
                )
              ) : null}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
