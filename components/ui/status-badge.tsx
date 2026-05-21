// components/ui/status-badge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const variantStyles = {
  current: "border-transparent bg-green-100 text-green-700 hover:bg-green-100",
} as const

interface StatusBadgeProps {
  status: keyof typeof variantStyles
  children: React.ReactNode
  className?: string
}

/**
 * Badge semántico para estados de entidad (ej. "En Curso").
 *
 * Uso:
 * ```tsx
 * <StatusBadge status="current">En Curso</StatusBadge>
 * ```
 *
 * Mismo token visual que `CompensacionesTable` y `MantenimientoHistorialTable`.
 * Para badges de texto neutro (sin semántica de estado) usar `SoftBadge`.
 */
export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <Badge className={cn(variantStyles[status], className)}>
      {children}
    </Badge>
  )
}
