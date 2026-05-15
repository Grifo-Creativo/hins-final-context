// components/gdcv/SocioDetailSheet.tsx
"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CardWire } from "@/components/ui/card-wire"
import { FeatureItem } from "@/components/ui/feature-item"
import { IconBadge } from "@/components/ui/icon-badge"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { StatList, type StatListItem } from "@/components/ui/stat-list"
import type { SocioRow } from "@/data/gdcv-mock"
import { ParkingMeter, PlugZap, XIcon } from "lucide-react"

/** Fila de tabla / trigger del sheet — alias local para props públicas. */
export type Socio = SocioRow

// Static detail data keyed by socio id — for prototype
const DETAIL_MAP: Record<
  string,
  {
    descripcion: string
    medidor: string
    participacion: string
    energiaGeneradaKwh: string
    energiaGeneradaMes: string
    autoconsumoVirtual: string
    inyectada: string
    autoconsumoKwh: number
    inyectadaKwh: number
    totalKwh: number
    ahorroGenerado: string
    potenciaUtilizada: string
    fechaDeAlta: string
    nombreResponsable: string
    telefonoContacto: string
    ahorroEmisiones: string
  }
> = {
  FC: {
    descripcion: "Dispone de Autoconsumo y Crédito por Inyección a red.",
    medidor: "3551118",
    participacion: "25%",
    energiaGeneradaKwh: "31.0",
    energiaGeneradaMes: "Abril 2026",
    autoconsumoVirtual: "21.0 kWh",
    inyectada: "10.0 kWh",
    autoconsumoKwh: 21.0,
    inyectadaKwh: 10.0,
    totalKwh: 31.0,
    ahorroGenerado: "$62.000",
    potenciaUtilizada: "NN kWh",
    fechaDeAlta: "NN",
    nombreResponsable: "NN",
    telefonoContacto: "NN",
    ahorroEmisiones: "3.47",
  },
}

/** Fallback detail derived from the table row for socios without static data. */
function fallbackDetail(socio: Socio) {
  const kwh = parseFloat(socio.energiaGenerada.replace(/[^0-9.]/g, "")) || 0
  const auto = Math.round(kwh * 0.68 * 10) / 10
  const inj = Math.round((kwh - auto) * 10) / 10
  return {
    descripcion: "Dispone de Autoconsumo Virtual del parque.",
    medidor: socio.medidor,
    participacion: socio.participacion,
    energiaGeneradaKwh: String(kwh),
    energiaGeneradaMes: "Abril 2026",
    autoconsumoVirtual: `${auto} kWh`,
    inyectada: `${inj} kWh`,
    autoconsumoKwh: auto,
    inyectadaKwh: inj,
    totalKwh: kwh,
    ahorroGenerado: socio.ahorroGenerado,
    potenciaUtilizada: "NN kWh",
    fechaDeAlta: "NN",
    nombreResponsable: "NN",
    telefonoContacto: "NN",
    ahorroEmisiones: "NN",
  }
}

function buildInfoItems(detail: ReturnType<typeof fallbackDetail>): StatListItem[] {
  return [
    { name: "Potencia utilizada", value: detail.potenciaUtilizada },
    { name: "Fecha de alta", value: detail.fechaDeAlta },
    { name: "Nombre del responsable", value: detail.nombreResponsable },
    { name: "Teléfono de contacto", value: detail.telefonoContacto },
    { name: "Ahorro en Emisiones", value: detail.ahorroEmisiones },
  ]
}

