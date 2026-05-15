// components/ui/card-wire.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const CardWire = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border border-border bg-white p-4",
      className
    )}
    {...props}
  />
))
CardWire.displayName = "CardWire"

export { CardWire }
