// data/mantenimiento-mock.ts

import { formatCurrency } from "@/lib/format-currency"

const fmtArs = (amount: number) => formatCurrency(amount, "ars", "full")

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
    costoAsociado: fmtArs(54_800),
    enCurso: true,
  },
  {
    id: "2026-03",
    periodo: "Marzo 2026",
    cantidadMantenciones: 3,
    costoAsociado: fmtArs(72_100),
  },
  {
    id: "2026-02",
    periodo: "Febrero 2026",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(15_400),
  },
  {
    id: "2026-01",
    periodo: "Enero 2026",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(45_600),
  },
  {
    id: "2025-12",
    periodo: "Diciembre 2025",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(21_200),
  },
  {
    id: "2025-11",
    periodo: "Noviembre 2025",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(38_900),
  },
  {
    id: "2025-10",
    periodo: "Octubre 2025",
    cantidadMantenciones: 3,
    costoAsociado: fmtArs(67_400),
  },
  {
    id: "2025-09",
    periodo: "Septiembre 2025",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(12_800),
  },
  {
    id: "2025-08",
    periodo: "Agosto 2025",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(42_300),
  },
  {
    id: "2025-07",
    periodo: "Julio 2025",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(18_500),
  },
]

/** GDD — Parque General Roca (May 2025 → Abr 2026). */
export const gddMantenimientoHistorialMock: MantenimientoHistorialRow[] = [
  {
    id: "2026-04",
    periodo: "Abril 2026",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(31_200),
    enCurso: true,
  },
  {
    id: "2026-03",
    periodo: "Marzo 2026",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(14_800),
  },
  {
    id: "2026-02",
    periodo: "Febrero 2026",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(28_600),
  },
  {
    id: "2026-01",
    periodo: "Enero 2026",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(11_400),
  },
  {
    id: "2025-12",
    periodo: "Diciembre 2025",
    cantidadMantenciones: 3,
    costoAsociado: fmtArs(52_900),
  },
  {
    id: "2025-11",
    periodo: "Noviembre 2025",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(44_100),
  },
  {
    id: "2025-10",
    periodo: "Octubre 2025",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(9_800),
  },
  {
    id: "2025-09",
    periodo: "Septiembre 2025",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(22_500),
  },
  {
    id: "2025-08",
    periodo: "Agosto 2025",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(16_300),
  },
  {
    id: "2025-07",
    periodo: "Julio 2025",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(27_400),
  },
]

/** GDC — Parque Solar Marcos Juárez (prototipo). */
export const gdcParkName = "Parque Solar Marcos Juárez"

export const gdcMantenimientoHistorialMock: MantenimientoHistorialRow[] = [
  {
    id: "2026-04",
    periodo: "Abril 2026",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(48_600),
    enCurso: true,
  },
  {
    id: "2026-03",
    periodo: "Marzo 2026",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(19_200),
  },
  {
    id: "2026-02",
    periodo: "Febrero 2026",
    cantidadMantenciones: 3,
    costoAsociado: fmtArs(61_800),
  },
  {
    id: "2026-01",
    periodo: "Enero 2026",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(36_400),
  },
  {
    id: "2025-12",
    periodo: "Diciembre 2025",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(17_900),
  },
  {
    id: "2025-11",
    periodo: "Noviembre 2025",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(33_500),
  },
  {
    id: "2025-10",
    periodo: "Octubre 2025",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(29_700),
  },
  {
    id: "2025-09",
    periodo: "Septiembre 2025",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(13_100),
  },
  {
    id: "2025-08",
    periodo: "Agosto 2025",
    cantidadMantenciones: 2,
    costoAsociado: fmtArs(41_200),
  },
  {
    id: "2025-07",
    periodo: "Julio 2025",
    cantidadMantenciones: 1,
    costoAsociado: fmtArs(15_600),
  },
]
