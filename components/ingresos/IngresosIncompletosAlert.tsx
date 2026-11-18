import { TriangleAlertIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { hayDatosIncompletos } from "@/lib/ingresos-kpis"
import type { CoberturaIngresos } from "@/lib/api/types"

interface IngresosIncompletosAlertProps {
  cobertura: CoberturaIngresos | null | undefined
  className?: string
}

/** Aviso visible cuando hay registros de energía sin valorizar (FR-023). */
export function IngresosIncompletosAlert({ cobertura, className }: IngresosIncompletosAlertProps) {
  if (!cobertura || !hayDatosIncompletos(cobertura)) return null
  const n = cobertura.registrosSinIngreso

  return (
    <Alert variant="warning" className={className}>
      <TriangleAlertIcon aria-hidden="true" />
      <AlertTitle>Datos de ingresos incompletos</AlertTitle>
      <AlertDescription>
        {n.toLocaleString("es-AR")} {n === 1 ? "registro de energía no pudo" : "registros de energía no pudieron"}{" "}
        valorizarse (sin tarifa vigente u otro motivo). Los importes mostrados pueden ser parciales.
      </AlertDescription>
    </Alert>
  )
}
