// components/layout/DashboardMain.tsx
import type { ReactNode } from "react"

import { LegalDisclaimerFooter } from "@/components/layout/LegalDisclaimerFooter"
import { TermsAcceptanceGate } from "@/components/legal/TermsAcceptanceGate"
import { PageTransition } from "@/components/ui/page-transition"

/** Contenedor principal de dashboards (GDD, GDC, GDCV). Excluir en `/main`. */
export function DashboardMain({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 bg-background-subtle px-4 py-4 sm:px-6 sm:py-6">
      <TermsAcceptanceGate>
        <PageTransition>
          <div className="flex flex-col gap-4 sm:gap-6">
            {children}
            <LegalDisclaimerFooter />
          </div>
        </PageTransition>
      </TermsAcceptanceGate>
    </main>
  )
}
