# GDCV Socio — Vista V2: Mi Ahorro con perspectiva Dinero / Energía

> **Ruta:** `http://localhost:3000/gdcv/socio-v2`  
> **Propósito:** Variante de `/gdcv/socio` para validación de diseño con el cliente. Permite al socio ver sus ahorros tanto en pesos ($) como en kWh, sin duplicar datos.

---

## 1. Archivos del feature

### Nuevos (no modifican nada existente)
| Archivo | Rol |
|---|---|
| `app/gdcv/socio-v2/page.tsx` | Ruta Next.js — compone los bloques de la página |
| `components/gdcv/SocioEnergyViewV2.tsx` | Layout 2 columnas — orquesta el bloque interactivo |
| `components/gdcv/SocioV2BarChart.tsx` | Bar chart simple (mint, labels top) — solo V2 |
| `components/ui/tabs-for-blocks-icons.tsx` | Toggle $ / ⚡ — variante icon-only de TabsForBlocks |
| `components/gdcv/SocioV2FeatureKpi.tsx` | KPI híbrida FeatureItem + KpiPrimary (sparkline) — panel derecho |
| `components/gdcv/SocioV2BreakdownList.tsx` | Desglose con tabs `$` / `⚡` controlados — solo V2 |
| `components/gdcv/socio-v2-constants.ts` | Chips DIA/6M/1A/TODO + copy de subtítulos mockup |

### Modificado (solo adición, sin tocar exports existentes)
| Archivo | Qué se agregó |
|---|---|
| `data/gdcv-socio-mock.ts` | Series kWh, `socioStatListV2Dinero/Energia`, `socioV2PanelKpis` |

### NO modificados (reutilizados tal cual)
- `components/gdcv/SocioPageHeading.tsx`
- `components/gdcv/SocioRoiView.tsx`
- `components/gdcv/CompensacionesTable.tsx`
- Todos los componentes de `components/ui/`

---

## 2. Layout de la página (`/gdcv/socio-v2`)

```
<SocioPageHeading />          ← header idéntico a /gdcv/socio
<SocioEnergyViewV2 />         ← ÚNICO bloque nuevo/diferente
<SocioRoiView />              ← idéntico a /gdcv/socio
<CompensacionesTable />       ← idéntico a /gdcv/socio
```

Solo `SocioEnergyViewV2` difiere del flujo original.

---

## 3. Diseño de `SocioEnergyViewV2`

### Layout 2 columnas (responsive) — alineado a `GDCV__SocioV2-Performance_01/02.png`

```
┌─────────────────────────────────────────┬────────────────┐
│  LEFT CARD (Card manual)                │  RIGHT CARD    │
│                                         │                │
│  Title + "Weekly overview"    [DIA 6M  │  Abril 2026    │
│  1A TODO] [$ ⚡]                        │  [En Curso] ⋮  │
│                                         │                │
│  ████████ SocioV2BarChart               │  ┌──────┬─────┐│
│  mint simple + label encima             │  │Wallet│ ⚡  ││
│  ($ o kWh según toggle)                 │  │Ahorro│Gen. ││
│                                         │  └──────┴─────┘│
│                                         │  Desglose Ahorro│
│                                         │  [$][⚡]        │
│                                         │  · Autoconsumo │
│                                         │  · Inyectada   │
│                                         │  · Total Abril │
└─────────────────────────────────────────┴────────────────┘
```

---

## 4. Interacciones

### Tab principal (💵 / ⚡)
- Cambia el **título** del left card: `"Mi Ahorro Generado"` ↔ `"Mi Energía Generada"`
- Cambia los **datos del chart**: `getSocioAhorroSeries()` ↔ `getSocioAhorroEnergiaSeries()`
- Cambia los **items del StatList**: `socioStatListInyeccion` ↔ `socioStatListAhorroEnergia`
- El right card siempre muestra ambos KPIs (fijo)

### Range chips (DIARIO / 1M / 6M / 1A / TODO)
- Actualiza solo los datos del chart
- Funciona igual para ambas perspectivas

### Tabs de desglose (Dinero / Energía)
- Sincronizados con el tab principal (`setMainTab`)
- Cambiar uno cambia el otro

---

## 5. Modelo de datos

### Conversión $-kWh
Tasa fija: `$74.400 ÷ 830.17 kWh = $89.60/kWh`  
Split: **68% autoconsumo / 32% inyectada** (idéntico al modelo monetario)

