// components/ui/tabs-for-blocks.tsx
"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export type TabsForBlocksVariant = "text" | "icon" | "icon-label"

export interface TabsForBlocksTab {
  value: string
  label?: string
  icon?: LucideIcon
  /** Obligatorio en `variant="icon"` si no hay label visible. */
  ariaLabel?: string
}

interface TabsForBlocksProps {
  tabs: TabsForBlocksTab[]
  variant?: TabsForBlocksVariant
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

const triggerActive =
  "data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs data-active:!bg-white data-active:!text-foreground data-[state=inactive]:text-muted-foreground"

function getTabsListClassName(variant: TabsForBlocksVariant): string {
  const base = "gap-1 rounded-md bg-stone-200/75 p-1"

  if (variant === "text") {
    return cn(
      base,
      "h-full w-full min-w-0 max-md:overflow-x-auto max-md:flex-nowrap justify-stretch sm:inline-flex sm:w-fit"
    )
  }

  return cn(base, "inline-flex h-full w-fit shrink-0")
}

function getTabsTriggerClassName(variant: TabsForBlocksVariant): string {
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
    "h-full min-w-0 flex-1 shrink-0 rounded-md border-transparent px-2 py-2 text-center text-sm font-medium sm:flex-initial sm:shrink sm:px-5 sm:py-2.5"
  )
}

export function TabsForBlocks({
  tabs,
  variant = "text",
  defaultValue,
  value,
  onValueChange,
  className,
}: TabsForBlocksProps) {
  return (
    <Tabs
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={cn("h-full w-full min-w-0 sm:w-auto", className)}
    >
      <TabsList className={getTabsListClassName(variant)}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const ariaLabel = tab.ariaLabel ?? tab.label

          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              aria-label={
                variant === "icon" ? ariaLabel : undefined
              }
              className={getTabsTriggerClassName(variant)}
            >
              {Icon && variant !== "text" ? (
                <Icon className="size-4 shrink-0" aria-hidden />
              ) : null}
              {variant !== "icon" ? tab.label : null}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
