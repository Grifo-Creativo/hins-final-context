// components/gdcv/SocioTarifasDialog.tsx — tarifa efectiva y esquemas tarifarios de un socio
"use client"

import { useCallback, useEffect, useState } from "react"

import { EsquemaPanel } from "@/components/esquemas/EsquemaPanel"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { PaginatedResponse } from "@/lib/api/paginated"
import type { Esquema, FranjasEfectivas } from "@/lib/api/types"
import { getArgentinaTodayIso } from "@/lib/argentina-day-range"
import { DIALOG_BODY_SCROLL, DIALOG_HEADER_FLUSH } from "@/lib/dialog-layout"
import { cn } from "@/lib/utils"

interface TarifasData {
  efectivas: FranjasEfectivas | null
  historial: PaginatedResponse<Esquema>
  catalogo: string[]
  canWrite: boolean
}

interface SocioTarifasDialogProps {
  parqueId: string
  socioId: string
  socioNombre: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SocioTarifasDialog({ parqueId, socioId, socioNombre, open, onOpenChange }: SocioTarifasDialogProps) {
  const [fecha, setFecha] = useState(() => getArgentinaTodayIso())
  const [page, setPage] = useState(1)
  const [data, setData] = useState<TarifasData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    fetch(`/api/parques/${parqueId}/socios/${socioId}/tarifas?fecha=${fecha}&page=${page}`)
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body?.message ?? "Error al consultar las tarifas del socio")
        if (!cancelled) {
          setData(body)
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error al consultar las tarifas del socio")
      })
    return () => {
      cancelled = true
    }
  }, [open, parqueId, socioId, fecha, page, reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-4xl">
        <DialogHeader className={DIALOG_HEADER_FLUSH}>
          <DialogTitle>Tarifas — {socioNombre}</DialogTitle>
        </DialogHeader>
        <div className={cn(DIALOG_BODY_SCROLL, "pb-4")}>
          {data ? (
            <EsquemaPanel
              destino={{ tipo: "SOCIO", parqueId, socioId }}
              efectivas={data.efectivas}
              historial={data.historial}
              catalogo={data.catalogo}
              canWrite={data.canWrite}
              fecha={fecha}
              loadError={error}
              onFechaChange={(f) => {
                setFecha(f)
                setPage(1)
              }}
              onPageChange={setPage}
              onChanged={reload}
            />
          ) : error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : (
            <div className="flex flex-col gap-2" aria-busy="true">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
