// components/gdd/GddMantenimientoView.tsx
import { ParkMantenimientoView } from "@/components/mantenimiento/ParkMantenimientoView"
import { gddMantenimientoHistorialMock } from "@/data/mantenimiento-mock"
import { parkName } from "@/data/gdd-performance-mock"

export function GddMantenimientoView() {
  return (
    <ParkMantenimientoView
      parkName={parkName}
      modelType="GDD"
      data={gddMantenimientoHistorialMock}
    />
  )
}
