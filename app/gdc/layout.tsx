// app/gdc/layout.tsx
import type { ReactNode } from "react"

import { GdcHeader } from "@/components/layout/GdcHeader"
import { GdcLayoutShell } from "@/components/layout/GdcLayoutShell"
import { PageTransition } from "@/components/ui/page-transition"

export default function GdcLayout({ children }: { children: ReactNode }) {
  return (
    <GdcLayoutShell>
      <GdcHeader />
      <main className="flex-1 px-6 py-6 bg-[#F2ECE9]/36">
        <PageTransition>{children}</PageTransition>
      </main>
    </GdcLayoutShell>
  )
}
