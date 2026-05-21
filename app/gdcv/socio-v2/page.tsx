import { CompensacionesTable } from "@/components/gdcv/CompensacionesTable"
import { SocioEnergyViewV2 } from "@/components/gdcv/SocioEnergyViewV2"
import { SocioPageHeading } from "@/components/gdcv/SocioPageHeading"
import { SocioRoiView } from "@/components/gdcv/SocioRoiView"
import { compensacionesMock } from "@/data/gdcv-socio-mock"

export default function SocioV2Page() {
  return (
    <>
      <SocioPageHeading />
      <SocioEnergyViewV2 />
      <SocioRoiView />
      <CompensacionesTable data={compensacionesMock} />
    </>
  )
}
