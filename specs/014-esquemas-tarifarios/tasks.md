---
description: "Task list for Esquemas tarifarios por franjas horarias (Parque y Socio)"
---

# Tasks: Esquemas tarifarios por franjas horarias (Parque y Socio)

**Input**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/)

**Tests**: Incluidos. La constitución (III) exige test-first para lógica de datos/validación. Escribir cada test y verlo fallar antes de implementar. Los componentes de presentación quedan exentos.

**Format**: `- [ ] T### [P?] [US?] Descripción con ruta`. `[P]` = archivos distintos, sin dependencia pendiente.

## Phase 1: Setup

- [X] T001 Agregar tipos `TipoFranja`, `EsquemaEstado`, `DestinoTipo`, `OrigenValor`, `Franja`, `FranjaDto`, `Esquema`, `CreateEsquemaDto`, `UpdateEsquemaDto`, `FranjaEfectiva`, `FranjasEfectivas` en `lib/api/types.ts` (según data-model.md)
- [X] T002 [P] Agregar opciones `TIPOS_FRANJA` (RESTO/PICO/VALLE con etiqueta) y `ORIGEN_LABEL` (PROPIO/CATÁLOGO) en `lib/admin-options.ts`

## Phase 2: Foundational (bloquea todas las historias)

**Tests primero (deben fallar)**

- [X] T003 [P] Test de `requireReader()` (HINS_ADMIN y AGC pasan; otro rol → `/main`; `UnauthorizedError` → `/login`) en `tests/lib/api/guards.test.ts`
- [X] T004 [P] Test de `lib/esquema-franjas.ts` en `tests/lib/esquema-franjas.test.ts`: `validateFranjas` (falta un tipo, tipo duplicado, hora inválida, hueco, solape, cruce de medianoche válido 23:00–05:00, cobertura exacta 24 h, límite inicio inclusivo/fin exclusivo, las 3 horas omitidas válido, solo algunas omitidas inválido, valor propio negativo, 0 válido vs vacío, catálogo vacío inválido), `toCreateDto`/`toUpdateDto` (vacío = omitir campo), `franjasToForm` (valores con origen CATÁLOGO quedan vacíos), `emptyFranjasForm`
- [X] T005 [P] Test de `lib/api/esquemas-tarifarios.ts` en `tests/lib/api/esquemas-tarifarios.test.ts`: rutas y métodos por destino (parque/socio), `page/limit`, `fecha`, coerción de decimales a number, `emptyPage` en 404, delete 204 → `null`
- [X] T006 [P] Test de `buildParkNav` con ítem "Tarifas" (admin y AGC lo ven; otros roles no; conserva `?proyectoId`) en `tests/lib/admin-nav.test.ts`

**Implementación**

- [X] T007 [P] Agregar `requireReader()` (HINS_ADMIN | AGC; mismos redirects que `requireAdmin`) en `lib/api/guards.ts`
- [X] T008 [P] Crear `lib/esquema-franjas.ts` (`EsquemaFormValues`, `emptyFranjasForm`, `franjasToForm`, `validateFranjas`, `toCreateDto`, `toUpdateDto`); no hardcodea horarios habituales: omitir los tres horarios es válido, informar alguno obliga a informar los tres (research R2)
- [X] T009 [P] Crear `lib/api/esquemas-tarifarios.ts`: `listEsquemas(destino, {page, limit})`, `getEsquema(id)`, `createEsquema(destino, dto)`, `updateEsquema(id, dto)`, `deleteEsquema(id)`, `getFranjasEfectivas(destino, fecha?)`, `getTarifaEfectiva(destino, fecha?, hora?)`; normaliza decimales
- [X] T010 Agregar ítem "Tarifas" (`TagIcon`, `${base}/tarifas${query}`) visible a admin y AGC en `buildParkNav` de `lib/admin-nav.ts`; verificar que los layouts de `app/{gdd,gdc,gdcv}/layout.tsx` pasen el rol (incluido AGC) a `ParkSidebar` en `components/layout/ParkSidebar.tsx`
- [X] T011 [P] Crear `lib/api/esquema-catalogo.ts`: `listNombresTarifa()` → nombres únicos del catálogo (pagina `GET /tarifas` hasta agotar) para el selector (research R6)
- [X] T012 [P] Crear `components/esquemas/FranjasEfectivasTable.tsx` (tabla de 3 franjas: tipo, horario, tarifa, energía, inyección, unidad; `Badge` PROPIO/CATÁLOGO; aviso "heredado del parque" cuando `heredado`)

