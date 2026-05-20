// data/main-mock.ts — datos de ejemplo Main_00 / flows/main/flow.md

export type ProjectType = "GDD" | "GDC"

export interface Project {
  id: string
  name: string
  type: ProjectType
  /** Ruta interna si el proyecto tiene vista construida; null si está pendiente */
  href: string | null
  /** Imagen de portada (remoto permitido en next.config o ruta bajo /public) */
  coverImageUrl?: string
}

export const projectsMock: Project[] = [
  {
    id: "rio-cuarto",
    name: "Parque Río Cuarto",
    type: "GDC",
    href: "/gdcv/performance",
    coverImageUrl: "/images/parque-rio-cuarto.png",
  },
  {
    id: "marcos-juarez",
    name: "Parque Solar Marcos Juarez",
    type: "GDC",
    href: "/gdc/mantenimiento",
    coverImageUrl:
      "https://hins.com.ar/wp-content/uploads/2026/01/Render-2.webp",
  },
  {
    id: "general-roca",
    name: "Parque Fotovoltaico de General Roca",
    type: "GDD",
    href: "/gdd/performance",
    coverImageUrl:
      "https://hins.com.ar/wp-content/uploads/2025/12/General-Roca-2-scaled-1.jpg",
  },
  {
    id: "arroyo-cabral",
    name: "Parque Solar Arroyo Cabral",
    type: "GDC",
    href: null,
    coverImageUrl:
      "https://hins.com.ar/wp-content/uploads/2025/05/Arroyo-Cabral-scaled.jpg",
  },
]
