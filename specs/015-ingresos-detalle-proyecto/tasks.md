# Tasks: Ingresos por inyección en el detalle de proyecto

**Input**: `specs/015-ingresos-detalle-proyecto/` (plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md)
**Tests**: requeridos para lógica pura (Constitución III, FR-028): escribir y ver fallar antes de implementar.
**Format**: `- [ ] ID [P?] [US?] Descripción con ruta`

## Phase 1: Setup

- [x] T001 Regenerar `docs/openapi.json` desde `http://localhost:3000/docs-json` y verificar paths `/ingresos/*` y `/roi/realizado` (FR-029)
- [x] T002 [P] Agregar tipos de ingresos y ROI realizado (Alcance, IngresoPeriodo, IngresosResumen, Cobertura, IngresosKpis, TarifaVigente, IngresoSocio, IngresosPorSocio, RoiRealizado) y extender `Socio` con `medidores[]` y `potenciaAsociadaKwp` en `lib/api/types.ts`

## Phase 2: Foundational (bloquea todas las historias)

- [x] T003 Crear `lib/api/ingresos.ts` con `getIngresosResumen`, `getIngresosKpis`, `getIngresosPorSocio` (parámetro `alcance` obligatorio, `buildQuery`, `apiFetch`, null→estado vacío) siguiendo `lib/api/energia.ts`
- [x] T004 [P] Agregar `getRoiRealizado(parqueId, {socioId?, hasta?})` en `lib/api/roi.ts`
- [x] T005 [P] Test rojo de utilidades de formato: monto string→ARS sin pérdida, variación null→"—" en `tests/lib/ingresos-kpis.test.ts`
- [x] T006 Crear `lib/ingresos-kpis.ts` (formateo de variación y montos, estados sinTarifa/sinIngresosTodavia/incompleto) hasta que T005 pase. Variaciones y promedio por socio vienen calculados del backend: el front solo los formatea, no los recalcula
- [x] T007 [P] Crear `components/ingresos/IngresosIncompletosAlert.tsx` (aviso con `cobertura.registrosSinIngreso`, rol alert, shadcn Alert) (FR-023)
- [x] T008 [P] Crear `components/ingresos/EstadoNulo.tsx` (variantes: sin tarifa, sin ingresos todavía, sin tipo de cambio, sin inversión meta) (FR-026)
- [x] T009 [P] Crear `components/ingresos/BloqueConError.tsx` (error boundary + reintento `router.refresh`) (FR-024)
- [x] T010 [P] Crear `components/ingresos/UltimaActualizacion.tsx` mostrando `ultimoIngresoCalculadoEn` (aclaración 3)

**Checkpoint**: cliente, tipos y componentes compartidos listos.

## Phase 3: US1 - KPIs de Performance (P1) 🎯 MVP

**Prueba independiente**: abrir Performance GDD y GDCV con ingresos; importes, variación, tarifa, energía acumulada y promedio coinciden con el backend; sin valores fijos.

- [x] T011 [P] [US1] Tests rojos de formateo de variación null → "—", visibilidad de promedio por usuario solo GDCV y no null, texto de energía acumulada en `tests/lib/ingresos-kpis.test.ts`
- [x] T012 [US1] Cargar `getIngresosKpis` (alcance PARQUE, mes en curso hora Argentina con `lib/argentina-day-range.ts`) en `app/gdd/performance/page.tsx` y `app/gdcv/performance/page.tsx`, en paralelo con el resto de fetches (`Promise.allSettled`) y cada bloque envuelto en `BloqueConError`/Suspense propio (FR-024). En GDCV, KPIs y por-socio (T023) son bloques independientes en la misma página
- [x] T013 [US1] Reemplazar `savingsCardMock`, `tariffCardMock` y `compareBadge` mock por datos reales, rótulo "Ingresos por inyección" en `components/gdd/ParkPerformanceView.tsx` (FR-001..004, FR-025)
- [x] T014 [US1] Reemplazar `gdcvAhorroTotalAbril` y `gdcvPromedioPorUsuario` por `kpis.promedioPorSocio` del backend (sin recalcular); ocultar si es null en `components/gdcv/GdcvPerformanceView.tsx`. En GDD no se muestra (FR-005, FR-021)
- [x] T015 [US1] Mostrar `IngresosIncompletosAlert`, `EstadoNulo` y `UltimaActualizacion` en ambas vistas de Performance (FR-023, FR-026)

