// components/gdd/GddRoiView.tsx
"use client"

import { RoiRealizadoContent } from "@/components/gdd/RoiRealizadoContent"
import { gddRoiProjectionData } from "@/data/gdd-roi-mock"
import type { RoiRealizado } from "@/lib/api/types"
import type { BloqueIngresos } from "@/lib/ingresos-bloque"

interface GddRoiViewProps {
  /** ROI realizado desde ingresos reales (GET /roi/realizado). Payback, plazo, TIR y
   * escenarios siguen sin dato real y se muestran como no disponibles/estimativos. */
  roi: BloqueIngresos<RoiRealizado>
}

export function GddRoiView({ roi }: GddRoiViewProps) {
  return <RoiRealizadoContent roi={roi} proyeccionMock={gddRoiProjectionData} />
}
