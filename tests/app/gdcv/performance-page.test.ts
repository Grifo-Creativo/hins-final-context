import { describe, it, expect, vi, afterEach } from "vitest"

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

vi.mock("@/lib/api/client", () => ({
  UnauthorizedError: class UnauthorizedError extends Error {
    constructor(message = "Sesión expirada o inválida") {
      super(message)
      this.name = "UnauthorizedError"
    }
  },
}))

vi.mock("@/lib/api/dashboard-context", () => ({
  resolveDashboardContext: vi.fn(),
}))

vi.mock("@/lib/api/energia", () => ({
  listEnergia: vi.fn(),
  listEnergiaDiaria: vi.fn(),
}))

vi.mock("@/lib/api/socios", () => ({
  listSocios: vi.fn(),
}))

vi.mock("@/components/gdcv/GdcvPerformanceView", () => ({
  GdcvPerformanceView: vi.fn(() => null),
}))

vi.mock("@/components/gdcv/GdcvPageHeading", () => ({
  GdcvPageHeading: () => null,
}))

import { redirect } from "next/navigation"
import { UnauthorizedError } from "@/lib/api/client"
import { resolveDashboardContext } from "@/lib/api/dashboard-context"
import { listEnergia, listEnergiaDiaria } from "@/lib/api/energia"
import { listSocios } from "@/lib/api/socios"
import GdcvPerformancePage from "@/app/gdcv/performance/page"
import type { ReactElement } from "react"

function findViewProps(element: ReactElement): Record<string, unknown> {
  const children = (element.props as { children: ReactElement[] }).children
  const view = children[children.length - 1]
  return view.props as Record<string, unknown>
}

const parque = {
  id: "parque-1",
  proyectoId: "proy-1",
  potenciaTotalKwp: 100,
  fechaPuestaEnMarcha: "2026-01-01",
  stationExternalId: null,
  nombreExterno: null,
  direccion: null,
  longitud: null,
  latitud: null,
  contactoNombre: null,
  contactoInfo: null,
}

const proyecto = {
  id: "proy-1",
  nombre: "PSF Test",
  modelo: "GDCV" as const,
  ubicacion: "",
  fechaAlta: "2026-01-01",
  activo: true,
}