## Phase 4: US2 - Historial de Generación (P1)

**Prueba independiente**: cada fila muestra el ingreso real del mes; meses sin ingreso en 0; columnas sin dato con "—".

- [x] T016 [P] [US2] Test rojo de serie mensual que rellena meses en cero y no suma alcances en `tests/lib/ingresos-series.test.ts`
- [x] T017 [US2] Crear `lib/ingresos-series.ts` (serie mensual desde `resumen` agrupar=mes, meses faltantes en cero)
- [x] T018 [US2] Modificar `getGenerationHistoryRows` en `lib/park-energy-series.ts` para recibir ingresos reales y usar "—" en adquirida/otras/total/% (FR-006); actualizar `tests/lib/park-energy-series.test.ts`
- [x] T019 [US2] Cargar `getIngresosResumen` (agrupar=mes, alcance PARQUE) en las páginas de Performance y pasarlo a `components/gdd/ConsumptionHistoryTable.tsx`; renombrar columna a "Ingresos por inyección"

## Phase 5: US3 - Socios (P2)

**Prueba independiente**: parque con socio de 1 medidor y otro de 2; potencia, energía, ingreso, desglose; totales = suma de filas; solo HINS Admin y AGC.

- [x] T020 [P] [US3] Test rojo de `mapSocioToRow` con datos reales, estados sinMedidor/sinIngresos y esquema propio/parque en `tests/lib/socio-presentation.test.ts`
- [x] T021 [US3] Actualizar `lib/api/socios.ts` para mapear `medidores[]` y `potenciaAsociadaKwp`
- [x] T022 [US3] Reescribir `mapSocioToRow` en `lib/socio-presentation.ts` con `getIngresosPorSocio` (FR-007, FR-008, FR-010)
- [x] T023 [US3] Cargar `getIngresosPorSocio` (alcance SOCIOS, solo HINS_ADMIN/AGC, FR-007b) en `app/gdcv/performance/page.tsx` como bloque aislado y pasarlo a `GdcvPerformanceView`, que renderiza `SociosTable` (ahí vive, `components/gdcv/GdcvPerformanceView.tsx`); mostrar columnas y totales reales en `components/gdcv/SociosTable.tsx`
- [x] T024 [US3] Reemplazar `DETAIL_MAP` mock por datos reales con desglose por medidor; campos sin dato como "No disponible" en `components/gdcv/SocioDetailSheet.tsx` (FR-009, FR-011)
- [x] T023b [US3] Verificar cómo se resuelve el rol en `app/gdcv/**` y garantizar que dueño GDD y SOCIO no accedan a la tabla/detalle de socios ni a `por-socio` (FR-007b, FR-027); agregar test del helper de permisos si se extrae lógica
- [x] T025 [US3] Eliminar de `data/gdcv-socio-mock.ts` los datos de socio ya reemplazados (solo si ya no se usan)

## Phase 6: US4 - ROI (P2)

**Prueba independiente**: ROI con inversión meta y tipos de cambio: acumulado, pendiente y % coinciden con `roi/realizado`; mes sin tipo de cambio marcado.

