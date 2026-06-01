// components/gdcv/SocioPageHeading.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"

import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { socioParkName } from "@/data/gdcv-socio-mock"

const navTabs = [
  { value: "/gdcv/socio", label: "Mi Espacio" },
  { value: "/gdcv/socio/parque", label: "El Parque" },
]

export function SocioPageHeading() {
  const pathname = usePathname()
  const router = useRouter()

  // Normalise so exact "/gdcv/socio" matches even when nested layout appends nothing
  const activeTab = pathname.startsWith("/gdcv/socio/parque")
    ? "/gdcv/socio/parque"
    : "/gdcv/socio"

  return (
    <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="min-w-0 max-w-full text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {socioParkName}
      </h1>
      <TabsForBlocks
        className="w-full min-w-0 sm:w-auto"
        tabs={navTabs}
        value={activeTab}
        onValueChange={(v) => router.push(v)}
      />
    </div>
  )
}
