// components/ui/model-badge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ParkModel = "GDD" | "GDCV" | "GDC"

const modelStyles: Record<ParkModel, string> = {
  GDD:  "border-transparent bg-green-600 text-white hover:bg-green-600",
  GDCV: "border-transparent bg-blue-600  text-white hover:bg-blue-600",
  GDC:  "border-transparent bg-amber-600 text-white hover:bg-amber-600",
}

interface ModelBadgeProps {
  model: ParkModel
  className?: string
}

/**
 * Badge de tipo de modelo de parque (GDD / GDCV / GDC).
 *
 * Uso:
 * ```tsx
 * <ModelBadge model="GDD" />
 * <ModelBadge model="GDCV" />
 * <ModelBadge model="GDC" />
 * ```
 *
 * El texto siempre es el nombre del modelo — no acepta `children`.
 * Para estados semánticos live/vigente usar `StatusBadge`.
 */
export function ModelBadge({ model, className }: ModelBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("shrink-0 font-medium", modelStyles[model], className)}
    >
      {model}
    </Badge>
  )
}
