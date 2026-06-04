// app/gdc/layout.tsx
import type { ReactNode } from "react"

import { DashboardMain } from "@/components/layout/DashboardMain"
import { GdcHeader } from "@/components/layout/GdcHeader"
import { GdcLayoutShell } from "@/components/layout/GdcLayoutShell"

export default function GdcLayout({ children }: { children: ReactNode }) {
  return (
    <GdcLayoutShell>
      <GdcHeader />
      <DashboardMain>{children}</DashboardMain>
    </GdcLayoutShell>
  )
}
