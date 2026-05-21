// components/ui/tabs-for-blocks-icons.tsx
"use client"

import {
  TabsForBlocks,
  type TabsForBlocksTab,
} from "@/components/ui/tabs-for-blocks"

export type { TabsForBlocksTab as TabsForBlocksIconTab }

interface TabsForBlocksIconsProps {
  tabs: TabsForBlocksTab[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

/** @deprecated Prefer `TabsForBlocks` con `variant="icon"`. */
export function TabsForBlocksIcons(props: TabsForBlocksIconsProps) {
  return <TabsForBlocks {...props} variant="icon" />
}
