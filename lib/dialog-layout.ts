// lib/dialog-layout.ts
import { cn } from "@/lib/utils"

/** Padding del shell — alineado con design-system.md (p-4 sm:p-6). */
export const DIALOG_CONTENT_PADDING = "p-4 sm:p-6"

/** Gap entre bloques hijos en dialog con padding default. */
export const DIALOG_CONTENT_GAP = "gap-4 sm:gap-6"

/**
 * Compensa el padding del `DialogContent` para que el footer llegue al borde del panel.
 * Usar solo cuando el content tiene `DIALOG_CONTENT_PADDING`.
 */
export const DIALOG_FOOTER_BLEED = "-mx-4 sm:-mx-6 -mb-4 sm:-mb-6"

/** Footer con padding responsive (sin bleed — cuando el content es `p-0`). */
export const DIALOG_FOOTER_INSET =
  "shrink-0 flex flex-col-reverse gap-2 rounded-b-xl border-t border-border bg-muted/50 p-4 sm:flex-row sm:justify-end sm:p-6"

/** Header de dialog flush (content `p-0`). */
export const DIALOG_HEADER_FLUSH =
  "shrink-0 flex flex-col gap-2 border-b border-border p-4 text-left sm:p-6"

/** Área scroll en dialog flush — mismo ritmo que SHEET_OPS_SCROLL. */
export const DIALOG_BODY_SCROLL =
  "min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4"

/** Posición del botón cerrar ghost cuando hay padding en content. */
export const DIALOG_CLOSE_BUTTON_POSITION =
  "top-4 right-4 sm:top-6 sm:right-6"

export function dialogFooterClassName(className?: string, flushParent = false) {
  return cn(
    DIALOG_FOOTER_INSET,
    !flushParent && DIALOG_FOOTER_BLEED,
    className
  )
}
