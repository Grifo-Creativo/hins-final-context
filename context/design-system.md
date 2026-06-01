# design-system.md
# HINS — Design System v2

> **Regla de precedencia:** Cuando existe un spec en `/context/components.md`,
> ese archivo tiene la última palabra. Este documento define tokens, principios
> y referencias. `components.md` define implementación exacta.

---

## 1. Design Tokens — Colores

### Paleta Base (Zinc — Alto Contraste)

| Token | Valor | Descripción |
|---|---|---|
| `--background` | `#FFFFFF` | Blanco puro — superficie de cards y contenido |
| `--background-subtle` | `lab(91 2.48 3.22 / 0.36)` | Fondo del shell (Main content / body del layout) |
| `--foreground` | `#09090B` | Zinc 950 — texto principal |
| `--primary` | `#18181B` | Zinc 900 — fondo de botones y CTAs |
| `--primary-foreground` | `#FAFAFA` | Zinc 50 — texto sobre botones primarios |
| `--muted` | `#F4F4F5` | Zinc 100 — fondos sutiles |
| `--muted-foreground` | `#71717A` | Zinc 500 — texto secundario / helper |
| `--border` | `#E4E4E7` | Zinc 200 — bordes de inputs y tarjetas |
| `--input` | `#E4E4E7` | Zinc 200 |
| `--ring` | `#18181B` | Zinc 900 — estado de foco |
| `--secondary` | `#F4F4F5` | Zinc 100 — elementos de soporte |
| `--secondary-foreground` | `#18181B` | Zinc 900 |
| `--accent` | `#F4F4F5` | Zinc 100 — hover en listas y menús |
| `--accent-foreground` | `#18181B` | Zinc 900 |

> **NOTA:** El color primario es intencionalmente monocromático (Zinc).
> No hay color de marca definido aún. Cuando se defina, reemplazar `--primary`
> y sus variantes — es un cambio de un token, no requiere tocar componentes.

---

### Paleta de Charts — Green Ramp (defecto)

> **REGLA CRÍTICA:** Estos colores son EXCLUSIVOS para charts y visualizaciones.
> NUNCA usar `--primary` en gráficos.
> NUNCA usar colores de chart en UI (botones, badges, navegación).

| Token | Valor | Uso |
|---|---|---|
| `--chart-1` | `#22C55E` | Green 500 — serie optimista/favorable |
| `--chart-1-muted` | `#22C55E` @ 55% | Green 500 con opacidad — series pasadas |
| `--chart-stack-autoconsumo` | `var(--chart-1)` | Segmento base de bar chart apilado (autoconsumo virtual) |
| `--chart-stack-inyectada` | `rgb(251 191 36 / 0.9)` | Segmento superior apilado — `amber-400` @ 90% (energía inyectada) |
| `--chart-2` | `#16A34A` | Green 600 — serie base/referencia |
| `--chart-3` | `#15803D` | Green 700 — serie crítica/datos reales |
| `--chart-4` | `#4ADE80` | Green 400 — hover states o serie adicional |
| `--chart-5` | `#86EFAC` | Green 300 — variante clara/serie adicional |

**Lógica de uso en bar/line charts:**
- Barras de períodos pasados: `fill-green-500/40` (opacidad 40%)
- Barra del período actual: `fill-green-500` (sin opacidad, destacada)

---

### Paleta de Charts — Extendida para Finanzas (Zinc + Green + Rose)

**Uso:** Charts de proyección financiera (ROI, recuperación, payback).

**Justificación:** Finanzas requiere diferenciación clara entre datos reales, proyecciones, oportunidades y riesgos. Zinc comunica neutralidad; Green comunica oportunidad; Rose comunica cautela/riesgo.

| Rol | Color | Hex | Contraste | WCAG | Uso |
|---|---|---|---|---|---|
| Datos reales | Zinc 950 | `#09090B` | 16:1 | ✅ AAA | Líneas sólidas de dato concreto (máxima autoridad) |
| Proyecciones | Zinc 600 @ 60% | `#52525B` | 8:1 | ✅ AA | Líneas con opacidad (menos certeza que dato) |
| Objetivo/Exitoso | Green 600 | `#16A34A` | 9.8:1 | ✅ AA | Meta de inversión, metas de éxito |
| Oportunidad/Favorable | Green 500 | `#22C55E` | 7.1:1 | ✅ AA | Proyecciones optimistas |
| Cautela/Riesgo | Rose 400 | `#FB7185` | 3.1:1 | ⚠️ Border | Escenarios de riesgo (mitigado con strokeWidth + patrón) |
| Referencia temporal | Zinc 800 | `#27272A` | 11:1 | ✅ AAA | Marcador de presente (Hoy) |

