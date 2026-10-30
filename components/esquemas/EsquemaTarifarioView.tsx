// components/esquemas/EsquemaTarifarioView.tsx — Server Component compartido por /gdd, /gdc y /gdcv /tarifas
import { redirect } from "next/navigation"

import { EsquemaParquePanel } from "@/components/esquemas/EsquemaParquePanel"
import { UnauthorizedError } from "@/lib/api/client"
import { resolveDashboardContext } from "@/lib/api/dashboard-context"
import { listNombresTarifa } from "@/lib/api/esquema-catalogo"
import { getFranjasEfectivas, listEsquemas } from "@/lib/api/esquemas-tarifarios"
import { requireReader } from "@/lib/api/guards"
import { loadList } from "@/lib/api/load-list"
import { parsePage } from "@/lib/api/paginated"
import type { Destino, FranjasEfectivas } from "@/lib/api/types"
import { getArgentinaTodayIso } from "@/lib/argentina-day-range"

interface EsquemaTarifarioViewProps {
  searchParams: Promise<{ proyectoId?: string; fecha?: string; page?: string }>
}

interface LoadedContext {
  parqueId: string
  efectivas: FranjasEfectivas | null
  catalogo: string[]
  efectivasError: string | null
}

async function loadContext(proyectoId: string, fecha: string, loadCatalogo: boolean): Promise<LoadedContext | null> {
  try {
    const ctx = await resolveDashboardContext(proyectoId)
    if (!ctx) return null
    const parqueId = ctx.parque.id
    const [efectivas, catalogo] = await Promise.all([
      getFranjasEfectivas({ tipo: "PARQUE", parqueId }, fecha).then(
        (value) => ({ value, error: null as string | null }),
        (error: unknown) => {
          if (error instanceof UnauthorizedError) throw error
          return { value: null, error: error instanceof Error ? error.message : "No se pudo cargar la tarifa efectiva" }
        }
      ),
      loadCatalogo ? listNombresTarifa() : Promise.resolve([] as string[]),
    ])
    return { parqueId, efectivas: efectivas.value, catalogo, efectivasError: efectivas.error }
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/login")
    throw error
  }
}

export async function EsquemaTarifarioView({ searchParams }: EsquemaTarifarioViewProps) {
  const role = await requireReader()
  const { proyectoId, fecha: fechaParam, page } = await searchParams
  if (!proyectoId) {
    return <p className="text-sm text-muted-foreground">Falta el parámetro proyectoId.</p>
  }

  const fecha = fechaParam && /^\d{4}-\d{2}-\d{2}$/.test(fechaParam) ? fechaParam : getArgentinaTodayIso()

  const ctx = await loadContext(proyectoId, fecha, role === "HINS_ADMIN")
  if (!ctx) return <p className="text-sm text-muted-foreground">Proyecto o parque no encontrado.</p>

  const destino: Destino = { tipo: "PARQUE", parqueId: ctx.parqueId }
  const { efectivas, catalogo, efectivasError } = ctx
  const historial = await loadList((p) => listEsquemas(destino, { page: p }), parsePage(page))

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Tarifas del parque</h1>
      <EsquemaParquePanel
        destino={destino}
        efectivas={efectivas}
        historial={historial}
        catalogo={catalogo}
        canWrite={role === "HINS_ADMIN"}
        fecha={fecha}
        loadError={historial.loadError ?? efectivasError}
      />
    </div>
  )
}
