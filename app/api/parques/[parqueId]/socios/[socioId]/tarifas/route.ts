import { NextResponse } from "next/server"

import { ForbiddenError, UnauthorizedError } from "@/lib/api/client"
import { listNombresTarifa } from "@/lib/api/esquema-catalogo"
import { getFranjasEfectivas, listEsquemas } from "@/lib/api/esquemas-tarifarios"
import { parsePage } from "@/lib/api/paginated"
import { getMe } from "@/lib/api/usuarios"
import type { Destino } from "@/lib/api/types"
import { getArgentinaTodayIso } from "@/lib/argentina-day-range"

interface RouteParams {
  params: Promise<{ parqueId: string; socioId: string }>
}

/**
 * Boundary Server/Client (Principio II) para el diálogo "Tarifas" de un socio:
 * agrega tarifa efectiva, historial y catálogo (este último solo para admin).
 * Lectura: HINS_ADMIN y AGC.
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { parqueId, socioId } = await params
  const { searchParams } = new URL(request.url)
  const fechaParam = searchParams.get("fecha")
  const fecha = fechaParam && /^\d{4}-\d{2}-\d{2}$/.test(fechaParam) ? fechaParam : getArgentinaTodayIso()
  const destino: Destino = { tipo: "SOCIO", parqueId, socioId }

  try {
    const role = (await getMe())?.role
    if (role !== "HINS_ADMIN" && role !== "AGC") {
      return NextResponse.json({ message: "Sin permisos" }, { status: 403 })
    }
    const canWrite = role === "HINS_ADMIN"
    const [efectivas, historial, catalogo] = await Promise.all([
      getFranjasEfectivas(destino, fecha),
      listEsquemas(destino, { page: parsePage(searchParams.get("page") ?? undefined) }),
      canWrite ? listNombresTarifa() : Promise.resolve([]),
    ])
    return NextResponse.json({ efectivas, historial, catalogo, canWrite, fecha })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: error.message }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error al consultar las tarifas del socio" },
      { status: 500 }
    )
  }
}