**Ejemplo: ROI Projection Chart**
```
Real acumulada        → Zinc 950 (sólida 3px) — dato concreto
Base (proyección)     → Zinc 600 @ 60% (sólida 2px) — menos certeza
Favorable (optimista) → Green 500 (sólida 1.5px) — oportunidad
Riesgo (cautela)      → Rose 400 (punteada 2.5px) — alerta
Meta (objetivo)       → Green 600 (sólida 2px) — éxito esperado
Hoy (presente)        → Zinc 800 (sólida 1.5px) — referencia temporal
```

**Accesibilidad:**
- Zinc (950, 900, 800, 600): ✅ WCAG AA+ (contrast >= 8:1)
- Green (500, 600): ✅ WCAG AA (contrast >= 7.1:1)
- Rose 400: ⚠️ WCAG Border (3.1:1) — mitigado con `strokeWidth` >= 2.5px + patrón punteado

---

### Estados Semánticos

Usar únicamente para comunicar estados al usuario (alerts, badges, inline messages).
No usar como colores decorativos.

| Estado | Background | Text | Uso |
|---|---|---|---|
| **Success** | `#F0FDF4` | `#166534` | Completado, pago exitoso |
| **Warning** | `#FFFBEB` | `#92400E` | Pendiente, atención |
| **Error** | `#FEF2F2` | `#991B1B` | Fallido, error de validación |
| **Info** | `#EFF6FF` | `#1E40AF` | Mensajes informativos, notas |

### Tokens de Dominio Energético

Colores semánticos propios del negocio energético. No son chart colors ni UI colors genéricos — representan categorías fijas del dominio.

| Token | Valor | Tailwind ref | Uso |
|---|---|---|---|
| `--energy-autoconsumo` | `#84cc16` | `lime-500` | Energía de autoconsumo (virtual). Ícono: `ParkingMeter` (lucide) |
| `--energy-inyectada` | `#6366f1` | `indigo-500` | Energía inyectada a la red. Ícono: `PlugZap` (lucide) |

**Reglas:**
- Usar exclusivamente para representar estas dos categorías energéticas — nunca como color decorativo.
- Siempre acompañados de su ícono y label correspondiente — el color nunca es el único identificador.
- No usar en charts de Recharts — para eso usar `--chart-1` a `--chart-5`.
- Definir en `globals.css` como variables CSS y referenciar desde componentes con `var(--energy-autoconsumo)`.

---

## 2. Tipografía

### Fuente base
- **Font family:** Inter
- **Origen:** `next/font/google` (Next.js optimiza en build time)
- **Variable:** `--font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif`
- `-webkit-font-smoothing: antialiased` siempre activo.

| Rol | Tailwind | Tamaño | Peso | Color token | Uso en HINS |
|---|---|---|---|---|---|
| **H1** | `text-4xl font-bold` | 36px | 700 | `--foreground` | Título de página (nombre del parque) |
| **H2** | `text-2xl font-semibold` | 24px | 600 | `--foreground` | Títulos de sección principales |
| **H3** | `text-lg font-semibold` | 18px | 600 | `--foreground` | Títulos de cards y bloques |
| **H4** | `text-base font-semibold` | 16px | 600 | `--foreground` | Subtítulos dentro de cards |
| **Metric** | `text-4xl font-bold` | 36px | 700 | `#0A0A0A` | Valores KPI destacados (830.17 kWh) |
| **Metric SM** | `text-xl font-semibold` | 20px | 600 | `#0A0A0A` | Valores KPI secundarios (`$ 66.400`) |
| **Body** | `text-sm font-normal` | 14px | 400 | `--foreground` | Filas de tabla, valores |
| **Label** | `text-sm font-medium` | 14px | 500 | `--muted-foreground` | Headers de tabla, etiquetas |
| **Subtitle** | `text-sm font-normal` | 14px | 400 | `--muted-foreground` | Subtítulos bajo títulos de card |
| **Small** | `text-xs font-normal` | 12px | 400 | `--muted-foreground` | Captions, chips de comparativo |