describe("app/gdcv/performance/page", () => {
  afterEach(() => vi.restoreAllMocks())

  it("passes registrosEnergia, registrosEnergiaDiaria and periodoActual to GdcvPerformanceView", async () => {
    vi.mocked(resolveDashboardContext).mockResolvedValue({ proyecto, parque })
    const registrosEnergia = [{ periodo: "2026-07", energiaMesKwh: 100, ingresoMes: 200 }]
    const registrosEnergiaDiaria = [{ fecha: "2026-07-01", energiaDiaKwh: 10, ingresoDia: 20 }]
    vi.mocked(listEnergia).mockResolvedValue(registrosEnergia)
    vi.mocked(listEnergiaDiaria).mockResolvedValue(registrosEnergiaDiaria)
    vi.mocked(listSocios).mockResolvedValue([])

    const element = await GdcvPerformancePage({ searchParams: Promise.resolve({ proyectoId: "proy-1" }) })

    expect(findViewProps(element)).toEqual(
      expect.objectContaining({
        parque,
        registrosEnergia,
        registrosEnergiaDiaria,
        periodoActual: expect.stringMatching(/^\d{4}-\d{2}$/),
      })
    )
  })

  it("renders with registrosEnergia: null when listEnergia throws a non-Unauthorized error", async () => {
    vi.mocked(resolveDashboardContext).mockResolvedValue({ proyecto, parque })
    vi.mocked(listEnergia).mockRejectedValue(new Error("boom"))
    vi.mocked(listEnergiaDiaria).mockResolvedValue([])
    vi.mocked(listSocios).mockResolvedValue([])

    const element = await GdcvPerformancePage({ searchParams: Promise.resolve({ proyectoId: "proy-1" }) })

    expect(findViewProps(element)).toEqual(
      expect.objectContaining({ registrosEnergia: null })
    )
  })

  it("redirects to /login when listEnergia throws UnauthorizedError", async () => {
    vi.mocked(resolveDashboardContext).mockResolvedValue({ proyecto, parque })
    vi.mocked(listEnergia).mockRejectedValue(new UnauthorizedError())
    vi.mocked(listEnergiaDiaria).mockResolvedValue([])
    vi.mocked(listSocios).mockResolvedValue([])

    await expect(
      GdcvPerformancePage({ searchParams: Promise.resolve({ proyectoId: "proy-1" }) })
    ).rejects.toThrow("REDIRECT:/login")
    expect(redirect).toHaveBeenCalledWith("/login")
  })

  it("redirects to /login when listEnergiaDiaria throws UnauthorizedError", async () => {
    vi.mocked(resolveDashboardContext).mockResolvedValue({ proyecto, parque })
    vi.mocked(listEnergia).mockResolvedValue([])
    vi.mocked(listEnergiaDiaria).mockRejectedValue(new UnauthorizedError())
    vi.mocked(listSocios).mockResolvedValue([])

    await expect(
      GdcvPerformancePage({ searchParams: Promise.resolve({ proyectoId: "proy-1" }) })
    ).rejects.toThrow("REDIRECT:/login")
  })

  it("passes socios: Socio[] to GdcvPerformanceView when listSocios succeeds", async () => {
    vi.mocked(resolveDashboardContext).mockResolvedValue({ proyecto, parque })
    vi.mocked(listEnergia).mockResolvedValue([])
    vi.mocked(listEnergiaDiaria).mockResolvedValue([])
    const socios = [
      {
        id: "s1",
        parqueId: "parque-1",
        nombre: "Alfredo Isaac SA",
        participacionPorcentaje: 15,
        tipoCargo: "SIN_POTENCIA" as const,
        medidorNumero: "3543871",
        usuarioId: null,
      },
    ]
    vi.mocked(listSocios).mockResolvedValue(socios)

    const element = await GdcvPerformancePage({ searchParams: Promise.resolve({ proyectoId: "proy-1" }) })

    expect(findViewProps(element)).toEqual(expect.objectContaining({ socios }))
  })

  it("passes socios: null when listSocios throws a non-Unauthorized error", async () => {
    vi.mocked(resolveDashboardContext).mockResolvedValue({ proyecto, parque })
    vi.mocked(listEnergia).mockResolvedValue([])
    vi.mocked(listEnergiaDiaria).mockResolvedValue([])
    vi.mocked(listSocios).mockRejectedValue(new Error("boom"))

    const element = await GdcvPerformancePage({ searchParams: Promise.resolve({ proyectoId: "proy-1" }) })

    expect(findViewProps(element)).toEqual(expect.objectContaining({ socios: null }))
  })

  it("passes socios: [] (vacío, distinto de error) when listSocios resolves an empty array", async () => {
    vi.mocked(resolveDashboardContext).mockResolvedValue({ proyecto, parque })
    vi.mocked(listEnergia).mockResolvedValue([])
    vi.mocked(listEnergiaDiaria).mockResolvedValue([])
    vi.mocked(listSocios).mockResolvedValue([])

    const element = await GdcvPerformancePage({ searchParams: Promise.resolve({ proyectoId: "proy-1" }) })

    expect(findViewProps(element)).toEqual(expect.objectContaining({ socios: [] }))
  })

  it("redirects to /login when listSocios throws UnauthorizedError", async () => {
    vi.mocked(resolveDashboardContext).mockResolvedValue({ proyecto, parque })
    vi.mocked(listEnergia).mockResolvedValue([])
    vi.mocked(listEnergiaDiaria).mockResolvedValue([])
    vi.mocked(listSocios).mockRejectedValue(new UnauthorizedError())

    await expect(
      GdcvPerformancePage({ searchParams: Promise.resolve({ proyectoId: "proy-1" }) })
    ).rejects.toThrow("REDIRECT:/login")
  })
})
