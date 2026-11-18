"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface BloqueConErrorProps {
  /** Qué no pudo cargarse, p.ej. "los ingresos del mes". */
  titulo: string
}

/** Estado de error aislado por bloque con reintento (FR-024). */
export function BloqueConError({ titulo }: BloqueConErrorProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Alert variant="error">
      <AlertTitle>No se pudo cargar {titulo}</AlertTitle>
      <AlertDescription>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => startTransition(() => router.refresh())}
        >
          {pending ? "Reintentando…" : "Reintentar"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
