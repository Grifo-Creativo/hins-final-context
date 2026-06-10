# about-performance-layout.md
# HINS — Layout de la fila superior en vistas Performance

> **Lectura recomendada** cuando se modifique:
> - `ParkDetailsCard`, `PerformancePlaceholderCard`
> - `PERFORMANCE_TOP_ROW_GRID` / `GDD_PERFORMANCE_TOP_ROW_GRID`
> - Cualquier vista Performance (GDD / GDCV AGC / GDCV Socio parque)
>
> **No reemplaza** `context/components.md` (spec de componentes).  
> **Complementa** flows por rol (`flows/GDD/flow.md`, `flows/GDCV-agc/GDCV_flow.md`, etc.).

---

## 1. Qué es esta fila

En Performance (y variantes socio), la **primera fila** del contenido principal suele ser un grid de **3 columnas** en desktop:

| Col | Contenido típico | Ancho (desktop) |
|-----|------------------|-----------------|
| 1 | Detalle del parque (`ParkDetailsCard`) o placeholder | Proporcional (`fr`) |
| 2 | Chart principal (`CardWithContent` + bar o vista DIA) | Proporcional (`fr`, mayor) |
| 3 | Columna de KPIs (`KpiPrimary` / `KpiSecondary` stack) | **Fijo 340px** |

En mobile: `grid-cols-1` — las tres cards se apilan.

**Archivo fuente de constantes:** `components/ui/performance-placeholder-card.tsx`

---

## 2. Constantes de grid (implementación actual)

### `PERFORMANCE_TOP_ROW_GRID` (default)

```txt
md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_340px]
```

- Proporción flexible parque : chart ≈ **33% : 67%** (del espacio restante tras 340px).
- **Usado en:** vistas AGC/GDD con 3 columnas (parque + chart + KPI 340px). **No** en Socio parque.

### `GDD_PERFORMANCE_TOP_ROW_GRID` (con `ParkDetailsCard`)

```txt
md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)_340px]
```

- Proporción flexible ≈ **38% : 62%**.
- Tuning visual para labels largos en grid 2×2 (*Ultimo Mantenimiento*) sin ensanchar demasiado el chart.
- **Usado en:** `ParkPerformanceView` (`/gdd/performance`), `GdcvPerformanceView` (`/gdcv/performance`).

### `SOCIO_ENERGY_TOP_ROW_GRID` (Mi Espacio — otro producto de fila)

```txt
lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2.25fr)_340px]
xl:grid-cols-[minmax(0,1.15fr)_minmax(0,2.4fr)_340px]
```

- Orden: **parque** | **chart** (flex, prioridad) | **panel Abril** (340px, última columna).
- **No mezclar** con las constantes Performance de arriba.

### `SOCIO_PARQUE_TOP_ROW_GRID` (Performance del Parque socio)

```txt
md:grid-cols-[minmax(0,1.85fr)_340px]
items-stretch
```

- Columnas misma altura (`h-full` en card chart + columna KPI).
- Chart: `flex-1` + `min-h-[300px]` + `h-full` en `ParkEnergyBarChart`; KPI 2×2 `shrink-0` debajo. Sin columna `ParkDetailsCard`.

---

## 3. Por qué este enfoque es sano (grid + flex)

| Práctica | Cómo se cumple |
|----------|----------------|
| CSS Grid estándar | Columnas `fr` + tercera fija `340px`; sin `calc()` custom ni JS de layout. |
| `minmax(0, …fr)` | Evita overflow con textos largos en celdas KPI. |
| `items-stretch` + `h-full` en hijos | Las tres cards de la fila igualan altura (patrón existente). |
| Separación de responsabilidades | El **ancho** de `ParkDetailsCard` lo define el **padre grid**; el organismo no fija `width` en px. |

Dentro de `ParkDetailsCard`:

- **Flex columna** (`flex h-full min-h-0 flex-col`): imagen arriba + bloque métricas abajo.
- **Imagen:** `block h-auto w-full` + dimensiones intrínsecas del PNG → ancho 100%, altura proporcional.
- **Métricas:** `PARK_DETAILS_METRICS_GRID` (`1.15fr / 0.85fr`) + `KpiSecondaryMetric`.

No hay posicionamiento absoluto para columnas ni hacks de ancho dentro del organismo.

---

## 4. `ParkDetailsCard` — integración

