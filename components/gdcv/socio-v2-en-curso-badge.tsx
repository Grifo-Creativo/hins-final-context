// components/gdcv/socio-v2-en-curso-badge.tsx
import { Badge } from "@/components/ui/badge"

/** Mismo patrón que `CompensacionesTable` — estado En Curso. */
export function SocioV2EnCursoBadge() {
  return (
    <Badge className="border-transparent bg-green-100 text-green-700 hover:bg-green-100">
      En Curso
    </Badge>
  )
}
