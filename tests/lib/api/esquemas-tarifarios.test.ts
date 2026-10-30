import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/api/client", () => ({ apiFetch: vi.fn() }))

import { apiFetch } from "@/lib/api/client"
import {
  createEsquema,
  deleteEsquema,
  getFranjasEfectivas,
  listEsquemas,
  updateEsquema,
} from "@/lib/api/esquemas-tarifarios"
import type { Destino } from "@/lib/api/types"

const parque: Destino = { tipo: "PARQUE", parqueId: "p1" }
const socio: Destino = { tipo: "SOCIO", parqueId: "p1", socioId: "s1" }

const rawEsquema = {
  id: "e1",
  destino: { tipo: "PARQUE", id: "p1" },
  vigenteDesde: "2026-01-01",
  vigenteHasta: null,
  estado: "VIGENTE",
  franjas: [
    { tipo: "PICO", horaInicio: "18:00", horaFin: "23:00", tarifaNombre: "Pico", valorEnergia: "12.5", valorInyeccion: null, unidad: null },
  ],
}

describe("lib/api/esquemas-tarifarios", () => {
  beforeEach(() => vi.clearAllMocks())

  it("listEsquemas de parque arma ruta y coacciona decimales", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ items: [rawEsquema], total: 1, page: 2, limit: 20 })
    const r = await listEsquemas(parque, { page: 2, limit: 20 })
    expect(apiFetch).toHaveBeenCalledWith("/parques/p1/esquemas-tarifarios?page=2&limit=20")
    expect(r.items[0].franjas[0].valorEnergia).toBe(12.5)
    expect(r.items[0].franjas[0].valorInyeccion).toBeNull()
  })

  it("listEsquemas de socio usa la ruta del socio", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ items: [], total: 0, page: 1, limit: 20 })
    await listEsquemas(socio, { page: 1 })
    expect(apiFetch).toHaveBeenCalledWith("/parques/p1/socios/s1/esquemas-tarifarios?page=1&limit=20")
  })

  it("listEsquemas devuelve página vacía ante null", async () => {
    vi.mocked(apiFetch).mockResolvedValue(null)
    expect(await listEsquemas(parque, { page: 1 })).toEqual({ items: [], total: 0, page: 1, limit: 20 })
  })

  it("createEsquema hace POST por destino", async () => {
    vi.mocked(apiFetch).mockResolvedValue(rawEsquema)
    const dto = { vigenteDesde: "2026-11-01", franjas: [] }
    await createEsquema(socio, dto)
    expect(apiFetch).toHaveBeenCalledWith("/parques/p1/socios/s1/esquemas-tarifarios", { method: "POST", body: dto })
  })

  it("updateEsquema hace PATCH", async () => {
    vi.mocked(apiFetch).mockResolvedValue(rawEsquema)
    await updateEsquema("e1", { franjas: [] })
    expect(apiFetch).toHaveBeenCalledWith("/esquemas-tarifarios/e1", { method: "PATCH", body: { franjas: [] } })
  })

  it("deleteEsquema hace DELETE y tolera 204", async () => {
    vi.mocked(apiFetch).mockResolvedValue(null)
    expect(await deleteEsquema("e1")).toBeNull()
    expect(apiFetch).toHaveBeenCalledWith("/esquemas-tarifarios/e1", { method: "DELETE" })
  })

  it("getFranjasEfectivas con fecha, parque y socio", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ esquema: {}, fecha: "2026-10-29", franjas: [] })
    await getFranjasEfectivas(parque, "2026-10-29")
    expect(apiFetch).toHaveBeenLastCalledWith("/parques/p1/tarifa-efectiva/franjas?fecha=2026-10-29")
    await getFranjasEfectivas(socio)
    expect(apiFetch).toHaveBeenLastCalledWith("/parques/p1/socios/s1/tarifa-efectiva/franjas")
  })

  it("getFranjasEfectivas devuelve null si no hay esquema (404)", async () => {
    vi.mocked(apiFetch).mockResolvedValue(null)
    expect(await getFranjasEfectivas(parque)).toBeNull()
  })
})