- [x] T026 [P] [US4] Tests rojos en `tests/lib/roi-realizado.test.ts`: sinInversionMeta, mesesSinTipoCambio, conversión ARS por mes con tipoCambio del mes
- [x] T027 [US4] Crear `lib/roi-realizado.ts` (KPIs, filas Histórico, tramo real de curva, conversión de moneda)
- [x] T028 [US4] Cargar `getRoiRealizado` (en paralelo con el resto de fetches de la página) en `app/gdd/roi/page.tsx` y `app/gdcv/roi/page.tsx`
- [x] T029 [US4] Reemplazar KPIs, timeline y `TIPO_CAMBIO_ARS` en `components/gdd/GddRoiView.tsx`; dejar de mostrar `creditoAcumulado` (FR-012..017)
- [x] T030 [P] [US4] Igual para `components/gdcv/GdcvRoiView.tsx`
- [x] T031 [US4] Alimentar tabla Histórico en `components/gdd/GddRoiRecuperoTable.tsx` y tramo real de la curva con datos reales; payback/TIR/proyectado marcados "estimativo/no disponible" (FR-016, FR-018); verificar en `quickstart.md` paso 5
- [x] T032 [US4] Eliminar `lib/roi-kpis.ts` (`computeRealRoiKpis`) y su test si quedan sin uso

## Phase 7: US5 - Portal del socio (P3)

> **⛔ Bloqueada**: el portal (`app/gdcv/socio/**`) es un demo 100% cliente: sin `proyectoId`/`parqueId`, sin sesión real de rol SOCIO (`SocioAuthGate` valida un OTP contra el socio mock `AS` en `sessionStorage`). Los endpoints de ingresos exigen parque y un usuario SOCIO con `socioId` asociado en el backend. Requiere decisión: login real de socio + resolución de parque/socio, o dejar el portal como demo. No se implementó para no mezclar datos reales con identidad ficticia.

**Prueba independiente**: como SOCIO con ingresos, solo ve su socio; total del mes y serie correctos; sin promedio por socio.

- [ ] T033 ⛔ BLOQUEADA: ver nota [US5] Cargar `getIngresosKpis` y `getIngresosResumen` con `alcance=SOCIOS` y `socioId` propio en `app/gdcv/socio/page.tsx` y `app/gdcv/socio/parque/page.tsx` (FR-019)
- [ ] T034 ⛔ [US5] Reemplazar mock de total del mes y serie en `components/gdcv/SocioPerformanceView.tsx` y `components/gdcv/SocioEnergyView.tsx`
- [ ] T035 ⛔ [US5] Columna de ingreso por inyección real en `components/gdcv/CompensacionesTable.tsx`; autoconsumo, total y "Aplicado" como no disponibles (FR-020)
- [ ] T036 ⛔ [US5] Ocultar `promedioPorSocio` al socio y garantizar que ninguna ruta ofrece datos de parque/otros socios (FR-021, SC-007)

## Phase 8: Polish

- [x] T037 [P] Buscar y eliminar textos "Ahorro" residuales sobre valores de ingresos (`grep -rn "Ahorro" components app`) (FR-025). Quedan "Ahorro" solo en el portal del socio (T033–T036 bloqueadas), MonetaryBarChart y "Ahorro Estimado" del Proyectado (estimativo, fuera de alcance)
- [x] T038 [P] Revisar que ninguna vista sume PARQUE+SOCIOS (SC-004) y accesibilidad de alertas/estados (teclado, contraste)
- [x] T039 `npm test && npm run lint && npm run build`
- [ ] T040 (pendiente: requiere backend con datos y sesión; no ejecutado) Ejecutar `quickstart.md` completo con datos reales; registrar si los medidores de socio exportan energía y si hay tipos de cambio REAL. Si faltan tipos de cambio, el criterio de salida es que la vista muestre el estado "sin tipo de cambio" sin romperse (no bloquea). Medir tiempo de carga de Performance frente al estado previo (SC-003: ≤ 3 s adicionales)

## Dependencias y orden

- Setup → Foundational → historias. US1 y US2 comparten Performance (US2 tras T012). US3, US4, US5 independientes entre sí tras Foundational.
- Dentro de cada historia: tests rojos → lib → página → componente.
- Paralelo: T002/T004/T005/T007-T010; T011/T016/T020/T026 en paralelo entre historias; T029 y T030.

## Estrategia

- MVP = Phase 1-3 (US1). Luego US2 → US3/US4 → US5 → Polish.
