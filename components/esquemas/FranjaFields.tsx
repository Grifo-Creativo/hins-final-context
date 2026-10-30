// components/esquemas/FranjaFields.tsx — campos de una franja del editor de esquema
"use client"

import { SelectField } from "@/components/admin/SelectField"
import { TextField } from "@/components/admin/FormField"
import { TIPOS_FRANJA } from "@/lib/admin-options"
import type { TipoFranja } from "@/lib/api/types"
import type { FranjaFormValues } from "@/lib/esquema-franjas"

interface FranjaFieldsProps {
  tipo: TipoFranja
  values: FranjaFormValues
  tarifas: readonly string[]
  onChange: (field: keyof FranjaFormValues, value: string) => void
}

export function FranjaFields({ tipo, values, tarifas, onChange }: FranjaFieldsProps) {
  const label = TIPOS_FRANJA.find((t) => t.value === tipo)?.label ?? tipo
  return (
    <fieldset className="flex flex-col gap-3 rounded-md border border-border p-3">
      <legend className="px-1 text-sm font-semibold">{label}</legend>
      <SelectField
        label={`Tarifa ${label}`}
        options={tarifas.map((t) => ({ value: t, label: t }))}
        value={values.tarifaNombre}
        onValueChange={(v) => onChange("tarifaNombre", v)}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label={`Inicio ${label} (HH:MM)`}
          type="time"
          value={values.horaInicio}
          onChange={(e) => onChange("horaInicio", e.target.value)}
        />
        <TextField
          label={`Fin ${label} (HH:MM)`}
          type="time"
          value={values.horaFin}
          onChange={(e) => onChange("horaFin", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <TextField
          label="Energía propia"
          type="number"
          step="any"
          min="0"
          placeholder="Catálogo"
          value={values.valorEnergia}
          onChange={(e) => onChange("valorEnergia", e.target.value)}
        />
        <TextField
          label="Inyección propia"
          type="number"
          step="any"
          min="0"
          placeholder="Catálogo"
          value={values.valorInyeccion}
          onChange={(e) => onChange("valorInyeccion", e.target.value)}
        />
        <TextField
          label="Unidad propia"
          placeholder="Catálogo"
          value={values.unidad}
          onChange={(e) => onChange("unidad", e.target.value)}
        />
      </div>
    </fieldset>
  )
}
