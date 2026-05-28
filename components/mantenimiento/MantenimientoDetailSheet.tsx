// components/mantenimiento/MantenimientoDetailSheet.tsx
"use client"

import { SheetContentDetail } from "@/components/ui/sheet-ops"
import type { MantenimientoHistorialRow } from "@/data/mantenimiento-mock"
import { formatMantenimientoSheetTitle } from "@/lib/mantenimiento-format"

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
    <SheetContentDetail
      open={open}
      onOpenChange={onOpenChange}
      title={formatMantenimientoSheetTitle(row.periodo)}
      showFooter={false}
    >
      <p className="text-sm text-muted-foreground">
        Detalle de mantenimiento — próximamente.
      </p>
    </SheetContentDetail>
  )
}