**Reglas:**
- No usar más de 3 tamaños tipográficos por vista.
- Peso 700 solo en H1 y valores KPI destacados. Nunca en UI funcional.
- No hardcodear `font-family` — usar siempre `--font-sans`.
- No usar tamaños menores a `text-xs` (12px).

### Jerarquía de Headings — Componente `Heading` (Atom)

**PATRÓN ATOMIC DESIGN:**
```
ATOM: Heading       → componentiza estilos H1/H2/H3
MOLECULE: SectionHeader → Heading + action slot
ORGANISM: CardWithContent, StatList, Tables → usan Heading internamente
```

#### Cuándo usar cada nivel

| Nivel | Tailwind | Contexto | Ejemplo | Componente |
|---|---|---|---|---|
| **H1** | `text-4xl font-bold` | Título principal de vista (1 por página) | "Parque Río Cuarto" | Directo en página |
| **H2** | `text-2xl font-semibold` | Secciones/containers que agrupan cards (reservado, pocos hoy) | [Futuro: agrupación de bloques] | Directo en layout |
| **H3** | `text-lg font-semibold` | Títulos de cards, listas, componentes unitarios (**MÁS VARIACIONES**) | "Desglose de Ahorro", "Historial de Compensaciones" | `Heading`, `SectionHeader` |

#### Implementación

**H3 con variante simple (sin acciones):**
```tsx
<Heading level="h3">Desglose de Ahorro</Heading>
```

**H3 con acciones (usando molecule `SectionHeader`):**
```tsx
<SectionHeader
  title="Desglose de Ahorro"
  action={<TabsForBlocks variant="icon" ... />}
/>
```

#### Reglas

✅ **DO:**
- Usar `<Heading level="h3">` para títulos sin acciones
- Usar `<SectionHeader title="...">` cuando haya actions/tabs
- **Única fuente de verdad:** cambios en estilos van en `/components/ui/heading.tsx`
- Siempre usar etiqueta semántica correcta (`<h1>`, `<h2>`, `<h3>`)

❌ **DON'T:**
- Hardcodear clases `text-lg font-semibold` en componentes — usar `<Heading>`
- Crear variantes de heading fuera del atom (ej. `<h3 className="custom">`)
- Mezclar `<h3>` nativo con `<Heading level="h3">` en la misma app
- Usar H1 más de una vez por página

---

## 3. Geometría, Spacing y Shadows

### Border radius

| Rol | Clase Tailwind | px | Elementos |
|---|---|---|---|
| **Controles** | `rounded-md` | ~8px | Botones, inputs, chips, badges, tabs |
| **Contenedores** | `rounded-xl` | ~14px | Cards, panels |

### Spacing — Desktop (base x4)

| Valor | Clase Tailwind | Uso |
|---|---|---|
| 4px | `gap-1` / `p-1` | Micro gaps inline |
| 8px | `gap-2` / `p-2` | Spacing interno de badges y chips |
| 16px | `p-4` / `gap-4` | Padding interno de KPIs; gap entre items hermanos en grid 2×N |
| 24px | `p-6` / `gap-6` | Padding de CardWithContent, gap entre secciones |
| 32px | `gap-8` / `p-8` | Márgenes de layout principal |

**Jerarquía de gaps (obligatoria):**
- `gap-6` → separación **entre bloques/secciones** (chart ↔ sidebar, header ↔ KPIs ↔ desglose).
- `gap-4` → separación **entre items del mismo grupo** en grid 2×N (`KpiPrimaryCompact`, `FeatureItem`, wire de `KpiPrimary`).
- ❌ No usar `gap-3 sm:gap-4` responsive en grids de KPIs — un solo token (`gap-4`) en mobile y desktop.

### Spacing Responsivo en Mobile — Wrappers de Primer Nivel

Para optimizar espacio en viewports pequeños (<640px), los **elementos wrapper de primer nivel** (containers principales, cards, grids de bloques) utilizan patrón responsive:

| Contexto | Mobile <640px | Desktop ≥640px | Tailwind |
|---|---|---|---|
| Gap entre bloques en wrappers | **gap-4** (16px) | **gap-6** (24px) | `gap-4 sm:gap-6` |
| Padding de main content | **p-4** (16px) | **p-6** (24px) | `p-4 sm:p-6` |
| Padding de CardWithContent | **p-4** (16px) | **p-6** (24px) | `p-4 sm:p-6` |

