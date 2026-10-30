# Contrato de componentes compartidos

```ts
type Destino = { tipo: "PARQUE"; parqueId: string } | { tipo: "SOCIO"; parqueId: string; socioId: string }

// Server Component. Obtiene efectivas + historial + catálogo y compone la vista.
EsquemaTarifarioView({ destino, fecha?: string, page?: number, canWrite: boolean })

// Client. Tabla de solo lectura de las 3 franjas efectivas.
FranjasEfectivasTable({ franjas: FranjaEfectiva[], heredado: boolean })

// Client. Crear (initial = precarga opcional) o editar (esquema).
EsquemaEditorDialog({ destino, tarifas: string[], esquema?: Esquema, precarga?: FranjaEfectiva[], onDone })

// Server Actions (wrappers de runCrudAction)
createEsquema(destino, dto) / updateEsquema(id, dto) / deleteEsquema(id) → ActionResult<Esquema>
```

Funciones puras (`lib/esquema-franjas.ts`):
- `validateFranjas(form): string | null`
- `toCreateDto(form)` / `toUpdateDto(form, esquema)`
- `franjasToForm(franjas: Franja[] | FranjaEfectiva[])`
- `emptyFranjasForm()`
