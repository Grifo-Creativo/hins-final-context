// lib/chart-day-format.ts

export function formatChartDayShort(d: Date): string {
  const day = d.getDate()
  const month = d.toLocaleString("es-AR", { month: "short" })
  return `${day} ${month}`
}

export function formatChartDayLong(d: Date): string {
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/** Date picker — ej. "Mayo 20, 2026" */
export function formatChartDayPicker(d: Date): string {
  const month = d.toLocaleString("es-AR", { month: "long" })
  const monthLabel = month.charAt(0).toUpperCase() + month.slice(1)
  return `${monthLabel} ${d.getDate()}, ${d.getFullYear()}`
}

/** Nav prev/next y label derecho — ej. "May 19" */
export function formatChartDayNavShort(d: Date): string {
  const month = d.toLocaleString("en-US", { month: "short" })
  return `${month} ${d.getDate()}`
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function addCalendarDays(d: Date, delta: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + delta)
  return next
}

/** Horas abreviadas inline — ej. "12:00" → "12 Hrs" */
export function formatChartHourCompact(hour: string): string {
  const [h] = hour.split(":")
  const parsed = Number.parseInt(h ?? "", 10)
  if (!Number.isFinite(parsed)) {
    return hour
  }
  return `${parsed} Hrs`
}

/** Horas en tooltip — ej. "12:00" → "12:00 Hrs" */
export function formatChartHourTooltip(hour: string): string {
  if (!hour) {
    return hour
  }
  return `${hour} Hrs`
}

/** Pico diario — ej. "2,8 kW · 12 Hrs" */
export function formatDailyPeakLabel(value: string, hour: string): string {
  return `${value} · ${formatChartHourCompact(hour)}`
}
