# Implementation Plan: Esquemas tarifarios por franjas horarias (Parque y Socio)

**Branch**: `014-esquemas-tarifarios` | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

## Summary

Agregar a la UI la gestión y consulta de **esquemas tarifarios** (3 franjas RESTO/PICO/VALLE con horario, tarifa del catálogo y valores propios opcionales) a nivel de **parque** y de **socio**. Se reutiliza la infraestructura de 013 (`lib/api`, `runCrudAction`, `requireAdmin`, `components/admin/*`, `admin-nav`). La novedad es un **editor de esquema** (formulario de 3 franjas, no encaja en el `ResourceFormDialog` plano), un **panel de tarifa efectiva** (franjas efectivas con origen PROPIO/CATÁLOGO) y un **historial paginado** de esquemas por destino. Un único módulo de componentes sirve a parque y socio; solo cambia el "destino".

## Technical Context

**Language/Version**: TypeScript estricto, Next.js 16 App Router (RSC + Server Actions)

**Primary Dependencies**: shadcn/Radix existentes (`dialog`, `table`, `badge`, `alert`, `date-picker`, `button`, `input`), `lucide-react`. **Sin dependencias nuevas**

**Storage**: Backend REST (`HINS_API_BASE_URL`); contrato en `http://localhost:3000/docs-json`. Sin base local

**Testing**: Vitest 4 (node); funciones puras (validación de cobertura 24 h, normalización), módulos `lib/api`, server actions (patrón `tests/lib/api/*`)

**Target Platform**: Web, desktop primero

**Project Type**: web-app (Next.js frontend/BFF)

**Performance Goals**: historial 20 filas/página, paginación servidor; vista efectiva visible < 10 s (SC-001)

**Constraints**: token en cookie httpOnly → fetch y rol solo en servidor. Lectura: `HINS_ADMIN` o `AGC`; escritura: solo `HINS_ADMIN`. `apiFetch` devuelve `null` en 204/404. Horarios en hora Argentina, inicio inclusivo / fin exclusivo

**Scale/Scope**: 2 destinos, 1 editor compartido, ~2 rutas nuevas + 1 diálogo en tabla de socios

## Constitution Check

| Principio | Estado | Cómo se cumple |
|---|---|---|
| I Type safety | ✅ | Tipos `Esquema`, `Franja`, `FranjaEfectiva`, `TarifaEfectiva` en `lib/api/types.ts`; coerción Decimal→number en el borde; sin `any` |
| II Server/Client | ✅ | Páginas RSC leen `searchParams` y llaman `lib/api`; mutaciones por Server Actions; client solo para editor y diálogos |
| III Test-first | ✅ | `validateFranjas` (cobertura 24 h, solapes, medianoche), builders de payload, módulos API y actions con tests antes de implementar |
| IV UI consistente | ✅ | Reusa `ConfirmDeleteDialog`, `PaginationControls`, `FormField`, `SelectField`; editor de franjas y tabla de franjas extraídos como componentes compartidos |
| V Simplicidad | ✅ | Sin deps nuevas; un solo editor para parque y socio; sin lógica de cálculo de tarifa en el cliente (la resuelve el backend) |

Re-evaluación post-diseño: sin violaciones. Complexity Tracking vacío.

## Project Structure

### Documentation

```text
specs/014-esquemas-tarifarios/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── backend-endpoints.md
│   └── shared-components.md
└── tasks.md            # /speckit-tasks
```

### Source Code

```text
lib/api/
├── esquemas-tarifarios.ts   # list/get/create/update/remove por destino + tarifaEfectiva/franjasEfectivas
├── types.ts                 # + Esquema, Franja(Dto), FranjaEfectiva, TarifaEfectiva, DestinoEsquema, TipoFranja
└── guards.ts                # + requireReader(): HINS_ADMIN | AGC (lectura)

lib/
├── esquema-franjas.ts       # puro: HORARIOS_HABITUALES, validateFranjas(), toFranjaDtos(), franjasToForm(), emptyFranjasForm()
└── admin-nav.ts             # + ítem "Tarifas" en buildParkNav (admin y AGC)

components/esquemas/
├── EsquemaTarifarioView.tsx # Server Component (rutas de parque): efectiva + historial + editor
├── EsquemaPanel.tsx         # client: mismo contenido que la vista, alimentado por props/fetch (lo usa el diálogo de socio)
├── FranjasEfectivasTable.tsx# tabla 3 franjas, badges PROPIO/CATÁLOGO, aviso "heredado del parque"
├── EsquemaHistorial.tsx     # lista paginada con estado y acciones (editar/eliminar según estado y rol)
├── EsquemaEditorDialog.tsx  # client: fecha + 3 franjas; crear/editar; precarga desde efectivas
├── FranjaFields.tsx         # una franja: tarifa (select catálogo), horas, valores propios
└── esquema-actions.ts       # wrappers de una línea sobre runCrudAction

app/{gdd,gdc,gdcv}/tarifas/page.tsx    # wrappers finos → EsquemaTarifarioView (destino = parque)
components/gdcv/SocioTarifasDialog.tsx # diálogo client desde fila de SociosTable; carga datos por Route Handlers y muta con server actions
app/api/parques/[parqueId]/socios/[socioId]/tarifas/route.ts  # GET → { efectivas, historial, catalogo } (requireReader)

tests/lib/{esquema-franjas}.test.ts
tests/lib/api/esquemas-tarifarios.test.ts
tests/app/esquemas-actions.test.ts
```

**Structure Decision**: monolito Next.js existente. Esquema de parque = ruta nueva por modelo (mismo patrón que `costos`); esquema de socio = diálogo en la tabla de socios GDCV (patrón `SocioHistoricoDialog`), ya que el socio solo existe en GDCV.

## Key Design Decisions (ver research.md)

1. **Rangos = franjas del esquema**; el catálogo `/tarifas` no se toca salvo advertencia al borrar (FR-016).
2. **Validación de cobertura en cliente** (24 h sin huecos ni solapes, admite cruce de medianoche) para feedback inmediato; el backend sigue siendo la autoridad (400).
3. **Editor propio** en vez de `ResourceFormDialog`: el contrato es un arreglo de 3 filas, no un form plano.
4. **Solo-lectura para AGC** con `requireReader()`; acciones de escritura ocultas y revalidadas en servidor (el backend responde 403).
5. **Parque**: `/{gdd,gdc,gdcv}/tarifas?proyectoId=`; ítem de menú "Tarifas" visible a admin y AGC.
6. **Diálogo de socio = client**: no puede montar RSC; consume un Route Handler que agrega efectivas + historial + catálogo y muta con las mismas server actions. `EsquemaPanel` es el contenido presentacional compartido.
7. **Horarios**: se pueden omitir los tres (backend aplica habituales) o informar los tres; el editor no hardcodea habituales.
8. **Socio sin esquema**: `GET .../tarifa-efectiva/franjas` del socio ya hereda del parque; la UI lo distingue comparando `esquema.destino.tipo` (SOCIO vs PARQUE).
9. **Fecha de consulta** por `?fecha=YYYY-MM-DD` (por defecto hoy), compartible por URL.
10. **Precarga** del editor de socio con franjas efectivas (FR-014); valores con origen CATÁLOGO se dejan vacíos para no fijarlos como propios.
