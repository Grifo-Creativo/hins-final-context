// components/gdd/GddPageHeading.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { DownloadIcon } from "lucide-react"

import { parkName } from "@/data/gdd-performance-mock"

const navTabs = [
  { value: "/gdd/performance", label: "Performance" },
  { value: "/gdd/roi", label: "Retorno de Inversión" },
]

export function GddPageHeading() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <h1 className="min-w-0 max-w-full text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {parkName}
        </h1>
        <Badge
          variant="secondary"
          className="shrink-0 border-transparent bg-green-600 font-medium text-white hover:bg-green-600"
        >
          GDD
        </Badge>
      </div>
      <div className="flex w-full min-w-0 items-center gap-4 sm:w-auto sm:gap-6">
        <TabsForBlocks
          className="min-w-0 flex-1 sm:flex-initial"
          tabs={navTabs}
          value={pathname}
          onValueChange={(v) => router.push(v)}
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
