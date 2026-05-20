// data/mantenimiento-mock.ts

export interface MantenimientoHistorialRow {
  id: string
  periodo: string
  cantidadMantenciones: number
  costoAsociado: string
  enCurso?: boolean
}

/** GDCV — Parque Río Cuarto (Jul 2025 → Abr 2026). */
export const gdcvMantenimientoHistorialMock: MantenimientoHistorialRow[] = [
  {
    id: "2026-04",
    periodo: "Abril 2026",
    cantidadMantenciones: 2,
    costoAsociado: "$54.800",
    enCurso: true,
  },
  {
    id: "2026-03",
    periodo: "Marzo 2026",
    cantidadMantenciones: 3,
    costoAsociado: "$72.100",
  },
  {
    id: "2026-02",
    periodo: "Febrero 2026",
    cantidadMantenciones: 1,
    costoAsociado: "$15.400",
  },
  {
    id: "2026-01",
    periodo: "Enero 2026",
    cantidadMantenciones: 2,
    costoAsociado: "$45.600",
  },
  {
    id: "2025-12",
    periodo: "Diciembre 2025",
    cantidadMantenciones: 1,
    costoAsociado: "$21.200",
  },
  {
    id: "2025-11",
    periodo: "Noviembre 2025",
    cantidadMantenciones: 2,
    costoAsociado: "$38.900",
  },
  {
    id: "2025-10",
    periodo: "Octubre 2025",
    cantidadMantenciones: 3,
    costoAsociado: "$67.400",
  },
  {
    id: "2025-09",
    periodo: "Septiembre 2025",
    cantidadMantenciones: 1,
    costoAsociado: "$12.800",
  },
  {
    id: "2025-08",
    periodo: "Agosto 2025",
    cantidadMantenciones: 2,
    costoAsociado: "$42.300",
  },
  {
    id: "2025-07",
    periodo: "Julio 2025",
    cantidadMantenciones: 1,
    costoAsociado: "$18.500",
  },
]

/** GDD — Parque General Roca (May 2025 → Abr 2026). */
export const gddMantenimientoHistorialMock: MantenimientoHistorialRow[] = [
  {
    id: "2026-04",
    periodo: "Abril 2026",
    cantidadMantenciones: 2,
    costoAsociado: "$31.200",
    enCurso: true,
  },
  {
    id: "2026-03",
    periodo: "Marzo 2026",
    cantidadMantenciones: 1,
    costoAsociado: "$14.800",
  },
  {
    id: "2026-02",
    periodo: "Febrero 2026",
    cantidadMantenciones: 2,
    costoAsociado: "$28.600",
  },
  {
    id: "2026-01",
    periodo: "Enero 2026",
    cantidadMantenciones: 1,
    costoAsociado: "$11.400",
  },
  {
    id: "2025-12",
    periodo: "Diciembre 2025",
    cantidadMantenciones: 3,
    costoAsociado: "$52.900",
  },
  {
    id: "2025-11",
    periodo: "Noviembre 2025",
    cantidadMantenciones: 2,
    costoAsociado: "$44.100",
  },
  {
    id: "2025-10",
    periodo: "Octubre 2025",
    cantidadMantenciones: 1,
    costoAsociado: "$9.800",
  },
  {
    id: "2025-09",
    periodo: "Septiembre 2025",
    cantidadMantenciones: 2,
    costoAsociado: "$22.500",
  },
  {
    id: "2025-08",
    periodo: "Agosto 2025",
    cantidadMantenciones: 1,
    costoAsociado: "$16.300",
  },
  {
    id: "2025-07",
    periodo: "Julio 2025",
    cantidadMantenciones: 2,
    costoAsociado: "$27.400",
  },
]

/** GDC — Parque Solar Marcos Juárez (prototipo). */
export const gdcParkName = "Parque Solar Marcos Juárez"

export const gdcMantenimientoHistorialMock: MantenimientoHistorialRow[] = [
  {
    id: "2026-04",
    periodo: "Abril 2026",
    cantidadMantenciones: 2,
    costoAsociado: "$48.600",
    enCurso: true,
  },
  {
    id: "2026-03",
    periodo: "Marzo 2026",
    cantidadMantenciones: 1,
    costoAsociado: "$19.200",
  },
  {
    id: "2026-02",
    periodo: "Febrero 2026",
    cantidadMantenciones: 3,
    costoAsociado: "$61.800",
  },
  {
    id: "2026-01",
    periodo: "Enero 2026",
    cantidadMantenciones: 2,
    costoAsociado: "$36.400",
  },
  {
    id: "2025-12",
    periodo: "Diciembre 2025",
    cantidadMantenciones: 1,
    costoAsociado: "$17.900",
  },
  {
    id: "2025-11",
    periodo: "Noviembre 2025",
    cantidadMantenciones: 2,
    costoAsociado: "$33.500",
  },
  {
    id: "2025-10",
    periodo: "Octubre 2025",
    cantidadMantenciones: 2,
    costoAsociado: "$29.700",
  },
  {
    id: "2025-09",
    periodo: "Septiembre 2025",
    cantidadMantenciones: 1,
    costoAsociado: "$13.100",
  },
  {
    id: "2025-08",
    periodo: "Agosto 2025",
    cantidadMantenciones: 2,
    costoAsociado: "$41.200",
  },
  {
    id: "2025-07",
    periodo: "Julio 2025",
    cantidadMantenciones: 1,
    costoAsociado: "$15.600",
  },
]
