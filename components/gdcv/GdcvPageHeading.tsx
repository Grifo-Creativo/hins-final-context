// components/gdcv/GdcvPageHeading.tsx
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ModelBadge } from "@/components/ui/model-badge"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { gdcvParkName } from "@/data/gdcv-mock"
import { DownloadIcon } from "lucide-react"

const navTabs = [
  { value: "/gdcv/performance", label: "Performance" },
  {
    value: "/gdcv/roi",
    label: "Retorno de Inversión",
    labelMobile: "ROI",
  },
]

const currencyTabs = [
  { value: "usd", label: "DOLAR" },
  { value: "ars", label: "ARS" },
]

export function GdcvPageHeading() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currency = searchParams.get("currency") ?? "usd"
  const isRoiView = pathname === "/gdcv/roi"

  function handleNavChange(path: string) {
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
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <h1 className="min-w-0 max-w-full text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {gdcvParkName}
        </h1>
        <ModelBadge model="GDCV" />
      </div>
      <div className="flex w-full min-w-0 items-center gap-4 sm:w-auto sm:gap-6">
        {isRoiView && (
          <TabsForBlocks
            width="fit"
            className="shrink-0"
            tabs={currencyTabs}
            value={currency}
            onValueChange={handleCurrencyChange}
          />
        )}
        <TabsForBlocks
          width="fill"
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
