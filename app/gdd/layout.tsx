// app/gdd/layout.tsx
import type { ReactNode } from "react"

import { GddHeader } from "@/components/layout/GddHeader"
import { GddLayoutShell } from "@/components/layout/GddLayoutShell"
import { PageTransition } from "@/components/ui/page-transition"

export default function GddLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <GddLayoutShell>
      <GddHeader />
      <main className="flex-1 px-6 py-6 bg-background-subtle">
        <PageTransition>{children}</PageTransition>
      </main>
    </GddLayoutShell>
  )
}
