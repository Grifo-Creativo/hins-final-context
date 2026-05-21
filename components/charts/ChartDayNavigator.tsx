// components/charts/ChartDayNavigator.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  addCalendarDays,
  formatChartDayLong,
  formatChartDayShort,
  isSameCalendarDay,
} from "@/lib/chart-day-format"
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

export interface ChartDayNavigatorProps {
  activeDay: Date
  today: Date
  onActiveDayChange: (day: Date) => void
  className?: string
}

export function ChartDayNavigator({
  activeDay,
  today,
  onActiveDayChange,
  className,
}: ChartDayNavigatorProps) {
  const prevDay = addCalendarDays(activeDay, -1)
  const nextDay = addCalendarDays(activeDay, 1)

  function changeDay(delta: number) {
    const next = addCalendarDays(activeDay, delta)
    if (next > today) return
    onActiveDayChange(next)
  }

  return (
    <div
      className={
        className ??
        "flex items-center justify-between gap-3 border-b border-border px-4 pb-3 pt-1 sm:px-6"
      }
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 gap-2 text-xs"
        onClick={() => changeDay(-1)}
      >
        <ChevronLeftIcon className="size-4" aria-hidden />
        {formatChartDayShort(prevDay)}
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-2 text-xs shadow-xs"
          >
            <CalendarIcon
              className="size-4 text-muted-foreground"
              aria-hidden
            />
            {formatChartDayLong(activeDay)}
            <ChevronRightIcon
              className="size-4 text-muted-foreground"
              aria-hidden
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={activeDay}
            onSelect={(date) => {
              if (date && date <= today) onActiveDayChange(date)
            }}
            disabled={(date) => date > today}
          />
        </PopoverContent>
      </Popover>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 gap-2 text-xs"
        onClick={() => changeDay(1)}
        disabled={isSameCalendarDay(activeDay, today)}
      >
        {formatChartDayShort(nextDay)}
        <ChevronRightIcon className="size-4" aria-hidden />
      </Button>
    </div>
  )
}
