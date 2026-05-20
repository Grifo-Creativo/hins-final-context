// components/gdc/GdcMantenimientoView.tsx
import { ParkMantenimientoView } from "@/components/mantenimiento/ParkMantenimientoView"
import {
  gdcMantenimientoHistorialMock,
  gdcParkName,
} from "@/data/mantenimiento-mock"

export function GdcMantenimientoView() {
  return (
    <ParkMantenimientoView
      parkName={gdcParkName}
      modelType="GDC"
      data={gdcMantenimientoHistorialMock}
    />
  )
}
