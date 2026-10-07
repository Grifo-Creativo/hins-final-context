import { redirect } from "next/navigation"
import { connection } from "next/server"

import { UnauthorizedError } from "@/lib/api/client"
import { getMe } from "@/lib/api/usuarios"
import type { UsuarioRole } from "@/lib/api/types"

/** Rol del usuario actual, o null si no se pudo determinar (nunca lanza). */
export async function getCurrentRole(): Promise<UsuarioRole | null> {
  // El rol depende de la sesión: fuerza render dinámico (sin esto el try/catch
  // tragaría el aviso de Next y el build intentaría llamar al backend).
  await connection()
  try {
    return (await getMe())?.role ?? null
  } catch {
    return null
  }
}

/**
 * Guard de páginas de configuración (FR-012): sesión expirada → /login,
 * cualquier rol distinto de HINS_ADMIN → /main.
 */
export async function requireAdmin(): Promise<void> {
  await connection()
  let role: UsuarioRole | null = null
  try {
    role = (await getMe())?.role ?? null
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/login")
    redirect("/main")
  }
  if (role !== "HINS_ADMIN") redirect("/main")
}
