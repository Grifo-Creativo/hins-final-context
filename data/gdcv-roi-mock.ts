// /data/gdcv-roi-mock.ts

export const ROI_INVERSION_META = 4_270_000

export type ROIDataPoint = {
  fecha: string      // "YYYY-MM"
  real?: number      // solo hasta HOY
  base?: number
  favorable?: number
  riesgo?: number
}

export const roiProjectionData: ROIDataPoint[] = [
  // Real data: Mar 2024 — Feb 2026
  { fecha: "2024-03", real: 0 },
  { fecha: "2024-04", real: 35_000 },
  { fecha: "2024-05", real: 72_000 },
  { fecha: "2024-06", real: 115_000 },
  { fecha: "2024-07", real: 165_000 },
  { fecha: "2024-08", real: 220_000 },
  { fecha: "2024-09", real: 280_000 },
  { fecha: "2024-10", real: 345_000 },
  { fecha: "2024-11", real: 415_000 },
  { fecha: "2024-12", real: 490_000 },
  { fecha: "2025-01", real: 570_000 },
  { fecha: "2025-02", real: 655_000 },
  { fecha: "2025-03", real: 745_000 },
  { fecha: "2025-04", real: 840_000 },
  { fecha: "2025-05", real: 940_000 },
  { fecha: "2025-06", real: 1_045_000 },
  { fecha: "2025-07", real: 1_155_000 },
  { fecha: "2025-08", real: 1_270_000 },
  { fecha: "2025-09", real: 1_390_000 },
  { fecha: "2025-10", real: 1_515_000 },
  { fecha: "2025-11", real: 1_645_000 },
  { fecha: "2025-12", real: 1_780_000 },
  { fecha: "2026-01", real: 1_920_000 },
  { fecha: "2026-02", real: 2_065_000 },

  // Proyecciones: Mar 2026 onwards
  { fecha: "2026-03", base: 2_215_000, favorable: 2_400_000, riesgo: 2_000_000 },
  { fecha: "2026-04", base: 2_370_000, favorable: 2_590_000, riesgo: 2_120_000 },
  { fecha: "2026-05", base: 2_530_000, favorable: 2_790_000, riesgo: 2_245_000 },
  { fecha: "2026-06", base: 2_695_000, favorable: 2_995_000, riesgo: 2_375_000 },
  { fecha: "2026-07", base: 2_865_000, favorable: 3_210_000, riesgo: 2_510_000 },
  { fecha: "2026-08", base: 3_040_000, favorable: 3_430_000, riesgo: 2_650_000 },
  { fecha: "2026-09", base: 3_220_000, favorable: 3_660_000, riesgo: 2_795_000 },
  { fecha: "2026-10", base: 3_405_000, favorable: 3_895_000, riesgo: 2_945_000 },
  { fecha: "2026-11", base: 3_595_000, favorable: 4_140_000, riesgo: 3_100_000 },
  { fecha: "2026-12", base: 3_790_000, favorable: 4_390_000, riesgo: 3_260_000 },
  { fecha: "2027-01", base: 3_990_000, favorable: 4_650_000, riesgo: 3_425_000 },
  { fecha: "2027-02", base: 4_195_000, favorable: 4_920_000, riesgo: 3_595_000 },
  { fecha: "2027-03", base: 4_405_000, favorable: 5_200_000, riesgo: 3_770_000 },
  { fecha: "2027-04", base: 4_620_000, favorable: 5_490_000, riesgo: 3_950_000 },
  { fecha: "2027-05", base: 4_840_000, favorable: 5_790_000, riesgo: 4_135_000 },
  { fecha: "2027-06", base: 5_065_000, favorable: 6_100_000, riesgo: 4_325_000 },
  { fecha: "2027-07", base: 5_295_000, favorable: 6_420_000, riesgo: 4_520_000 },
  { fecha: "2027-08", base: 5_530_000, favorable: 6_750_000, riesgo: 4_720_000 },
  { fecha: "2027-09", base: 5_770_000, favorable: 7_090_000, riesgo: 4_925_000 },
  { fecha: "2027-10", base: 6_015_000, favorable: 7_440_000, riesgo: 5_135_000 },
  { fecha: "2027-11", base: 6_265_000, favorable: 7_800_000, riesgo: 5_350_000 },
  { fecha: "2027-12", base: 6_520_000, favorable: 8_170_000, riesgo: 5_570_000 },
  { fecha: "2028-01", base: 6_780_000, favorable: 8_550_000, riesgo: 5_795_000 },
  { fecha: "2028-02", base: 7_045_000, favorable: 8_940_000, riesgo: 6_025_000 },
  { fecha: "2028-03", base: 7_315_000, favorable: 9_340_000, riesgo: 6_260_000 },
  { fecha: "2028-04", base: 7_590_000, favorable: 9_750_000, riesgo: 6_500_000 },
  { fecha: "2028-05", base: 7_870_000, favorable: 10_170_000, riesgo: 6_745_000 },
  { fecha: "2028-06", base: 8_155_000, favorable: 10_600_000, riesgo: 6_995_000 },
  { fecha: "2028-07", base: 8_445_000, favorable: 11_040_000, riesgo: 7_250_000 },
  { fecha: "2028-08", base: 8_740_000, favorable: 11_490_000, riesgo: 7_510_000 },
  { fecha: "2028-09", base: 9_040_000, favorable: 11_950_000, riesgo: 7_775_000 },
  { fecha: "2028-10", base: 9_345_000, favorable: 12_420_000, riesgo: 8_045_000 },
  { fecha: "2028-11", base: 9_655_000, favorable: 12_900_000, riesgo: 8_320_000 },
  { fecha: "2028-12", base: 9_970_000, favorable: 13_390_000, riesgo: 8_600_000 },
]

export const ROI_FECHA_HOY = "2026-03"

/** Meses absolutos: `year * 12 + (mes - 1)` */
function fechaToAbsoluteMonthIndex(fecha: string): number {
  const [year, month] = fecha.split("-").map(Number)
  return year * 12 + month - 1
}

function absoluteMonthIndexToFecha(monthIndexRounded: number): string {
  const year = Math.floor(monthIndexRounded / 12)
  const month = (monthIndexRounded % 12) + 1
  return `${year}-${String(month).padStart(2, "0")}`
}

/**
 * Cruce entre una serie y la meta (interpolación lineal entre dos puntos).
 */
export function calcularFechaRecupero(
  data: ROIDataPoint[],
  serie: keyof Omit<ROIDataPoint, "fecha">,
  meta: number
): string | null {
  for (let i = 1; i < data.length; i++) {
    const prevVal = data[i - 1][serie] as number | undefined
    const currVal = data[i][serie] as number | undefined
    if (prevVal === undefined || currVal === undefined) continue
    if (prevVal === currVal) continue

    const crosses =
      (prevVal < meta && currVal >= meta) || (prevVal > meta && currVal <= meta)
    if (!crosses) continue

    const t = (meta - prevVal) / (currVal - prevVal)
    const prevIx = fechaToAbsoluteMonthIndex(data[i - 1].fecha)
    const currIx = fechaToAbsoluteMonthIndex(data[i].fecha)
    const interpIx = prevIx + t * (currIx - prevIx)
    return absoluteMonthIndexToFecha(Math.round(interpIx))
  }
  return null
}
