// data/gdcv-daily-mock.ts

export type DailyPoint = { hour: string; kw: number }

/** Mock — “hoy” del prototipo (20 mayo 2026). */
export const MOCK_TODAY = new Date(2026, 4, 20)

export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const HOURS_25 = Array.from({ length: 25 }, (_, i) => {
  const h = i.toString().padStart(2, "0")
  return `${h}:00`
})

function hourToIndex(hour: string): number {
  const [h] = hour.split(":")
  return Number.parseInt(h ?? "0", 10)
}

function isCloudyDay(dateKey: string): boolean {
  const day = Number.parseInt(dateKey.split("-").pop() ?? "1", 10)
  return day % 2 === 0
}

function solarKwAtHour(hourIndex: number, peakKw: number, cloudy: boolean): number {
  if (hourIndex < 6 || hourIndex > 18) {
    return 0
  }

  const distance = Math.abs(hourIndex - 12)
  const spread = cloudy ? 3.2 : 2.8
  let kw = peakKw * Math.exp(-(distance * distance) / (2 * spread * spread))

  if (cloudy && hourIndex >= 13 && hourIndex <= 15) {
    kw *= 0.45
  }

  return Math.round(kw * 100) / 100
}

/**
 * Generación intradiaria mock — 25 puntos (00:00 … 24:00).
 * Campana solar 06:00–18:00; días pares (dateKey) simulan nubosidad.
 */
/** Puntos intradiarios 06:00–20:00 para AreaChart (campana solar visible). */
export function getDailyGenerationData24(dateKey: string): DailyPoint[] {
  return getDailyGenerationData(dateKey).filter((point) => {
    const hour = hourToIndex(point.hour)
    return hour >= 6 && hour <= 20
  })
}

export function getDailyGenerationData(dateKey: string): DailyPoint[] {
  const cloudy = isCloudyDay(dateKey)
  const peakKw = cloudy ? 1.4 : 2.8

  return HOURS_25.map((hour) => {
    const hourIndex = hourToIndex(hour)
    return {
      hour,
      kw: solarKwAtHour(hourIndex, peakKw, cloudy),
    }
  })
}

export function getDailyTotal(data: DailyPoint[]): string {
  const sum = data.reduce((acc, point) => acc + point.kw, 0)
  return `${sum.toLocaleString("es-AR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} kWh`
}

export function getDailyPeak(data: DailyPoint[]): { value: string; hour: string } {
  const peak = data.reduce(
    (best, point) => (point.kw > best.kw ? point : best),
    data[0] ?? { hour: "12:00", kw: 0 }
  )

  return {
    value: `${peak.kw.toLocaleString("es-AR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} kW`,
    hour: peak.hour,
  }
}