**Checkpoint**: base lista; historias pueden avanzar.

## Phase 3: User Story 1 — Ver franjas y tarifa efectiva (P1) 🎯 MVP

**Goal**: ver el esquema efectivo de parque y socio con origen de cada valor y fecha elegible.

**Independent Test**: abrir `/gdcv/tarifas?proyectoId=<id>` y el diálogo de tarifas de un socio con y sin esquema propio; cambiar `?fecha=`.

- [X] T013 [US1] Crear `components/esquemas/EsquemaTarifarioView.tsx` (Server Component): `requireReader()`, lee `fecha` (por defecto hoy en hora Argentina con `lib/argentina-day-range.ts`), llama `getFranjasEfectivas(destino, fecha)`, renderiza fecha de vigencia + `FranjasEfectivasTable` (vía `EsquemaPanel`), estados vacío/error/carga (FR-015), `heredado = esquema.destino.tipo === "PARQUE" && destino.tipo === "SOCIO"`
- [X] T013b [P] [US1] Crear `components/esquemas/EsquemaPanel.tsx` (client, presentacional: efectivas + historial + acciones por props; lo usan `EsquemaTarifarioView` y `SocioTarifasDialog`)
- [X] T014 [P] [US1] Crear `components/esquemas/FechaConsultaPicker.tsx` (client; `DatePicker` existente; actualiza `?fecha=` conservando `proyectoId`)
- [X] T015 [P] [US1] Crear páginas `app/gdcv/tarifas/page.tsx`, `app/gdd/tarifas/page.tsx`, `app/gdc/tarifas/page.tsx` (wrappers finos: resuelven parque con `resolveDashboardContext(proyectoId)` y montan `EsquemaTarifarioView`)
- [X] T016 [US1] Crear `app/api/parques/[parqueId]/socios/[socioId]/tarifas/route.ts` (GET con `requireReader`; devuelve `{ efectivas, historial, catalogo }` para `fecha` y `page`) y `components/gdcv/SocioTarifasDialog.tsx` (client, patrón `SocioHistoricoDialog`; muestra `EsquemaPanel` con los datos del handler)
- [X] T017 [US1] Agregar acción "Tarifas" a la fila de socio y montar `SocioTarifasDialog` en `components/gdcv/SociosTable.tsx` (mismo patrón que `historicoSocio`)

**Checkpoint**: US1 demostrable de solo lectura.

## Phase 4: User Story 2 — Definir esquema de un parque (P1)

**Goal**: crear, editar, eliminar esquemas de parque con historial y validaciones.

**Independent Test**: crear esquema en un parque, verlo en el historial, editarlo, eliminarlo; probar hueco horario y fecha ≤ último.

- [X] T018 [P] [US2] Test de server actions `createEsquemaAction`/`updateEsquemaAction`/`deleteEsquemaAction` (éxito, error del backend reenviado, `UnauthorizedError` → `/login`, delete `null` = éxito, `revalidatePath`) en `tests/app/esquemas-actions.test.ts`
- [X] T019 [US2] Crear `components/esquemas/esquema-actions.ts` (`"use server"`, wrappers de una línea sobre `runCrudAction`; el backend responde 403 a no-admin, igual que 013; revalida `/{gdd,gdc,gdcv}/tarifas`)
- [X] T020 [P] [US2] Crear `components/esquemas/FranjaFields.tsx` (una franja: `SelectField` de tarifa, 2 campos de hora HH:MM con placeholder = horario habitual, 3 valores propios opcionales con ayuda "vacío = catálogo")
- [X] T021 [US2] Crear `components/esquemas/EsquemaEditorDialog.tsx` (client): fecha de vigencia (`DatePicker`) + 3 `FranjaFields`; modo crear/editar; `validateFranjas` antes de enviar; conserva datos ante error del backend; en VIGENTE deshabilita fecha; aviso éxito inline
- [X] T022 [US2] Crear `components/esquemas/EsquemaHistorial.tsx`: tabla paginada (desde, hasta, estado con `Badge`, resumen de franjas), `PaginationControls`, acciones editar/eliminar solo si `canWrite` y estado ≠ HISTÓRICA, `ConfirmDeleteDialog`
- [X] T023 [US2] Integrar en `EsquemaTarifarioView.tsx`: cargar historial con `loadList(listEsquemas)` + `listNombresTarifa()`, botón "Crear esquema" y `EsquemaHistorial` solo si `canWrite` (rol admin); estado vacío con acción de crear
- [X] T024 [US2] Mapear errores del backend (400 horarios, 404 tarifa, 409 fecha/histórico/fecha fuera de orden entre esquemas vecinos) a mensajes legibles en `components/esquemas/esquema-actions.ts` (sin ocultar el mensaje original)

