import { NextResponse } from "next/server"
import { UnauthorizedError } from "@/lib/api/client"
import { getEnergiaDelDia } from "@/lib/api/energia"
import { getRegistroMasRecienteDelDia, getRegistrosDelDiaOrdenados } from "@/lib/park-energy-series"

interface RouteParams {
  params: Promise<{ parqueId: string }>
}

/**
 * Boundary Server/Client para la pestaña DIA (Principio II) — evita exponer
 * apiFetch/token del backend HINS al cliente. Ver
 * specs/004-daily-monthly-energy-view/contracts/get-parque-energia-dia.md.
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { parqueId } = await params
  const { searchParams } = new URL(request.url)
  const periodo = searchParams.get("periodo")
  if (!periodo) {
    return NextResponse.json({ message: "Falta periodo" }, { status: 400 })
  }

  try {
    const registros = await getEnergiaDelDia(parqueId, periodo)
    const registro = getRegistroMasRecienteDelDia(registros)
    const registrosOrdenados = getRegistrosDelDiaOrdenados(registros)
    return NextResponse.json({ registro, registros: registrosOrdenados })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error al consultar la energía del día" },
      { status: 500 }
    )
  }
}
