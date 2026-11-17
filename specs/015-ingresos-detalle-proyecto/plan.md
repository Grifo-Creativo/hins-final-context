# Implementation Plan: Ingresos por inyección en el detalle de proyecto

**Branch**: `015-ingresos-detalle-proyecto` | **Date**: 2026-11-17 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/015-ingresos-detalle-proyecto/spec.md`

## Summary

Reemplazar mocks de "ahorro" por datos reales de la API de ingresos (kpis, resumen, por-socio, roi/realizado) en Performance GDD/GDCV, Historial de Generación, tabla/detalle de socios, ROI y portal del socio. Enfoque: un cliente tipado `lib/api/ingresos.ts` (+ `roiRealizado`), funciones puras en `lib/ingresos-*.ts` con tests (variación, series, estados nulos, conversión), carga en Server Components con aislamiento de fallas por bloque (Suspense + error boundary), alcance siempre explícito, y componentes UI compartidos para aviso de datos incompletos y estados nulos.

## Technical Context

**Language/Version**: TypeScript strict, Node 20, Next.js 16.2.4 (App Router), React 19.2

**Primary Dependencies**: shadcn/Radix, Tailwind v4, Recharts 3.8, TanStack Table, date-fns. Sin dependencias nuevas.

**Storage**: N/A (backend HINS vía `apiFetch`, `HINS_API_BASE_URL`)

**Testing**: vitest (`npm test`), tests en `tests/lib/*.test.ts`

**Target Platform**: Web (SSR), roles HINS_ADMIN / GDD_OWNER / AGC / SOCIO

**Project Type**: web-application (solo front; backend ya entregado)

**Performance Goals**: KPIs de ingresos sin añadir >3 s sobre la carga actual (SC-003); peticiones en paralelo por bloque.

**Constraints**: montos llegan como string (decimal) → se coaccionan en el borde `lib/api` con `toNumber`; nunca sumar PARQUE+SOCIOS; fallas aisladas por bloque.

**Scale/Scope**: ~8 vistas, 5 endpoints nuevos, 1 cliente, ~6 módulos puros.

## Constitution Check

| Principio | Evaluación |
|---|---|
| I Type Safety | PASS. Tipos únicos en `lib/api/types.ts`; `any` evitado; respuesta validada con guard en borde. |
| II Server/Client | PASS. Fetch en Server Components; vistas interactivas reciben props. Sin fetch cliente a endpoints internos. |
| III Test-first | PASS. Lógica pura (variación, promedio, series, conversión, estados) con tests antes de implementar. |
| IV UI accesible | PASS. Reuso shadcn/tokens; avisos con rol/label; componente compartido `IngresosIncompletosAlert` y `EstadoNulo`. |
| V Simplicidad | PASS. Sin deps, sin flags; un cliente, funciones puras. `lint` + `build` por PR. |

Sin violaciones; Complexity Tracking vacío. Re-evaluado tras Phase 1: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/015-ingresos-detalle-proyecto/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ingresos-api.md
└── tasks.md   # /speckit-tasks
```

### Source Code (repository root)

```text
lib/api/
├── ingresos.ts            # NUEVO: resumen, kpis, porSocio (alcance obligatorio)
├── roi.ts                 # + getRoiRealizado
├── socios.ts              # medidores[], potenciaAsociadaKwp
├── types.ts               # tipos de ingresos / roi realizado
lib/
├── ingresos-kpis.ts       # NUEVO puro: variación, promedio, estados
├── ingresos-series.ts     # NUEVO puro: serie mensual con meses en cero
├── roi-realizado.ts       # NUEVO puro: conversión ARS/USD, estados
├── park-energy-series.ts  # getGenerationHistoryRows usa ingresos
├── socio-presentation.ts  # mapSocioToRow con datos reales
components/
├── ingresos/              # NUEVO: IngresosIncompletosAlert, EstadoNulo, BloqueConError
├── gdd/ (ParkPerformanceView, GddRoiView, ConsumptionHistoryTable, GddRoiRecuperoTable)
├── gdcv/ (GdcvPerformanceView, GdcvRoiView, SociosTable, SocioDetailSheet)
app/gdd|gdcv/**/page.tsx  # carga en paralelo + Suspense por bloque
docs/openapi.json         # regenerado desde swagger vivo
tests/lib/ingresos-*.test.ts, roi-realizado.test.ts
```

**Structure Decision**: proyecto Next.js único; capa de datos en `lib/api`, lógica pura en `lib/`, UI en `components/`. Sigue el patrón de `energia.ts`.

## Complexity Tracking

Sin violaciones.