**Checkpoint**: parque completo (ver + gestionar).

## Phase 5: User Story 3 — Definir esquema de un socio (P2)

**Goal**: esquema propio por socio con herencia del parque y precarga.

**Independent Test**: crear esquema en un socio sin propio → vista efectiva pasa a "propio"; eliminarlo → vuelve "heredado".

- [X] T025 [US3] Extender `SocioTarifasDialog.tsx` con historial, botón "Crear esquema" y `EsquemaEditorDialog` (solo admin) para destino SOCIO usando los datos del Route Handler de T016 y las server actions de T019
- [X] T026 [US3] Añadir precarga (parque y socio) en `EsquemaEditorDialog.tsx`: prop `precarga` (franjas efectivas actuales, propias o del parque) → `franjasToForm`; botón "Partir de la tarifa efectiva"
- [X] T027 [US3] Tras mutar, recargar los datos del Route Handler en `SocioTarifasDialog.tsx`, y asegurar que los textos indican "propio" vs "heredado del parque" tras crear/eliminar
- [X] T028 [P] [US3] Test de `esquema-franjas` para precarga desde efectivas (origen CATÁLOGO → vacío, PROPIO → valor) en `tests/lib/esquema-franjas.test.ts`

**Checkpoint**: parque y socio completos.

## Phase 6: User Story 4 — Coherencia con el catálogo (P3)

**Goal**: advertir al borrar tarifas que alimentan esquemas.

**Independent Test**: borrar una tarifa usada → ver advertencia; si el backend rechaza, ver el motivo.

- [X] T029 [US4] Actualizar `IMPACT_WARNING` en `components/tarifas/tarifaConfig.tsx` para mencionar esquemas de parques y socios (FR-016); verificar que el error 409 del backend se muestra en `ConfirmDeleteDialog`

## Phase 7: Polish

- [ ] T030 [P] Revisión de accesibilidad (labels, foco en diálogos, contraste de badges, navegación por teclado del editor) en `components/esquemas/*`
- [ ] T031 [P] Verificar que AGC no ve acciones de escritura y otros roles son redirigidos (SC-005) siguiendo `quickstart.md` escenario 6
- [X] T032 Ejecutar `pnpm test`, `pnpm lint` y `pnpm build`; corregir fallas
- [ ] T033 Recorrer `quickstart.md` completo contra el backend local y registrar desvíos

## Dependencies & Order

- Phase 1 → Phase 2 → historias. Dentro de Phase 2: tests (T003–T006) antes de implementación (T007–T012); T010 depende de T006/T007.
- **US1** depende de Phase 2. **US2** depende de US1 (reusa `EsquemaTarifarioView`). **US3** depende de US1 y del editor de US2 (T021). **US4** independiente (solo T029).
- Orden de entrega: US1 → US2 → US3 → US4.

## Parallel Examples

- Phase 2 tests: T003, T004, T005, T006 en paralelo; luego T007, T008, T009, T011, T012.
- US1: T014 y T015 en paralelo tras T013.
- US2: T018 y T020 en paralelo.
- US4 puede hacerse en cualquier momento tras Phase 1.

## Implementation Strategy

- **MVP**: Phase 1 + 2 + US1 (consulta de solo lectura de parque y socio).
- **Incremento 2**: US2 (gestión parque). **Incremento 3**: US3 (socio). **Incremento 4**: US4 + Polish.
