// components/gdd/GddPageHeading.tsx
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ModelBadge } from "@/components/ui/model-badge"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { DownloadIcon } from "lucide-react"

import { parkName } from "@/data/gdd-performance-mock"

const navTabs = [
  { value: "/gdd/performance", label: "Performance" },
  { value: "/gdd/roi", label: "Retorno de Inversión" },
]

const currencyTabs = [
  { value: "usd", label: "DOLAR" },
  { value: "ars", label: "ARS" },
]

export function GddPageHeading() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currency = searchParams.get("currency") ?? "usd"
  const isRoiView = pathname === "/gdd/roi"

  function handleNavChange(path: string) {
    // Al navegar, preservar el currency param si existe
    const params = searchParams.toString()
    router.push(params ? `${path}?${params}` : path)
  }

  function handleCurrencyChange(newCurrency: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (newCurrency === "usd") {
      params.delete("currency")
    } else {
      params.set("currency", newCurrency)
    }
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <h1 className="min-w-0 max-w-full text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {parkName}
        </h1>
        <ModelBadge model="GDD" />
      </div>
      <div className="flex w-full min-w-0 items-center gap-4 sm:w-auto sm:gap-6">
        {isRoiView && (
          <TabsForBlocks
            tabs={currencyTabs}
            value={currency}
            onValueChange={handleCurrencyChange}
          />
        )}
        <TabsForBlocks
          className="min-w-0 flex-1 sm:flex-initial"
          tabs={navTabs}
          value={pathname}
          onValueChange={handleNavChange}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 shadow-xs"
          aria-label="Exportar datos"
        >
          <DownloadIcon className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
