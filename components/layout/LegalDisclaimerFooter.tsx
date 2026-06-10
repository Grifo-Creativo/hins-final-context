// components/layout/LegalDisclaimerFooter.tsx
"use client"

import { useState } from "react"

import { TermsAndConditionsDialog } from "@/components/legal/TermsAndConditionsDialog"
import {
  LEGAL_DISCLAIMER_FOOTER_TEXT,
  LEGAL_TERMS_LINK_LABEL,
} from "@/data/legal-information-placeholder"
import { InfoIcon } from "lucide-react"

export function LegalDisclaimerFooter() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <footer className="w-full" aria-label="Información legal y metodológica">
      <div className="flex w-full items-start gap-2 text-sm leading-relaxed text-muted-foreground">
        <InfoIcon
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <p className="min-w-0 flex-1 text-left">
          {LEGAL_DISCLAIMER_FOOTER_TEXT}{" "}
          <button
            type="button"
            className="inline font-normal text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
            onClick={() => setDialogOpen(true)}
          >
            {LEGAL_TERMS_LINK_LABEL}
          </button>
          .
        </p>
      </div>

      <TermsAndConditionsDialog
        variant="informative"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </footer>
  )
}
