// components/ui/input-with-icon-button.tsx
"use client"

import { useId, type ComponentProps } from "react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type InputWithIconButtonProps = {
  label?: string
  id?: string
  icon: LucideIcon
  /** Texto accesible del botón (obligatorio). */
  iconButtonLabel: string
  /** Tooltip al hover/focus del botón ícono. */
  iconTooltip?: string
  iconTooltipSide?: "top" | "bottom" | "left" | "right"
  onIconClick?: () => void
  containerClassName?: string
  inputClassName?: string
  buttonClassName?: string
} & Omit<ComponentProps<"input">, "className">

export function InputWithIconButton({
  label,
  id: idProp,
  icon: Icon,
  iconButtonLabel,
  iconTooltip,
  iconTooltipSide = "top",
  onIconClick,
  containerClassName,
  inputClassName,
  buttonClassName,
  disabled,
  ...inputProps
}: InputWithIconButtonProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  const iconButton = (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={disabled}
      className={cn(
        "size-8 shrink-0 rounded-l-none shadow-none focus-visible:z-10",
        buttonClassName
      )}
      aria-label={iconButtonLabel}
      onClick={onIconClick}
    >
      <Icon className="size-4" aria-hidden />
    </Button>
  )

  return (
    <div className={cn("w-full space-y-2", containerClassName)}>
      {label ? (
        <label
          htmlFor={id}
          className="text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
      ) : null}
      <div className="flex rounded-md shadow-xs">
        <Input
          id={id}
          disabled={disabled}
          className={cn(
            "-me-px flex-1 rounded-r-none shadow-none focus-visible:z-10",
            inputClassName
          )}
          {...inputProps}
        />
        {iconTooltip ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>{iconButton}</TooltipTrigger>
              <TooltipContent side={iconTooltipSide} sideOffset={4}>
                {iconTooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          iconButton
        )}
      </div>
    </div>
  )
}
