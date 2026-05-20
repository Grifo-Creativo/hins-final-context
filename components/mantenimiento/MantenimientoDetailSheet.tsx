// components/mantenimiento/MantenimientoDetailSheet.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { MantenimientoHistorialRow } from "@/data/mantenimiento-mock"
import { formatMantenimientoSheetTitle } from "@/lib/mantenimiento-format"
import { XIcon } from "lucide-react"

interface MantenimientoDetailSheetProps {
  row: MantenimientoHistorialRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MantenimientoDetailSheet({
  row,
  open,
  onOpenChange,
}: MantenimientoDetailSheetProps) {
  if (!row) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex h-full max-h-dvh w-full max-w-sm flex-col gap-0 overflow-hidden p-0"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <SheetHeader className="shrink-0 space-y-0 p-6 text-left">
            <div className="flex flex-row items-start justify-between gap-4">
              <SheetTitle className="pr-2 text-2xl font-semibold leading-tight text-foreground">
                {formatMantenimientoSheetTitle(row.periodo)}
              </SheetTitle>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8 shrink-0 shadow-xs"
                  aria-label="Cerrar"
                >
                  <XIcon className="size-4" aria-hidden />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-0">
            <p className="text-sm text-muted-foreground">
              Detalle de mantenimiento — próximamente.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
