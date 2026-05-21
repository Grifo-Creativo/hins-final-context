// components/main/NewProjectDialog.tsx — Dialog for creating new projects

"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ModelBadge, type ParkModel } from "@/components/ui/model-badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { InputWithIconButton } from "@/components/ui/input-with-icon-button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PROJECT_TYPES, type NewProjectFormData, type ProjectType } from "@/data/new-project-mock"
import { ParkingMeter } from "lucide-react"

interface NewProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const [formData, setFormData] = useState<NewProjectFormData>({
    nombre: "",
    tipo: undefined as any,
  })

  const handleReset = () => {
    setFormData({
      nombre: "",
      tipo: undefined,
    })
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleReset()
    }
    onOpenChange(isOpen)
  }

  const handleCreate = () => {
    // Validación básica
    if (!formData.nombre.trim()) {
      alert("Por favor ingresa el nombre del parque")
      return
    }
    if (formData.tipo === "GDD" && !formData.medidor?.trim()) {
      alert("Por favor ingresa el número de medidor")
      return
    }

    // TODO: Aquí iría la lógica para crear el proyecto
    console.log("Crear proyecto:", formData)

    // Cerrar dialog
    handleOpenChange(false)
  }

  const isFormValid =
    formData.nombre.trim() !== "" &&
    formData.tipo &&
    (formData.tipo === "GDCV" || (formData.tipo === "GDD" && formData.medidor?.trim()))

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Proyecto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nombre
            </label>
            <Input
              placeholder="Ej: Parque San Francisco"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>

          {/* Tipo de Parque */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Tipo de Parque
            </label>
            <ToggleGroup
              type="single"
              value={formData.tipo}
              onValueChange={(value) => {
                if (value) {
                  setFormData({ ...formData, tipo: value as ProjectType })
                }
              }}
              variant="outline"
              className="w-full [&_[data-state=on]]:bg-primary [&_[data-state=on]]:text-primary-foreground"
            >
              {PROJECT_TYPES.map((type) => (
                <ToggleGroupItem key={type.value} value={type.value} className="flex-1">
                  <ModelBadge model={type.value as ParkModel} />
                  <span className="ml-2">{type.label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* N° de Medidor (condicional - GDD) */}
          {formData.tipo === "GDD" && (
            <InputWithIconButton
              label="N° de Medidor"
              icon={ParkingMeter}
              iconButtonLabel="Buscar medidor"
              iconTooltip="N° de medidor del parque"
              placeholder="Ingresar..."
              value={formData.medidor || ""}
              onChange={(e) =>
                setFormData({ ...formData, medidor: e.target.value })
              }
              onIconClick={() => {
                // Prototipo: acción de búsqueda/validación de medidor
              }}
            />
          )}

          {/* Cantidad de Socios (condicional - GDCV) */}
          {formData.tipo === "GDCV" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Cantidad de Socios
              </label>
              <Input
                placeholder="Ej: 15"
                value={formData.socios || ""}
                onChange={(e) =>
                  setFormData({ ...formData, socios: e.target.value })
                }
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="default"
            onClick={handleCreate}
            disabled={!isFormValid}
          >
            Crear
          </Button>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
