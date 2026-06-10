// components/legal/TermsAcceptanceGate.tsx
"use client"

import { useEffect, useState, type ReactNode } from "react"

import { TermsAndConditionsDialog } from "@/components/legal/TermsAndConditionsDialog"
import {
  hasAcceptedCurrentTerms,
  recordTermsAcceptance,
  setTermsAccepted,
} from "@/lib/terms-acceptance"

type TermsAcceptanceGateProps = {
  children: ReactNode
}

export function TermsAcceptanceGate({ children }: TermsAcceptanceGateProps) {
  const [ready, setReady] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (hasAcceptedCurrentTerms()) {
      setReady(true)
      return
    }
    setDialogOpen(true)
  }, [])

  const handleAccept = async () => {
    setTermsAccepted()
    await recordTermsAcceptance()
    setDialogOpen(false)
    setReady(true)
  }

  if (!ready) {
    return (
      <TermsAndConditionsDialog
        variant="acceptance"
        open={dialogOpen}
        onAccept={handleAccept}
      />
    )
  }

  return <>{children}</>
}
