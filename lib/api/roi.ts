import { apiFetch } from "@/lib/api/client"
import { buildQuery } from "@/lib/api/paginated"
import type { RegistrarRoiDto, RegistroRoi, RoiRealizado } from "@/lib/api/types"

export async function listRoi(parqueId: string): Promise<RegistroRoi[]> {
  const result = await apiFetch<RegistroRoi[]>(`/parques/${parqueId}/roi`)
  return result ?? []
}

export async function registrarRoi(parqueId: string, dto: RegistrarRoiDto): Promise<RegistroRoi | null> {
  return apiFetch<RegistroRoi>(`/parques/${parqueId}/roi`, { method: "POST", body: dto })
}

/** ROI realizado en USD a partir de ingresos reales (alcance PARQUE) — FR-012. */
export async function getRoiRealizado(
  parqueId: string,
  params: { socioId?: string; hasta?: string } = {}
): Promise<RoiRealizado | null> {
  return apiFetch<RoiRealizado>(`/parques/${parqueId}/roi/realizado${buildQuery(params)}`)
}
