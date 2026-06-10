// components/legal/TermsAndConditionsDialog.tsx
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  LEGAL_TERMS_ACCEPTANCE_BUTTON_LABEL,
  LEGAL_TERMS_ACCEPTANCE_CHECKBOX_LABEL,
  LEGAL_TERMS_DIALOG_TITLE,
  LEGAL_TERMS_PLACEHOLDER_SECTIONS,
} from "@/data/legal-information-placeholder"
import {
  DIALOG_BODY_SCROLL,
  DIALOG_HEADER_FLUSH,
} from "@/lib/dialog-layout"
import { cn } from "@/lib/utils"

export type TermsDialogVariant = "informative" | "acceptance"

export type TermsAndConditionsDialogProps = {
  variant: TermsDialogVariant
  open: boolean
  onOpenChange?: (open: boolean) => void
  onAccept?: () => void
}

export function TermsAndConditionsDialog({
  variant,
  open,
  onOpenChange,
  onAccept,
}: TermsAndConditionsDialogProps) {
  const [accepted, setAccepted] = useState(false)
  const isAcceptance = variant === "acceptance"

  const handleOpenChange = (next: boolean) => {
    if (isAcceptance && !next) return
    onOpenChange?.(next)
    if (!next) setAccepted(false)
  }

  const handleAccept = () => {
    if (!accepted) return
    onAccept?.()
    setAccepted(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex max-h-[min(90vh,40rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton={false}
        onPointerDownOutside={(event) => {
          if (isAcceptance) event.preventDefault()
        }}
        onInteractOutside={(event) => {
          if (isAcceptance) event.preventDefault()
        }}
        onEscapeKeyDown={(event) => {
          if (isAcceptance) event.preventDefault()
        }}
      >
        <DialogHeader className={DIALOG_HEADER_FLUSH}>
          <DialogTitle className="text-base font-semibold sm:text-lg">
            {LEGAL_TERMS_DIALOG_TITLE}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            [CONTENIDO TEMPORAL] Documento provisorio hasta definición legal.
          </p>
        </DialogHeader>

        <div className={DIALOG_BODY_SCROLL}>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
            {LEGAL_TERMS_PLACEHOLDER_SECTIONS.map((section) => (
              <section key={section.heading}>
                <h3 className="mb-1 text-sm font-medium text-foreground">
                  {section.heading}
                </h3>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        </div>

        <DialogFooter
          flushParent
          className={
            isAcceptance
              ? "flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              : undefined
          }
        >
          {isAcceptance ? (
            <>
              <div className="flex w-full min-w-0 items-start gap-2 sm:flex-1">
                <input
                  id="hins-terms-acceptance"
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  className={cn(
                    "mt-0.5 size-4 shrink-0 rounded border border-input accent-primary",
                    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  )}
                />
                <Label
                  htmlFor="hins-terms-acceptance"
                  className="cursor-pointer font-normal leading-relaxed text-foreground"
                >
                  {LEGAL_TERMS_ACCEPTANCE_CHECKBOX_LABEL}
                </Label>
              </div>
              <Button
                type="button"
                variant="default"
                className="w-full shrink-0 shadow-xs sm:w-auto"
                disabled={!accepted}
                onClick={handleAccept}
              >
                {LEGAL_TERMS_ACCEPTANCE_BUTTON_LABEL}
              </Button>
            </>
          ) : (
            <DialogClose asChild>
              <Button variant="default" className="w-full shadow-xs sm:w-auto">
                Entendido
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
