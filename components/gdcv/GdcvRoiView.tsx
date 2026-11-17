// components/gdcv/GdcvRoiView.tsx
"use client"

import { RoiRealizadoContent } from "@/components/gdd/RoiRealizadoContent"
import { gdcvRoiProjectionData, gdcvRoiProyectado } from "@/data/gdcv-agc-mock"
import type { RoiRealizado } from "@/lib/api/types"
import type { BloqueIngresos } from "@/lib/ingresos-bloque"

interface GdcvRoiViewProps {
  /** ROI realizado desde ingresos reales (GET /roi/realizado). Payback, plazo, TIR y
   * escenarios siguen sin dato real y se muestran como no disponibles/estimativos. */
  roi: BloqueIngresos<RoiRealizado>
}

export function GdcvRoiView({ roi }: GdcvRoiViewProps) {
  return <RoiRealizadoContent roi={roi} proyectadoData={gdcvRoiProyectado} proyeccionMock={gdcvRoiProjectionData} />
}
