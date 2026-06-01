import type { ReactNode } from "react"

import { MainHeader } from "@/components/layout/MainHeader"
import { MainLayoutShell } from "@/components/layout/MainLayoutShell"
import { PageTransition } from "@/components/ui/page-transition"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayoutShell>
      <MainHeader />
      <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6 bg-background-subtle">
        <PageTransition>{children}</PageTransition>
      </main>
    </MainLayoutShell>
  )
}
