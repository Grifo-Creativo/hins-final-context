// components/ui/sheet-ops.tsx
"use client"

import type { ReactNode } from "react"
import { ChevronLeftIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  SHEET_OPS_FOOTER,
  SHEET_OPS_HEADER_BORDERED,
  SHEET_OPS_HEADER_DETAIL,
  SHEET_OPS_NOTIFICATIONS_HEADER,
  SHEET_OPS_SCROLL,
  type SheetContentProfile,
  sheetContentClassName,
} from "@/lib/sheet-layout"
import { cn } from "@/lib/utils"

interface SheetOpsHeaderProps {
  title: string
  variant?: "bordered" | "detail"
  className?: string
  /** Slot antes del botón cerrar (ej. `CurrencyContextIndicator`). */
  action?: ReactNode
  /** Volver a sheet superior — icon button a la izquierda del [x]. */
  onBack?: () => void
}

/** Título + cerrar (outline icon) — patrón OPS de drill-down. */
export function SheetOpsHeader({
  title,
  variant = "bordered",
  className,
  action,
  onBack,
}: SheetOpsHeaderProps) {
  return (
    <SheetHeader
      className={cn(
        variant === "detail"
          ? SHEET_OPS_HEADER_DETAIL
          : SHEET_OPS_HEADER_BORDERED,
        className
      )}
    >
      <div className={cn("flex flex-col", action ? "gap-3" : "gap-0")}>
        <div className="flex flex-row items-start justify-between gap-4">
          <SheetTitle className="min-w-0 flex-1 pr-2 text-2xl font-semibold leading-tight text-foreground">
            {title}
          </SheetTitle>
          <div className="flex shrink-0 items-center gap-2">
            {onBack ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8 shadow-xs"
                aria-label="Volver"
                onClick={onBack}
              >
                <ChevronLeftIcon className="size-4" aria-hidden />
              </Button>
            ) : null}
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8 shadow-xs"
                aria-label="Cerrar"
              >
                <XIcon className="size-4" aria-hidden />
              </Button>
            </SheetClose>
          </div>
        </div>
        {action ? (
          <div className="flex justify-end">{action}</div>
        ) : null}
      </div>
    </SheetHeader>
  )
}

interface SheetOpsNotificationsHeaderProps {
  title: string
  description: string
  className?: string
}

/** Header de sheet notificaciones (sin icon cerrar en header). */
export function SheetOpsNotificationsHeader({
  title,
  description,
  className,
}: SheetOpsNotificationsHeaderProps) {
  return (
    <SheetHeader className={cn(SHEET_OPS_NOTIFICATIONS_HEADER, className)}>
      <SheetTitle>{title}</SheetTitle>
      <SheetDescription>{description}</SheetDescription>
    </SheetHeader>
  )
}

interface SheetOpsScrollProps {
  children: ReactNode
  className?: string
}

export function SheetOpsScroll({ children, className }: SheetOpsScrollProps) {
  return (
    <div className={cn(SHEET_OPS_SCROLL, className)}>{children}</div>
  )
}

const SHEET_OPS_SCROLL_FLUSH = "min-h-0 flex-1 overflow-y-auto"

interface SheetOpsFooterProps {
  onClose: () => void
  label?: string
  className?: string
}

export function SheetOpsFooter({
  onClose,
  label = "Cerrar",
  className,
}: SheetOpsFooterProps) {
  return (
    <SheetFooter className={cn(SHEET_OPS_FOOTER, className)}>
      <Button
        type="button"
        variant="outline"
        className="w-full shadow-xs"
        onClick={onClose}
      >
        {label}
      </Button>
    </SheetFooter>
  )
}

interface SheetContentTableProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  profile?: SheetContentProfile
  side?: "left" | "right"
  /** Default `false` — cierre por X del header; más espacio para tabla + paginación. */
  showFooter?: boolean
  /** Override de ancho (≥640px). Ej. `data-[side=right]:sm:max-w-3xl` — acordar en DS. */
  contentClassName?: string
  /** Acción en header (antes de cerrar). Ej. moneda de solo lectura en ROI Socio. */
  headerAction?: ReactNode
}

/**
 * Sheet OPS para tablas anchas: header → scroll → footer «Cerrar» opcional.
 * Tabla: `GddRoiRecuperoTable` con `layout="embedded"` y `showColumnVisibility={false}`.
 */
export function SheetContentTable({
  open,
  onOpenChange,
  title,
  children,
  profile = "table",
  side = "right",
  showFooter = false,
  contentClassName,
  headerAction,
}: SheetContentTableProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        showCloseButton={false}
        className={sheetContentClassName(profile, contentClassName)}
      >
        <SheetOpsHeader title={title} variant="bordered" action={headerAction} />
        <SheetOpsScroll>{children}</SheetOpsScroll>
        {showFooter ? (
          <SheetOpsFooter onClose={() => onOpenChange(false)} />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

interface SheetContentDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  /** `padded` = `SheetOpsScroll`; `flush` = scroll sin padding (contenido define `p-6`). */
  scrollVariant?: "padded" | "flush"
  showFooter?: boolean
  side?: "left" | "right"
  scrollClassName?: string
  /** Volver a sheet superior — solo cuando hay drill-down (ej. medidor → socio). */
  onBack?: () => void
}

/**
 * Sheet OPS perfil detalle: header + scroll + footer «Cerrar» opcional.
 */
export function SheetContentDetail({
  open,
  onOpenChange,
  title,
  children,
  scrollVariant = "padded",
  showFooter = true,
  side = "right",
  scrollClassName,
  onBack,
}: SheetContentDetailProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        showCloseButton={false}
        className={sheetContentClassName("detail")}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <SheetOpsHeader title={title} variant="detail" onBack={onBack} />
          {scrollVariant === "flush" ? (
            <div className={cn(SHEET_OPS_SCROLL_FLUSH, scrollClassName)}>
              {children}
            </div>
          ) : (
            <SheetOpsScroll className={scrollClassName}>{children}</SheetOpsScroll>
          )}
          {showFooter ? (
            <SheetOpsFooter onClose={() => onOpenChange(false)} />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
