import { describe, it, expect, vi, afterEach } from "vitest"

vi.mock("@/lib/api/client", () => ({
  apiFetch: vi.fn(),
  UnauthorizedError: class UnauthorizedError extends Error {
    constructor(message = "Sesión expirada o inválida") {
      super(message)
      this.name = "UnauthorizedError"
    }
  },
}))

import { apiFetch, UnauthorizedError } from "@/lib/api/client"
import { GET } from "@/app/api/parques/[parqueId]/energia-dia/route"

function makeRequest(periodo?: string): Request {
  const url = periodo
    ? `http://localhost/api/parques/p1/energia-dia?periodo=${periodo}`
    : "http://localhost/api/parques/p1/energia-dia"
  return new Request(url)
}

describe("GET /api/parques/[parqueId]/energia-dia", () => {
  afterEach(() => vi.restoreAllMocks())

  it("returns 400 when periodo is missing", async () => {
    const response = await GET(makeRequest(), { params: Promise.resolve({ parqueId: "p1" }) })
    expect(response.status).toBe(400)
  })

  it("returns the most recent registro for the day", async () => {
    const registros = [
      {
        capturadoEn: "2026-07-20T08:00:00.000Z",
        energiaDiaKwh: 10,
        ingresoDia: 1,
        energiaTotalKwh: 100,
        energiaInyectadaDiaKwh: 0,
        energiaConsumidaDiaKwh: 0,
      },
      {
        capturadoEn: "2026-07-20T14:41:56.703Z",
        energiaDiaKwh: 93.61,
        ingresoDia: 6843.04,
        energiaTotalKwh: 901509.7,
        energiaInyectadaDiaKwh: 0,
        energiaConsumidaDiaKwh: 0,
      },
    ]
    vi.mocked(apiFetch).mockResolvedValue(registros)
    const response = await GET(makeRequest("2026-07-20"), { params: Promise.resolve({ parqueId: "p1" }) })
    expect(apiFetch).toHaveBeenCalledWith("/parques/p1/energia?periodo=2026-07-20")
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.registro).toEqual(registros[1])
    expect(body.registros).toEqual([registros[0], registros[1]])
  })

  it("returns registro: null and registros: [] when there are no records for the day", async () => {
    vi.mocked(apiFetch).mockResolvedValue(null)
    const response = await GET(makeRequest("2026-07-20"), { params: Promise.resolve({ parqueId: "p1" }) })
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.registro).toBeNull()
    expect(body.registros).toEqual([])
  })

  it("returns 401 when the session is unauthorized", async () => {
    vi.mocked(apiFetch).mockRejectedValue(new UnauthorizedError())
    const response = await GET(makeRequest("2026-07-20"), { params: Promise.resolve({ parqueId: "p1" }) })
    expect(response.status).toBe(401)
  })

  it("returns 500 on unexpected errors", async () => {
    vi.mocked(apiFetch).mockRejectedValue(new Error("boom"))
    const response = await GET(makeRequest("2026-07-20"), { params: Promise.resolve({ parqueId: "p1" }) })
    expect(response.status).toBe(500)
  })
})
