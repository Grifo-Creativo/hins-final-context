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
| `--background-subtle` | `#F2ECE9` @ 36% | Fondo del shell (Main content / body del layout) |
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
| **Metric SM** | `text-xl font-semibold` | 20px | 600 | `#0A0A0A` | Valores KPI secundarios ($66.400) |
| **Body** | `text-sm font-normal` | 14px | 400 | `--foreground` | Filas de tabla, valores |
| **Label** | `text-sm font-medium` | 14px | 500 | `--muted-foreground` | Headers de tabla, etiquetas |
| **Subtitle** | `text-sm font-normal` | 14px | 400 | `--muted-foreground` | Subtítulos bajo títulos de card |
| **Small** | `text-xs font-normal` | 12px | 400 | `--muted-foreground` | Captions, chips de comparativo |

**Reglas:**
- No usar más de 3 tamaños tipográficos por vista.
- Peso 700 solo en H1 y valores KPI destacados. Nunca en UI funcional.
- No hardcodear `font-family` — usar siempre `--font-sans`.
- No usar tamaños menores a `text-xs` (12px).

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
| 16px | `p-4` | Padding interno de KPIs |
| 24px | `p-6` / `gap-6` | Padding de CardWithContent, gap entre secciones |
| 32px | `gap-8` / `p-8` | Márgenes de layout principal |

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

### Shell — nativo shadcn/Tailwind (NO modificar)

| Elemento | Notas |
|---|---|
| `Sidebar` | sidebar-07 — colapsa a íconos |
| `Navbar` | `bg-white`, `border-b border-[#E5E5E5]` — nativo |
| `SidebarProvider` + `SidebarInset` | Wrapper global de todas las vistas |

### Estructura base de toda vista (obligatoria)

```
HD_UI_Hins
  Sidebar                    ← nativo, no tocar
  Main content               ← bg: #F2ECE9 @ 36%
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
| `Card` | `/components/ui/card.tsx` | → `components.md` |
| `IconBadge` | `/components/ui/icon-badge.tsx` | → `components.md` |
| `KpiPrimary` | `/components/ui/kpi-primary.tsx` | → `components.md` |
| `KpiSecondary` | `/components/ui/kpi-secondary.tsx` | → `components.md` |
| `SoftBadge` | `/components/ui/soft-badge.tsx` | → `components.md` |
| `TabsForBlocks` | `/components/ui/tabs-for-blocks.tsx` | → `components.md` |
| `CardWithContent` | `/components/ui/card-with-content.tsx` | → `components.md` |
| `Table` | `/components/ui/data-table.tsx` | ⏳ Refactor pendiente |
| `Sheet` | shadcn/ui nativo | ver `ux-guidelines.md` §3 |
| `Button` | shadcn/ui nativo | ver reglas abajo |
| `Badge` | shadcn/ui nativo | usar variante nativa |
| `Alert` | shadcn/ui nativo | usar semantic states §1 |
| `HinsAlert` | shadcn/ui Alert nativo | → `components.md` |

### Card — resumen
- Superficie neutral. `p-0`. El padding lo define el contenido.
- Un solo tipo. Sin variantes de estilo.
- **Spec completo:** `components.md`

### KPIs — resumen
- `KpiPrimary` → dato principal, 1 por vista, sparkline edge-to-edge
- `KpiSecondary` → datos de soporte, N por vista, sin borde especial
- Ambos viven dentro de `Card`
- **Spec completo:** `components.md`

### TabsForBlocks — resumen
- Único componente de tabs/chips permitido en el producto
- Fondo contenedor: `bg-stone-200/75` (#E7E5E4 @ 75%)
- Tab activo: `bg-white shadow-sm`
- **Spec completo:** `components.md`

### SoftBadge — resumen
- Shape: `rounded-full`
- Background: `bg-[#F2ECE9]/36`
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
- `GenerationSparkline` → sparkline de tendencia en KpiPrimary — **Spec completo:** `components.md`
- `ParkEnergyBarChart` → bar chart de generación del parque — **Spec completo:** `components.md`
- `ROIProjectionChart` → proyección financiera multi-escenario — **Paleta:** Zinc + Green + Rose

---

## 7. Responsive y Plataforma

| Propiedad | Definición |
|---|---|
| **Tipo** | Web App |
| **Estrategia** | Desktop-first, full responsive |
| **Breakpoints** | Desktop → Tablet → Mobile |
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
- `KpiPrimary` solo 1 por vista
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
- Más de una `KpiPrimary` por vista
- Botones sin `shadow-sm`
- Modificar estructura del Sidebar o Navbar (son nativos)
- Confiar SOLO en color para diferenciar series en charts (usar patrón visual también)
