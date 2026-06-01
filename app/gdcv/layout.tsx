// app/gdcv/layout.tsx
"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { GdcvHeader } from "@/components/layout/GdcvHeader"
import { GdcvLayoutShell } from "@/components/layout/GdcvLayoutShell"
import { GdcvLayoutShellNoSidebar } from "@/components/layout/GdcvLayoutShellNoSidebar"
import { PageTransition } from "@/components/ui/page-transition"

export default function GdcvLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isSocioRoute = pathname.startsWith("/gdcv/socio")
  const Shell = isSocioRoute ? GdcvLayoutShellNoSidebar : GdcvLayoutShell

  return (
    <Shell>
      <GdcvHeader />
      <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6 bg-background-subtle">
        <PageTransition>{children}</PageTransition>
      </main>
    </Shell>
  )
}
