// components/ui/park-equipment-dialog.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { KpiSecondaryMetric } from "@/components/ui/kpi-secondary-metric"
import type { ParkEquipmentDetail } from "@/data/park-equipment-mock"

interface ParkEquipmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  detail: ParkEquipmentDetail
}

/** Detalle técnico del equipamiento — dialog modal, no compite con el dashboard. */
export function ParkEquipmentDialog({
  open,
  onOpenChange,
  detail,
}: ParkEquipmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {detail.parkName} · Equipamiento
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {detail.metrics.map((metric) => (
            <KpiSecondaryMetric
              key={metric.label}
              label={metric.label}
              value={metric.value}
            />
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="shadow-xs">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
