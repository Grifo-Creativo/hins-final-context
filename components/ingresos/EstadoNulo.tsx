import { cn } from "@/lib/utils"

export type EstadoNuloVariant =
  | "sin-tarifa"
  | "sin-ingresos"
  | "sin-tipo-cambio"
  | "sin-inversion-meta"
  | "sin-medidor"
  | "sin-ingresos-periodo"
  | "sin-acceso"
  | "no-disponible"

const TEXTOS: Record<EstadoNuloVariant, string> = {
  "sin-tarifa": "Sin tarifa vigente",
  "sin-ingresos": "Sin ingresos todavía",
  "sin-tipo-cambio": "Sin tipo de cambio",
  "sin-inversion-meta": "Falta registrar la inversión meta para calcular el pendiente y el porcentaje.",
  "sin-medidor": "Sin medidor",
  "sin-ingresos-periodo": "Sin ingresos en el período",
  "sin-acceso": "No tenés acceso a esta información.",
  "no-disponible": "No disponible",
}

interface EstadoNuloProps {
  variant: EstadoNuloVariant
  /** Reemplaza el texto por defecto. */
  children?: React.ReactNode
  className?: string
}

/** Estado explícito y diferenciado para valores nulos (FR-026). */
export function EstadoNulo({ variant, children, className }: EstadoNuloProps) {
  return (
    <p data-estado={variant} className={cn("text-sm text-muted-foreground", className)}>
      {children ?? TEXTOS[variant]}
    </p>
  )
}

export function textoEstadoNulo(variant: EstadoNuloVariant): string {
  return TEXTOS[variant]
}
