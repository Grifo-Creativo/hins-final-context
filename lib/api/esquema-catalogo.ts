import { apiFetch } from "@/lib/api/client"
import { buildQuery, type PaginatedResponse } from "@/lib/api/paginated"
import type { Tarifa } from "@/lib/api/types"

const PAGE_LIMIT = 100
const MAX_PAGES = 20

/** Nombres únicos del catálogo de tarifas, para el selector de franja. */
export async function listNombresTarifa(): Promise<string[]> {
  const nombres = new Set<string>()
  for (let page = 1; page <= MAX_PAGES; page++) {
    const result = await apiFetch<PaginatedResponse<Tarifa>>(`/tarifas${buildQuery({ page, limit: PAGE_LIMIT })}`)
    if (!result) break
    for (const t of result.items) nombres.add(t.nombre)
    if (page * result.limit >= result.total) break
  }
  return [...nombres].sort((a, b) => a.localeCompare(b, "es"))
}