### Breakdown Abril 2026
| | $ | kWh |
|---|---|---|
| Autoconsumo virtual | $54.200 | 564 kWh |
| Energía Inyectada | $20.200 | 266 kWh |
| **Total** | **$74.400** | **830 kWh** |

### Series históricas (en `data/gdcv-socio-mock.ts`)

**Monetaria** — función `getSocioAhorroSeries(range)`:
- `SOCIO_AHORRO_MONTHLY` — 6 meses Nov 25 → Abr 26
- `SOCIO_AHORRO_WEEKLY` — 4 semanas de Abril

**Energía** — función `getSocioAhorroEnergiaSeries(range)`:
- `SOCIO_AHORRO_ENERGIA_MONTHLY` — mismos 6 meses en kWh
- `SOCIO_AHORRO_ENERGIA_WEEKLY` — 4 semanas de Abril en kWh

Ambas funciones usan `sliceChartRangeSeries()` de `@/lib/chart-range-resolve`.

---

## 6. Componentes UI usados (con props relevantes)

| Componente | Import | Props usadas |
|---|---|---|
| `CardWithContent` | `@/components/ui/card-with-content` | `title` (dinámico), `className` |
| `Card` | `@/components/ui/card` | clase manual para right card |
| `Badge` | `@/components/ui/badge` | `className="bg-green-100 text-green-700 border-transparent"` |
| `FeatureItem` | `@/components/ui/feature-item` | `icon`, `label`, `value`, `orientation="vertical"` |
| `StatList` | `@/components/ui/stat-list` | `title`, `items`, `tabs`, `defaultTab`, `onTabChange` |
| `SocioV2BarChart` | `@/components/gdcv/SocioV2BarChart` | Barras simples mint + labels top |
| `TabsForBlocksIcons` | `@/components/ui/tabs-for-blocks-icons` | Variante icon-only de TabsForBlocks ($ / ⚡) |
| `SocioV2BreakdownList` | `@/components/gdcv/SocioV2BreakdownList` | Desglose + tabs `$` / `⚡` |
| `TabsForBlocks` | `@/components/ui/tabs-for-blocks` | Chips DIA / 6M / 1A / TODO |

### Nota sobre `FeatureItem` con `orientation="vertical"`
Renderiza: icono (IconBadge verde) arriba, label debajo, valor grande abajo. Full-width dentro del grid.

### Nota sobre `MonetaryBarChart`
Aunque el nombre sugiere uso monetario, el componente es agnóstico a unidades. Acepta cualquier `{ label, autoconsumo, inyectada }` — los tooltips usan los labels del config (`"Autoconsumo Virtual"`, `"Energía Inyectada"`).

---

## 7. Estado del componente (`SocioEnergyViewV2`)

```typescript
const [ahorroRange, setAhorroRange] = useState<ChartRangeChip>("6m")
const [mainTab, setMainTab] = useState<"dinero" | "energia">("dinero")
```

- `ahorroRange`: controla qué slice de datos muestra el chart
- `mainTab`: controla perspectiva ($vs kWh), sincroniza título + chart + statList + desglose tabs

---

## 8. Qué falta / posibles continuaciones

- [ ] Tooltip accesible en `SocioV2BarChart` (opcional; mock no lo exige)
- [ ] El right card tiene el mes en `socioV2PanelKpis` — dinámico con backend
- [ ] Chip **DIA** usa rango interno `1m` (semanas de abril) — vista diaria real pendiente
- [ ] Menú ⋮ — eliminado del prototipo V2 (no requerido por ahora)
- [ ] Cuando el cliente valide, decidir si reemplaza `/gdcv/socio` o convive
- [ ] `SocioPageHeading` no activa nav en `/gdcv/socio-v2` — aceptable para prototipo

**Referencia visual:** `flows/GDCV-socio/GDCV__SocioV2-Performance_01.png` (dinero) y `_02.png` (energía).

---

## 9. Commits del feature

```
2f9d650  Fix right card layout: inline badge, full-width KPIs, correct tab labels
156f29d  Update right card design to match mockup exactly
238afc7  Refactor SocioEnergyViewV2 to match mockup specifications exactly
1b6d24d  Create SocioEnergyViewV2 - variant view with dinero/energia tab perspective
```

Repositorio: `https://github.com/juanma25/hins-final-context`  
Branch: `main`
