// components/ui/hins-tooltip.tsx
"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface HinsTooltipProps {
  /** Elemento que dispara el tooltip (ej. InfoIcon) */
  trigger: React.ReactNode
  /** Texto principal del tooltip */
  content: string
  /** Si se pasa href, el contenido se renderiza como textlink */
  href?: string
  /** Posición del tooltip. Default: top */
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function HinsTooltip({
  trigger,
  content,
  href,
  side = "top",
  className,
}: HinsTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center cursor-pointer"
            aria-label="Más información"
          >
            {trigger}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn(
            "bg-foreground text-background text-xs font-normal rounded-md py-2 px-3",
            className
          )}
        >
          {href ? (
            <a
              href={href}
              className="underline underline-offset-2 text-background"
            >
              {content}
            </a>
          ) : (
            <p>{content}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
