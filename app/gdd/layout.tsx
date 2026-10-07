// app/gdd/layout.tsx
import { Suspense, type ReactNode } from "react"

import { getCurrentRole } from "@/lib/api/guards"
import { DashboardMain } from "@/components/layout/DashboardMain"
import { GddHeader } from "@/components/layout/GddHeader"
import { GddLayoutShell } from "@/components/layout/GddLayoutShell"

export default async function GddLayout({
  children,
}: {
  children: ReactNode
}) {
  const role = await getCurrentRole()

  return (
    <GddLayoutShell role={role}>
      <Suspense fallback={null}>
        <GddHeader />
      </Suspense>
      <DashboardMain>{children}</DashboardMain>
    </GddLayoutShell>
  )
}
