// components/esquemas/EsquemaPanel.tsx — contenido compartido (parque y socio): efectiva + historial + acciones
"use client"

import { useState, useTransition } from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog"
import { deleteEsquemaAction } from "@/components/esquemas/esquema-actions"
import { EsquemaEditorDialog } from "@/components/esquemas/EsquemaEditorDialog"
import { FranjasEfectivasTable } from "@/components/esquemas/FranjasEfectivasTable"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TIPOS_FRANJA } from "@/lib/admin-options"
import type { PaginatedResponse } from "@/lib/api/paginated"
import type { Destino, Esquema, EsquemaEstado, FranjasEfectivas } from "@/lib/api/types"

const ESTADO_LABEL: Record<EsquemaEstado, string> = { HISTORICA: "Histórico", VIGENTE: "Vigente", FUTURA: "Futuro" }
const ESTADO_VARIANT: Record<EsquemaEstado, "default" | "secondary" | "outline"> = {
  HISTORICA: "outline",
  VIGENTE: "default",
  FUTURA: "secondary",
}

export interface EsquemaPanelProps {
  destino: Destino
  efectivas: FranjasEfectivas | null
  historial: PaginatedResponse<Esquema>
  catalogo: string[]
  canWrite: boolean
  fecha: string
  loadError?: string | null
  onFechaChange: (fecha: string) => void
  onPageChange: (page: number) => void
  /** Se invoca tras crear/editar/eliminar para recargar los datos. */
  onChanged: () => void
}

function resumen(e: Esquema): string {
  return e.franjas
    .map((f) => `${TIPOS_FRANJA.find((t) => t.value === f.tipo)?.label ?? f.tipo} ${f.horaInicio}–${f.horaFin} (${f.tarifaNombre})`)
    .join(" · ")
}

export function EsquemaPanel({
  destino,
  efectivas,
  historial,
  catalogo,
  canWrite,
  fecha,
  loadError,
  onFechaChange,
  onPageChange,
  onChanged,
}: EsquemaPanelProps) {
  const [editor, setEditor] = useState<{ open: boolean; esquema?: Esquema }>({ open: false })
  const [toDelete, setToDelete] = useState<Esquema | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const esSocio = destino.tipo === "SOCIO"
  const heredado = esSocio && efectivas?.esquema.destino.tipo === "PARQUE"
  const totalPages = Math.max(1, Math.ceil(historial.total / historial.limit))

  const confirmDelete = () => {
    if (!toDelete) return
    startTransition(async () => {
      const result = await deleteEsquemaAction(toDelete.id)
      if (result.error) {
        setDeleteError(result.error)
        return
      }
      setToDelete(null)
      setDeleteError(null)
      onChanged()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {loadError ? (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>{loadError}</span>
            <Button size="sm" variant="outline" onClick={onChanged}>
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <section aria-labelledby="tarifa-efectiva-title" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="tarifa-efectiva-title" className="text-base font-semibold">
            Tarifa efectiva
          </h2>
          <label className="flex items-center gap-2 text-sm">
            Fecha de consulta
            <Input
              type="date"
              className="w-40"
              value={fecha}
              onChange={(e) => e.target.value && onFechaChange(e.target.value)}
            />
          </label>
        </div>

        {efectivas ? (
          <>
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              Esquema vigente desde {efectivas.esquema.vigenteDesde}
              {esSocio ? (
                <Badge variant={heredado ? "secondary" : "default"}>
                  {heredado ? "Heredado del parque" : "Esquema propio del socio"}
                </Badge>
              ) : null}
            </p>
            <FranjasEfectivasTable franjas={efectivas.franjas} />
          </>
        ) : (
          <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            {esSocio
              ? "Este socio no tiene esquema propio y el parque tampoco tiene uno vigente en esta fecha."
              : "Este parque no tiene un esquema tarifario vigente en esta fecha."}
            {canWrite ? " Crea uno desde el historial." : ""}
          </p>
        )}
      </section>

      <section aria-labelledby="historial-title" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 id="historial-title" className="text-base font-semibold">
            Historial de esquemas
          </h2>
          {canWrite ? (
            <Button size="sm" onClick={() => setEditor({ open: true })}>
              <PlusIcon /> Crear esquema
            </Button>
          ) : null}
        </div>

        {historial.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay esquemas definidos.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Desde</TableHead>
                <TableHead>Hasta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Franjas</TableHead>
                {canWrite ? <TableHead className="w-24 text-right">Acciones</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {historial.items.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.vigenteDesde}</TableCell>
                  <TableCell>{e.vigenteHasta ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={ESTADO_VARIANT[e.estado]}>{ESTADO_LABEL[e.estado]}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md whitespace-normal text-xs">{resumen(e)}</TableCell>
                  {canWrite ? (
                    <TableCell className="text-right">
                      {e.estado !== "HISTORICA" ? (
                        <span className="inline-flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Editar esquema desde ${e.vigenteDesde}`}
                            onClick={() => setEditor({ open: true, esquema: e })}
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Eliminar esquema desde ${e.vigenteDesde}`}
                            onClick={() => {
                              setDeleteError(null)
                              setToDelete(e)
                            }}
                          >
                            <Trash2Icon />
                          </Button>
                        </span>
                      ) : null}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {totalPages > 1 ? (
          <div className="flex items-center justify-end gap-2 text-sm">
            <Button size="sm" variant="outline" disabled={historial.page <= 1} onClick={() => onPageChange(historial.page - 1)}>
              Anterior
            </Button>
            <span>
              Página {historial.page} de {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={historial.page >= totalPages}
              onClick={() => onPageChange(historial.page + 1)}
            >
              Siguiente
            </Button>
          </div>
        ) : null}
      </section>

      {canWrite ? (
        <>
          <EsquemaEditorDialog
            key={editor.esquema?.id ?? "new"}
            open={editor.open}
            onOpenChange={(open) => setEditor((prev) => ({ ...prev, open }))}
            destino={destino}
            tarifas={catalogo}
            esquema={editor.esquema}
            precarga={efectivas?.franjas}
            onSaved={onChanged}
          />
          <ConfirmDeleteDialog
            open={!!toDelete}
            onOpenChange={(open) => {
              if (!open) setToDelete(null)
            }}
            description={toDelete ? `el esquema vigente desde ${toDelete.vigenteDesde}` : ""}
            warning={
              esSocio
                ? "Si es el único esquema del socio, volverá a regir el esquema del parque."
                : "Los socios sin esquema propio dejarán de tener tarifa si este era el único esquema del parque."
            }
            error={deleteError}
            isPending={isPending}
            onConfirm={confirmDelete}
          />
        </>
      ) : null}
    </div>
  )
}
