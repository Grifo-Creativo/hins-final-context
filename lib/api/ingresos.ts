import { apiFetch } from "@/lib/api/client"
import { buildQuery } from "@/lib/api/paginated"
import type {
  AgruparIngresos,
  AlcanceIngresos,
  IngresosPorSocio,
  KpisIngresos,
  ResumenIngresos,
} from "@/lib/api/types"

/**
 * Cliente de ingresos por inyección. `alcance` es obligatorio: PARQUE y SOCIOS
 * nunca se suman entre sí (specs/015-ingresos-detalle-proyecto, FR-022).
 * Devuelve null si el parque no existe (404) — el llamador muestra estado vacío.
 */
export async function getIngresosKpis(
  parqueId: string,
  params: { alcance: AlcanceIngresos; periodo?: string; socioId?: string }
): Promise<KpisIngresos | null> {
  return apiFetch<KpisIngresos>(`/parques/${parqueId}/ingresos/kpis${buildQuery(params)}`)
}

export async function getIngresosResumen(
  parqueId: string,
  params: {
    alcance: AlcanceIngresos
    agrupar?: AgruparIngresos
    desde?: string
    hasta?: string
    socioId?: string
    medidorId?: string
    porFranja?: boolean
  }
): Promise<ResumenIngresos | null> {
  const { porFranja, ...rest } = params
  return apiFetch<ResumenIngresos>(
    `/parques/${parqueId}/ingresos/resumen${buildQuery({ ...rest, porFranja: porFranja ? "true" : undefined })}`
  )
}

/** Solo HINS_ADMIN / AGC. Siempre alcance SOCIOS. */
export async function getIngresosPorSocio(
  parqueId: string,
  params: { periodo?: string; desde?: string; hasta?: string } = {}
): Promise<IngresosPorSocio | null> {
  return apiFetch<IngresosPorSocio>(`/parques/${parqueId}/ingresos/por-socio${buildQuery(params)}`)
}
