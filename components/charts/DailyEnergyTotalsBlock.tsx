// components/charts/DailyEnergyTotalsBlock.tsx
"use client"

import { DailyEnergyMeasuresChart, type DailyEnergyMeasurePoint } from "@/components/charts/DailyEnergyMeasuresChart"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import type { RegistroEnergiaDia } from "@/lib/api/types"
import { getRegistroMasRecienteDelDia, getRegistrosDelDiaOrdenados } from "@/lib/park-energy-series"
import {
  addCalendarDays,
  formatChartDayLong,
  formatChartDayNavShort,
  isSameCalendarDay,
} from "@/lib/chart-day-format"
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

function formatHourLabel(capturadoEn: string): string {
  const d = new Date(capturadoEn)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

function formatArs(value: number | null): string {
  if (value === null) return "—"
  return `$ ${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatKwh(value: number | null): string {
  if (value === null) return "—"
  return `${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`
}

export interface DailyEnergyTotalsBlockProps {
  activeDay: Date
  today: Date
  onActiveDayChange: (day: Date) => void
  /** Todos los registros reales del día (uno por captura), `[]` si no hay dato. */
  registros: RegistroEnergiaDia[]
  className?: string
}

/**
 * Curva de energía generada por hora, real — un punto por cada registro que
 * el backend capturó ese día (`capturadoEn`), X = hora, Y = `energiaDiaKwh`.
 * Mismo estilo visual que la card "Generada en [mes]" pero a tamaño
 * completo, con ejes. `energiaTotalKwh` (acumulado histórico) e `ingresoDia`
 * (otra unidad) se muestran aparte, tomados del registro más reciente. Ver
 * specs/004-daily-monthly-energy-view/research.md Decision 1.
 */
export function DailyEnergyTotalsBlock({
  activeDay,
  today,
  onActiveDayChange,
  registros,
  className,
}: DailyEnergyTotalsBlockProps) {
  const prevDay = addCalendarDays(activeDay, -1)
  const nextDay = addCalendarDays(activeDay, 1)
  const isToday = isSameCalendarDay(activeDay, today)
  const registro = getRegistroMasRecienteDelDia(registros)

  function changeDay(delta: number) {
    const next = addCalendarDays(activeDay, delta)
    if (next > today) return
    onActiveDayChange(next)
  }

  const chartData: DailyEnergyMeasurePoint[] = getRegistrosDelDiaOrdenados(registros).map((r) => ({
    label: formatHourLabel(r.capturadoEn),
    kwh: r.energiaDiaKwh ?? 0,
  }))

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-4", className)}>
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full justify-center md:w-auto md:justify-start">
          <DatePicker value={activeDay} onValueChange={onActiveDayChange} disabled={(date) => date > today} />
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-4 md:w-auto md:justify-end">
          <p className="text-sm text-muted-foreground">{formatChartDayLong(activeDay)}</p>
          <p className="text-sm font-semibold text-foreground">Ingreso: {formatArs(registro?.ingresoDia ?? null)}</p>
          <p className="text-sm font-semibold text-foreground">
            Acumulado histórico: {formatKwh(registro?.energiaTotalKwh ?? null)}
          </p>
        </div>
      </div>

      <div className="relative min-h-[300px] flex-1">
        {registros.length === 0 ? (
          <div className="flex h-full min-h-[300px] w-full items-center justify-center">
            <p className="text-sm text-muted-foreground">Sin registros de energía para este día.</p>
          </div>
        ) : (
          <DailyEnergyMeasuresChart data={chartData} className="h-full min-h-[300px] w-full" />
        )}

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2"
          onClick={() => changeDay(-1)}
          aria-label={`Día anterior, ${formatChartDayNavShort(prevDay)}`}
        >
          <ChevronLeftIcon aria-hidden />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2"
          onClick={() => changeDay(1)}
          disabled={isToday}
          aria-label={`Día siguiente, ${formatChartDayNavShort(nextDay)}`}
        >
          <ChevronRightIcon aria-hidden />
        </Button>
      </div>
    </div>
  )
}
