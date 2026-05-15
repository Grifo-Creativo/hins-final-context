// app/gdcv/socio/parque/page.tsx
import { GeneracionTable } from "@/components/gdcv/GeneracionTable"
import { SocioPageHeading } from "@/components/gdcv/SocioPageHeading"
import { SocioPerformanceView } from "@/components/gdcv/SocioPerformanceView"
import { generacionMock } from "@/data/gdcv-socio-mock"

export default function SocioParquePage() {
  return (
    <>
      <SocioPageHeading />
      <SocioPerformanceView />
      <GeneracionTable data={generacionMock} />
    </>
  )
}