| Item | Detalle |
|------|---------|
| Estado GDD | Integrado en `/gdd/performance` |
| Estado GDCV | Integrado en `/gdcv/performance` |
| Mock GDD | `gddParkDetails` en `data/gdd-performance-mock.ts` |
| Mock GDCV | `gdcvParkDetails` en `data/gdcv-mock.ts` |
| Asset GDD | `/images/png-assets/asset_gdd.png` (478×347) |
| Asset GDCV | `/images/png-assets/asset_gdcv.png` (478×347) |
| Spec UI | `context/components.md` → ParkDetailsCard, KpiSecondaryMetric |

---

## 5. Qué puede complicar el futuro

### 5.1 Bifurcación de constantes de grid

Hoy hay **dos** grids Performance (`PERFORMANCE_*` vs `GDD_*`). Al integrar `ParkDetailsCard` en GDCV:

- **Opción A (recomendada):** Reutilizar `GDD_PERFORMANCE_TOP_ROW_GRID` si el ratio 38/62 sirve también en GDCV.
- **Opción B:** Renombrar a algo neutro, ej. `PERFORMANCE_TOP_ROW_WITH_PARK_GRID`, y usarlo en todas las vistas con parque.
- **Evitar:** Copiar strings de `grid-cols-[…]` en cada vista — deriva silenciosa.

### 5.2 Tuning por `fr` decimal

`1.15` / `1.85` es ajuste visual, no semántico de negocio. Si otro breakpoint necesita otro ratio, no multiplicar constantes sin documentar aquí.

Alternativa más automática (menos predecible): `minmax(240px, 1.2fr)` en col 1. Solo si el contenido lo exige.

### 5.3 Labels largos vs ancho de columna

Si un label sigue partiendo en 2 líneas:

1. Afinar ratio (`1.2fr` / `1.8fr`) — primero probar aquí.
2. Tipografía ya reducida en value (`text-base` en `KpiSecondaryMetric`).
3. Último recurso: acortar copy o `text-xs` solo en labels (coordinar con `components.md`).

### 5.4 Tercera columna fija 340px

Cambiar `340px` impacta **todas** las vistas que usan el mismo grid. Coordinar con diseño antes de tocar.

### 5.5 Archivos relacionados (checklist de impacto)

| Cambio | Revisar |
|--------|---------|
| Nuevo ratio de columnas 1–2 | `performance-placeholder-card.tsx`, vistas Performance, este doc |
| Nuevo organismo en col 1 | `ParkDetailsCard`, mock por flujo, grid constant |
| Chip rango DIA / bar chart | `components/gdd/chart-range-options.ts` (`CHART_RANGE_TABS`) |
| Vista horaria | `DailyGenerationChartBlock`, `period === "1d"` en la vista |

---

## 6. Chips de rango en header de chart

Fuente única: `components/gdd/chart-range-options.ts` → `CHART_RANGE_TABS`.

| Chip `id` | Label UI | Vista |
|-----------|----------|--------|
| `1d` | **DIA** | `DailyGenerationChartBlock` |
| `1m` | 1M | Bar chart |
| `6m` | 6M | Bar chart (default habitual) |
| `1a` | 1A | Bar chart |
| `todo` | TODO | Bar chart |

Consumido por: `ParkPerformanceView`, `GdcvPerformanceView`, `SocioPerformanceView`, `SocioEnergyView` (modo kWh).

---

## 7. Decisiones cerradas

- `ParkDetailsCard` en GDD y GDCV Performance; grid compartido `GDD_PERFORMANCE_TOP_ROW_GRID` (`1.15fr : 1.85fr : 340px`).
- Imagen: full-width proporcional, sin `h-*` fijo en el organismo.
- KPI label mantenimiento: **Ultimo Mantenimiento** (ambos flujos).
- GDCV `imageAlt`: **Parque GDCV**; equipo mock: Canadian Solar HiKu7 655W (línea comercial real, distinta a GDD).

---

## 8. Referencias rápidas

| Recurso | Ruta |
|---------|------|
| Constantes grid | `components/ui/performance-placeholder-card.tsx` |
| Organismo parque | `components/ui/park-details-card.tsx` |
| Primitiva métrica | `components/ui/kpi-secondary-metric.tsx` |
| GDD vista | `components/gdd/ParkPerformanceView.tsx` |
| GDCV vista | `components/gdcv/GdcvPerformanceView.tsx` |
| Spec componentes | `context/components.md` (ParkDetailsCard, ChartRangeOptions) |
