// app/gdcv/socio/layout.tsx
import type { ReactNode } from "react"

import { SocioAuthGate } from "@/components/gdcv/SocioAuthGate"
import { PageTransition } from "@/components/ui/page-transition"

export default function SocioLayout({ children }: { children: ReactNode }) {
  return (
    <SocioAuthGate>
      <PageTransition>
        <div className="flex flex-col gap-6">{children}</div>
      </PageTransition>
    </SocioAuthGate>
  )
}
