// components/layout/LegalDisclaimerFooter.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  LEGAL_DISCLAIMER_FOOTER_TEXT,
  LEGAL_TERMS_DIALOG_TITLE,
  LEGAL_TERMS_LINK_LABEL,
  LEGAL_TERMS_PLACEHOLDER_SECTIONS,
} from "@/data/legal-information-placeholder"
import {
  DIALOG_BODY_SCROLL,
  DIALOG_HEADER_FLUSH,
} from "@/lib/dialog-layout"
import { InfoIcon } from "lucide-react"

export function LegalDisclaimerFooter() {
  return (
    <footer className="w-full" aria-label="Información legal y metodológica">
      <Dialog>
        <div className="flex w-full items-start gap-2 text-sm leading-relaxed text-muted-foreground">
          <InfoIcon
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <p className="min-w-0 flex-1 text-left">
            {LEGAL_DISCLAIMER_FOOTER_TEXT}{" "}
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline font-normal text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
              >
                {LEGAL_TERMS_LINK_LABEL}
              </button>
            </DialogTrigger>
            .
          </p>
        </div>

        <DialogContent
          className="flex max-h-[min(90vh,40rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
          showCloseButton={false}
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

          <DialogFooter flushParent>
            <DialogClose asChild>
              <Button variant="default" className="w-full shadow-xs sm:w-auto">
                Entendido
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </footer>
  )
}
