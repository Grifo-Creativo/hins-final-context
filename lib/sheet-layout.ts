// lib/sheet-layout.ts
import { cn } from "@/lib/utils"

/** Shell base OPS — combinar con un perfil de `SHEET_CONTENT_PROFILE`. Ver `components.md` § Sheet. */
export const SHEET_CONTENT_BASE =
  "flex h-full max-h-dvh w-full flex-col gap-0 overflow-hidden p-0"

/**
 * Anchos canónicos — incluir `data-[side=*]:sm:max-w-*` para ganar al primitivo
 * `sheet.tsx` (`data-[side=right]:sm:max-w-sm`).
 */
export const SHEET_CONTENT_PROFILE = {
  detail:
    "max-w-sm data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
  notifications:
    "sm:max-w-md data-[side=left]:sm:max-w-md data-[side=right]:sm:max-w-md",
  table:
    "sm:max-w-3xl data-[side=left]:sm:max-w-3xl data-[side=right]:sm:max-w-3xl",
} as const

export type SheetContentProfile = keyof typeof SHEET_CONTENT_PROFILE

export function sheetContentClassName(
  profile: SheetContentProfile,
  className?: string
) {
  return cn(SHEET_CONTENT_BASE, SHEET_CONTENT_PROFILE[profile], className)
}

/** Header con borde inferior (tabla, notificaciones). */
export const SHEET_OPS_HEADER_BORDERED =
  "shrink-0 space-y-0 border-b border-border p-6 text-left"

/** Header detalle (socio, mantenimiento) — sin borde bajo el título. */
export const SHEET_OPS_HEADER_DETAIL =
  "shrink-0 space-y-0 p-6 text-left"

export const SHEET_OPS_SCROLL =
  "min-h-0 flex-1 overflow-y-auto px-6 py-4"

export const SHEET_OPS_FOOTER =
  "shrink-0 border-t border-border bg-popover p-6"

/** Header notificaciones — título + descripción, sin botón icon (cierra overlay / trigger). */
export const SHEET_OPS_NOTIFICATIONS_HEADER =
  "shrink-0 space-y-1 border-b border-border p-4 text-left"
