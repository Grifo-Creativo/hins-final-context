// lib/table-utils.ts
import { cn } from "@/lib/utils"

/** Column meta for HINS data tables (TanStack Table). */
export type HinsTableColumnMeta = {
  label?: string
  /** Pin column to the left on viewports below `md` while horizontally scrolling. */
  sticky?: "start"
  /** Min width of the sticky column on mobile — `wide` for avatar/name rows. */
  stickyWidth?: "default" | "wide"
}

const STICKY_START_WIDTH: Record<NonNullable<HinsTableColumnMeta["stickyWidth"]>, string> = {
  default: "max-md:min-w-28",
  wide: "max-md:min-w-44",
}

export function getHinsTableColumnMeta(meta: unknown): HinsTableColumnMeta | undefined {
  if (!meta || typeof meta !== "object") return undefined
  return meta as HinsTableColumnMeta
}

/** Tailwind classes for a sticky first column on mobile (`max-md` only). */
export function stickyStartCellClassName(meta: unknown): string | undefined {
  const columnMeta = getHinsTableColumnMeta(meta)
  if (columnMeta?.sticky !== "start") return undefined

  const widthKey = columnMeta.stickyWidth ?? "default"

  return cn(
    "max-md:sticky max-md:left-0 max-md:z-10",
    "max-md:bg-background max-md:shadow-[4px_0_8px_-4px_rgba(9,9,11,0.08)]",
    "max-md:group-hover:bg-muted",
    STICKY_START_WIDTH[widthKey]
  )
}