**⚠️ IMPORTANTE:** Esta es una **extensión responsiva** de las reglas base:
- **Desktop (≥640px):** se mantiene `gap-6` entre bloques (regla clásica sin cambios)
- **Mobile (<640px):** se reduce a `gap-4` para optimizar real estate visual (nueva excepción controlada)

**NO confundir con:**
- Grids de KPIs/items internos → siempre `gap-4` (tanto mobile como desktop) — ver línea 218
- Este patrón `gap-4 sm:gap-6` es **solo para wrappers**, no para grids internos

### Elementos de formulario — Tamaño estándar

| Elemento | Tamaño | Altura | Padding | Font |
|---|---|---|---|---|
| **Input** | lg (default) | `h-8` (32px) | `px-2.5 py-1` (10px h, 4px v) | **`text-base` siempre** (16px) |
| **Select** | lg (default) | `h-8` (32px) | `px-2.5 py-1` (10px h, 4px v) | **`text-base` siempre** (16px) |
| **Textarea** | lg (default) | `min-h-20` (80px) | `px-2.5 py-1.5` (10px h, 6px v) | **`text-base` siempre** (16px) |
| **Label** | — | — | — | `text-sm font-medium text-muted-foreground` (14px, 500) |

**REGLA CRÍTICA:**
- ✅ Todos los elementos de formulario usan tamaño **lg** (grande) por defecto
- ✅ Font es **`text-base` siempre** — en desktop Y en mobile
- ❌ No crear variantes sm o md para inputs
- ❌ No usar responsive text-size (`md:text-sm`, etc.) en formularios
- ⚠️ Si se requiere un campo más compacto, comunicar con Design System Owner

