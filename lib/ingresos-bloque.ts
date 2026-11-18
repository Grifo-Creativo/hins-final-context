import { redirect } from "next/navigation"

import { ForbiddenError, UnauthorizedError } from "@/lib/api/client"

/**
 * Resultado de cargar un bloque de ingresos. Una falla afecta solo a su bloque
 * (FR-024): "error" ≠ "vacio" (404 / sin datos) ≠ "sin-acceso" (403).
 */
export type BloqueIngresos<T> =
  | { status: "ok"; data: T }
  | { status: "vacio" }
  | { status: "sin-acceso" }
  | { status: "error" }

/** Ejecuta un fetch de ingresos aislando fallas; la sesión vencida redirige a login. */
export async function cargarBloqueIngresos<T>(fn: () => Promise<T | null>): Promise<BloqueIngresos<T>> {
  try {
    const data = await fn()
    return data === null ? { status: "vacio" } : { status: "ok", data }
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/login")
    if (error instanceof ForbiddenError) return { status: "sin-acceso" }
    return { status: "error" }
  }
}
