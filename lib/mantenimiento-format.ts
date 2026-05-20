// lib/mantenimiento-format.ts

const MONTH_ABBR: Record<string, string> = {
  Enero: "Ene",
  Febrero: "Feb",
  Marzo: "Mar",
  Abril: "Abr",
  Mayo: "May",
  Junio: "Jun",
  Julio: "Jul",
  Agosto: "Ago",
  Septiembre: "Sep",
  Octubre: "Oct",
  Noviembre: "Nov",
  Diciembre: "Dic",
}

/** Título compacto para sheet — ej. "Mant. Dic 2025". */
export function formatMantenimientoSheetTitle(periodo: string): string {
  const [month, year] = periodo.split(" ")
  const abbr = MONTH_ABBR[month] ?? month?.slice(0, 3) ?? ""
  return `Mant. ${abbr} ${year ?? ""}`.trim()
}