**Aplicar siempre:**
- `rounded-md` — 8px border radius
- `border border-input` — Zinc 200 (#E4E4E7)
- `bg-transparent` — fondo transparente
- `px-2.5 py-1` — padding estándar
- `text-base` — 16px (SIN responsive)
- `text-foreground` — color de texto (#09090B)
- `placeholder:text-muted-foreground` — placeholder gris (#71717A)
- `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` — focus state

### Shadows

| Nivel | Tailwind | Uso |
|---|---|---|
| **sm** | `shadow-sm` | Cards, botones — uso estándar |
| **md** | `shadow-md` | Dropdowns, Popovers |
| **lg** | `shadow-lg` | Sheet lateral |

---

## 4. Anatomía del Shell

### Shell — nativo shadcn/Tailwind

| Elemento | Notas |
|---|---|
| `Sidebar` | `collapsible="icon"` — rail de íconos (~3rem) o expandido (16rem) |
| `SidebarProvider` + `SidebarInset` | Wrapper global; ver estado por defecto abajo |
| `Navbar` | `bg-white`, `border-b border-[#E5E5E5]` — nativo |

**No reescribir** la anatomía shadcn del Sidebar/Navbar. Sí está permitido configurar `defaultOpen`, cookie y tooltips según spec.

#### Sidebar — estado por defecto (desktop)

| Viewport | Comportamiento | Estado inicial |
|---|---|---|
| **Desktop / tablet ≥768px** | Rail de íconos o sidebar expandido | **Colapsado** (`SidebarProvider` → `defaultOpen={false}`) |
| **Mobile &lt;768px** | Sheet overlay desde `SidebarTrigger` | **Cerrado** (sin cambios respecto al patrón mobile) |

- El usuario expande con `SidebarTrigger`, `SidebarRail` o `Ctrl/Cmd + B`.
- **Persistencia (solo desktop):** cookie `sidebar_state` — `true` = expandido, `false` = colapsado. Se restaura al montar la app; no afecta el Sheet mobile.
- En modo ícono: labels ocultos; navegación con `SidebarMenuButton` + `tooltip` (nombre del ítem o usuario en footer).

**Implementación detallada:** `engineering/tech-stack.md` → Sidebar (desktop vs mobile) · `context/components.md` → Shell — Sidebar (desktop).

**Shells admin:** `MainLayoutShell`, `GddLayoutShell`, `GdcvLayoutShell`, `GdcLayoutShell`. **Socio** (`/gdcv/socio/*`): sin sidebar visible (`GdcvLayoutShellNoSidebar`).

### Estructura base de toda vista (obligatoria)

```
HD_UI_Hins
  Sidebar                    ← colapsado por defecto (desktop); expandir con trigger
  Main content               ← bg: lab(91 2.48 3.22 / 0.36)
    Navbar                   ← nativo, no tocar
    body
      heading                ← H1 + badge + tabs/acciones
      container              ← gap-6 entre bloques
        [cards / tabla / chart]
```

---

## 5. Componentes

### Regla de precedencia
Todos los componentes con spec en `/context/components.md` se rigen
por ese archivo. Las entradas aquí son referencias, no specs de implementación.

### Índice de componentes

| Componente | Archivo | Spec completo |
|---|---|---|
| `Heading` | `/components/ui/heading.tsx` | → `components.md` |
| `SectionHeader` | `/components/ui/section-header.tsx` | → `components.md` |
| `Card` | `/components/ui/card.tsx` | → `components.md` |
| `IconBadge` | `/components/ui/icon-badge.tsx` | → `components.md` |
| `KpiPrimary` | `/components/ui/kpi-primary.tsx` | → `components.md` |
| `KpiPrimaryCompact` | `/components/ui/kpi-primary-compact.tsx` | → `components.md` |
| `KpiSecondary` | `/components/ui/kpi-secondary.tsx` | → `components.md` |
| `SoftBadge` | `/components/ui/soft-badge.tsx` | → `components.md` |
| `TabsForBlocks` | `/components/ui/tabs-for-blocks.tsx` | → `components.md` |
| `CardWithContent` | `/components/ui/card-with-content.tsx` | → `components.md` |
| `DatePicker` | `/components/ui/date-picker.tsx` | → `components.md` |
| `PeriodSelector` | `/components/ui/period-selector.tsx` | → `components.md` |
| `Table` | `/components/ui/data-table.tsx` | ⏳ Refactor pendiente |
| `Sheet` | `/components/ui/sheet.tsx` | Drill-down: `ux-guidelines.md` §3 · OPS: `lib/sheet-layout.ts`, `sheet-ops.tsx` · spec: `components.md` § Sheet |
| `Button` | shadcn/ui nativo | ver reglas abajo |
| `Badge` | shadcn/ui nativo | usar variante nativa |
| `Alert` | shadcn/ui nativo | usar semantic states §1 |
| `HinsAlert` | shadcn/ui Alert nativo | → `components.md` |

### Card — resumen
- Superficie neutral. `p-0`. El padding lo define el contenido.
- Un solo tipo. Sin variantes de estilo.
- **Spec completo:** `components.md`

### KPIs — resumen
- `KpiPrimary` → dato héroe, **1 por vista**, tipografía 4xl, sparkline edge-to-edge
- `KpiPrimaryCompact` → variante compacta con sparkline, **N por vista** en grid (misma Card + `shadow-xs`)
- `KpiSecondary` → datos de soporte sin sparkline (o layout alternativo), N por vista
- Todos viven dentro de `Card`
- **Spec completo:** `components.md`

### TabsForBlocks — resumen
- Único componente de tabs/chips permitido en el producto
- Fondo contenedor: `bg-stone-200/75` (#E7E5E4 @ 75%)
- Tab activo: `bg-white shadow-sm`
- **Spec completo:** `components.md`

### SoftBadge — resumen
- Shape: `rounded-full`
- Background: `bg-background-subtle` (token `--background-subtle`)
- Text: `--foreground`
- Ícono izquierdo: opcional
- **Spec completo:** `components.md`

### Botones

**Primary:**
- Fondo: `--primary` (Zinc 900) / Texto: `--primary-foreground` / Shadow: `shadow-sm`
- Hover: Zinc 800 (`#27272A`) / Disabled: `opacity-50`
- NUNCA usar colores de chart en botones

**Secondary:**
- Fondo: `--background` / Borde: `border border-input` / Shadow: `shadow-sm`
- Hover: `--accent`

**Regla:** Todos los botones de acción llevan `shadow-sm` sin excepción.

---

## 6. Chart System

### Arquitectura (separación obligatoria)
```
chartData      → array de puntos de datos
chartConfig    → colores, labels, formato (chart-config.ts / chartColors.ts)
chartComponent → renderizado puro
```

### Reglas generales para charts
- ❌ No usar `--primary` en gráficos
- ✅ Usar `--chart-1` a `--chart-5` (Green ramp) para charts estándar
- ✅ Bar charts apilados de ahorro (autoconsumo + inyectada) → `--chart-stack-autoconsumo` + `--chart-stack-inyectada` (ver `MonetaryBarChart` en `components.md`)
- ⚠️ Excepción: Charts financieros pueden usar Zinc (neutral) + Rose (riesgo) si está documentado
- CartesianGrid con `strokeDasharray` y opacidad reducida
- Ejes sin línea visible (`axisLine: false`, `tickLine: false`)

### Paleta extendida para ROI / Finanzas

Ciertos charts requieren semántica financiera que va más allá de la rampa verde:

**Estrategia:**
1. Usar `--chart-1` a `--chart-5` para series "neutras" (generación, consumo, etc)
2. Usar Zinc (foreground/primary) para difernciar datos reales vs proyecciones
3. Usar Green para oportunidad/éxito (alineado con chart palette)
4. Usar Rose para riesgo/cautela (excepción semántica controlada)

**Patrón visual como fallback:**
- Sólido vs punteado (diferencia visual)
- Grosor diferenciado (1.5px, 2px, 2.5px, 3px)
- Alpha/opacidad (proyecciones vs datos)

**Regla:** Esta paleta extendida está documentada y es revisable cuando se defina color de marca.

### Componentes de charts disponibles
- `GenerationSparkline` → sparkline en `KpiPrimary` / `KpiPrimaryCompact` — **Spec completo:** `components.md`
- `MonetaryBarChart` → bar chart apilado de ahorro (autoconsumo + inyectada) — **Spec completo:** `components.md`
- `ParkEnergyBarChart` → bar chart de generación del parque (rangos 1M–TODO) — **Spec completo:** `components.md`
- `DailyGenerationChart` → area chart horario kW (vista 1D) — **Spec completo:** `components.md`
- `DailyGenerationChartBlock` → bloque UI completo vista 1D (DatePicker + KPIs + nav + chart) — **Spec completo:** `components.md`
- `ROIProjectionChart` → proyección financiera multi-escenario — montos vía `formatCurrency` (USD) — **Paleta:** Zinc + Green + Rose

### Formato monetario (ARS / USD)

**Helper:** `/lib/format-currency.ts` — única fuente para montos en UI y charts.  
**Spec de implementación (API, consumidores, excepciones):** `context/components.md` → [FormatCurrency](#formatcurrency).

| Moneda | Prefijo en montos | Label en tabs / toggles |
|---|---|---|
| ARS | `$ ` (con espacio) | `ARS` |
| USD | `u$s ` (con espacio) | `DOLAR` |

**Números (locale `es-AR`):** miles `.` · decimales `,` · sin `,00` en montos operativos (centavos ARS omitidos salvo TC/tarifa con `decimals: 2`).

| Modo | Uso | Ejemplo |
|---|---|---|
| `full` | KPI, tooltip, tablas | `$ 82.600` · `u$s 3.779` |
| `compact` | Label sobre barra; KPI ROI mobile ≥1M | `$ 82,6k` · `u$s 3,8k` |
| `axis` | Eje Y chart | `$ 83k` · `u$s 4k` |

**Por pantalla:** Socio Mi Ahorro → `ars`. GDD ROI → `usd` base, `ars` vía `formatRoiFromUsd` + `TIPO_CAMBIO_ARS`.

### Currency Context Rules

Reglas de contexto monetario para vistas financieras. Aplican a KPIs, tablas, charts, tooltips y summaries.

#### Contexto global

El selector superior (**DOLAR** | **ARS**) define la moneda de **toda** la vista. Todos los montos debajo heredan ese contexto automáticamente.

#### Labels — qué comunicar

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| Inversión Recuperada | Inversión Recuperada (DOLAR) |
| Capital Pendiente | Capital Pendiente (ARS) |
| Ahorro Estimado | Ahorro Estimado USD |

Los labels describen **conceptos de negocio**, no moneda, unidades ni formatos técnicos.

#### Representación monetaria

La moneda se comunica **solo** mediante:

1. Tab activo global (`DOLAR` | `ARS`)
2. Prefijo del valor renderizado (`u$s ` | `$ `)

Ejemplos: `u$s 180.000` · `$ 180.000`

#### No duplicación contextual

Nunca repetir moneda simultáneamente en tab + label + valor.

#### Casing

| Contexto | Formato |
|---|---|
| Tabs | `DOLAR` · `ARS` (uppercase) |
| Valores | `u$s` · `$` (nunca USD, usd, U$S, dólar, pesos) |

#### Excepciones permitidas

Moneda en labels **solo** cuando:

- Coexisten múltiples monedas en la misma vista
- Exports técnicos (CSV, PDF) → `currencyExportColumnLabel`
- Comparativas multi-currency documentadas
- Tooltips financieros avanzados con escenarios cruzados

Fuera de esos casos → **prohibido** repetir moneda en labels.

**Spec de helpers:** `context/components.md` → [FormatCurrency](#formatcurrency).

### Formato de horas en charts diarios

Convención fija para vista **1D / DIA** (chip de rango en header de card) — helpers en `/lib/chart-day-format.ts`:

| Contexto | Formato | Ejemplo |
|---|---|---|
| Inline / KPI pico | `N Hrs` | `12 Hrs` |
| Tooltip chart | `HH:MM Hrs` | `12:00 Hrs` |
| Pico compuesto | `value · N Hrs` | `1,4 kW · 12 Hrs` |

❌ No usar `"12h"` ni omitir `Hrs` en tooltips.

### Formato de unidades energéticas

Convención SI en UI — spec completa: `context/components.md` → [FormatEnergy](#formatenergy--unidades-energéticas).

| Unidad | Casing | Ejemplo |
|---|---|---|
| Energía | `kWh` | `830 kWh` |
| Potencia instalada | `kWp` | `980 kWp` |
| Potencia instantánea | `kW` | `1,4 kW · 12 Hrs` |

❌ No usar `Kwh`, `KWH` ni `kwh` como sufijo de unidad.

Locale numérico: `es-AR` (miles `.`, decimales `,`) antes del espacio + unidad.

### Animación en charts

| Chart | Comportamiento |
|---|---|
| `ParkEnergyBarChart` | Recharts default al cambiar `data` (cambio de chip 1M/3M/6M…) |
| `DailyGenerationChart` | Morph Recharts: **800ms** al montar tab 1D, **500ms** al cambiar día |
| Reduced motion | Desactivar animación si `prefers-reduced-motion: reduce` |

---

## 7. Responsive y Plataforma

| Propiedad | Definición |
|---|---|
| **Tipo** | Web App |
| **Estrategia** | Desktop-first, full responsive |
| **Breakpoints** | Desktop → Tablet → Mobile |
| **CardWithContent subtitle** | Oculto en mobile (`hidden md:block`) — ver `components.md` § CardWithContent |
| **FeatureItem con ícono** | Mobile: ícono arriba + texto abajo (`gap-4`) para grid 2×2 — ver `components.md` § FeatureItem |
| **Color mode** | Light Mode prioritario |
| **Dark mode** | Compatible vía tokens (valor agregado) |

---

## 8. DO / DON'T

### DO ✅
- `components.md` tiene la última palabra en implementación
- Mapear colores desde tokens CSS, nunca hardcodear hex en componentes
- `rounded-md` en controles, `rounded-xl` en contenedores
- `--chart-*` exclusivamente en visualizaciones de datos
- Usar paleta extendida (Zinc + Rose) SOLO en charts financieros documentados
- `Card` siempre con `p-0` — padding lo define el contenido
- `KpiPrimary` solo 1 por vista (héroe); `KpiPrimaryCompact` permitido en grid 2×N
- `TabsForBlocks` con `bg-stone-200/75` — único componente de tabs
- Todos los botones de acción con `shadow-sm`
- Respetar estructura `heading → container → [cards]` en toda vista
- Usar patrón visual (sólido/punteado/grosor) además de color en charts

### DON'T ❌
- Usar `--primary` en charts
- Usar colores de chart en botones, badges o navegación
- Mezclar estilos inline con Tailwind
- Peso 700 en UI funcional (solo H1 y Metric)
- Hardcodear hex de colores en componentes
- Crear variantes de Card con padding o borde propios
- Crear variantes de TabsForBlocks fuera del spec
- Más de una `KpiPrimary` héroe por vista
- Botones sin `shadow-sm`
- Reescribir anatomía del Sidebar o Navbar (son nativos shadcn) — la configuración `defaultOpen`/cookie está documentada en §4
- Confiar SOLO en color para diferenciar series en charts (usar patrón visual también)
