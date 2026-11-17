import type { UsuarioRole } from "@/lib/api/types"

/**
 * FR-007b: la tabla/detalle de socios y los ingresos por socio son solo para
 * HINS Admin y AGC. El dueño GDD no aplica; el socio ve únicamente su portal.
 * Rol desconocido (null) → denegado por defecto.
 */
export function puedeVerSocios(role: UsuarioRole | null | undefined): boolean {
  return role === "HINS_ADMIN" || role === "AGC"
}
