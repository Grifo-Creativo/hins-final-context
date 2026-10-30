// components/esquemas/EsquemaParquePanel.tsx — conecta EsquemaPanel con la URL (?fecha, ?page) en las rutas de parque
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { EsquemaPanel, type EsquemaPanelProps } from "@/components/esquemas/EsquemaPanel"

type Props = Omit<EsquemaPanelProps, "onFechaChange" | "onPageChange" | "onChanged">

export function EsquemaParquePanel(props: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const push = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    if (key === "fecha") params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <EsquemaPanel
      {...props}
      onFechaChange={(f) => push("fecha", f)}
      onPageChange={(p) => push("page", String(p))}
      onChanged={() => router.refresh()}
    />
  )
}
