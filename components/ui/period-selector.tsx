// components/ui/period-selector.tsx
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"

const DEFAULT_OPTIONS = [
  "Abril 2026",
  "Marzo 2026",
  "Febrero 2026",
  "Enero 2026",
  "Diciembre 2025",
  "Noviembre 2025",
]

interface PeriodSelectorProps {
  /** Período actualmente seleccionado (string, ej. "Abril 2026") */
  value: string
  /** Callback cuando el usuario elige un nuevo período */
  onValueChange: (value: string) => void
  /** Lista de opciones. Por defecto: últimos 6 meses. */
  options?: string[]
  className?: string
}

export function PeriodSelector({
  value,
  onValueChange,
  options = DEFAULT_OPTIONS,
  className,
}: PeriodSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("gap-2 shadow-xs", className)}
        >
          <CalendarIcon className="size-4 text-muted-foreground" aria-hidden />
          {value}
          <ChevronDownIcon className="size-4 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onValueChange(option)}
            className={cn(
              option === value && "font-medium text-foreground"
            )}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Controlled wrapper with internal state — for use cases that don't need to lift state
interface PeriodSelectorLocalProps {
  defaultValue?: string
  options?: string[]
  onChange?: (value: string) => void
  className?: string
}

export function PeriodSelectorLocal({
  defaultValue = DEFAULT_OPTIONS[0],
  options = DEFAULT_OPTIONS,
  onChange,
  className,
}: PeriodSelectorLocalProps) {
  const [value, setValue] = useState(defaultValue)

  function handleChange(next: string) {
    setValue(next)
    onChange?.(next)
  }

  return (
    <PeriodSelector
      value={value}
      onValueChange={handleChange}
      options={options}
      className={className}
    />
  )
}
