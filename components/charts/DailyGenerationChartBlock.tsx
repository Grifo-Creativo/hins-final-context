// components/charts/DailyGenerationChartBlock.tsx
"use client"

import { useEffect, useRef, useState } from "react"

import {
  DailyGenerationChart,
  DAILY_CHART_DAY_CHANGE_ANIMATION_MS,
  DAILY_CHART_MOUNT_ANIMATION_MS,
} from "@/components/charts/DailyGenerationChart"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import type { DailyPoint } from "@/data/gdcv-daily-mock"
import {
  addCalendarDays,
  formatChartDayNavShort,
  isSameCalendarDay,
} from "@/lib/chart-day-format"
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const navButtonClass =
  "h-8 gap-2 rounded-full text-xs shadow-xs"

function InlineStat({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={cn("flex min-w-0 items-baseline gap-1.5", className)}
    >
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="truncate text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  )
}

export interface DailyGenerationChartBlockProps {
  activeDay: Date
  today: Date
  onActiveDayChange: (day: Date) => void
  data: DailyPoint[]
  totalLabel: string
  peakLabel: string
  className?: string
}

export function DailyGenerationChartBlock({
  activeDay,
  today,
  onActiveDayChange,
  data,
  totalLabel,
  peakLabel,
  className,
}: DailyGenerationChartBlockProps) {
  const prevDay = addCalendarDays(activeDay, -1)
  const nextDay = addCalendarDays(activeDay, 1)
  const isToday = isSameCalendarDay(activeDay, today)
  const [animationDuration, setAnimationDuration] = useState(
    DAILY_CHART_MOUNT_ANIMATION_MS
  )
  const hasChangedDay = useRef(false)

  useEffect(() => {
    if (!hasChangedDay.current) {
      hasChangedDay.current = true
      return
    }
    setAnimationDuration(DAILY_CHART_DAY_CHANGE_ANIMATION_MS)
  }, [activeDay])

  function changeDay(delta: number) {
    const next = addCalendarDays(activeDay, delta)
    if (next > today) return
    onActiveDayChange(next)
  }

  return (
    <div className={cn("-mx-4 flex min-h-0 flex-1 flex-col", className)}>
      <div className="flex shrink-0 flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full justify-center md:w-auto md:justify-start">
          <DatePicker
            value={activeDay}
            onValueChange={onActiveDayChange}
            disabled={(date) => date > today}
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-4 md:flex md:flex-1 md:items-center md:justify-end">
          <InlineStat label="Acumulado:" value={totalLabel} />
          <InlineStat
            label="Pico:"
            value={peakLabel}
            className="justify-self-end md:justify-self-auto"
          />
        </div>
      </div>

      <div className="relative min-h-[300px] flex-1 w-full overflow-hidden">
        <DailyGenerationChart
          data={data}
          animationDuration={animationDuration}
          className="h-full min-h-[300px] w-full"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            navButtonClass,
            "absolute left-3 top-1/2 z-10 -translate-y-1/2 bg-white/95 max-md:size-8 max-md:gap-0 max-md:px-0"
          )}
          onClick={() => changeDay(-1)}
          aria-label={`Día anterior, ${formatChartDayNavShort(prevDay)}`}
        >
          <ChevronLeftIcon className="size-4" aria-hidden />
          <span className="max-md:sr-only">{formatChartDayNavShort(prevDay)}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            navButtonClass,
            "absolute right-3 top-1/2 z-10 -translate-y-1/2 bg-white/95 max-md:size-8 max-md:gap-0 max-md:px-0"
          )}
          onClick={() => changeDay(1)}
          disabled={isToday}
          aria-label={`Día siguiente, ${formatChartDayNavShort(nextDay)}`}
        >
          <span className="max-md:sr-only">{formatChartDayNavShort(nextDay)}</span>
          <ChevronRightIcon className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
