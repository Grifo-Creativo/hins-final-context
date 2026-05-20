// components/mantenimiento/ParkMantenimientoView.tsx
import { MantenimientoHistorialTable } from "@/components/mantenimiento/MantenimientoHistorialTable"
import { Badge } from "@/components/ui/badge"
import type { MantenimientoHistorialRow } from "@/data/mantenimiento-mock"
import { cn } from "@/lib/utils"

export type ParkModelType = "GDD" | "GDC" | "GDCV"

const modelBadgeClass: Record<ParkModelType, string> = {
  GDD: "border-transparent bg-green-600 font-medium text-white hover:bg-green-600",
  GDC: "border-transparent bg-amber-600 font-medium text-white hover:bg-amber-600",
  GDCV: "border-transparent bg-blue-600 font-medium text-white hover:bg-blue-600",
}

interface ParkMantenimientoViewProps {
  parkName: string
  modelType: ParkModelType
  data: MantenimientoHistorialRow[]
}

export function ParkMantenimientoView({
  parkName,
  modelType,
  data,
}: ParkMantenimientoViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h1 className="min-w-0 max-w-full text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {parkName}
          </h1>
          <Badge
            variant="secondary"
            className={cn("shrink-0", modelBadgeClass[modelType])}
          >
            {modelType}
          </Badge>
        </div>
      </header>

      <MantenimientoHistorialTable data={data} />
    </div>
  )
}