interface SocioDetailSheetProps {
  socio: Socio | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SocioDetailSheet({
  socio,
  open,
  onOpenChange,
}: SocioDetailSheetProps) {
  if (!socio) return null

  const detail = DETAIL_MAP[socio.id] ?? fallbackDetail(socio)
  const autoconsumoPercent = Math.round((detail.autoconsumoKwh / detail.totalKwh) * 100)
  const inyectadaPercent = 100 - autoconsumoPercent
  const infoItems = buildInfoItems(detail)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex h-full max-h-dvh w-full max-w-sm flex-col gap-0 overflow-hidden p-0"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {/* 1. Header */}
          <SheetHeader className="shrink-0 space-y-0 p-6 text-left">
            <div className="flex flex-row items-start justify-between gap-4">
              <SheetTitle className="pr-2 text-2xl font-semibold leading-tight text-foreground">
                {socio.nombre}
              </SheetTitle>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8 shrink-0 shadow-sm"
                  aria-label="Cerrar"
                >
                  <XIcon className="size-4" aria-hidden />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6 p-6 pt-0">
              {/* 2. Alert — no tocar */}
              {socio.tipo === "Virtual" && (
                <Alert variant="warning" className="w-full p-4">
                  <AlertTitle>⚡ Socio Virtual</AlertTitle>
                  <AlertDescription>
                    Tiene Autoconsumo y Crédito por inyección.
                  </AlertDescription>
                </Alert>
              )}

              {/* 3. Medidor + Participación — bloque independiente */}
              <div className="grid grid-cols-2 gap-4">
                <FeatureItem orientation="vertical" label="Nº de Medidor" value={detail.medidor} />
                <FeatureItem orientation="vertical" label="Participación (%)" value={detail.participacion} />
              </div>

              {/* 4+5. Energía generada + Ahorro — CardWire */}
              <CardWire>
                <div className="flex flex-col gap-6">
                    {/* Row energía */}
                    <div className="flex flex-col gap-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="text-sm font-medium text-foreground">Energía generada</p>
                          <p className="text-xs text-muted-foreground">{detail.energiaGeneradaMes}</p>
                        </div>
                        <p className="shrink-0 text-xl font-semibold tabular-nums text-[#0A0A0A]">
                          {detail.energiaGeneradaKwh}
                          <span className="ml-1 text-sm font-normal text-muted-foreground">kWh</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <IconBadge
                              icon={ParkingMeter}
                              size="sm"
                              className="bg-lime-500 text-white"
                            />
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <p className="text-sm font-medium text-foreground">Autoconsumo</p>
                              <p className="text-xl font-semibold tabular-nums text-[#0A0A0A]">
                                {detail.autoconsumoVirtual.replace(" kWh", "")}
                                <span className="ml-1 text-sm font-normal text-muted-foreground">kWh</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <IconBadge
                              icon={PlugZap}
                              size="sm"
                              className="bg-indigo-500 text-white"
                            />
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <p className="text-sm font-medium text-foreground">Inyectada</p>
                              <p className="text-xl font-semibold tabular-nums text-[#0A0A0A]">
                                {detail.inyectada.replace(" kWh", "")}
                                <span className="ml-1 text-sm font-normal text-muted-foreground">kWh</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div
                            className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
                            role="presentation"
                          >
                            <div
                              className="h-full bg-[var(--energy-autoconsumo)]"
                              style={{ width: `${autoconsumoPercent}%` }}
                            />
                            <div
                              className="h-full bg-[var(--energy-inyectada)]"
                              style={{ width: `${inyectadaPercent}%` }}
                            />
                          </div>
                          <div className="flex w-full text-xs text-muted-foreground">
                            <span className="text-left" style={{ width: `${autoconsumoPercent}%` }}>
                              {autoconsumoPercent}%
                            </span>
                            <span className="text-right" style={{ width: `${inyectadaPercent}%` }}>
                              {inyectadaPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FeatureItem — Ahorro Generado */}
                    <FeatureItem label="Ahorro Generado" value={detail.ahorroGenerado} />
                </div>
              </CardWire>

              {/* 6. Más información del socio */}
              <StatList title="Más información del socio" items={infoItems} />
            </div>
          </div>

          {/* 7. Footer */}
          <div className="shrink-0 border-t border-border bg-popover p-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
