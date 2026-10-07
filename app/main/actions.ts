"use server"

import { revalidatePath } from "next/cache"
import { createProyecto } from "@/lib/api/proyectos"
import type { CreateProyectoDto, Proyecto } from "@/lib/api/types"

export interface CreateProyectoActionResult {
  proyecto?: Proyecto
  error?: string
}

export async function createProyectoAction(dto: CreateProyectoDto): Promise<CreateProyectoActionResult> {
  try {
    const proyecto = await createProyecto(dto)
    if (!proyecto) {
      return { error: "El backend no devolvió el proyecto creado" }
    }
    revalidatePath("/main")
    return { proyecto }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error al crear el proyecto" }
  }
}
