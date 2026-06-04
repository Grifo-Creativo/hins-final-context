// app/gdcv/layout.tsx
"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { DashboardMain } from "@/components/layout/DashboardMain"
import { GdcvHeader } from "@/components/layout/GdcvHeader"
import { GdcvLayoutShell } from "@/components/layout/GdcvLayoutShell"
import { GdcvLayoutShellNoSidebar } from "@/components/layout/GdcvLayoutShellNoSidebar"

export default function GdcvLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isSocioRoute = pathname.startsWith("/gdcv/socio")
  const Shell = isSocioRoute ? GdcvLayoutShellNoSidebar : GdcvLayoutShell

  return (
    <Shell>
      <GdcvHeader />
      <DashboardMain>{children}</DashboardMain>
    </Shell>
  )
}
