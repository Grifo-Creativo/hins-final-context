// components/gdcv/GdcvMantenimientoView.tsx
import { ParkMantenimientoView } from "@/components/mantenimiento/ParkMantenimientoView"
import { gdcvMantenimientoHistorialMock } from "@/data/mantenimiento-mock"
import { gdcvParkName } from "@/data/gdcv-mock"

export function GdcvMantenimientoView() {
  return (
    <ParkMantenimientoView
      parkName={gdcvParkName}
      modelType="GDCV"
      data={gdcvMantenimientoHistorialMock}
    />
  )
}
