// components/esquemas/EsquemaEditorDialog.tsx — crear/editar un esquema (fecha + 3 franjas)
"use client"

import { useState, useTransition } from "react"

import { TextField } from "@/components/admin/FormField"
import { createEsquemaAction, updateEsquemaAction } from "@/components/esquemas/esquema-actions"
import { FranjaFields } from "@/components/esquemas/FranjaFields"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Destino, Esquema, FranjaEfectiva } from "@/lib/api/types"
import {
  emptyFranjasForm,
  franjasToForm,
  TIPOS,
  toCreateDto,
  toUpdateDto,
  validateFranjas,
  type EsquemaFormValues,
  type FranjaFormValues,
} from "@/lib/esquema-franjas"

interface EsquemaEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  destino: Destino
  tarifas: readonly string[]
  /** Si se pasa, modo edición. */
  esquema?: Esquema
  /** Franjas efectivas actuales para "Partir de la tarifa efectiva" (solo crear). */
  precarga?: FranjaEfectiva[]
  onSaved: () => void
}

export function EsquemaEditorDialog(props: EsquemaEditorDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
        {props.open ? <EditorBody {...props} /> : null}
      </DialogContent>
    </Dialog>
  )
}

function initialForm(esquema?: Esquema): EsquemaFormValues {
  if (!esquema) return emptyFranjasForm()
  return { vigenteDesde: esquema.vigenteDesde, franjas: franjasToForm(esquema.franjas) }
}

function EditorBody({ onOpenChange, destino, tarifas, esquema, precarga, onSaved }: EsquemaEditorDialogProps) {
  const [form, setForm] = useState<EsquemaFormValues>(() => initialForm(esquema))
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const editing = !!esquema
  const fechaLocked = editing && esquema.estado !== "FUTURA"

  const setFranja = (tipo: (typeof TIPOS)[number], field: keyof FranjaFormValues, value: string) =>
    setForm((prev) => ({ ...prev, franjas: { ...prev.franjas, [tipo]: { ...prev.franjas[tipo], [field]: value } } }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isPending) return
    const validationError = validateFranjas(form, tarifas)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    startTransition(async () => {
      const result = esquema
        ? await updateEsquemaAction(esquema.id, toUpdateDto(form, esquema))
        : await createEsquemaAction(destino, toCreateDto(form))
      if (result.error) {
        setError(result.error)
        return
      }
      onSaved()
      onOpenChange(false)
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>{editing ? "Editar esquema tarifario" : "Nuevo esquema tarifario"}</DialogTitle>
      </DialogHeader>

      <TextField
        label="Vigente desde"
        type="date"
        value={form.vigenteDesde}
        disabled={fechaLocked}
        onChange={(e) => setForm((prev) => ({ ...prev, vigenteDesde: e.target.value }))}
      />
      <p className="text-xs text-muted-foreground">
        Los horarios (inicio inclusivo, fin exclusivo, hora de Argentina) deben cubrir las 24 horas. Si dejas los tres
        sin completar se usan los habituales de cada franja. Los valores propios vacíos se toman del catálogo.
      </p>

      {!editing && precarga && precarga.length > 0 ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => setForm((prev) => ({ ...prev, franjas: franjasToForm(precarga) }))}
        >
          Partir de la tarifa efectiva
        </Button>
      ) : null}

      {TIPOS.map((tipo) => (
        <FranjaFields
          key={tipo}
          tipo={tipo}
          values={form.franjas[tipo]}
          tarifas={tarifas}
          onChange={(field, value) => setFranja(tipo, field, value)}
        />
      ))}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : editing ? "Guardar" : "Crear"}
        </Button>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
          Cancelar
        </Button>
      </DialogFooter>
    </form>
  )
}
