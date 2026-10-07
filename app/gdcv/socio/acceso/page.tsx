// app/gdcv/socio/acceso/page.tsx
import { SocioAccessView } from "@/components/gdcv/SocioAccessView"
import { Suspense } from "react";

export default function SocioAccesoPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SocioAccessView />
    </Suspense>
  );
}
