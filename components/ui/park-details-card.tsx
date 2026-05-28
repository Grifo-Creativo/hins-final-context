// components/ui/park-details-card.tsx
import Image from "next/image"

import { CardWithContent } from "@/components/ui/card-with-content"
import { KpiSecondaryMetric } from "@/components/ui/kpi-secondary-metric"
import { cn } from "@/lib/utils"

export type ParkDetailsMetric = {
  label: string
  value: string
}

export type ParkDetailsCardProps = {
  imageSrc: string
  imageAlt: string
  metrics: readonly [
    ParkDetailsMetric,
    ParkDetailsMetric,
    ParkDetailsMetric,
    ParkDetailsMetric,
  ]
  className?: string
  /** Dimensiones intrínsecas del asset — la altura en pantalla escala con el ancho de la card. */
  imageWidth?: number
  imageHeight?: number
}

/** Proporción nativa del PNG GDD; GDCV puede pasar imageWidth/imageHeight distintos. */
const DEFAULT_PARK_IMAGE_WIDTH = 478
const DEFAULT_PARK_IMAGE_HEIGHT = 347

export function ParkDetailsCard({
  imageSrc,
  imageAlt,
  metrics,
  className,
  imageWidth = DEFAULT_PARK_IMAGE_WIDTH,
  imageHeight = DEFAULT_PARK_IMAGE_HEIGHT,
}: ParkDetailsCardProps) {
  return (
    <CardWithContent title="" noPadding className={cn("h-full", className)}>
      <div className="flex h-full min-h-0 flex-col">
        <div className="relative w-full shrink-0 leading-none">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="block h-auto w-full"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <KpiSecondaryMetric
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </div>
        </div>
      </div>
    </CardWithContent>
  )
}
