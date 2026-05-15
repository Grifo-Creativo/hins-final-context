// app/gdcv/socio/page.tsx
import { CompensacionesTable } from "@/components/gdcv/CompensacionesTable"
import { SocioEnergyView } from "@/components/gdcv/SocioEnergyView"
import { SocioPageHeading } from "@/components/gdcv/SocioPageHeading"
import { SocioRoiView } from "@/components/gdcv/SocioRoiView"
import { compensacionesMock } from "@/data/gdcv-socio-mock"

export default function SocioPage() {
  return (
    <>
      <SocioPageHeading />
      <SocioEnergyView />
      <SocioRoiView />
      <CompensacionesTable data={compensacionesMock} />
    </>
  )
}
