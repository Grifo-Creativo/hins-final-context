// components/ui/park-details-card.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { ServerCrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardWithContent } from "@/components/ui/card-with-content"
import { KpiSecondaryMetric } from "@/components/ui/kpi-secondary-metric"
import { ParkEquipmentDialog } from "@/components/ui/park-equipment-dialog"
import {
  PARK_EQUIPAMIENTO_METRIC_LABEL,
  type ParkEquipmentDetail,
} from "@/data/park-equipment-mock"
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
  /** Detalle técnico del equipamiento — botón en footer abre dialog. */
  equipmentDetail?: ParkEquipmentDetail
}

/** Grid 2×2 — columna izquierda más ancha para labels largos (1.15fr / 0.85fr). */
export const PARK_DETAILS_METRICS_GRID =
  "grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-4"

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
  equipmentDetail,
}: ParkDetailsCardProps) {
  const [equipmentOpen, setEquipmentOpen] = useState(false)

  return (
    <>
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
          <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
            <div className={PARK_DETAILS_METRICS_GRID}>
              {metrics.map((metric) => (
                <KpiSecondaryMetric
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  valueClassName={
                    metric.label === PARK_EQUIPAMIENTO_METRIC_LABEL
                      ? "truncate"
                      : undefined
                  }
                  valueTitle={
                    metric.label === PARK_EQUIPAMIENTO_METRIC_LABEL
                      ? metric.value
                      : undefined
                  }
                />
              ))}
            </div>
            {equipmentDetail ? (
              <Button
                type="button"
                variant="outline"
                className="mt-auto w-full shadow-xs"
                onClick={() => setEquipmentOpen(true)}
              >
                <ServerCrashIcon aria-hidden />
                Detalle de equipamiento
              </Button>
            ) : null}
          </div>
        </div>
      </CardWithContent>

      {equipmentDetail ? (
        <ParkEquipmentDialog
          open={equipmentOpen}
          onOpenChange={setEquipmentOpen}
          detail={equipmentDetail}
        />
      ) : null}
    </>
  )
}
