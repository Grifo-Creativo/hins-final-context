import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))
vi.mock("@/lib/api/esquemas-tarifarios", () => ({
  createEsquema: vi.fn(),
  updateEsquema: vi.fn(),
  deleteEsquema: vi.fn(),
}))

import { revalidatePath } from "next/cache"
import { UnauthorizedError } from "@/lib/api/client"
import { createEsquema, deleteEsquema, updateEsquema } from "@/lib/api/esquemas-tarifarios"
import {
  createEsquemaAction,
  deleteEsquemaAction,
  updateEsquemaAction,
} from "@/components/esquemas/esquema-actions"

const destino = { tipo: "SOCIO", parqueId: "p1", socioId: "s1" } as const
const dto = { vigenteDesde: "2026-11-01", franjas: [] }

describe("esquema actions", () => {
  beforeEach(() => vi.clearAllMocks())

  it("create pasa destino y DTO y revalida las rutas de tarifas", async () => {
    vi.mocked(createEsquema).mockResolvedValue({ id: "e1" } as never)
    expect(await createEsquemaAction(destino, dto)).toEqual({ entidad: { id: "e1" } })
    expect(createEsquema).toHaveBeenCalledWith(destino, dto)
    for (const path of ["/gdd/tarifas", "/gdc/tarifas", "/gdcv/tarifas"]) {
      expect(revalidatePath).toHaveBeenCalledWith(path)
    }
  })

  it("update pasa id y DTO", async () => {
    vi.mocked(updateEsquema).mockResolvedValue({ id: "e1" } as never)
    await updateEsquemaAction("e1", { franjas: [] })
    expect(updateEsquema).toHaveBeenCalledWith("e1", { franjas: [] })
  })

  it("reenvía el mensaje del backend sin ocultarlo", async () => {
    vi.mocked(createEsquema).mockRejectedValue(new Error("Vigente desde igual o anterior al último esquema"))
    expect(await createEsquemaAction(destino, dto)).toEqual({
      error: "Vigente desde igual o anterior al último esquema",
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("delete: null (204) es éxito", async () => {
    vi.mocked(deleteEsquema).mockResolvedValue(null)
    expect(await deleteEsquemaAction("e1")).toEqual({})
  })

  it("sesión expirada redirige a /login", async () => {
    vi.mocked(updateEsquema).mockRejectedValue(new UnauthorizedError())
    await expect(updateEsquemaAction("e1", {})).rejects.toThrow("REDIRECT:/login")
  })
})
