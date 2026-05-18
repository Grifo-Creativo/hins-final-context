// hooks/use-is-mobile.ts
"use client"

import { useEffect, useState } from "react"

/** Viewport por debajo de `md` (640px) — alineado a Tailwind `max-md`. */
export function useIsMobile(maxWidthPx = 639) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidthPx}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [maxWidthPx])

  return isMobile
}
