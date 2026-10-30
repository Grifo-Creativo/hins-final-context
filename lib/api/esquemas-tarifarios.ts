import { apiFetch } from "@/lib/api/client"
import { buildQuery, DEFAULT_PAGE_SIZE, emptyPage, toNumber, type PaginatedResponse } from "@/lib/api/paginated"
import type {
  CreateEsquemaDto,
  Destino,
  Esquema,
  FranjaEfectiva,
  FranjasEfectivas,
  UpdateEsquemaDto,
} from "@/lib/api/types"

const nullableNumber = (v: unknown): number | null => (v === null || v === undefined ? null : toNumber(v))

function normalize(raw: Esquema): Esquema {
  return {
    ...raw,
    franjas: raw.franjas.map((f) => ({
      ...f,
      valorEnergia: nullableNumber(f.valorEnergia),
      valorInyeccion: nullableNumber(f.valorInyeccion),
    })),
  }
}

function normalizeEfectiva(f: FranjaEfectiva): FranjaEfectiva {
  return {
    ...f,
    valorEnergia: { ...f.valorEnergia, valor: toNumber(f.valorEnergia.valor) },
    valorInyeccion: { ...f.valorInyeccion, valor: toNumber(f.valorInyeccion.valor) },
  }
}

const base = (destino: Destino) =>
  destino.tipo === "PARQUE" ? `/parques/${destino.parqueId}` : `/parques/${destino.parqueId}/socios/${destino.socioId}`

export async function listEsquemas(
  destino: Destino,
  params: { page?: number; limit?: number }
): Promise<PaginatedResponse<Esquema>> {
  const { page = 1, limit = DEFAULT_PAGE_SIZE } = params
  const result = await apiFetch<PaginatedResponse<Esquema>>(
    `${base(destino)}/esquemas-tarifarios${buildQuery({ page, limit })}`
  )
  if (!result) return emptyPage(page, limit)
  return { ...result, items: result.items.map(normalize) }
}

export async function createEsquema(destino: Destino, dto: CreateEsquemaDto): Promise<Esquema | null> {
  const result = await apiFetch<Esquema>(`${base(destino)}/esquemas-tarifarios`, { method: "POST", body: dto })
  return result ? normalize(result) : null
}

export async function updateEsquema(id: string, dto: UpdateEsquemaDto): Promise<Esquema | null> {
  const result = await apiFetch<Esquema>(`/esquemas-tarifarios/${id}`, { method: "PATCH", body: dto })
  return result ? normalize(result) : null
}

export async function deleteEsquema(id: string): Promise<null> {
  await apiFetch(`/esquemas-tarifarios/${id}`, { method: "DELETE" })
  return null
}

/** Franjas efectivas a una fecha (por defecto hoy). Un socio sin esquema propio recibe las del parque. null si no hay esquema. */
export async function getFranjasEfectivas(destino: Destino, fecha?: string): Promise<FranjasEfectivas | null> {
  const result = await apiFetch<FranjasEfectivas>(`${base(destino)}/tarifa-efectiva/franjas${buildQuery({ fecha })}`)
  return result ? { ...result, franjas: result.franjas.map(normalizeEfectiva) } : null
}
