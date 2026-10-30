"use server"

import { createEsquema, deleteEsquema, updateEsquema } from "@/lib/api/esquemas-tarifarios"
import type { CreateEsquemaDto, Destino, Esquema, UpdateEsquemaDto } from "@/lib/api/types"
import { runCrudAction } from "@/lib/crud-action"

// El backend responde 403 a no-admin (mismo criterio que las actions de 013).
const PATHS = ["/gdd/tarifas", "/gdc/tarifas", "/gdcv/tarifas"]

export async function createEsquemaAction(destino: Destino, dto: CreateEsquemaDto) {
  return runCrudAction<Esquema>(() => createEsquema(destino, dto), PATHS)
}

export async function updateEsquemaAction(id: string, dto: UpdateEsquemaDto) {
  return runCrudAction<Esquema>(() => updateEsquema(id, dto), PATHS)
}

export async function deleteEsquemaAction(id: string) {
  return runCrudAction<Esquema>(() => deleteEsquema(id), PATHS, { allowNull: true })
}
