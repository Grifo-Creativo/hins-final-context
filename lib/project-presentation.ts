import type { ModeloNegocio } from "@/lib/api/types"

/**
 * Imagen de portada por proyecto — dato puramente presentacional, fuera del
 * contrato de backend (Proyecto no expone coverImageUrl). Mapa local
 * hardcodeado por id hasta que el backend agregue soporte de imagen.
 */
export const PROJECT_COVER_IMAGES: Record<string, string> = {
  "rio-cuarto": "/images/parque-rio-cuarto.png",
  "marcos-juarez": "https://hins.com.ar/wp-content/uploads/2026/01/Render-2.webp",
  "general-roca": "https://hins.com.ar/wp-content/uploads/2025/12/General-Roca-2-scaled-1.jpg",
  "arroyo-cabral": "https://hins.com.ar/wp-content/uploads/2025/05/Arroyo-Cabral-scaled.jpg",
}

export function getProjectCoverImage(proyectoId: string): string | undefined {
  return PROJECT_COVER_IMAGES[proyectoId]
}

/**
 * Ruta de dashboard según el modelo de negocio del proyecto, parametrizada
 * por proyectoId (query param) — las páginas de cada dashboard resuelven el
 * Parque real vía lib/api/parques.ts getPrimaryParque(proyectoId).
 */
export function hrefForModelo(modelo: ModeloNegocio, proyectoId: string): string {
  const base = modelo === "GDD" ? "/gdd/performance" : modelo === "GDC" ? "/gdc/performance" : "/gdcv/performance"
  return `${base}?proyectoId=${proyectoId}`
}
