// app/gdd/layout.tsx
import type { ReactNode } from "react"

import { DashboardMain } from "@/components/layout/DashboardMain"
import { GddHeader } from "@/components/layout/GddHeader"
import { GddLayoutShell } from "@/components/layout/GddLayoutShell"

export default function GddLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <GddLayoutShell>
      <GddHeader />
      <DashboardMain>{children}</DashboardMain>
    </GddLayoutShell>
  )
}
