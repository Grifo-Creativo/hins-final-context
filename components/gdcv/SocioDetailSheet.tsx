// components/gdcv/SocioDetailSheet.tsx
"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { CardWire } from "@/components/ui/card-wire"
import { FeatureItem } from "@/components/ui/feature-item"
import { SheetContentDetail } from "@/components/ui/sheet-ops"
import { StatList, type StatListItem } from "@/components/ui/stat-list"
import type { MedidorDetalle, SocioRow } from "@/data/gdcv-mock"
import { textoEstadoNulo } from "@/components/ingresos/EstadoNulo"

/** Fila de tabla / trigger del sheet — alias local para props públicas. */
export type Socio = SocioRow

const ESQUEMA_LABELS = { PROPIO: "Propio", PARQUE: "Del parque" } as const

const NO_DISPONIBLE = textoEstadoNulo("no-disponible")

interface SocioDetailData {
  medidor: string
  participacion: string
  potenciaAsociada: string
  energiaGenerada: string
  ingresoInyeccion: string
}

/** Todo sale de la fila real (GET /ingresos/por-socio); nada se inventa (FR-011). */
function detailFromRow(socio: Socio, medidor: MedidorDetalle | null): SocioDetailData {
  if (medidor) {
    return {
      medidor: medidor.numero,
      participacion: medidor.participacion,
      potenciaAsociada: medidor.potenciaAsociada,
      energiaGenerada: medidor.energiaGenerada,
      ingresoInyeccion: medidor.ahorroGenerado,
    }
  }
  return {
    medidor: socio.medidor,
    participacion: socio.participacion,
    potenciaAsociada: socio.potenciaAsociada,
    energiaGenerada: socio.energiaGenerada,
    ingresoInyeccion: socio.ahorroGenerado,
  }
}

function buildInfoItems(detail: SocioDetailData): StatListItem[] {
  return [
    { name: "Potencia Asociada", value: detail.potenciaAsociada },
    // Sin dato real todavía (fuera de alcance): no disponible, no valores de ejemplo.
    { name: "Fecha de alta", value: NO_DISPONIBLE },
    { name: "Nombre del responsable", value: NO_DISPONIBLE },
    { name: "Teléfono de contacto", value: NO_DISPONIBLE },
    { name: "Ahorro en Emisiones", value: NO_DISPONIBLE },
  ]
}

interface SocioDetailSheetProps {
  socio: Socio | null
  /** Medidor puntual (sheet intermedio de socios con +1 medidor). */
  selectedMedidor?: MedidorDetalle | null
  /** Mes consultado, p.ej. "Abril 2026". */
  periodoLabel?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Volver al sheet intermedio de medidores (solo si se abrió desde ahí). */
  onBack?: () => void
}

export function SocioDetailSheet({
  socio,
  selectedMedidor = null,
  periodoLabel,
  open,
  onOpenChange,
  onBack,
}: SocioDetailSheetProps) {
  if (!socio) return null

  const detail = detailFromRow(socio, selectedMedidor)
  const infoItems = buildInfoItems(detail)

  return (
    <SheetContentDetail
      open={open}
      onOpenChange={onOpenChange}
      title={socio.nombre}
      scrollVariant="flush"
      onBack={onBack}
    >
      <div className="flex flex-col gap-4 sm:gap-6 p-6 pt-0">
        {socio.estado === "sin-medidor" && (
          <Alert variant="info" className="w-full p-4">
            <AlertDescription>{textoEstadoNulo("sin-medidor")} registrado: no hay energía para valorizar.</AlertDescription>
          </Alert>
        )}
        {socio.estado === "sin-ingresos" && (
          <Alert variant="info" className="w-full p-4">
            <AlertDescription>{textoEstadoNulo("sin-ingresos-periodo")}.</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FeatureItem orientation="vertical" label="Nº de Medidor" value={detail.medidor} />
          <FeatureItem orientation="vertical" label="Participación (%)" value={detail.participacion} />
        </div>

        <CardWire>
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground">Energía inyectada</p>
                {periodoLabel && <p className="text-xs text-muted-foreground">{periodoLabel}</p>}
              </div>
              <p className="shrink-0 text-xl font-semibold tabular-nums text-[#0A0A0A]">{detail.energiaGenerada}</p>
            </div>

            <FeatureItem label="Ingresos por inyección" value={detail.ingresoInyeccion} />
            <FeatureItem
              label="Esquema tarifario"
              value={socio.esquema ? ESQUEMA_LABELS[socio.esquema] : "—"}
            />
            {/* Autoconsumo y neteo: sin dato real todavía (fuera de alcance). */}
            <FeatureItem label="Autoconsumo" value={NO_DISPONIBLE} />
          </div>
        </CardWire>

        <StatList title="Más información del socio" items={infoItems} />
      </div>
    </SheetContentDetail>
  )
}
