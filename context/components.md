# components.md
# HINS — Componentes UI

> **Este archivo tiene la última palabra en implementación.**
> Cuando hay conflicto entre este archivo y `design-system.md`,
> prevalece este archivo.

---

## Índice

> Spec de implementación completa para cada componente.  
> Buscar por categoría o `Ctrl+F` con el nombre exacto del componente.

### Fundación
1. [Heading](#heading) — H1/H2/H3 semántico, fuente única de estilos tipográficos
2. [SectionHeader](#sectionheader) — H3/H2 + action slot (tabs, badges, botones)
3. [Shell — Sidebar](#shell--sidebar-desktop) — layout base, estado colapsado/expandido, cookie

### Inputs y Controles
4. [Form Elements](#form-elements) — Input, Select, Textarea (tamaño lg único, `text-base` siempre)
5. [InputWithIconButton](#inputwithiconbutton) — input con botón ícono integrado a la derecha
6. [Button](#button) — variantes (default/outline/ghost), `shadow-xs`, cuándo usar cada variante
7. [TabsForBlocks](#tabsforblocks) — único componente de tabs del producto (rango, navegación interna)
8. [PeriodSelector](#periodselector) — selector de período mensual (DropdownMenu)
9. [DatePicker](#datepicker) — selector de día calendario (Popover + Calendar, vista 1D)
10. [ChartRangeOptions](#chartrangeoptions) — constantes de chips de rango (1D / 1M / 3M / 6M / 1A / TODO)

### Cards y Contenedores
11. [Card](#card) — superficie base (`p-0`, `shadow-xs`, `py-0` obligatorio)
12. [CardWire](#cardwire) — card con layout interno estándar (ícono + datos estructurados)
13. [CardWithContent](#cardwithcontent) — card con header + tabs + content slot
14. [CardWithResponsiveTabs](#cardwithresponsivetabs) — tabs en footer en mobile (<640px)

### KPIs y Métricas
15. [KpiPrimary](#kpiprimary) — KPI héroe (1 por vista, sparkline edge-to-edge)
16. [KpiPrimaryCompact](#kpiprimarycompact) — variante compacta en grid 2×N
17. [KpiSecondary](#kpisecondary) — datos de soporte sin sparkline
18. [KpiSecondaryMetric](#kpisecondarymetric) — métrica con formato numérico destacado
19. [KpiSecondaryCompact](#kpisecondarycompact) — layout horizontal compacto
20. [KpiWithAsset](#kpiwithasset) — KPI con imagen de asset (parque, instalación)
21. [KpiProgressBar](#kpiprogressbar) — KPI con barra de progreso gradiente
22. [KpiPaybackTimeline](#kpipaybacktimeline) — visualización de payback con timeline
23. [KpiWithTimeline](#kpiwithtimeline) — KPI con línea temporal de proyección
24. [ParkDetailsCard](#parkdetailscard) — card de detalles técnicos del parque
25. [FeatureItem](#featureitem) — par etiqueta/valor (horizontal, vertical, o con ícono)
26. [StatList](#statlist) — lista de stats con separadores

### Badges e Indicadores
27. [SoftBadge](#softbadge) — badge sutil (`rounded-full`, `bg-background-subtle`)
28. [StatusBadge](#statusbadge) — badge de estado semántico (En Curso, Cerrado, etc.)
29. [ModelBadge](#modelbadge) — badge de modelo de negocio (GDD / GDC / GDCV)
30. [IconBadge](#iconbadge) — ícono en contenedor badge (sm/md/lg)

### Tablas
31. [Table](#table) — tabla TanStack con sort, columnas ocultables, sheet drill-down
32. [GddRoiRecuperoTable](#gddroirecuperotable) — tabla de recupero ROI en Sheet (GDD)
33. [MantenimientoHistorialTable](#mantenimientohistorialtable) — historial de mantenimiento (AGC/Admin)

### Charts
34. [GenerationSparkline](#generationsparkline) — sparkline en KpiPrimary (área, sin ejes)
35. [GenerationSparkbars](#generationsparkbars) — sparkbars en KpiPrimaryCompact
36. [ParkEnergyBarChart](#parkenergybarchar) — bar chart generación parque (rangos 1M–TODO)
37. [MonetaryBarChart](#monetarybarchar) — bar chart apilado ahorro (autoconsumo + inyectada)
38. [DailyGenerationChart](#dailygenerationchart) — area chart horario kW (vista 1D)
39. [DailyGenerationChartBlock](#dailygenerationchartblock) — bloque UI completo vista 1D (DatePicker + nav + chart)

### Drill-down y Sheets
40. [Sheet — drill-down y anchos](#sheet--drill-down-y-anchos) — tres perfiles (detail / notifications / table)
41. [SheetOps — composición](#sheetops--composición-drill-down) — recetas listas: SheetContentTable, SheetContentDetail

### Feedback y Alertas
42. [HinsTooltip](#hinstooltip) — tooltip custom con delay y contenido rico
43. [HinsAlert](#hinsalert) — alerta contextual (warning/info/success/error), sin ícono ni dismiss

### Vistas y Páginas
44. [PageHeader](#pageheader) — header de página con H1 + breadcrumb + acciones
45. [SocioAccessView](#socioaccessview) — pantalla OTP de acceso socio (`/gdcv/socio/acceso`)

### Helpers y Utilidades
46. [FormatCurrency](#formatcurrency) — ARS/USD, modos full/compact/axis, locale `es-AR`
47. [FormatEnergy](#formatenergy--unidades-energéticas) — kWh/kWp/kW, casing SI, locale `es-AR`

---

## Heading (Atom)

**Archivo:** `/components/ui/heading.tsx`  
**Estado:** ✅ Aprobado  
**Patrón:** Atomic Design — Atom (indivisible)

### Propósito

Componentiza estilos de headings (H1, H2, H3) para garantizar consistencia tipográfica en toda la aplicación. **Única fuente de verdad** para cambios de estilos de headings.

### Cuándo usar

- **H1:** Título principal de vista (1 por página)
- **H2:** Títulos de secciones/containers (reservado, pocos hoy)
- **H3:** Títulos de cards, listas, componentes unitarios

### Props

| Prop | Tipo | Required | Default | Descripción |
|---|---|---|---|---|
| `level` | `"h1"` \| `"h2"` \| `"h3"` | ✅ | — | Nivel semántico HTML |
| `children` | `React.ReactNode` | ✅ | — | Contenido del heading |
| `className` | `string` | ❌ | — | Clases Tailwind adicionales |

### Spec

| Nivel | Tailwind | Tamaño | Peso | Color |
|---|---|---|---|---|
| H1 | `text-4xl font-bold` | 36px | 700 | `text-foreground` |
| H2 | `text-2xl font-semibold` | 24px | 600 | `text-foreground` |
| H3 | `text-lg font-semibold` | 18px | 600 | `text-foreground` |

### Ejemplos

```tsx
import { Heading } from "@/components/ui/heading"

// H1: Título principal
<Heading level="h1">Parque Río Cuarto</Heading>

// H3: Título de card
<Heading level="h3">Desglose de Ahorro</Heading>

// H3 con clase adicional
<Heading level="h3" className="leading-snug">Título especial</Heading>
```

### Notas de implementación

- ✅ Usa tokens CSS directamente (`--foreground`)
- ✅ Renderiza etiqueta semántica correcta (`<h1>`, `<h2>`, `<h3>`)
- ✅ Listo para integración en molecules (ej. `SectionHeader`)
- ❌ No mezclar con h3 inline (`<h3 className="...">`) — siempre usar `<Heading>`

---

## SectionHeader

**Archivo:** `/components/ui/section-header.tsx`
**Estado:** ✅ Aprobado
**Patrón:** Atomic Design — Molecule (`Heading` atom + action slot)

### Cuándo usar
- H3 con acciones/controles (tabs, badges, botones, selects)
- Títulos de StatList, Tables, secciones con header controls
- Para H3 **sin acciones** → usar directamente `<Heading level="h3">`

### Cuándo NO usar
- Títulos de página (H1) → layout de la vista directamente
- Labels inline dentro de componentes → `<p>` con Tailwind

### Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — | Texto del heading |
| `level` | `"h2"` \| `"h3"` | `"h3"` | `h2` = sección de vista (ej. ROI socio); `h3` = card/bloque |
| `action` | `React.ReactNode` | — | Slot libre: TabsForBlocks, Badge, Button, Select, etc. |
| `size` | `"md"` \| `"sm"` | `"md"` | **deprecated** — usar `level` |
| `className` | `string` | — | Clases Tailwind adicionales |

### Spec visual

| Elemento | Tailwind |
|---|---|
| Contenedor | `flex flex-row items-center justify-between gap-2 sm:gap-4` |
| Title H3 (`level="h3"`) | `text-lg font-semibold text-foreground` (vía `Heading` atom) |
| Title H2 (`level="h2"`) | `text-lg font-semibold text-foreground` (tag `h2` directo) |
| Action slot | `flex flex-shrink-0 ml-auto w-auto` |

### Implementación

```tsx
// /components/ui/section-header.tsx
import { Heading } from "@/components/ui/heading"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  level?: "h2" | "h3"
  /** @deprecated usar `level` */
  size?: "md" | "sm"
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({ title, level = "h3", size = "md", action, className }) {
  const isMd = size === "md"
  const titleClassName =
    level === "h2" ? "text-lg font-semibold text-foreground"
    : isMd ? undefined
    : "text-sm font-medium"

  return (
    <div className={cn("flex flex-row items-center justify-between gap-2 sm:gap-4", className)}>
      {level === "h2" ? (
        <h2 className={cn("min-w-0 truncate", titleClassName)}>{title}</h2>
      ) : (
        <Heading level="h3" className={cn("min-w-0 truncate", titleClassName)}>
          {title}
        </Heading>
      )}
      {action ? <div className="flex flex-shrink-0 ml-auto w-auto">{action}</div> : null}
    </div>
  )
}
```

### Casos de uso

```tsx
// H3 sin acción — usar Heading directamente:
<Heading level="h3">Título simple</Heading>

// H3 con tabs de rango (CardWithContent):
<SectionHeader
  title="Energía Generada del Parque"
  action={
    <TabsForBlocks
      tabs={[{ value: "1m", label: "1M" }, { value: "3m", label: "3M" }, { value: "6m", label: "6M" }]}
      defaultValue="6m"
      onValueChange={setRange}
    />
  }
/>

// H3 con botón (Table):
<SectionHeader
  title="Historial de Generación"
  action={
    <Button variant="outline" size="sm" className="gap-2 shadow-xs">
      <TableIcon className="size-4" aria-hidden />
      Ver columnas
    </Button>
  }
/>

// H3 con badge de estado (GDCV Socio — período activo):
<SectionHeader
  title="Abril 2026"
  action={<StatusBadge status="current">En Curso</StatusBadge>}
/>

// H2 — sección de vista (ROI Socio, nivel superior):
<SectionHeader level="h2" title="Mi Retorno de Inversión" />
```

### Notas para el agente
- `level="h3"` (default) → usa `Heading` atom internamente; `level="h2"` → tag `h2` directo
- `size` está deprecated — no usar en código nuevo; `level` es el prop correcto
- `action` es slot libre — no acoplar tipos específicos
- Gap responsivo: `gap-2 sm:gap-4` — el componente ya lo maneja, no sobrescribir
- **Migración pendiente:** `CardWithContent`, `StatList` y `ConsumptionHistoryTable` deben migrar a usar `SectionHeader` internamente

---

## Form Elements

**Archivos:** `/components/ui/input.tsx`, `/components/ui/select.tsx`, `/components/ui/textarea.tsx`  
**Estado:** ✅ Aprobado — tamaño único **lg**  
**Fuente:** shadcn/ui nativo

### Regla fundamental

**Todos los elementos de formulario en HINS usan tamaño lg (grande) por defecto.**

No existen variantes sm o md para inputs, selects, textareas o campos similares. Esto simplifica:
- Consistencia visual en toda la aplicación
- Reducción de complejidad de componentes
- Mejor accesibilidad (targets más grandes)

### Spec — Tamaño LG (único)

| Elemento | Altura | Padding | Font | Border radius |
|---|---|---|---|---|
| Input | `h-8` (32px) | `px-2.5 py-1` | **`text-base` siempre** (16px) | `rounded-md` (8px) |
| Select | `h-8` (32px) | `px-2.5 py-1` | **`text-base` siempre** (16px) | `rounded-md` (8px) |
| Textarea | `min-h-20` (80px) | `px-2.5 py-1.5` | **`text-base` siempre** (16px) | `rounded-md` (8px) |
| Label | — | — | `text-sm font-medium text-muted-foreground` (14px, 500) | — |

### Implementación

**Todos los inputs:**
```tsx
<Input
  className="h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-base"
  placeholder="Ej: Parque San Francisco"
/>
```

**Clases Tailwind obligatorias:**
- `h-8` — altura estándar
- `rounded-md` — 8px border radius
- `border border-input` — Zinc 200 (#E4E4E7)
- `bg-transparent` — fondo transparente
- `px-2.5 py-1` — padding estándar (10px horizontal, 4px vertical)
- `text-base` — font desktop (16px)
- `placeholder:text-muted-foreground` — placeholder gris
- `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` — focus state
- `disabled:opacity-50` — estado deshabilitado

### Labels en formularios

**Spec:**
```tsx
<label className="text-sm font-medium text-muted-foreground">
  Nombre
</label>
```

**Clases obligatorias:**
- `text-sm` — 14px
- `font-medium` — weight 500
- `text-muted-foreground` — Zinc 500 (#71717A)

### Spacing entre campo y label

Usar `gap-2` entre label e input cuando estén en columna:

```tsx
<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-muted-foreground">
    Nombre
  </label>
  <Input placeholder="..." />
</div>
```

### Notas para el agente

- ❌ NUNCA crear inputs sm o md
- ❌ NUNCA cambiar `h-8` a otra altura
- ✅ Si se requiere un campo más compacto, discutir primero con Design System Owner
- ✅ `text-base` en desktop es intencional — mejora accesibilidad
- ✅ Responsive `text-sm` en mobile (`md:text-sm`) está en el componente Input nativo
- ✅ Focus state con ring-3 es estándar shadcn — mantenerlo siempre

---

## InputWithIconButton

**Archivo:** `/components/ui/input-with-icon-button.tsx`  
**Estado:** ✅ Aprobado  
**Dependencias:** `Input`, `Button` (shadcn), `lucide-react`

### Cuándo usar

- Campo de texto con una **acción secundaria** en el borde derecho (buscar, validar, abrir ayuda).
- Formularios y diálogos donde el input y el botón deben leerse como **un solo control** visual.

### Cuándo NO usar

- Sustituir `Select`, `PeriodSelector`, `DatePicker` o `TabsForBlocks`.
- Acción primaria del formulario → usar `Button` aparte.
- Solo decoración sin acción → no agregar botón; usar `Input` simple.

### Spec visual

| Parte | Reglas |
|---|---|
| Input | Mismo spec lg que `Input` (`h-8`, `text-base`). `rounded-r-none`, sin sombra propia. |
| Botón | `variant="outline"`, `size="icon"`, `size-8`, `rounded-l-none`, `shadow-none`. |
| Grupo | `flex` + `rounded-md shadow-xs` en el contenedor. |
| Label | Opcional — `text-sm font-medium text-muted-foreground`, `htmlFor` al input. |
| Focus | `focus-visible:z-10` en input y botón para ring visible en el grupo. |

### Props

```tsx
export type InputWithIconButtonProps = {
  label?: string
  id?: string
  icon: LucideIcon
  iconButtonLabel: string   // obligatorio — aria-label del botón
  iconTooltip?: string      // tooltip del botón ícono (Tooltip nativo shadcn)
  iconTooltipSide?: "top" | "bottom" | "left" | "right"
  onIconClick?: () => void
  containerClassName?: string
  inputClassName?: string
  buttonClassName?: string
} & Omit<ComponentProps<"input">, "className">
```

### Implementación

```tsx
import { ParkingMeter } from "lucide-react"
import { InputWithIconButton } from "@/components/ui/input-with-icon-button"

<InputWithIconButton
  label="N° de Medidor"
  icon={ParkingMeter}
  iconButtonLabel="Buscar medidor"
  iconTooltip="N° de medidor del parque"
  placeholder="Ingresar..."
  value={medidor}
  onChange={(e) => setMedidor(e.target.value)}
  onIconClick={() => { /* acción mock o real */ }}
/>
```

### Notas para el agente

- ❌ No crear variantes sm/md del grupo.
- ✅ `iconButtonLabel` siempre definido (accesibilidad).
- ✅ Si `disabled` en el input, el botón hereda `disabled`.
- ✅ Ícono solo `lucide-react`.

---

## Button

**Archivo:** `/components/ui/button.tsx`  
**Estado:** ✅ Aprobado  
**Fuente:** shadcn/ui Button + custom variants

### Regla fundamental

**Los botones de acción en HINS llevan `shadow-xs` por defecto** para mantener una elevación visual sutil y consistente.

El componente Button soporta múltiples variantes y tamaños, pero cada caso de uso tiene un patrón específico recomendado.

### Variantes permitidas

| Variante | Uso | Ejemplo |
|----------|-----|---------|
| `default` | Botones primarios/CTA, crear, guardar | "Nuevo Socio", "Guardar cambios" |
| `outline` | Botones secundarios, acciones en headers, tablas | Descargar, filtros, vista de columnas |
| `secondary` | Alternativa a outline, menos énfasis | Menos común, usar con cuidado |
| `ghost` | Botones sin elevación visual (hover states internos) | Contextos modales o navegación interna |
| `destructive` | Acciones peligrosas (borrar, cancelar) | Eliminar socio |
| `link` | Links estilizados como botones | Navegar dentro de vista |

### Tamaños permitidos

| Tamaño | Altura | Uso |
|--------|--------|-----|
| `default` | `h-8` | Botones en formularios y bloques de contenido |
| `sm` | `h-7` | Botones compactos en espacios reducidos |
| `lg` | `h-9` | Botones destacados (menos común) |
| `icon` | `size-8` | Botones de acción con solo ícono (headers, acciones de tabla) |
| `icon-sm` | `size-7` | Ícono compacto (raro) |
| `icon-xs` | `size-6` | Ícono muy pequeño (raro) |
| `icon-lg` | `size-9` | Ícono grande (raro) |

### Patrón recomendado: Shadow en botones de acción

**Patrón estándar para botones de acción (headers, tablas, etc.):**

```tsx
<Button
  variant="outline"        // Siempre outline o default
  size="icon"             // Para ícono-only
  className="shadow-xs"   // Shadow visual sutil (defecto recomendado)
  aria-label="..."        // Accesibilidad
>
  <IconComponent className="size-4" aria-hidden />
</Button>
```

**Patrón para botones primarios con texto:**

```tsx
<Button
  type="button"
  variant="default"       // Primary CTA
  size="default"         // o 'lg' si es prominente
  className="gap-1.5 shadow-xs"  // gap para ícono + texto
>
  <IconComponent className="size-4" aria-hidden />
  Nuevo
</Button>
```

**Patrón flexible: Sin shadow en contextos especiales**

```tsx
// En modales, sheets o contextos donde no necesites elevación visual
<Button
  variant="ghost"         // Sin shadow — hover states solo
  size="icon"
  aria-label="Cerrar"
>
  <XIcon className="size-4" aria-hidden />
</Button>
```

### Implementación completa

```tsx
// /components/ui/button.tsx (ya existente)
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs ...",
        outline: "border-input bg-white shadow-xs hover:bg-muted ...",
        secondary: "bg-secondary text-secondary-foreground shadow-xs ...",
        ghost: "hover:bg-muted hover:text-foreground ...",  // ✅ Sin shadow — para contextos modales/internos
        destructive: "bg-destructive/10 text-destructive ...",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 ...",
        xs: "h-6 gap-1 px-2 text-xs ...",
        sm: "h-7 gap-1 px-2.5 ...",
        lg: "h-9 gap-1.5 px-2.5 ...",
        icon: "size-8",
        "icon-xs": "size-6 ...",
        "icon-sm": "size-7 ...",
        "icon-lg": "size-9",
      },
    },
  }
)
```

### Casos de uso en el producto

**Header con botón export (outline + icon + shadow):**
```tsx
<Button
  variant="outline"
  size="icon"
  className="shadow-xs"
  aria-label="Exportar datos"
>
  <DownloadIcon className="size-4" aria-hidden />
</Button>
```

**Botón crear nuevo (default + texto + ícono):**
```tsx
<Button
  variant="default"
  size="default"
  className="gap-1.5 shadow-xs"
  onClick={() => openDialog()}
>
  <PlusCircleIcon className="size-4" aria-hidden />
  Nuevo Socio
</Button>
```

**Botón de acción en tabla (outline + icon + shadow):**
```tsx
<DropdownMenuTrigger asChild>
  <Button
    variant="outline"
    size="icon"
    className="size-8 shadow-xs"
    aria-label={`Acciones — ${row.getValue("periodo")}`}
  >
    <MoreHorizontalIcon className="size-4" aria-hidden />
  </Button>
</DropdownMenuTrigger>
```

### ✅ Cuándo usar cada variante

**Usa `outline` + `shadow-xs` cuando:**
- El botón es acción principal en headers
- El botón está en tablas (dropdown actions)
- El botón es filtro o control visible
- Necesitas que el botón tenga presencia visual

**Usa `ghost` cuando:**
- El botón está dentro de un Sheet o Dialog
- El botón es acción interna sin elevación necesaria
- El botón está en contextos donde el hover-only es suficiente
- Quieres minimizar la presencia visual

```tsx
// ❌ Inconsistente
<Button variant="outline" size="icon" aria-label="Action">
  {/* Falta shadow-xs */}
</Button>

// ✅ Correcto para headers/tablas
<Button variant="outline" size="icon" className="shadow-xs" aria-label="Action">
  <IconComponent className="size-4" />
</Button>

// ✅ Correcto para modales/internos
<Button variant="ghost" size="icon" aria-label="Close">
  <XIcon className="size-4" />
</Button>
```

### Notas para el agente

- Siempre usar `shadow-xs` en botones de acción — decisión de diseño validada
- `ghost` es para hover states internos, no para botones de acción visibles
- `icon` size es estándar para acciones en headers/tablas
- Texto + ícono siempre llevan `gap-1.5` entre ellos
- `aria-label` es obligatorio en botones icon-only para accesibilidad
- Focus state con ring-3 es nativo — no sobrescribir

---

## TabsForBlocks

**Archivo:** `/components/ui/tabs-for-blocks.tsx`
**Estado:** ✅ Aprobado
**Fuente:** shadcn/ui Tabs — variante Boxed (shadcn studio)

### Cuándo usar
- Selector de período temporal (DIA / 1M / 6M / 1A / TODO) — ver [ChartRangeOptions](#chartrangeoptions)
- Navegación entre vistas dentro de una misma página
- Filtro de contenido dentro de una card

**REGLA:** Es el único componente de tabs/chips permitido en el producto.
No crear variantes alternativas bajo ninguna circunstancia.

### Cuándo NO usar
- Navegación global entre páginas distintas → usar Sidebar
- Acciones → usar Button
- Filtros de tabla con múltiple selección → usar Checkbox

### Spec

| Propiedad | Valor | Tailwind |
|---|---|---|
| Variant | Boxed tabs | shadcn/ui `<Tabs>` nativo |
| Background contenedor | #E7E5E4 @ 75% | `bg-stone-200/75` |
| Border radius contenedor | 8px | `rounded-md` |
| Padding contenedor | 4px | `p-1` |
| Tab activo — background | #FFFFFF | `data-[state=active]:bg-white` |
| Tab activo — shadow | xs | `data-[state=active]:shadow-xs` |
| Tab inactivo — texto | muted-foreground | nativo shadcn |
| Height | Fill contenedor | `h-full` |
| Variant `text` (default) | Labels de texto | chips de rango, navegación |
| Variant `icon` | Solo ícono + `ariaLabel` | toggle $ / ⚡ en chart GDCV Socio |
| Variant `icon-label` | Ícono + label | reservado — uso explícito en flow |
| `labelMobile` | Label corto `< sm` | ej. `ROI` en header; desktop sigue con `label` completo |
| `width="fit"` | Ancho al contenido | DOLAR \| ARS en header ROI — no expandir en mobile |
| `width="fill"` | Flex en contenedor | Nav Performance \| ROI — `flex-1` en mobile |
| `readOnly` | Sin `onValueChange` | Reservado — moneda en sheet ROI ahora usa `TabsForBlocks` clickeable (`GddRoiRecuperoTable` `onCurrencyChange`), no un indicador solo-lectura |
| Size | lg | `text-sm` |

```tsx
// /components/ui/tabs-for-blocks.tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TabsForBlocksProps {
  tabs: { value: string; label: string }[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function TabsForBlocks({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
}: TabsForBlocksProps) {
  return (
    <Tabs
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={cn("h-full", className)}
    >
      <TabsList className="h-full bg-stone-200/75 rounded-md p-1 gap-1">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="
              h-full rounded-md text-sm font-medium
              data-[state=active]:bg-white
              data-[state=active]:shadow-xs
              data-[state=inactive]:text-muted-foreground
            "
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
```

### Casos de uso en el producto

```tsx
// Chips de período
<TabsForBlocks
  tabs={[
    { value: "1M", label: "1M" },
    { value: "3M", label: "3M" },
    { value: "6M", label: "6M" },
  ]}
  defaultValue="6M"
  onValueChange={(v) => setPeriod(v)}
/>

// Navegación de vista
<TabsForBlocks
  tabs={[
    { value: "performance", label: "Performance del Parque" },
    { value: "roi", label: "Retorno de Inversión" },
  ]}
  defaultValue="performance"
  onValueChange={(v) => router.push(
    v === "performance" ? "/gdd/performance" : "/gdd/roi"
  )}
/>
```

### Notas para el agente
- NUNCA tab activo con fondo negro, underline, o sin shadow.
- NUNCA usar para navegación global.
- El `defaultValue` lo define el flow que lo consume, no el componente.
- Variante `icon`: tabs con `{ value, icon, ariaLabel }` — ver `SOCIO_V2_UNIT_TABS` en `socio-v2-constants.ts`.
- Orden en header de chart: **rango primero**, toggle unidad después (slot `headerActions` de `CardWithContent`).

---

## ChartRangeOptions

**Archivo:** `/components/gdd/chart-range-options.ts`
**Estado:** ✅ Aprobado
**Exporta:** `CHART_RANGE_CHIP_OPTIONS`, `CHART_RANGE_TABS` (mapeo listo para `CardWithContent` / `TabsForBlocks`)

### Chips estándar (bar charts + vista diaria)

| `id` (`ChartRangeChip`) | Label UI | Comportamiento |
|---|---|---|
| `1d` | **DIA** | Vista diaria → `DailyGenerationChartBlock` (no bar chart) |
| `1m` | 1M | Serie acotada 1 mes |
| `6m` | 6M | Default habitual en Performance |
| `1a` | 1A | Último año |
| `todo` | TODO | Desde inicio de operaciones |

> **Wording:** el chip `1d` muestra **`DIA`** (no `DIARIO`) para ahorrar espacio en el header de la card.

### Implementaciones que consumen `CHART_RANGE_TABS`

| Vista | Archivo |
|---|---|
| GDD Performance | `components/gdd/ParkPerformanceView.tsx` |
| GDCV AGC Performance | `components/gdcv/GdcvPerformanceView.tsx` |
| GDCV Socio Mi Espacio | `components/gdcv/SocioEnergyView.tsx` |
| GDCV Socio Performance (parque) | `components/gdcv/SocioPerformanceView.tsx` — sin `ParkDetailsCard` |
| GDCV Socio Mi Energía | `components/gdcv/SocioEnergyView.tsx` (modo kWh; modo $ omite `1d`) |

**No usar** este archivo para Socio V2 monetary/energy chips — ver `socio-v2-constants.ts` (`DIA` allí = rango `1m` semanal, distinto semántico).

```tsx
import { CHART_RANGE_TABS } from "@/components/gdd/chart-range-options"

<CardWithContent
  tabs={CHART_RANGE_TABS}
  activeTab={period}
  onTabChange={(v) => setPeriod(v as ChartRangeChip)}
/>
```

---

## FormatCurrency

**Archivo:** `/lib/format-currency.ts`
**Estado:** ✅ Aprobado
**Principios visuales:** `context/design-system.md` → Formato monetario (ARS / USD)

### Cuándo usar
- Cualquier monto en UI: KPI, tooltip, tabla, label de barra, eje Y monetario.
- ROI GDD/GDCV con toggle de moneda (`formatRoiFromUsd` + `TIPO_CAMBIO_ARS`).
- `MonetaryBarChart` / `SocioV2BarChart` en modo dinero.
- `ROIProjectionChart` — tooltip `full`, eje Y `axis`, label inversión `compact` (USD).
- Mocks en `data/*` que exportan strings de display → `formatCurrency(…)` al definir el mock (no strings manuales).

### Cuándo NO usar
- Copy de tabs o botones de moneda → `currencyTabLabel` (literal **DOLAR** / **ARS**, sin prefijo numérico).
- **Labels de KPI, headers de tabla, tooltips** → nunca incluir moneda; ver [Currency Context Rules](#currency-context-rules).

### Prefijos y locale (Argentina)

| Moneda | Prefijo en montos | Label en `TabsForBlocks` / toggles |
|---|---|---|
| ARS | `$ ` (sí, con espacio) | `ARS` |
| USD | `u$s ` (sí, con espacio) | `DOLAR` |

| Regla numérica | Valor |
|---|---|
| Locale | `es-AR` siempre |
| Miles | `.` (ej. `82.600`) |
| Decimales | `,` (ej. `14,29`) |
| Centavos ARS en KPI/ahorro | **No** — `decimals` default `0` |
| Centavos / TC / tarifa | `formatCurrency(…, { decimals: 2 })` cuando el dato lo exige |

### Modos (`CurrencyFormatMode`)

| Modo | Uso | ARS ejemplo | USD ejemplo |
|---|---|---|---|
| `full` | KPI, tooltip, tablas, montos completos | `$ 82.600` | `u$s 3.779` |
| `compact` | Label sobre barra (chart); KPI ROI mobile ≥1M; montos compactos Socio ROI | `$ 82,6k` | `u$s 3,8k` |
| `axis` | Eje Y chart monetario | `$ 83k` | `u$s 4k` |

> **Lectura compacta:** `$ 82,6k` = mismo valor que `$ 82.600` en `full`. El sufijo `k`/`M` evita ambigüedad con la coma decimal.

### API

```ts
import {
  formatCurrency,
  formatRoiFromUsd,
  currencyTabLabel,
  type CurrencyCode,
  type CurrencyFormatMode,
} from "@/lib/format-currency"

// Monto ya en la moneda de visualización
formatCurrency(74400, "ars", "full")        // "$ 74.400"
formatCurrency(74400, "ars", "compact")     // "$ 74,4k"
formatCurrency(74400, "ars", "axis")        // "$ 74k"

// ROI: valor canónico en USD × tipo de cambio si ARS
formatRoiFromUsd(100, "ars", TIPO_CAMBIO_ARS, "full")

// ROI mobile (≥ 1M): `full` → `compact` automático — ej. `u$s 23,8M`
formatRoiFromUsdResponsive(23_800_000, "usd", TIPO_CAMBIO_ARS, true)

// Tabs header ROI (GddPageHeading) — único lugar de moneda en labels de UI
currencyTabLabel("usd")   // "DOLAR"
currencyTabLabel("ars")   // "ARS"
```

### Currency Context Rules

**Principios:** `context/design-system.md` → Currency Context Rules.

#### Contexto global de moneda

El toggle **DOLAR | ARS** en `GddPageHeading` (vista ROI GDD) es el **único** control de moneda de la vista. Todos los KPIs, celdas de tabla, tooltips y ejes heredan el `CurrencyCode` activo (`?currency=ars` en URL o default `usd`).

#### Reglas de labels (UI in-app)

| Regla | Detalle |
|---|---|
| Labels = concepto | "Inversión Recuperada", "Ahorro Estimado", "Cap. Recuperado" |
| Sin moneda en label | ❌ `(DOLAR)`, `(ARS)`, `(USD)`, "USD", "pesos" |
| Moneda en valor | ✅ prefijo vía `formatCurrency` / `formatRoiFromUsd` |
| Sin duplicación | ❌ tab + label + valor con moneda a la vez |

#### Headers de tabla

Usar labels semánticos **sin** sufijo de moneda:

```tsx
// ✅ Correcto
header: "Ahorro Estimado"

// ❌ Incorrecto — redundante con tab global
header: `Ahorro Estimado (${currencyTabLabel(currency)})`
```

#### Excepciones permitidas

| Caso | Helper / patrón |
|---|---|
| Tabs globales | `currencyTabLabel` |
| Exports CSV/PDF | `currencyExportColumnLabel` (legacy: `currencyColumnLabel`) |
| Multi-currency en misma vista | Label explícito documentado en flow |
| Tooltips avanzados multi-moneda | Copy documentado en flow |

#### Implementaciones actuales (post-cleanup)

| Consumidor | Patrón |
|---|---|
| `GddPageHeading` / `GdcvPageHeading` | Tabs `DOLAR` / `ARS` — contexto global |
| `GddRoiView` / `GdcvRoiView` | Labels sin moneda; valores `formatRoiFromUsdResponsive` |
| `GddRoiRecuperoTable` | Ver [GddRoiRecuperoTable](#gddroirecuperotable) |
| `SocioRoiView` | Paridad GDD ROI: mismos labels (`Recupero Estimado`, badge `Payback`, card TIR/Plazo/Invertido); `SectionHeader` `level="h2"` + `TabsForBlocks` DOLAR\|ARS (`?currency=`); `formatRoiFromUsdResponsive` + `TIPO_CAMBIO_ARS`; sin curva en vista |
| `MonetaryBarChart` | `currency` prop; labels/ejes vía `formatCurrency` |
| `SocioV2BarChart` | ARS fijo; `formatCurrency(…, "ars", "compact")` |
| `ROIProjectionChart` | USD fijo; tooltip `full`, eje `axis`, meta `compact` |

#### Mocks (`data/*`) — strings de display

Montos en mocks que se muestran en UI deben generarse con `formatCurrency` / `formatRoiFromUsd*` al exportar el string, **no** literales `"$74.400"` ni formato US (`$2.13 M`).

| Archivo | Moneda | Patrón |
|---|---|---|
| `data/gdd-performance-mock.ts` | `ars` | `formatCurrency(n, "ars", "full")` en `savingsCardMock`, `tariffCardMock`, `consumptionHistoryMock.coverageMoney` |
| `data/gdcv-mock.ts` | `ars` | Socios `ahorroGenerado`, KPIs parque, `gdcvRoiMetrics`, `socioDetalleMock` |
| `data/gdcv-socio-mock.ts` | `ars` / `usd` | Helpers locales `fmtArs` / `fmtArsCompact`; inversión socio `formatCurrency(…, "usd", "compact")` |
| `data/mantenimiento-mock.ts` | `ars` | `fmtArs(n)` → `costoAsociado` en historial GDD/GDCV/GDC |
| `data/gdd-roi-mock.ts` | — | Valores **numéricos USD**; formateo en vista con `formatRoiFromUsd*` |
| `data/gdcv-agc-mock.ts` | — | `gdcvRoiKpis` numéricos USD; sin `roiKpis` legacy pre-formateado |

```ts
// Patrón recomendado en mocks ARS
import { formatCurrency } from "@/lib/format-currency"
const fmtArs = (n: number) => formatCurrency(n, "ars", "full")
export const socioAhorroKpi = { value: fmtArs(74_400), /* … */ }
```

### Moneda por pantalla (negocio)

| Vista | `CurrencyCode` | Notas |
|---|---|---|
| GDCV Socio — Mi Ahorro | `ars` | Ahorro en factura; default en `MonetaryBarChart` |
| GDCV Socio — ROI | `usd` + `ars` | Inversión/recupero USD; ahorrado en facturas ARS |
| GDD ROI / GDCV ROI | `usd` / `ars` | Base USD en mock; `?currency=ars` en URL |

### Notas para el agente
- No usar `$` genérico para USD — usar `u$s ` en montos.
- **ARS y USD llevan espacio tras el prefijo:** `$ 74.400` · `u$s 5,7M` — nunca `$ 74.400` ni `$2.13 M` (formato US).
- No poner `u$s` ni `$` en labels de tabs — solo **DOLAR** / **ARS**.
- **No repetir moneda en labels** de KPI, tabla, chart o tooltip — tab global + prefijo del valor.
- No duplicar `toLocaleString("es-AR")` + prefijo manual en componentes; importar el helper.
- `compact`: labels de barras; tooltip de la misma barra siempre `full`; excepción ROI mobile ≥1M (`formatRoiFromUsdResponsive`).
- TIR, plazo, % y fechas no pasan por este helper.
- `currencyColumnLabel` / `currencyExportColumnLabel` → **solo exports**, no UI in-app.

---

## FormatEnergy — unidades energéticas

**Estado:** ✅ Convención aprobada (formateo inline en charts; helper central `format-energy.ts` pendiente de fase 2).

### Unidades canónicas (SI)

| Magnitud | Unidad | Casing | Ejemplo |
|---|---|---|---|
| Energía | kilovatio-hora | `kWh` | `830 kWh` |
| Potencia instalada | kilovatio-pico | `kWp` | `980 kWp` |
| Potencia instantánea | kilovatio | `kW` | `1,4 kW · 12 Hrs` |
| Megavatio-hora | megavatio-hora | `MWh` | reservado si escala >999 kWh en eje |

❌ **Prohibido:** `Kwh`, `KWH`, `kwh` como sufijo de unidad en UI o mocks.

✅ **Correcto:** número con locale `es-AR` + espacio + unidad: `830 kWh`, `204,59 kWh`.

### Formato compacto en charts (patrón actual)

| Contexto | Patrón | Ejemplo |
|---|---|---|
| Label barra / KPI energía | `N kWh` o `N,Nk kWh` si ≥1000 | `824,5k kWh` |
| Eje Y energía | sufijo `k` pegado, sin unidad | `824k` |
| Tarifa compuesta | `formatCurrency(…, "ars", "full") + " /kWh"` | `$ 80 /kWh` |

### Implementaciones

| Archivo | Patrón |
|---|---|
| `MonetaryBarChart` | `formatEnergy*` locales (modo `energia`) |
| `SocioV2BarChart` | idem modo kWh |
| `ParkEnergyBarChart` | `toLocaleString("es-AR") + " kWh"` |
| `gdd-performance-mock.ts` | `totalConsumption: "890 kWh"` (no `Kwh`) |
| `chart-day-format.ts` | Pico: `formatDailyPeakInline` → `kW · Hrs` |

### Notas para el agente
- Separar valor numérico (`kwh: 830.17`) de unidad en KPIs cuando sea posible (`unit="kWh"`).
- En tablas mock, incluir unidad en string display: `"830 kWh"` con casing exacto `kWh`.
- Horas en vista 1D: ver `design-system.md` → Formato de horas (`12 Hrs`, no `12h`).

---

## Shell — Sidebar (desktop)

**Implementación:** `components/ui/sidebar.tsx` · **Shells:** `components/layout/*LayoutShell.tsx`

En **desktop/tablet (≥768px)** el sidebar administrativo arranca **colapsado** (rail de íconos). El usuario lo expande con `SidebarTrigger` en el header, `SidebarRail` o `Ctrl/Cmd + B`. La preferencia se guarda en cookie `sidebar_state` (solo desktop).

**Mobile:** sin cambios — Sheet cerrado hasta abrir desde el trigger; no usar `defaultOpen` del provider para el drawer.

**Spec completa (persistencia, tooltips, lista de shells):** `engineering/tech-stack.md` → Sidebar (desktop vs mobile). Principios visuales: `design-system.md` → §4 Anatomía del Shell.

---

## Card

**Archivo:** `/components/ui/card.tsx`
**Estado:** ✅ Aprobado v2
**Fuente:** shadcn/ui Card — sin variantes

### Cuándo usar
Superficie neutral que contiene: KpiPrimary, KpiPrimaryCompact, KpiSecondary, CardWithContent.

### Cuándo NO usar
- Tablas → Table es independiente, sin Card
- Navegación global → Sidebar
- Modales o drawers → Sheet

### Spec

| Propiedad | Valor | Tailwind |
|---|---|---|
| Background | #FFFFFF | `bg-white` |
| Border | ninguno | — |
| Border radius | 14px | `rounded-xl` |
| Shadow | elevación sutil | `shadow-xs` |
| Padding | 0 | `p-0` |
| Overflow | hidden | `overflow-hidden` |

```tsx
// /components/ui/card.tsx
// shadcn nativo — se usa directamente sin wrapper custom.
// El shadcn nativo incluye py-4 por defecto. Overridear siempre con py-0.
// Clases base que todo consumidor debe respetar:
//   bg-white rounded-xl shadow-xs py-0 overflow-hidden
// ring-0 se agrega para neutralizar el ring nativo de shadcn.
```

### Regla crítica
Card es solo superficie. El padding lo define siempre el contenido:
- `KpiPrimary` / `KpiSecondary` → `p-4` en su wrapper interno
- `CardWithContent` → `p-4` en header y content
- **Regla del Design System:** Todas las Cards y contenedores en large-view desktop usan `p-4`
- Cualquier contenido futuro → define el suyo (siempre `p-4`)

### ⚠️ Atención al usar Card directamente
El shadcn nativo tiene `py-4` hardcodeado. **Siempre pasar `py-0`** como className
para que el padding lo controle el contenido interno y no la Card.

```tsx
// ✅ Correcto
<Card className="py-0 shadow-xs">...</Card>

// ❌ Incorrecto — py-4 nativo se cuela y rompe el spacing
<Card>...</Card>
```

---

## CardWire

**Archivo:** `/components/ui/card-wire.tsx`
**Estado:** ✅ Aprobado
**Fuente:** componente nativo HINS — Card con border, sin shadow

### Cuándo usar
- Contenedor visual para grupos de datos internos dentro de Sheets o vistas
- Cuando necesitas una superficie con borde sutil sin sombra (más "plana" que Card)
- Desglose de información — ej: Autoconsumo + Inyectada dentro de un Sheet
- Alternativa a Card cuando el visual necesita menos "elevación"

### Cuándo NO usar
- Contenedores principales de layout → Card
- Tablas → Table
- Modales o drawers → Sheet
- KPI y contenedores que necesitan sombra → Card

### Spec

| Propiedad | Valor | Tailwind |
|---|---|---|
| Background | #FFFFFF | `bg-white` |
| Border | 1px sólido | `border border-border` |
| Border radius | 8px | `rounded-md` |
| Shadow | ninguno | — |
| Padding | 16px | `p-4` |
| Overflow | visible | — |

### Implementación

```tsx
// /components/ui/card-wire.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const CardWire = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border border-border bg-white p-4",
      className
    )}
    {...props}
  />
))
CardWire.displayName = "CardWire"

export { CardWire }
```

### Uso en contexto

```tsx
// En Sheet — desglose de energía
<CardWire>
  <div className="grid grid-cols-2 gap-4">
    <div className="flex items-start gap-3">
      <IconBadge icon={ParkingMeterIcon} size="sm" />
      <div>
        <p className="text-sm font-medium">Autoconsumo (virtual)</p>
        <p className="text-sm font-semibold">21.0 kWh</p>
      </div>
    </div>
    <div className="flex items-start gap-3">
      <IconBadge icon={PlugZapIcon} size="sm" />
      <div>
        <p className="text-sm font-medium">Inyectada</p>
        <p className="text-sm font-semibold">10.0 kWh</p>
      </div>
    </div>
  </div>
  {/* progress bar */}
</CardWire>
```

### Notas para el agente
- Padding es `p-4` (16px) — diferencia con Card que es `p-0`
- Border es nativa — no usar shadow
- Border radius es `rounded-md` (8px) — más pequeña que Card (`rounded-xl` 14px)
- `className` es extensible — se puede sobreescribir color, padding, etc. si el contexto lo requiere
- Es agnóstico al contenido — puede contener flex layouts, grids, listas, etc.

---

## FeatureItem

**Archivo:** `/components/ui/feature-item.tsx`
**Estado:** ✅ Aprobado
**Fuente:** componente nativo HINS — destaque de valores totales/finales

### Cuándo usar
- Destacar valores finales, totales o conclusivos dentro de un bloque de datos
- Al cierre de un desglose (ej: Ahorro Generado después de Autoconsumo + Inyectada)
- Datos únicos destacados en grid (ej: Medidor | Participación en Sheet)
- Dentro de CardWire o contenedores de información
- Cuando el valor necesita diferenciarse visualmente del resto

### Cuándo NO usar
- Filas de datos normales → filas simples o StatList
- KPIs principales → KpiPrimary o KpiSecondary
- Botones o acciones → Button

### Variantes de orientación

| Prop | Layout | Uso |
|---|---|---|
| `orientation="horizontal"` | label izquierda · value derecha | Totales al cierre de un desglose (default, sin ícono) |
| `orientation="vertical"` | label arriba · value abajo | Datos únicos en grid (Medidor, Participación) |
| `icon` (prop opcional) | ícono + label/value | KPIs de soporte en grid 2×2 (ej. Potencia Instalada) |

### Íconos (`lucide-react`)

| Concepto | Ícono | Ejemplos de label |
|---|---|---|
| Energía / potencia / kWh | `ZapIcon` | Potencia total instalada, Energía asignada, Total acumulado |
| Ahorro / factura / crédito | `WalletIcon` | Total Ahorro en Abril, Ahorro Generado |
| Monto $ (no ahorro) | `CircleDollarSignIcon` | Inversión inicial, Autoconsumo virtual ($) |
| Fecha / operaciones | `CalendarIcon` | Inicio de operaciones |
| Socios / cupos | `UsersIcon` | Cantidad de socios |

> Desglose con ítems en $ sin ser “ahorro total”: `DollarSignIcon` en StatList (ej. Autoconsumo virtual).

### Spec

| Propiedad | Valor | Tailwind |
|---|---|---|
| Background | Shell background | `bg-background-subtle` |
| Border radius | 8px | `rounded-md` |
| Padding | 12px mobile · 16px desktop | `p-3 md:p-4` |
| Font label (sin ícono) | 14px medium | `text-sm font-medium text-foreground` |
| Font label (con ícono) | 12px mobile · 14px desktop | `text-xs md:text-sm font-medium` |
| Font value | 18px mobile · 20px desktop | `text-lg md:text-xl font-semibold text-[#0A0A0A]` |

**Horizontal (default, sin ícono):**
- Layout: `flex items-center justify-between gap-3 md:gap-4`

**Con ícono (`icon` prop):**
- Mobile: `flex-col gap-4` — IconBadge arriba, label + value abajo
- Desktop (`md+`): `flex-row items-center` — ícono izquierda, texto derecha
- IconBadge: `size-9 md:size-12`, `bg-white text-green-600`
- Grid contenedor recomendado: `grid grid-cols-2 gap-4`

**Vertical (`orientation="vertical"`):**
- Layout: `flex flex-col gap-1`
- Label: `text-xs font-medium text-muted-foreground` (más pequeño — es un caption)
- Value: `text-xl font-semibold` (igual que horizontal)

### Implementación

```tsx
// /components/ui/feature-item.tsx
interface FeatureItemProps {
  label: string
  value: string
  orientation?: "horizontal" | "vertical"
  icon?: LucideIcon
  className?: string
}

export function FeatureItem({
  label,
  value,
  orientation = "horizontal",
}: FeatureItemProps) {
  if (orientation === "vertical") {
    return (
      <div className="flex flex-col gap-1 rounded-md bg-background-subtle p-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tabular-nums text-[#0A0A0A]">{value}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-background-subtle p-4">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xl font-semibold tabular-nums text-[#0A0A0A]">{value}</p>
    </div>
  )
}
```

### Uso en contexto

```tsx
// Horizontal (default) — al cierre de un desglose
<FeatureItem label="Ahorro Generado" value="$ 62.000" />

// Vertical — en grid 2 columnas (Medidor | Participación)
<div className="grid grid-cols-2 gap-4">
  <FeatureItem orientation="vertical" label="Nº de Medidor" value="3551118" />
  <FeatureItem orientation="vertical" label="Participación (%)" value="15%" />
</div>

// Con ícono — `/gdcv/socio/parque` (`socioParqueChartMetricRows`)
<div className="grid grid-cols-2 gap-4">
  <FeatureItem label="Potencia total instalada" value="980 kWp" icon={ZapIcon} />
  <FeatureItem label="Potencia total de acople" value="815 kWp" icon={ZapIcon} />
</div>
<div className="grid grid-cols-2 gap-4">
  <FeatureItem label="Inversión inicial" value="u$s 5,7M" icon={CircleDollarSignIcon} />
  <FeatureItem label="Inicio de operaciones" value="Marzo 2024" icon={CalendarIcon} />
</div>

// Mi Espacio — panel 340px (`SocioEnergyView`): forzar columna en md+ (celdas estrechas)
<div className="grid grid-cols-2 gap-4">
  <FeatureItem icon={WalletIcon} label="Ahorro" value="$ 74.400" className="md:flex-col md:items-stretch" />
  <FeatureItem icon={ZapIcon} label="Energía Gen." value="830 kWh" className="md:flex-col md:items-stretch" />
</div>

// Parque — card ancha: default del componente (`md:flex-row`) sin className extra
```

### Notas para el agente
- `orientation` default es `"horizontal"` — no hace falta declararlo para el caso estándar
- Con `icon`, en mobile el layout colapsa a columna (ícono arriba) para permitir `grid-cols-2` sin overflow
- En **md+** el default es `flex-row`. En columna **340px** (Mi Espacio) usar `className="md:flex-col md:items-stretch"` — no `min-h-24` ni `justify-center`
- En `"vertical"` el label usa `text-xs` (12px) — es un caption, no un título
- En `"vertical"` el value usa `text-[#0A0A0A]` — mismo que KpiSecondary para consistencia
- `tabular-nums` en value siempre — alineación correcta de números
- `bg-background-subtle` — mismo fondo sutil del shell, consistente con SoftBadge
- Spacing en CardWire: `gap-4 sm:gap-6` entre rows (responsive mobile), `gap-4` entre elementos internos

---

## IconBadge

**Archivo:** `/components/ui/icon-badge.tsx`
**Estado:** ✅ Aprobado
**Cambio:** Agregado size="md", removida prop `background` — claridad semántica

### Cuándo usar
Ícono con fondo dentro de componentes KPI y contextos de soporte.
Comunica la categoría o naturaleza del dato. **No es interactivo.**

### Cuándo NO usar
- Íconos decorativos sin fondo → lucide-react directo
- Íconos en botones → Button size="icon"
- Íconos en navegación → Sidebar nativo

### Spec

| Propiedad | size="sm" (KpiSecondaryStacked) | size="md" (KpiSecondaryCompact) | size="lg" (KpiPrimary) |
|---|---|---|---|
| Contenedor | 24×24px → `size-6` | 36×36px → `size-9` | 48×48px → `size-12` |
| Background | `bg-green-600` | `bg-background-subtle` | `bg-background-subtle` |
| Border radius | 6px → `rounded` | 8px → `rounded-md` | 8px → `rounded-md` |
| Color ícono | `text-white` | `text-green-600` | `text-green-600` |
| Tamaño ícono | 12px → `size-3` | 20px → `size-5` | 24px → `size-6` |

```tsx
// /components/ui/icon-badge.tsx
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface IconBadgeProps {
  icon: LucideIcon
  size?: "sm" | "md" | "lg"
  className?: string
}

export function IconBadge({
  icon: Icon,
  size = "sm",
  className,
}: IconBadgeProps) {
  const sizeStyles = {
    sm: "size-6 rounded bg-green-600 text-white",
    md: "size-9 rounded-md bg-background-subtle text-green-600",
    lg: "size-12 rounded-md bg-background-subtle text-green-600",
  }

  const iconSizes = {
    sm: "size-3",
    md: "size-5",
    lg: "size-6",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center flex-shrink-0",
        sizeStyles[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} aria-hidden />
    </div>
  )
}
```

### Notas para el agente
- `size="sm"` → KpiSecondaryStacked (vertical stacked)
- `size="md"` → KpiSecondaryCompact (horizontal compacto)
- `size="lg"` → KpiPrimary (dato principal)
- `className` prop opcional para overrides puntuales
- **REMOVIDO:** `background` prop — causaba conflicto semántico
- No agregar onClick ni cursor-pointer — no es interactivo
- Cada size tiene su propia paleta de colores predefinida

---

## KpiPrimary

**Archivo:** `/components/ui/kpi-primary.tsx`
**Estado:** ✅ Aprobado

### Cuándo usar
El dato más importante de la vista. Responde la pregunta clave del usuario.
**Máximo 1 por vista.**

### Cuándo NO usar
- Datos secundarios o de soporte → KpiSecondary
- Más de una instancia por vista

### Spec

**Anatomía:**
```
Card [p-0, sin borde]
  └── flex col, gap-4, p-4
      ├── flex row, gap-4, items-start
      │   ├── IconBadge size="lg"        (48×48)
      │   └── flex col, gap-1, flex-1
      │       ├── label → text-lg font-semibold #0A0A0A
      │       └── value + unit → text-4xl font-bold #0A0A0A
      ├── Sparkline → AreaChart Recharts, edge-to-edge (mx-[-16px]), color --chart-1
      └── SoftBadge → comparativo período
```

| Elemento | Tailwind |
|---|---|
| Card wrapper | nativo (sin borde, solo shadow-xs) |
| Layout interno | `flex flex-col gap-4 p-4` |
| Header row | `flex items-start gap-4` |
| Text block | `flex flex-col gap-1 flex-1` |
| Label | `text-lg font-semibold text-[#0A0A0A]` |
| Value | `text-4xl font-bold text-[#0A0A0A]` |
| Unit | `text-xl font-semibold text-[#0A0A0A] ml-1` |
| Sparkline wrapper | `mx-[-16px]` — extiende a bordes de card |
| Sparkline chart | `aspect-auto h-14 w-full` |

```tsx
// /components/ui/kpi-primary.tsx
import { Card } from "@/components/ui/card"
import { IconBadge } from "@/components/ui/icon-badge"
import { SoftBadge } from "@/components/ui/soft-badge"
import { GenerationSparkline } from "@/components/charts/GenerationSparkline"
import { generationSparklineConfig } from "@/data/chart-config"
import { type LucideIcon } from "lucide-react"

interface KpiPrimaryProps {
  icon: LucideIcon
  label: string
  value: string
  unit?: string
  delta: string
  sparklineData?: { value: number }[]
}

export function KpiPrimary({
  icon, label, value, unit, delta, sparklineData,
}: KpiPrimaryProps) {
  const indexed = sparklineData?.map((d, i) => ({ i, value: d.value })) ?? []

  return (
    <Card>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-start gap-4">
          <IconBadge icon={icon} size="lg" />
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-lg font-semibold text-[#0A0A0A]">{label}</p>
            <p className="text-4xl font-bold text-[#0A0A0A]">
              {value}
              {unit && <span className="text-xl font-semibold ml-1">{unit}</span>}
            </p>
          </div>
        </div>
        {indexed.length > 0 && (
          <div className="mx-[-16px]">
            <GenerationSparkline
              data={indexed}
              chartConfig={generationSparklineConfig}
              className="aspect-auto h-14 w-full"
            />
          </div>
        )}
        <SoftBadge>{delta}</SoftBadge>
      </div>
    </Card>
  )
}
```

### Notas para el agente
- Sin borde gradiente. Card neutral nativo (shadow-xs).
- Sparkline es edge-to-edge usando `mx-[-16px]` en wrapper.
- Sparkline es opcional — solo se renderiza si `sparklineData.length > 0`.
- `unit` es opcional.
- 1 por vista máximo. Si hay duda → KpiSecondary.

---

## KpiPrimaryCompact

**Archivo:** `/components/ui/kpi-primary-compact.tsx`  
**Estado:** ✅ Aprobado  
**Familia:** variante compacta de `KpiPrimary` — misma superficie, sparkline y tooltip

### Cuándo usar
- KPIs de soporte **con tendencia** (sparkline) en grid 2×N
- Panel lateral o bloques donde el dato no es el héroe único de la vista
- Ejemplo producto: Ahorro + Energía Gen. del mes en curso (GDCV Socio)

### Cuándo NO usar
- El dato héroe de la vista → `KpiPrimary` (tipografía 4xl, 1 por vista)
- KPI sin sparkline → `KpiSecondary` o `KpiSecondaryCompact`
- Más de una fila de héroes → no reemplaza a `KpiPrimary`

### Spec

**Anatomía:**
```
Card [py-0, kpi-compact-border-fade, ring-0, rounded-xl, overflow-hidden]
  └── flex col, gap-3, p-4
      ├── flex row, gap-3, items-start
      │   ├── IconBadge size="lg"
      │   └── flex col, gap-0.5, flex-1
      │       ├── label → text-xs font-medium text-muted-foreground
      │       └── value + unit → text-lg font-semibold sm:text-xl #0A0A0A
      ├── Sparkline (opcional) → mx-[-16px], h-14, tooltip por punto (default GenerationSparkline)
      └── SoftBadge (opcional, solo si delta tiene contenido)
```

| Elemento | Tailwind |
|---|---|
| Card wrapper | `bg-white py-0 ring-0 rounded-xl overflow-hidden h-full kpi-compact-border-fade` |
| Layout interno | `flex flex-col gap-3 p-4` |
| Header row | `flex items-start gap-3` |
| Label | `text-xs font-medium text-muted-foreground truncate` |
| Value | `text-lg font-semibold tabular-nums text-[#0A0A0A] sm:text-xl` |
| Unit | `text-sm font-semibold sm:text-base ml-1` |
| Sparkline wrapper | `mx-[-16px] mt-auto` — edge-to-edge como KpiPrimary |
| Sparkline | `GenerationSparkline` default (`showTooltip` true) |
| Delta | `SoftBadge` condicional |

```tsx
// /components/ui/kpi-primary-compact.tsx
import { KpiPrimaryCompact } from "@/components/ui/kpi-primary-compact"
import { WalletIcon, ZapIcon } from "lucide-react"

<div className="grid grid-cols-2 gap-4">
  <KpiPrimaryCompact
    icon={WalletIcon}
    label="Ahorro"
    value="$ 74.400"
    sparklineData={[{ value: 62 }, { value: 58 }, { value: 71 }]}
  />
  <KpiPrimaryCompact
    icon={ZapIcon}
    label="Energia Gen."
    value="830"
    unit="kWh"
    sparklineData={[{ value: 42 }, { value: 58 }, { value: 74 }]}
  />
</div>
```

### Notas para el agente
- **Border fade effect:** `.kpi-compact-border-fade` aplica dual inset `box-shadow` — borde sutil (1px inset) + disolución hacia abajo. Efecto visual: el borde se desvanece hacia el fondo (especialmente en bordes inferiores y laterales). Interior de la card siempre blanco y limpio.
- Sparkline: **nunca** pasar `showTooltip={false}` — mismo comportamiento interactivo que `KpiPrimary`.
- `delta` es opcional — omitir o string vacío si no hay comparativo.
- Grid recomendado: `grid-cols-2 gap-4` — mismo token que grids 2×N de métricas (`FeatureItem`, `KpiPrimary` wire). Para separación entre secciones/bloques usar `gap-4 sm:gap-6` (responsive mobile) — ver `design-system.md` § "Spacing Responsivo en Mobile".
- N instancias por vista permitidas (a diferencia de `KpiPrimary`).
- **CSS token:** `.kpi-compact-border-fade` definido en `app/globals.css` — no hardcodear inline `style={{}}` si el efecto necesita cambiar globalmente.

---

## KpiSecondary

**Archivo:** `/components/ui/kpi-secondary.tsx`
**Estado:** ✅ Aprobado
**Cambio:** Variante horizontal agregada — ✅ Backward compatible

### Cuándo usar
Datos complementarios al KpiPrimary.
N instancias por vista.

### Cuándo NO usar
- El dato principal de la vista → KpiPrimary

### Spec

**Props (ACTUALIZADO):**
```ts
interface KpiSecondaryProps {
  icon: LucideIcon
  label: string
  value: string
  delta: string
  infoTooltip?: { content: string; href?: string }
  layout?: "vertical" | "horizontal"  // default: "vertical"
}
```

**Anatomía VERTICAL (default):**
```
Card [p-0]
  └── flex col, gap-2, p-4
      ├── IconBadge size="sm"   (24×24)  ← ARRIBA
      ├── label → text-sm font-normal #737373
      ├── flex row, gap-1, items-center       ← value + HinsTooltip (opcional)
      │   ├── value → text-xl font-semibold #0A0A0A
      │   └── HinsTooltip (si infoTooltip presente)
      │       └── trigger: InfoIcon size-4 text-muted-foreground
      └── SoftBadge → comparativo período
```

**Anatomía HORIZONTAL (NEW):**
```
Card [p-0]
  └── flex row, gap-3, p-4
      ├── IconBadge size="sm"   (24×24) ← IZQUIERDA
      └── flex col, gap-1, flex-1
          ├── label → text-sm font-normal #737373
          ├── flex row, gap-1, items-center
          │   ├── value → text-xl font-semibold #0A0A0A
          │   └── HinsTooltip (opcional)
          └── SoftBadge (solo si delta tiene contenido)
```

| Elemento | Vertical | Horizontal |
|---|---|---|
| Card wrapper | `bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden h-full` | idem |
| Layout interno | `flex flex-col gap-2 p-4` | `flex items-start gap-3 p-4` |
| IconBadge | `size-sm` (abajo) | `size-sm flex-shrink-0 mt-0.5` (izquierda, alineado) |
| Content wrapper | N/A | `flex flex-col gap-1 flex-1 min-w-0` |
| Label | `text-sm font-normal text-[#737373]` | idem |
| Value row | `flex items-center gap-1` | idem |
| Value | `text-xl font-semibold text-[#0A0A0A]` | idem + `break-words` |
| SoftBadge | siempre | solo si `delta` tiene contenido |

```tsx
// /components/ui/kpi-secondary.tsx
import { Card } from "@/components/ui/card"
import { IconBadge } from "@/components/ui/icon-badge"
import { SoftBadge } from "@/components/ui/soft-badge"
import { HinsTooltip } from "@/components/ui/hins-tooltip"
import { InfoIcon, type LucideIcon } from "lucide-react"

interface KpiSecondaryProps {
  icon: LucideIcon
  label: string
  value: string
  delta: string
  /** Si se pasa, muestra un InfoIcon con tooltip al lado del value */
  infoTooltip?: {
    content: string
    href?: string
  }
  /** Layout de la KPI: vertical (default) o horizontal */
  layout?: "vertical" | "horizontal"
}

export function KpiSecondary({
  icon,
  label,
  value,
  delta,
  infoTooltip,
  layout = "vertical",
}: KpiSecondaryProps) {
  if (layout === "horizontal") {
    return (
      <Card className="bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden h-full">
        <div className="flex items-start gap-3 p-4">
          <IconBadge icon={icon} size="sm" className="flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-sm font-normal text-[#737373]">{label}</p>
            <div className="flex items-center gap-1">
              <p className="text-xl font-semibold text-[#0A0A0A] break-words">
                {value}
              </p>
              {infoTooltip && (
                <HinsTooltip
                  trigger={
                    <InfoIcon
                      className="size-4 text-muted-foreground flex-shrink-0"
                      aria-hidden
                    />
                  }
                  content={infoTooltip.content}
                  href={infoTooltip.href}
                />
              )}
            </div>
            {delta && <SoftBadge>{delta}</SoftBadge>}
          </div>
        </div>
      </Card>
    )
  }

  // Default: vertical layout (original behavior — backward compatible)
  return (
    <Card className="bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden h-full">
      <div className="flex flex-col gap-2 p-4">
        <IconBadge icon={icon} size="sm" />
        <p className="text-sm font-normal text-[#737373]">{label}</p>
        <div className="flex items-center gap-1">
          <p className="text-xl font-semibold text-[#0A0A0A]">{value}</p>
          {infoTooltip && (
            <HinsTooltip
              trigger={<InfoIcon className="size-4 text-muted-foreground" aria-hidden />}
              content={infoTooltip.content}
              href={infoTooltip.href}
            />
          )}
        </div>
        <SoftBadge>{delta}</SoftBadge>
      </div>
    </Card>
  )
}
```

### Uso VERTICAL — default (sin cambios)
```tsx
// Comportamiento idéntico a antes — totalmente backward compatible
<KpiSecondary
  icon={DollarSignIcon}
  label="Ahorro Total Generado (Abril)"
  value="$ 66.400"
  delta="+36% Mes"
/>
```

### Uso VERTICAL con tooltip (caso Tarifa actual — GDD_01)
```tsx
<KpiSecondary
  icon={DollarSignIcon}
  label="Valor de Tarifa Actual"
  value="$ 80 / kWh"
  delta="+ 1.6% Mes"
  infoTooltip={{
    content: "Ver tarifas vigentes",
    href: "#",
  }}
/>
```

### Uso HORIZONTAL (NEW — GDCV_admin_03)
```tsx
<KpiSecondary
  icon={TrendingUpIcon}
  label="Inversión Inicial"
  value="$ 38.000.000"
  delta=""  // delta vacío si no hay comparativo
  layout="horizontal"
/>
```

### Notas para el agente

**VERTICAL (default):**
- Sin borde especial. Card neutral.
- `py-0` obligatorio para neutralizar el `py-4` nativo de shadcn.
- `ring-0` para neutralizar el ring nativo de shadcn.
- `h-full` para que la card estire al alto del contenedor padre (equal height en grid).
- Label puede ser multilínea — no truncar.
- `gap-2` consistente entre todos los elementos internos.
- `p-4` en el wrapper interno (Card es p-0).
- `infoTooltip` es opcional — no incluirlo si no hay información contextual adicional.
- El InfoIcon va siempre a la derecha del value, dentro del mismo flex row.
- ✅ BACKWARD COMPATIBLE — todas las KPIs existentes funcionan sin cambios.

**HORIZONTAL (NEW):**
- Icon va a la izquierda, siempre visible.
- `flex-shrink-0 mt-0.5` en IconBadge para alinear con la primera línea de texto.
- Content (label + value + delta) va a la derecha en columna dentro de `flex-1`.
- `gap-3` entre icon y content para aire visual.
- `min-w-0` en el flex col para permitir text wrapping en valores largos.
- `break-words` en value para valores que no caben en una línea.
- SoftBadge es condicional — mostrar solo si `delta` tiene contenido.
- `h-full` mantiene equal height en grid.
- Usar cuando se necesite layout compacto horizontal (e.g., KPIs lado a lado en columna).

**Compatibilidad & Safety:**
- ✅ `layout` es opcional → default `"vertical"` = comportamiento anterior
- ✅ Todas las props existentes funcionan idénticas
- ✅ Código separado con if/else → path vertical intacto
- ✅ TypeScript strict → no breaking changes

### Casos de uso

| Caso | Layout | Ejemplos |
|------|--------|----------|
| Grid de KPIs vertical (default) | `vertical` (omitir prop) | GDD_01, GDCV_admin_01 |
| KPIs apiladas horizontalmente | `layout="horizontal"` | GDCV_admin_03 Col 1 (Inversión + Ahorrado) |
| Futuro: dashboard resumen | `horizontal` | Próximas vistas |

---

## KpiSecondaryMetric

**Archivo:** `/components/ui/kpi-secondary-metric.tsx`
**Estado:** ✅ Aprobado · integrado en `ParkDetailsCard`, `KpiWithAsset` y fila KPI GDD ROI
**Propósito:** Primitiva label + value heredada de `KpiSecondary` (bloque vertical) **sin** Card, `IconBadge`, `SoftBadge`, `HinsTooltip` ni delta.

### Cuándo usar
- Celdas de un grid 2×2 dentro de `ParkDetailsCard`
- KPIs dentro de `KpiWithAsset` (`size="standard"`)
- Card 3 GDD ROI — layout custom en vista (`GddRoiView`) con `size="standard"`; **no** crear organismo
- Cualquier bloque denso donde haga falta la misma jerarquía tipográfica sin mini-cards

### Cuándo NO usar
- KPI autónoma en grid de cards → `KpiSecondary` o `KpiSecondaryCompact`
- Dato principal de la vista → `KpiPrimary`

### Spec (tipografía vs `KpiSecondary`)

| Elemento | `KpiSecondary` | `KpiSecondaryMetric` |
|---|---|---|
| Label | `text-sm font-normal text-[#737373]` | **igual** |
| Value | `text-xl font-semibold text-[#0A0A0A]` | **`text-base`** (`compact`, default) · **`text-xl`** (`standard`) |
| Contenedor | dentro de `Card` + `p-4` | `flex flex-col gap-1 min-w-0` |

El value en **`text-base`** (no `text-lg` ni `text-xl`) evita saturación visual en grid 2×2 y ayuda a que labels largos (ej. *Ultimo Mantenimiento*) convivan con valores técnicos en columna estrecha.

### Props

```tsx
interface KpiSecondaryMetricProps {
  label: string
  value: string
  size?: "compact" | "standard"  // default compact — standard = text-xl (KpiSecondary)
  align?: "left" | "right"
  valueClassName?: string
  className?: string
}
```

### Uso

```tsx
<KpiSecondaryMetric label="Cap. Instalada" value="1.250 kWp" />
<KpiSecondaryMetric label="Inversión Recuperada" value="u$s 6.000.000" size="standard" />
```

### Notas para el agente
- No envolver en `Card` — `ParkDetailsCard` aporta superficie (`CardWithContent`).
- Colores `#737373` / `#0A0A0A` — misma convención que `KpiSecondary`; no introducir tokens nuevos.
- `tabular-nums` solo en value.
- No refactorizar `KpiSecondary` para componer esta primitiva salvo pedido explícito.

---

## ParkDetailsCard

**Archivo:** `/components/ui/park-details-card.tsx`
**Estado:** ✅ Aprobado · **integrado** en GDD (`/gdd/performance`), GDCV AGC (`/gdcv/performance`) y Socio Mi Espacio (`/gdcv/socio`)
**Hijos:** `CardWithContent`, `KpiSecondaryMetric` × 4, `next/image`
**Propósito:** Organismo de detalle del parque: asset isométrico arriba (full-width, proporcional) + grid 2×2 de métricas compactas.

### Cuándo usar
- Primera columna de la fila superior Performance (junto a chart + columna KPI).
- GDD: `gddParkDetails` en `data/gdd-performance-mock.ts`.
- GDCV AGC: `gdcvParkDetails` en `data/gdcv-mock.ts`.
- GDCV Socio Mi Espacio: `socioParkDetails` en `data/gdcv-socio-mock.ts`.

### Cuándo NO usar
- KPIs con ícono/delta en cards separadas → `KpiSecondary`
- `/gdcv/socio/parque` — sin columna de detalle; grid `SOCIO_PARQUE_TOP_ROW_GRID`
- Reserva vacía → `PerformancePlaceholderCard` (solo donde aún no hay contenido de parque)

### Anatomía

```
CardWithContent(title="", noPadding, h-full)
└── flex h-full min-h-0 flex-col
    ├── div.relative.w-full.shrink-0.leading-none
    │   └── Image (width/height intrínsecos, block h-auto w-full)
    └── div.p-4.flex-1
        └── grid grid-cols-2 gap-4
            └── KpiSecondaryMetric × 4
```

### Props

```tsx
type ParkDetailsMetric = { label: string; value: string }

type ParkDetailsCardProps = {
  imageSrc: string
  imageAlt: string
  metrics: readonly [ParkDetailsMetric, ParkDetailsMetric, ParkDetailsMetric, ParkDetailsMetric]
  className?: string
  imageWidth?: number   // default 478 (PNG GDD)
  imageHeight?: number  // default 347 (PNG GDD)
}
```

### Assets

| Flujo | Ruta pública | Dimensiones default |
|---|---|---|
| GDD (en prod) | `/images/png-assets/asset_gdd.png` | 478 × 347 |
| GDCV (en prod) | `/images/png-assets/asset_gdcv.png` | 478 × 347 |

### Mock GDD (`gddParkDetails`)

| Label | Value ejemplo |
|---|---|
| Cap. Instalada | 1.250 kWp |
| Potencia Acople | 1.020 kWp |
| Equipo | Jinko Tiger Neo 72HL4 |
| Ultimo Mantenimiento | 12 Mar. 2026 |

### Mock GDCV (`gdcvParkDetails`)

| Label | Value ejemplo |
|---|---|
| Cap. Instalada | 980 kWp |
| Potencia Acople | 815 kWp |
| Equipo | Canadian Solar HiKu7 655W |
| Ultimo Mantenimiento | 18 Feb. 2026 |

`imageAlt`: **Parque GDCV**

### Mock Socio Mi Espacio (`socioParkDetails`)

Cuota e infraestructura **del socio** (no totales del parque). Sin **Ultimo Mantenimiento** (evita confusión de responsabilidad O&M con HINS).

Orden = grid 2×2 (fila 1 → fila 2):

| Celda | Label | Value ejemplo |
|---|---|---|
| 1 | Mi Potencia Instalada | 380 kWp |
| 2 | Mi participación | 15% (`socioPorcentaje`) |
| 3 | Equipo | Solar HiKu7 655W |
| 4 | Potencia de Acople | 310 kWp |

### Mock Socio parque (`socioParqueChartMetricRows` — `/gdcv/socio/parque`)

| Fila | Labels | Fuente mock |
|---|---|---|
| 1 | Potencia total instalada · Potencia total de acople | `gdcvParkDetails` (980 / 815 kWp) |
| 2 | Inversión inicial · Inicio de operaciones | `socioRoiMetrics` · `socioRoiSecondaryMetrics` |

Íconos: Zap · Zap · CircleDollarSign · Calendar. Ver FeatureItem → Íconos.

### Layout en página (GDD + GDCV Performance)

> Grid de fila, proporciones `fr`, checklist de impacto y riesgos futuros: **`flows/performance/about-performance-layout.md`**

- Grid: `GDD_PERFORMANCE_TOP_ROW_GRID` en `components/ui/performance-placeholder-card.tsx` (nombre histórico; usado también en GDCV).
- Proporción desktop: **`1.15fr` · `1.85fr` · `340px`** — columna parque ~38% del espacio flexible.
- Vistas: `ParkPerformanceView`, `GdcvPerformanceView`.

```tsx
import { ParkDetailsCard } from "@/components/ui/park-details-card"
import { GDD_PERFORMANCE_TOP_ROW_GRID } from "@/components/ui/performance-placeholder-card"
import { gddParkDetails } from "@/data/gdd-performance-mock"

<div className={GDD_PERFORMANCE_TOP_ROW_GRID}>
  <ParkDetailsCard
    imageSrc={gddParkDetails.imageSrc}
    imageAlt={gddParkDetails.imageAlt}
    metrics={gddParkDetails.metrics}
    className="h-full"
  />
  {/* chart + KPIs */}
</div>
```

### Dev showcase

`app/dev/components/page.tsx` — solo el organismo en `max-w-sm` (sin simular grid completo de la fila).

### Notas para el agente
- Imagen: **sin** `h-*` fijo ni `object-cover`; `block h-auto w-full` + dimensiones intrínsecas → ancho 100% de la card, altura proporcional, pegada al top.
- Esquinas superiores: `overflow-hidden` + `rounded-xl` de `Card` en `CardWithContent`.
- `noPadding` obligatorio en wrapper; padding solo en bloque de métricas (`p-4`).
- `gap-4` en grid interno (siempre); `gap-4 sm:gap-6` entre secciones de página (responsive mobile).
- No duplicar labels de métricas fuera del mock — una fuente por flujo.

---

## KpiSecondaryCompact

**Archivo:** `/components/ui/kpi-secondary-compact.tsx`
**Estado:** ✅ Nuevo
**Propósito:** Datos secundarios en layout horizontal compacto — alternativa a KpiSecondary

### Cuándo usar
Datos de soporte en layout **horizontal compacto**.
Cuando necesitás icon mediano (36×36) + label + value en fila.
Contextos: dashboards, resúmenes, KPIs lado a lado en columna (GDCV_admin_03).

### Cuándo NO usar
- Datos apilados verticalmente → KpiSecondary (default vertical)
- Dato principal de la vista → KpiPrimary
- Métricas simples sin icon → custom layout

### Spec

**Anatomía:**
```
Card [p-0]
  └── flex row, gap-4, p-4
      ├── IconBadge size="md"   (36×36) ← IZQUIERDA
      └── flex col, gap-1, flex-1
          ├── label → text-sm font-normal #737373
          ├── flex row, gap-1, items-center
          │   ├── value → text-xl font-semibold #0A0A0A
          │   └── HinsTooltip (opcional)
          └── SoftBadge (solo si delta presente)
```

| Elemento | Tailwind |
|---|---|
| Card wrapper | `bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden h-full` |
| Layout interno | `flex items-start gap-4 p-4` |
| IconBadge | `size="md" flex-shrink-0 mt-0.5` |
| Content wrapper | `flex flex-col gap-1 flex-1 min-w-0` |
| Label | `text-sm font-normal text-[#737373]` |
| Value row | `flex items-center gap-1` |
| Value | `text-xl font-semibold text-[#0A0A0A] break-words` |
| InfoIcon | `size-4 text-muted-foreground flex-shrink-0` |
| SoftBadge | condicional (solo si delta tiene contenido) |

```tsx
// /components/ui/kpi-secondary-compact.tsx
import { Card } from "@/components/ui/card"
import { HinsTooltip } from "@/components/ui/hins-tooltip"
import { IconBadge } from "@/components/ui/icon-badge"
import { SoftBadge } from "@/components/ui/soft-badge"
import { InfoIcon, type LucideIcon } from "lucide-react"

interface KpiSecondaryCompactProps {
  icon: LucideIcon
  label: string
  value: string
  delta?: string
  /** Si se pasa, muestra un InfoIcon con tooltip al lado del value */
  infoTooltip?: {
    content: string
    href?: string
  }
}

export function KpiSecondaryCompact({
  icon,
  label,
  value,
  delta,
  infoTooltip,
}: KpiSecondaryCompactProps) {
  const showDelta = Boolean(delta?.trim())

  return (
    <Card className="bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden h-full">
      <div className="flex items-start gap-4 p-4">
        <IconBadge icon={icon} size="md" className="flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="text-sm font-normal text-[#737373]">{label}</p>
          <div className="flex items-center gap-1">
            <p className="text-xl font-semibold text-[#0A0A0A] break-words">
              {value}
            </p>
            {infoTooltip && (
              <HinsTooltip
                trigger={
                  <InfoIcon
                    className="size-4 text-muted-foreground flex-shrink-0"
                    aria-hidden
                  />
                }
                content={infoTooltip.content}
                href={infoTooltip.href}
              />
            )}
          </div>
          {showDelta && <SoftBadge>{delta}</SoftBadge>}
        </div>
      </div>
    </Card>
  )
}
```

### Uso
```tsx
<KpiSecondaryCompact
  icon={TrendingUpIcon}
  label="Inversión Inicial"
  value="$ 38.000.000"
  delta=""  // delta opcional — vacío si no hay comparativo
/>

<KpiSecondaryCompact
  icon={DollarSignIcon}
  label="Ahorrado Total (en facturas)"
  value="$ 8.933.000"
  delta="+2.3% Mes"
  infoTooltip={{
    content: "Vs mes anterior",
    href: "#",
  }}
/>
```

### Notas para el agente
- Sin borde especial. Card neutral.
- `py-0` obligatorio para neutralizar el `py-4` nativo de shadcn.
- `ring-0` para neutralizar el ring nativo de shadcn.
- `h-full` para que la card estire al alto del contenedor padre (equal height en grid).
- `gap-4` entre icon y content (mayor que KpiSecondary horizontal que usa gap-3).
- `flex-shrink-0 mt-0.5` en IconBadge para alinear con la primera línea de texto.
- `min-w-0` en el flex col para permitir text wrapping en valores largos.
- `break-words` en value para valores que no caben en una línea.
- SoftBadge es condicional — mostrar solo si `delta` tiene contenido.
- `delta` es opcional (default: `undefined`).
- Diseñado específicamente para layout horizontal compacto.

---

## SoftBadge

**Archivo:** `/components/ui/soft-badge.tsx`
**Estado:** ✅ Aprobado

### Cuándo usar
- Comparativo de período en KpiPrimary y KpiSecondary
- Cualquier dato delta o variación contextual inline
- Cuando se necesita comunicar tendencia con ícono opcional

### Cuándo NO usar
- Estados semánticos (success/warning/error/info) → Alert o Badge nativo shadcn
- Acciones → Button
- Etiquetas de categoría estáticas → Badge nativo

### Spec

| Propiedad | Valor | Tailwind |
|---|---|---|
| Shape | Round | `rounded-full` |
| Background | `lab(91 2.48 3.22 / 0.36)` | `bg-background-subtle` |
| Text color | `--foreground` (#09090B) | `text-foreground` |
| Icon color | `--foreground` (#09090B) | `text-foreground` |
| Text style | XS / Regular | `text-xs font-normal` |
| Padding | 2px top/bottom, 8px left/right | `px-2 py-0.5` |
| Gap interno | 4px | `gap-1` |
| Width | fit-content siempre | `w-fit` — nunca se estira en contenedores flex |
| Left Icon | opcional | prop `icon?: LucideIcon` |
| Closable | false | no implementar |
| Avatar | false | no implementar |

```tsx
// /components/ui/soft-badge.tsx
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface SoftBadgeProps {
  children: React.ReactNode
  icon?: LucideIcon
  className?: string
}

export function SoftBadge({ children, icon: Icon, className }: SoftBadgeProps) {
  return (
    <span className={cn(
      "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5",
      "bg-background-subtle text-foreground text-xs font-normal",
      className
    )}>
      {Icon && <Icon className="size-3 text-foreground" />}
      {children}
    </span>
  )
}
```

### Uso en KPIs
```tsx
// Con ícono
<SoftBadge icon={TrendingUp}>+220 kWh vs mes anterior</SoftBadge>

// Sin ícono
<SoftBadge>+36% Mes</SoftBadge>
```

### Notas para el agente
- Background siempre `bg-background-subtle`. No usar otros colores en estado Primary.
- Ícono opcional — no forzarlo si el contenido es claro sin él.
- No implementar closable ni avatar.
- Para estados semánticos usar **`StatusBadge`** (ver sección siguiente), no Badge nativo inline.
- `w-fit` es parte del spec base — el componente nunca se estira al ancho del contenedor,
  independientemente de si el padre es `flex-col`, `grid` u otro layout. No agregar
  `self-start` ni `w-fit` en los consumidores: ya está garantizado por el componente.

---

## StatusBadge

**Archivo:** `/components/ui/status-badge.tsx`  
**Estado:** ✅ Aprobado

Badge semántico para estados de entidad (live, vigente, activo). Distinto de `SoftBadge` (período/delta neutro) y de `Badge` shadcn base (sin semántica de dominio).

### Cuándo usar
- Estado de un período, contrato o proceso que está **activo/vigente** → `status="current"` ("En Curso")
- Cualquier estado que requiera color semántico (success, warning, error) — agregar variante a `variantStyles`

### Cuándo NO usar
- Comparativos de período o deltas → `SoftBadge`
- Categorías estáticas sin semántica → `Badge` shadcn nativo
- Acciones → `Button`

### Variantes disponibles

| `status` | Color | Texto típico |
|---|---|---|
| `current` | Verde (`green-100 / green-700`) | "En Curso" |

### Spec

| Propiedad | Valor |
|---|---|
| Base | `Badge` shadcn primitivo |
| `current` background | `bg-green-100` |
| `current` text | `text-green-700` |
| Border | `border-transparent` |
| Hover | `hover:bg-green-100` (sin cambio) |

```tsx
// /components/ui/status-badge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const variantStyles = {
  current: "border-transparent bg-green-100 text-green-700 hover:bg-green-100",
} as const

interface StatusBadgeProps {
  status: keyof typeof variantStyles
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <Badge className={cn(variantStyles[status], className)}>
      {children}
    </Badge>
  )
}
```

### Uso

```tsx
// Período en curso
<StatusBadge status="current">En Curso</StatusBadge>

// En slot action de SectionHeader
<SectionHeader
  title="Abril 2026"
  action={<StatusBadge status="current">En Curso</StatusBadge>}
/>
```

### Dónde se usa
- `components/gdcv/CompensacionesTable.tsx` — columna Estado
- `components/mantenimiento/MantenimientoHistorialTable.tsx` — estado de período
- `components/gdcv/SocioEnergyView.tsx` — header del panel derecho (slot action de SectionHeader)

### Notas para el agente
- Extender con nuevas variantes agregando entradas a `variantStyles`. No usar clases inline en consumidores.
- El texto ("En Curso", etc.) siempre va como `children` — el componente no hardcodea strings.
- Reemplaza el patrón anterior: `<Badge className="bg-green-100 text-green-700 border-transparent ...">`.

---

## ModelBadge

**Archivo:** `/components/ui/model-badge.tsx`  
**Estado:** ✅ Aprobado

Badge de identificación del tipo de modelo de parque fotovoltaico. Reemplaza el patrón inline `<Badge className="bg-green-600 ...">GDD</Badge>` disperso en headings y vistas.

### Cuándo usar
- Junto al nombre del parque en headings (H1), para identificar qué modelo es (GDD, GDCV, GDC)
- En selectors/toggles de tipo de proyecto (`NewProjectDialog`)
- En vistas de mantenimiento que reciben `modelType` como prop

### Cuándo NO usar
- Estados live/vigente → `StatusBadge`
- Deltas o períodos comparativos → `SoftBadge`
- Categorías de membresía (ej. "Virtual") → `Badge` shadcn nativo por ahora

### Variantes disponibles

| `model` | Color | Tailwind |
|---|---|---|
| `GDD` | Verde sólido | `bg-green-600 text-white` |
| `GDCV` | Azul sólido | `bg-blue-600 text-white` |
| `GDC` | Ámbar sólido | `bg-amber-600 text-white` |

### Spec

| Propiedad | Valor |
|---|---|
| Base | `Badge` shadcn con `variant="secondary"` |
| Texto | Siempre el nombre del modelo (no acepta `children`) |
| Font | `font-medium` |
| Border | `border-transparent` |
| Hover | Sin cambio visual (`hover:bg-[mismo color]`) |
| `shrink-0` | Siempre — evita que se comprima en flex containers |

```tsx
// /components/ui/model-badge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ParkModel = "GDD" | "GDCV" | "GDC"

const modelStyles: Record<ParkModel, string> = {
  GDD:  "border-transparent bg-green-600 text-white hover:bg-green-600",
  GDCV: "border-transparent bg-blue-600  text-white hover:bg-blue-600",
  GDC:  "border-transparent bg-amber-600 text-white hover:bg-amber-600",
}

export function ModelBadge({ model, className }: { model: ParkModel; className?: string }) {
  return (
    <Badge variant="secondary" className={cn("shrink-0 font-medium", modelStyles[model], className)}>
      {model}
    </Badge>
  )
}
```

### Uso

```tsx
// En un heading junto al nombre del parque
<h1>{parkName}</h1>
<ModelBadge model="GDD" />

// Dinámico (prop recibida)
<ModelBadge model={modelType} />
```

### Dónde se usa
- `components/gdd/GddPageHeading.tsx`
- `components/gdd/GddViewHeader.tsx`
- `components/gdcv/GdcvPageHeading.tsx`
- `components/mantenimiento/ParkMantenimientoView.tsx`
- `components/main/NewProjectDialog.tsx`
- `app/gdc/performance/page.tsx`
- `app/gdc/roi/page.tsx`

### Notas para el agente
- `ParkModel` es el tipo exportado — usarlo en props de componentes que reciben modelo dinámico.
- No acepta `children` — el texto siempre viene del `model` prop.
- Agregar nuevos modelos agregando una entrada a `modelStyles`. Sin tocar el componente.

---

## CardWithContent

**Archivo:** `/components/ui/card-with-content.tsx`
**Estado:** ✅ Aprobado

### Cuándo usar
Card que contiene contenido variable: Chart, List, o cualquier bloque
que necesite header con título + subtítulo + acción opcional.

### Cuándo NO usar
- KPIs → KpiPrimary o KpiSecondary
- Tablas → Table es independiente
- Charts con tabs de rango donde el mobile UX importa → usar `CardWithResponsiveTabs`

### Spec

**Anatomía:**
```
Card [p-0, overflow-hidden]
  └── flex col, gap-4
      ├── Header [p-6 pb-0]
      │   ├── flex col, gap-1          (título + subtítulo)
      │   │   ├── h3 → title
      │   │   └── p  → subtitle (opcional)
      │   └── Header controls (opcional, ml-auto)
      │       ├── TabsForBlocks → tabs de rango (opcional)
      │       └── headerActions → slot libre (ej. TabsForBlocks variant="icon")
      └── Content [p-6 pt-0]
          └── Chart / List / slot libre
```

| Elemento | Tailwind |
|---|---|
| Card wrapper | `bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden` |
| Layout interno | `flex flex-col gap-4` |
| Header | `flex items-start justify-between p-6 pb-0` |
| Title block | `flex flex-col gap-1 flex-1` |
| Title (H3) | `text-lg font-semibold text-foreground` |
| Subtitle | `text-sm font-normal text-muted-foreground` — **oculto en mobile** (`hidden md:block`) |
| TabsForBlocks | `ml-auto` |
| Content | `p-6 pt-0` |

```tsx
// /components/ui/card-with-content.tsx
import { Card } from "@/components/ui/card"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { cn } from "@/lib/utils"

interface Tab {
  value: string
  label: string
}

interface CardWithContentProps {
  title: string
  subtitle?: string
  tabs?: Tab[]
  defaultTab?: string
  activeTab?: string
  onTabChange?: (value: string) => void
  /** Controles extra en header — después de `tabs`. Opcional; no afecta cards sin este prop. */
  headerActions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function CardWithContent({
  title, subtitle, tabs, defaultTab,
  onTabChange, children, className,
}: CardWithContentProps) {
  return (
    <Card className={cn("bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden", className)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between p-6 pb-0">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-sm font-normal text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {tabs && (
            <TabsForBlocks
              tabs={tabs}
              defaultValue={defaultTab}
              onValueChange={onTabChange}
              className="ml-auto"
            />
          )}
        </div>
        <div className="p-6 pt-0">
          {children}
        </div>
      </div>
    </Card>
  )
}
```

### Uso en GDD_01
```tsx
<CardWithContent
  title="Energía Generada del Parque"
  subtitle="Períodos mensuales"
  tabs={[
    { value: "1M", label: "1M" },
    { value: "3M", label: "3M" },
    { value: "6M", label: "6M" },
  ]}
  defaultTab="6M"
  onTabChange={(v) => setPeriod(v)}
>
  <BarChart data={chartData} />
</CardWithContent>
```

### Notas para el agente
- `py-0 ring-0` obligatorios — neutralizan defaults del shadcn nativo.
- Content slot acepta cualquier componente: Chart, List, etc.
- TabsForBlocks es opcional.
- `headerActions` es opcional — solo consumidores que lo pasen renderizan controles extra; el layout de cards existentes no cambia.
- Subtitle es opcional — en mobile se oculta (`hidden md:block`); la granularidad se comunica vía tabs o controles internos (ej. DatePicker en vista 1D).
- Nunca agregar padding al children directamente — el `p-6 pt-0` ya lo cubre.

**GDCV Socio — chart con perspectiva dinero / energía:**
```tsx
<CardWithContent
  title={getSocioV2ChartTitle(chartUnit)}
  subtitle={getSocioV2ChartSubtitle(chartRange)}
  tabs={CHART_RANGE_TABS}
  activeTab={chartRange}
  onTabChange={setChartRange}
  headerActions={
    <TabsForBlocks
      variant="icon"
      tabs={[...SOCIO_V2_UNIT_TABS]}
      value={chartUnit}
      onValueChange={(v) => setChartUnit(v as SocioV2Unit)}
    />
  }
>
  <MonetaryBarChart data={chartData} unit={chartUnit} ... />
</CardWithContent>
```

---

## CardWithResponsiveTabs

**Archivo:** `/components/ui/card-with-responsive-tabs.tsx`
**Estado:** ✅ Aprobado
**Extiende:** `CardWithContent` — misma estructura, layout de tabs responsivo

### Cuándo usar
- Charts que incluyen tabs de rango (1D / 1M / 3M / 6M / 1A / TODO) donde el mobile UX es prioritario
- Cuando el header en mobile quedaría sobrecargado con título + tabs + acciones simultáneos
- Cuando necesitás `mobileContentAfterTabs` (ej. FeatureItems después de los tabs en mobile)

### Cuándo NO usar
- Cards sin tabs → usar `CardWithContent`
- Cards con tabs solo de unidad ($ / ⚡) sin rango → `CardWithContent` + `headerActions`
- Tablas o KPIs → usar sus componentes específicos

### Comportamiento responsivo

| Elemento | Mobile (<640px) | Desktop (≥640px) |
|---|---|---|
| Tabs de rango | **Ocultos en header** → aparecen como **footer** bajo el chart | En header, a la derecha del título |
| `headerActions` | Siempre visibles en header (derecha) | Siempre visibles en header (derecha) |
| Subtitle | Oculto (`hidden`) | Visible (`md:block`) |
| `mobileContentAfterTabs` | Visible debajo de los tabs footer | Oculto (`hidden sm:flex`) |

### Anatomía

```
Desktop (≥640px):
Card
  └── flex-col
      ├── Header [p-4 pb-0, flex-row]
      │   ├── flex-1 → Title [+ Subtitle oculto en mobile]
      │   └── flex-shrink-0 → [RangeTabs (sm:flex)] + [headerActions (siempre)]
      └── Content [p-4 pt-0]
          └── children

Mobile (<640px):
Card
  └── flex-col
      ├── Header [p-4 pb-0, flex-row]
      │   ├── flex-1 → Title
      │   └── flex-shrink-0 → [headerActions solo]
      └── Content [p-4 pt-0]
          ├── children
          ├── RangeTabs footer [sm:hidden, pt-4]
          └── mobileContentAfterTabs [sm:hidden, pt-4] (si se pasa)
```

### Spec visual

| Elemento | Tailwind |
|---|---|
| Card wrapper | `bg-white py-0 shadow-xs ring-0 rounded-xl overflow-hidden` |
| Layout interno | `flex flex-col gap-4` |
| Header | `flex shrink-0 flex-row p-4 pb-0 items-center gap-2 sm:gap-4` |
| Title block | `flex min-w-0 flex-1 flex-col gap-1` (title truncate) |
| Subtitle | `hidden text-sm font-normal text-muted-foreground md:block` |
| Controls (derecha) | `flex flex-shrink-0 items-center gap-2` |
| RangeTabs header | `hidden sm:flex` — oculto en mobile |
| RangeTabs footer | `flex sm:hidden p-4 pt-0` (noPadding) ó `flex sm:hidden pt-4` (con padding) |
| mobileContentAfterTabs | `flex sm:hidden flex-col p-4 pt-0` (noPadding) ó `flex sm:hidden flex-col pt-4` |
| Content area | `flex min-h-0 flex-1 flex-col p-4 pt-0` |

### Props

```tsx
interface CardWithResponsiveTabsProps {
  title: string
  subtitle?: string
  tabs: Tab[]                          // siempre requerido — define ambos (header + footer)
  defaultTab?: string
  activeTab?: string
  onTabChange?: (value: string) => void
  headerActions?: React.ReactNode      // controles extra (ej. toggle $/⚡) — siempre en header
  children: React.ReactNode
  className?: string
  noPadding?: boolean                  // igual que CardWithContent
  allowTooltipOverflow?: boolean       // igual que CardWithContent
  mobileContentAfterTabs?: React.ReactNode  // solo visible en mobile, debajo del tab footer
}
```

### Uso típico — chart de generación con rango

```tsx
<CardWithResponsiveTabs
  title="Energía Generada del Parque"
  subtitle="Períodos mensuales"
  tabs={CHART_RANGE_TABS}
  activeTab={chartRange}
  onTabChange={setChartRange}
  noPadding
>
  <div className="min-h-[300px] flex-1 w-full">
    <ParkEnergyBarChart data={chartData} chartConfig={chartConfig} />
  </div>
</CardWithResponsiveTabs>
```

### Uso con headerActions y mobileContentAfterTabs (GDCV Socio Parque)

```tsx
<CardWithResponsiveTabs
  title={title}
  tabs={CHART_RANGE_TABS}
  activeTab={chartRange}
  onTabChange={setChartRange}
  headerActions={
    <TabsForBlocks variant="icon" tabs={UNIT_TABS} value={unit} onValueChange={setUnit} />
  }
  mobileContentAfterTabs={
    <div className="flex sm:hidden flex-col gap-4">
      {featureItems}
    </div>
  }
  noPadding
>
  {/* Desktop: FeatureItems dentro de children (hidden sm:flex) */}
  <div className="hidden sm:flex flex-col gap-4">
    {featureItems}
  </div>
  <ParkEnergyBarChart ... />
</CardWithResponsiveTabs>
```

### Notas para el agente

- **No duplicar TabsForBlocks** — el componente lo renderiza dos veces internamente (header oculto + footer oculto). Solo pasar `tabs` una vez via prop.
- `headerActions` siempre visible en header (mobile y desktop) — usar para toggles de unidad ($ / ⚡), no para rango.
- **`noPadding`** aplica padding p-4 al footer de tabs; sin `noPadding`, el padding es pt-4.
- El patrón `mobileContentAfterTabs` + children con `hidden sm:flex` resuelve reorden de elementos sin duplicar datos en el DOM.
- `shadow-xs` — consistente con design-system (no `shadow-sm`).
- Usado en: `GddParkPerformanceView`, `GdcvPerformanceView`, `SocioPerformanceView`, `SocioEnergyView`.

---

## Table

**Archivo:** `/components/gdd/ConsumptionHistoryTable.tsx`
**Estado:** ✅ Aprobado
**Dependencias:** TanStack Table, shadcn/ui DropdownMenu, shadcn/ui Button

### Cuándo usar
Tabla de datos históricos por período dentro de una vista de monitoreo.
Siempre independiente — **nunca dentro de `Card`**.

### Cuándo NO usar
- Listas simples sin columnas múltiples → lista con dividers
- Dentro de `Card` → anti-pattern documentado en `ux-guidelines.md`

---

### Spec Visual

| Propiedad | Valor | Tailwind |
|---|---|---|
| Contenedor | Blanco, redondeado, shadow | `bg-white rounded-xl shadow-xs overflow-hidden` |
| Header sección | Título + acción derecha | `p-6 pb-0` |
| Título | H3 | `text-lg font-semibold text-foreground` |
| Alto de fila | 56px | `h-14` |
| Header fila | Sin hover | `hover:bg-transparent` |
| Font header columna | Label muted | `text-sm font-medium text-muted-foreground` |
| Font body | Regular | `text-sm` |
| Font columna Período | Medium muted | `text-sm font-medium text-muted-foreground` |
| Números | Alineados | `tabular-nums` |
| Paginación | Derecha | `justify-end` |

---

### Columnas — GDD_01 Historial de Generación

| id | Header | Ocultable | Visible por defecto |
|---|---|---|---|
| `period` | Período | ❌ Fija | ✅ |
| `energyGenerated` | Energía generada | ✅ | ✅ |
| `energyPurchased` | Energía comprada | ✅ | ✅ |
| `coveragePercent` | Cobertura (%) | ✅ | ✅ |
| `totalConsumption` | Consumo Total | ✅ | ❌ oculta |
| `coverageMoney` | Cobertura ($) | ✅ | ✅ |
| `actions` | — | ❌ Fija | ✅ |

**Regla:** La primera columna (`period`) y la columna de acciones (`actions`) son siempre fijas en visibilidad (`enableHiding: false`). La primera columna además usa **sticky en mobile** (ver pattern abajo).

---

### Pattern: Sticky first column (mobile)

**Cuándo usar:** Tablas con varias columnas en viewports `< md` (640px).

**Comportamiento:**
- Un solo contenedor con scroll horizontal: el wrapper de `Table` (`data-slot="table-container"`, `overflow-x-auto`).
- La columna de referencia (Período, Socio, etc.) permanece visible con `position: sticky; left: 0` solo en `max-md`.
- El resto de columnas se desplazan horizontalmente por debajo.
- Sombra sutil en el borde derecho de la columna sticky al desplazar.

**Column meta:**

```ts
meta: {
  label: "Período",
  sticky: "start",           // pin izquierdo en mobile
  stickyWidth: "default",    // min-w-28 — textos cortos (período)
  // stickyWidth: "wide",    // min-w-44 — avatar + nombre (Socios)
}
```

**Utilidad:** `stickyStartCellClassName(meta)` desde `/lib/table-utils.ts` — aplicar en `TableHead` y `TableCell` junto con las clases de spec.

```tsx
import { stickyStartCellClassName } from "@/lib/table-utils"
import { cn } from "@/lib/utils"

<TableHead
  className={cn(
    "text-sm font-medium text-muted-foreground",
    stickyStartCellClassName(header.column.columnDef.meta)
  )}
>
```

**Filas:** `TableRow` con `className="group h-14"` — `TableRow` usa hover opaco en mobile (`max-md:hover:bg-muted`); la celda sticky usa `max-md:group-hover:bg-muted` para igualar la fila (sin alpha).

**No confundir con:** `enableHiding: false` (“columna fija” = no ocultable en “Ver columnas”).

**No incluir (por ahora):** sticky de la columna `actions` a la derecha.

---

### Pattern: Column Visibility

Reutilizable en cualquier tabla del producto como prop opcional.

**Botón "Ver columnas"** — header de tabla, alineado a la derecha:
- Ícono: `TableIcon` de `lucide-react`
- Variante: `outline`, size `sm`, `shadow-xs`
- Abre `DropdownMenu` con `DropdownMenuCheckboxItem` por cada columna ocultable

```tsx
// Botón trigger
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm" className="gap-2 shadow-xs">
      <TableIcon className="size-4" aria-hidden />
      Ver columnas
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48">
    {table
      .getAllColumns()
      .filter((col) => col.getCanHide())
      .map((col) => (
        <DropdownMenuCheckboxItem
          key={col.id}
          checked={col.getIsVisible()}
          onCheckedChange={(val) => col.toggleVisibility(val)}
        >
          {col.columnDef.meta?.label ?? col.id}
        </DropdownMenuCheckboxItem>
      ))}
  </DropdownMenuContent>
</DropdownMenu>

// Columna fija — no ocultable
{
  accessorKey: "period",
  header: "Período",
  enableHiding: false,
}

// Columna oculta por defecto
const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
  totalConsumption: false,
})
```

---

### Pattern: Column Sorting

Patrón de sorting estándar reutilizable en cualquier tabla del framework HINS usando TanStack Table.

#### Cuándo usar
- Cuando una tabla requiere ordenamiento interactivo, especialmente en reportes, vistas data-heavy y analíticas.
- Útil en columnas numéricas, de fechas, períodos o métricas para permitir análisis rápido.
- Por default, habilitado en todas las tablas con TanStack Table salvo columnas semánticas/acción.

#### Cuándo NO usar
- Sobre la columna `actions` u otras de operaciones/contexto (siempre `enableSorting: false`).
- Columnas de etiquetas/iconos puramente visuales, textos largos, descripciones ricas (usar solo donde el sorting tiene sentido de negocio).
- En listas planas/one-row o cuando la tabla no lo exige.

#### Spec UX

| Propiedad         | Valor                                     | Tailwind                          |
|-------------------|-------------------------------------------|-----------------------------------|
| Interacción       | Click sobre el header de columna           | `cursor-pointer`                  |
| Indicador visual  | Ícono solo cuando `enableSorting: true`    | `pl-2` gap mínimo a label         |
| Estado visual     | - asc: `ArrowUp`<br>- desc: `ArrowDown`<br>- off: `ArrowUpDown` | Icono a la derecha del label, `size-4` `text-muted-foreground` |
| Feedback          | Cambio inmediato del set de filas          | —                                 |
| Head hover        | No hay backgrounds agresivos.              | Minimalismo enterprise/data-heavy. |

#### Reglas de interacción

- 1° click → ascendente (`asc`)
- 2° click → descendente (`desc`)
- 3° click → desactiva sorting (`off`)
- Solo una columna por vez, salvo que explicitamente se requiera multi-sort.
- El ícono refleja el estado de sorting actual de la columna.
- No mostrar icono en columnas `enableSorting: false`.

#### Iconografía aprobada

- `ArrowUpDown` (lucide-react) — sin ordenar
- `ArrowUp` (lucide-react) — orden ascendente
- `ArrowDown` (lucide-react) — orden descendente
- Tamaño: `size-4`
- Color: `text-muted-foreground`
- Ubicación: alineado al label de columna (`flex items-center`)

#### Ejemplo de ColumnDef

```tsx
// Columna sortable
{
  accessorKey: "energyGenerated",
  header: ({ column }) => (
    <button
      type="button"
      className="flex items-center cursor-pointer select-none"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Energía generada
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 size-4 text-muted-foreground" aria-label="Ascendente" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 size-4 text-muted-foreground" aria-label="Descendente" />
      ) : (
        <ArrowUpDown className="ml-2 size-4 text-muted-foreground" aria-label="No ordenado" />
      )}
    </button>
  ),
  enableSorting: true,
  meta: { label: "Energía generada" },
},
// Columna no sortable
{
  id: "actions",
  header: "",
  enableSorting: false,
  enableHiding: false,
  // ...
}
```

#### Ejemplo de header sortable

```tsx
<TableHead>
  {table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <TableHead
          key={header.id}
          className={cn(
            "text-sm font-medium text-muted-foreground",
            header.column.getCanSort() && "cursor-pointer select-none"
          )}
          onClick={
            header.column.getCanSort()
              ? () => header.column.toggleSorting(header.column.getIsSorted() === "asc")
              : undefined
          }
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  ))}
</TableHead>
```

#### Configuración TanStack necesaria

```tsx
import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table"

const [sorting, setSorting] = useState<SortingState>([])

const table = useReactTable({
  data,
  columns,
  state: {
    sorting,
    // ...otros estados (columnVisibility, etc.)
  },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  // ...otros models
})
```

#### Notas para el agente

- El pattern de sorting es estándar, no crear un componente nuevo.
- El sorting UI debe sentirse sutil y alineado al lenguaje visual enterprise-mínimalista.
- Nunca agregar backgrounds de highlight, ni tooltips extra.
- Ordenar sólo donde tenga sentido de análisis para el usuario final.
- Usar siempre `ArrowUpDown`, `ArrowUp`, `ArrowDown` de `lucide-react` (sin modificar).
- No habilitar sorting en la columna de acciones ni "Período" si así lo define la tabla.
- El pattern soporta extensiones (multi-sorting, sorting server-side), pero por defecto es single-column en la UI.

---

### Pattern: Row Actions (menú contextual `⋮`)

Reutilizable en cualquier tabla del producto.

**Implementación:** `DropdownMenu` nativo shadcn/ui en la última columna.
- Sin header visible (`header: ""`)
- `enableHiding: false` — siempre visible
- Alineado a la derecha: `text-right`

**Acciones por defecto:**
- Descargar
- Copiar
- Compartir

```tsx
// Columna de acciones
{
  id: "actions",
  enableHiding: false,
  header: "",
  cell: ({ row }) => (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={`Acciones — ${row.getValue("period")}`}
          >
            <MoreHorizontalIcon className="size-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <DownloadIcon className="size-4 mr-2" aria-hidden />
            Descargar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon className="size-4 mr-2" aria-hidden />
            Copiar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon className="size-4 mr-2" aria-hidden />
            Compartir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
// ...

```


### Pattern: Row Actions (menú contextual `⋮`)

Reutilizable en cualquier tabla del producto.

**Implementación:** `DropdownMenu` nativo shadcn/ui en la última columna.
- Sin header visible (`header: ""`)
- `enableHiding: false` — siempre visible
- Alineado a la derecha: `text-right`

**Acciones por defecto:**
- Descargar
- Copiar
- Compartir

```tsx
// Columna de acciones
{
  id: "actions",
  enableHiding: false,
  header: "",
  cell: ({ row }) => (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={`Acciones — ${row.getValue("period")}`}
          >
            <MoreHorizontalIcon className="size-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <DownloadIcon className="size-4 mr-2" aria-hidden />
            Descargar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon className="size-4 mr-2" aria-hidden />
            Copiar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon className="size-4 mr-2" aria-hidden />
            Compartir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}
```

---

### Implementación completa — ConsumptionHistoryTable

```tsx
// /components/gdd/ConsumptionHistoryTable.tsx
"use client"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
  TableIcon, MoreHorizontalIcon,
  DownloadIcon, CopyIcon, ShareIcon,
} from "lucide-react"
import { type ConsumptionHistoryRow } from "@/data/gdd-performance-mock"

const columns: ColumnDef<ConsumptionHistoryRow>[] = [
  {
    accessorKey: "period",
    enableHiding: false,
    meta: { label: "Período" },
    header: "Período",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground">
        {row.getValue("period")}
      </span>
    ),
  },
  {
    accessorKey: "energyGenerated",
    meta: { label: "Energía generada" },
    header: "Energía generada",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("energyGenerated")}</span>
    ),
  },
  {
    accessorKey: "energyPurchased",
    meta: { label: "Energía comprada" },
    header: "Energía comprada",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("energyPurchased")}</span>
    ),
  },
  {
    accessorKey: "coveragePercent",
    meta: { label: "Cobertura (%)" },
    header: "Cobertura (%)",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("coveragePercent")}</span>
    ),
  },
  {
    accessorKey: "totalConsumption",
    meta: { label: "Consumo Total" },
    header: "Consumo Total",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("totalConsumption")}</span>
    ),
  },
  {
    accessorKey: "coverageMoney",
    meta: { label: "Cobertura ($)" },
    header: "Cobertura ($)",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("coverageMoney")}</span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`Acciones — ${row.getValue("period")}`}
            >
              <MoreHorizontalIcon className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <DownloadIcon className="size-4 mr-2" aria-hidden />
              Descargar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon className="size-4 mr-2" aria-hidden />
              Copiar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShareIcon className="size-4 mr-2" aria-hidden />
              Compartir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

interface ConsumptionHistoryTableProps {
  data: ConsumptionHistoryRow[]
}

export function ConsumptionHistoryTable({ data }: ConsumptionHistoryTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    totalConsumption: false,
  })

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-white rounded-xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <h3 className="text-lg font-semibold text-foreground">
          Historial de Generación
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 shadow-xs">
              <TableIcon className="size-4" aria-hidden />
              Ver columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(val) => col.toggleVisibility(val)}
                >
                  {(col.columnDef.meta as { label?: string })?.label ?? col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="p-6 pt-4 space-y-6">
        <Table aria-label="Historial de generación del parque">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="h-14 hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-sm font-medium text-muted-foreground"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="h-14">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>3</PaginationLink></PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
```

### Mock data requerida

```ts
// En /data/gdd-performance-mock.ts — agregar/actualizar:
export interface ConsumptionHistoryRow {
  period: string
  energyGenerated: string
  energyPurchased: string
  coveragePercent: string
  totalConsumption: string
  coverageMoney: string
}

export const consumptionHistoryMock: ConsumptionHistoryRow[] = [
  { period: "Abril 2026",     energyGenerated: "830 kWh",  energyPurchased: "60 kWh",  coveragePercent: "93%",   totalConsumption: "890 kWh", coverageMoney: "$ 66.400" },
  { period: "Marzo 2026",     energyGenerated: "610 kWh",  energyPurchased: "220 kWh", coveragePercent: "73%",   totalConsumption: "830 kWh", coverageMoney: "$ 48.800" },
  { period: "Febrero 2026",   energyGenerated: "690 kWh",  energyPurchased: "189 kWh", coveragePercent: "78.5%", totalConsumption: "879 kWh", coverageMoney: "$ 55.200" },
  { period: "Enero 2026",     energyGenerated: "780 kWh",  energyPurchased: "20 kWh",  coveragePercent: "97.5%", totalConsumption: "800 kWh", coverageMoney: "$ 62.400" },
  { period: "Diciembre 2025", energyGenerated: "870 kWh",  energyPurchased: "0 kWh",   coveragePercent: "100%",  totalConsumption: "870 kWh", coverageMoney: "$ 69.600" },
  { period: "Noviembre 2025", energyGenerated: "920 kWh",  energyPurchased: "4.2 kWh", coveragePercent: "99.5%", totalConsumption: "924 kWh", coverageMoney: "$ 73.600" },
]
```

### Notas para el agente
- Table es **independiente** — nunca dentro de `Card`.
- `ConsumptionHistoryTable` es el componente concreto para GDD_01.
- El pattern Column Visibility y Row Actions son reutilizables en otras tablas.
- `totalConsumption` oculta por defecto en `columnVisibility` inicial.
- `period` y `actions` tienen `enableHiding: false` — siempre visibles.
- `meta.label` define el texto que aparece en el dropdown "Ver columnas".
- El mock data en `gdd-performance-mock.ts` debe actualizarse: eliminar `differenceKwh`, `difference`, `consumptionCoop`, `coverageKwh`; agregar `energyPurchased`, `totalConsumption`, `coverageMoney` con datos reales.

---

## GenerationSparkline

**Archivo:** `/components/charts/GenerationSparkline.tsx`
**Estado:** ✅ Aprobado
**Usado en:** KpiPrimary, KpiPrimaryCompact

### Cuándo usar
Sparkline de tendencia dentro de KPIs de la familia primary (`KpiPrimary`, `KpiPrimaryCompact`).
Muestra la evolución del dato en el tiempo. Tooltip por punto al hover (default).

### Cuándo NO usar
- Charts principales de una vista → ParkEnergyBarChart u otros
- Fuera de KPIs primary con sparkline

### Spec

| Propiedad | Valor |
|---|---|
| Tipo | Recharts AreaChart |
| Altura | `h-14` (56px) |
| Ancho | `w-full` dentro de wrapper `mx-[-16px]` |
| Stroke | `var(--chart-1)` — Green 500 |
| Fill | gradiente `var(--chart-1)` opacity 0.35 → 0 |
| Dots | false |
| Margin | `left: 0, right: 0, top: 4, bottom: 0` |
| Tooltip | `ChartTooltipContent hideLabel hideIndicator` — activo por default (`showTooltip` true) |

```tsx
// /components/charts/GenerationSparkline.tsx
"use client"

import { Area, AreaChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type GenerationSparklineProps = {
  data: { i: number; value: number }[]
  chartConfig: ChartConfig
  className?: string
}

export function GenerationSparkline({ data, chartConfig, className }: GenerationSparklineProps) {
  return (
    <ChartContainer config={chartConfig} className={className ?? "aspect-auto h-14 w-full"}>
      <AreaChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="fillSpark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          fill="url(#fillSpark)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
```

### Notas para el agente
- Siempre se consume desde `KpiPrimary` o `KpiPrimaryCompact` dentro de `<div className="mx-[-16px]">`.
- No desactivar tooltip salvo caso excepcional documentado en el flow.
- `chartConfig` se importa desde `/data/chart-config` — nunca hardcodear colores.
- `data` requiere `{ i: number; value: number }[]` — el índice `i` es necesario.

---

## GenerationSparkbars

**Archivo:** `/components/charts/GenerationSparkbars.tsx`
**Estado:** ✅ Aprobado
**Patrón:** Variante de GenerationSparkline — bar chart en lugar de area chart
**Usado en:** KpiPrimaryCompact (cuando `sparklineType="bars"`)

### Propósito

Sparkbar (miniatura de bar chart) para mostrar tendencia de generación dentro de KPIs primary compact. Alternativa visual a `GenerationSparkline` — misma altura (`h-14`), mismo contenedor, pero renderizado como barras en lugar de área continua.

### Cuándo usar

- **Dentro de KpiPrimaryCompact** con `sparklineType="bars"` — para resaltar datos discretos por período
- Cuando la tendencia es más importante que los valores exactos
- Cuando el patrón de barras comunica mejor (vs. línea continua) — ej: generación diaria por semana

### Cuándo NO usar

- Sparklines en otros contextos (KpiPrimary, KpiSecondary) — usar `GenerationSparkline`
- Charts principales de una vista → ParkEnergyBarChart, MonetaryBarChart u otros
- Datos continuos donde el área bajo la curva importa

### Props

| Prop | Tipo | Required | Default | Descripción |
|---|---|---|---|---|
| `data` | `{ i: number; value: number }[]` | ✅ | — | Array de puntos: índice + valor |
| `chartConfig` | `ChartConfig` | ✅ | — | Config de colores desde `/data/chart-config` |
| `className` | `string` | ❌ | `"aspect-auto h-14 w-full"` | Clases Tailwind para wrapper |
| `showTooltip` | `boolean` | ❌ | `true` | Mostrar tooltip al hover |

### Spec

| Propiedad | Valor |
|---|---|
| Tipo | Recharts BarChart |
| Altura | `h-14` (56px) — idéntica a GenerationSparkline |
| Ancho | `w-full` dentro de wrapper `mx-[-16px]` (si está en KpiPrimaryCompact) |
| Bar fill | `var(--color-value)` — from chartConfig |
| Bar radius | `[2, 2, 0, 0]` — redondeado solo arriba, muy sutil |
| Bar spacing | Automático según cantidad de puntos (Recharts) |
| Margin | `left: 0, right: 0, top: 0, bottom: 4` |
| Tooltip | `ChartTooltipContent hideLabel hideIndicator` — configurable por prop |
| Dots | ninguno — renderizado como barras, no puntos |

### Implementación

```tsx
// /components/charts/GenerationSparkbars.tsx
"use client"

import { Bar, BarChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type GenerationSparkbarsProps = {
  data: { i: number; value: number }[]
  chartConfig: ChartConfig
  className?: string
  showTooltip?: boolean
}

export function GenerationSparkbars({
  data,
  chartConfig,
  className,
  showTooltip = true,
}: GenerationSparkbarsProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? "aspect-auto h-14 w-full"}
    >
      <BarChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 4 }}>
        {showTooltip && <ChartTooltip content={<ChartTooltipContent hideLabel hideIndicator />} />}
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
```

### Uso en contexto

```tsx
// En KpiPrimaryCompact con sparklineType="bars"
<KpiPrimaryCompact
  icon={ZapIcon}
  label="Energía Generada"
  value="830"
  unit="kWh"
  delta={{ value: 12, trend: "up" }}
  sparklineData={weeklyGenerationData}
  sparklineType="bars"  // ← Activa GenerationSparkbars
  chartConfig={generationChartConfig}
/>

// Más específicamente, dentro del componente KpiPrimaryCompact:
{sparklineData && (
  <div className="mx-[-16px]">
    {sparklineType === "bars" ? (
      <GenerationSparkbars
        data={sparklineData}
        chartConfig={chartConfig}
        showTooltip={true}
      />
    ) : (
      <GenerationSparkline
        data={sparklineData}
        chartConfig={chartConfig}
      />
    )}
  </div>
)}
```

### Comparación: GenerationSparkline vs GenerationSparkbars

| Aspecto | Sparkline (Area) | Sparkbars (Bar) |
|--------|------------------|-----------------|
| Tipo visual | Área continua bajo curva | Barras discretas |
| Mensaje | Tendencia suave, evolución | Valores por período, discreto |
| Radio | Smooth `monotone` | Bars con `radius=[2,2,0,0]` |
| Alternativa | Mejor para datos continuos | Mejor para datos semanales/diarios |
| Tooltip | Punto flotante por hover | Barra seleccionada |
| Default | `GenerationSparkline` | Requiere `sparklineType="bars"` explícito |

### Spec visual

```
┌─────────────────────────────────────────────────┐
│ h-14 (56px) total height                        │
├─────────────────────────────────────────────────┤
│      ║  ║      ║  ║      ║  ║      ║           │  ← barras
│      ║  ║ ║    ║  ║ ║    ║  ║ ║    ║           │
│  ║   ║  ║ ║ ║  ║  ║ ║ ║  ║  ║ ║ ║  ║           │
│  ║ ║ ║  ║ ║ ║  ║  ║ ║ ║  ║  ║ ║ ║  ║           │
│  ║ ║ ║  ║ ║ ║  ║  ║ ║ ║  ║  ║ ║ ║  ║   ║ ║    │
│  ║ ║ ║  ║ ║ ║  ║  ║ ║ ║  ║  ║ ║ ║  ║   ║ ║    │
└─────────────────────────────────────────────────┘
  color: var(--color-value) — dynamic por chartConfig
  radius: 2px arriba, sharp abajo
```

**Margin:** bottom=4px para dar respiro visual.

### Notas para el agente

- ✅ Siempre consumido desde `KpiPrimaryCompact` con `sparklineType="bars"`
- ✅ `data` requiere estructura `{ i: number; value: number }[]` — el índice `i` es obligatorio
- ✅ `chartConfig` desde `/data/chart-config` — **nunca hardcodear colores**
- ✅ `showTooltip` es configurable — por default `true` (igual que GenerationSparkline)
- ⚠️ **Diferencia clave:** GenerationSparkbars usa `BarChart`, no `AreaChart` — ambos deprecan el atributo `dot`
- ❌ No usar fuera de KpiPrimaryCompact — para otros sparklines, usar GenerationSparkline o charts específicos
- ❌ No hardcodear `radius`, `margin`, `fill` — siempre derivados de props o chartConfig

**Validación en mock:**
- Datos de `weeklyGenerationData` (7 puntos por semana)
- Datos de `monthlyGenerationData` (4-5 barras por mes)
- Tooltip muestra valor + unidad con estilos consistentes

---

## ParkEnergyBarChart

**Archivo:** `/components/charts/ParkEnergyBarChart.tsx`
**Estado:** ✅ Aprobado
**Usado en:** GDD_01 — CardWithContent "Energía Generada del Parque"

### Cuándo usar
Bar chart de generación de energía mensual/semanal del parque.
Siempre dentro de `CardWithContent` con chips 1M/3M/6M.

### Spec

| Propiedad | Valor |
|---|---|
| Tipo | Recharts BarChart |
| Altura | `h-[300px]` |
| Barra actual (último índice) | `var(--chart-1)` — Green 500 |
| Barras pasadas | `var(--chart-1-muted)` — Green 500 @ 40% |
| Border radius barra | `[6, 6, 0, 0]` — redondeado solo arriba |
| Bar size | `56px` |
| Label | posición "top", formato `"N kWh"` |
| Grid | vertical: false, `strokeDasharray="3 3"` |
| Ejes | `tickLine: false`, `axisLine: false` |

```tsx
// /components/charts/ParkEnergyBarChart.tsx
"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"

type ParkEnergyBarChartProps = {
  data: { label: string; generated: number }[]
  chartConfig: ChartConfig
}

function barFill(index: number, total: number): string {
  return index === total - 1 ? "var(--chart-1)" : "var(--chart-1-muted)"
}

export function ParkEnergyBarChart({ data, chartConfig }: ParkEnergyBarChartProps) {
  const n = data.length
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
      <BarChart data={data} margin={{ left: 4, right: 8, top: 28, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} className="text-muted-foreground" />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-muted-foreground" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="generated" radius={[6, 6, 0, 0]} barSize={56}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barFill(index, n)} />
          ))}
          <LabelList
            position="top"
            dataKey="generated"
            className="fill-foreground text-[10px] font-medium"
            formatter={(value: unknown) =>
              typeof value === "number"
                ? `${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })} kWh`
                : ""
            }
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
```

### Notas para el agente
- `barFill` determina el color por posición — nunca hardcodear colores en las barras.
- La última barra siempre es `--chart-1` (período actual).
- Barras pasadas siempre `--chart-1-muted`.
- `chartConfig` desde `/data/chart-config` — nunca inline.
- Los datos `{ label, generated }` los provee `/data/gdd-performance-mock.ts` via `getParkEnergySeries(period)`.

---

## MonetaryBarChart

**Archivo:** `/components/charts/MonetaryBarChart.tsx`
**Estado:** ✅ Aprobado
**Usado en:** GDCV Socio — "Mi Ahorro Generado" / "Mi Energía Generada"

### Cuándo usar
Bar chart **apilado** de ahorro por período: autoconsumo virtual (base) + energía inyectada (tope).
Soporta perspectiva en dinero (`unit="dinero"`) o kWh (`unit="energia"`).

### Spec — colores apilados

| Segmento | Token CSS | Valor | Notas |
|---|---|---|---|
| Autoconsumo virtual (base) | `--chart-stack-autoconsumo` | `var(--chart-1)` | Green 500 — serie principal del sistema |
| Energía inyectada (tope) | `--chart-stack-inyectada` | `rgb(251 191 36 / 0.9)` | Tailwind `amber-400` @ 90% opacidad |

**Reglas:**
- Nunca hardcodear `#a8d976`, `#ffc872` u otros hex en el componente.
- `chartConfig` desde `/data/chart-config.ts` → `socioAhorroStackChartConfig`.
- Tooltip custom replica los mismos tokens en los swatches de color.

### Spec — comportamiento

| Propiedad | Valor |
|---|---|
| Tipo | Recharts BarChart apilado (`stackId="a"`) |
| Altura default | `h-[260px]` — consumidor puede override |
| Grid | vertical: false, `strokeDasharray="3 3"` |
| Tooltip | Custom con desglose autoconsumo / inyectada / total |
| Hover cursor | `rgba(0,0,0,0.05)` |
| Densidad | `getChartBarDensity` — tooltip off si hay demasiadas barras |
| Labels sobre barra | `Bar` `label` — total vía `formatCurrency(…, "compact")` si `barCount ≤ 6` |
| Moneda | Prop `currency` (default `ars`); ver [FormatCurrency](#formatcurrency) |

```tsx
import { MonetaryBarChart } from "@/components/charts/MonetaryBarChart"
import { socioAhorroStackChartConfig } from "@/data/chart-config"
import { getSocioAhorroSeries } from "@/data/gdcv-socio-mock"

<MonetaryBarChart
  data={getSocioAhorroSeries("6m")}
  chartConfig={socioAhorroStackChartConfig}
  unit="dinero"
/>
```

### Notas para el agente
- Los tokens `--chart-stack-*` viven en `globals.css` — no confundir con `--energy-autoconsumo` / `--energy-inyectada` (dominio energético, no Recharts).
- El segmento superior (`inyectada`) lleva `radius={[6,6,0,0}` cuando hay ≤16 barras.
- Total del stack vía `label` en el `Bar` de `inyectada` (no `LabelList` — en apilados Recharts no alinea bien); `margin.top` 28px cuando hay labels.
- Ver [FormatCurrency](#formatcurrency) para reglas ARS/USD y modos `full` / `compact` / `axis`.

---

## DailyGenerationChart

**Archivo:** `/components/charts/DailyGenerationChart.tsx`
**Estado:** ✅ Aprobado
**Usado en:** `DailyGenerationChartBlock` — vista **1D / DIA** (chip `1d` en `CHART_RANGE_TABS`) de generación horaria

### Cuándo usar
Area chart de generación intradiaria (kW por hora). Render puro — siempre dentro de `DailyGenerationChartBlock`, nunca directo en la vista.

### Cuándo NO usar
- Rangos agregados (1M / 3M / 6M / 1A / TODO) → `ParkEnergyBarChart`
- Sparkline en KPI → `GenerationSparkline`

### Spec

| Propiedad | Valor |
|---|---|
| Tipo | Recharts AreaChart |
| Altura mínima | `min-h-[300px]` — crece con `flex-1` del contenedor padre |
| Stroke / fill | `var(--color-kw)` desde `dailyGenerationChartConfig` |
| Gradiente fill | `--color-kw` @ 15% → 0% opacidad |
| Eje X | ticks fijos: 06:00, 09:00, 12:00, 15:00, 18:00 |
| Eje Y | oculto |
| Tooltip label | `formatChartHourTooltip` → `"12:00 Hrs"` |
| Tooltip value | kW con 1 decimal (`es-AR`) |
| Animación montaje (tab 1D) | 800ms morph Recharts |
| Animación cambio de día | 500ms morph Recharts |
| Reduced motion | `isAnimationActive={false}` vía `usePrefersReducedMotion` |

### Props

```tsx
interface DailyGenerationChartProps {
  data: { hour: string; kw: number }[]
  className?: string
  animationDuration?: number  // default: 500 — el Block pasa 800 en primer montaje
}
```

### Notas para el agente
- Separación obligatoria: `data` desde mock (`getDailyGenerationData24`), config desde `/data/chart-config`.
- Formato de horas: helpers en `/lib/chart-day-format.ts` — nunca `"12h"`; usar `"12 Hrs"` (inline) o `"12:00 Hrs"` (tooltip).
- No usar `key` en el día — morph entre series, no remount.
- Constantes exportadas: `DAILY_CHART_MOUNT_ANIMATION_MS`, `DAILY_CHART_DAY_CHANGE_ANIMATION_MS`.

---

## DailyGenerationChartBlock

**Archivo:** `/components/charts/DailyGenerationChartBlock.tsx`
**Estado:** ✅ Aprobado
**Usado en:** GDD / GDCV AGC / GDCV Socio — `CardWithContent` "Energía Generada del Parque" cuando tab activo es **`1d`**

### Cuándo usar
Bloque completo de vista diaria: DatePicker + KPIs inline + nav prev/next + `DailyGenerationChart`.

### Cuándo NO usar
- Rangos distintos de 1D → wrapper con `ParkEnergyBarChart`
- Navegación de día fuera del chart → no duplicar; este bloque ya incluye DatePicker y nav

### Anatomía

```
[-mx-4 contenedor flex-1]
├── Header
│   ├── Row 1 mobile / izquierda desktop → DatePicker
│   └── Row 2 mobile (grid 2 cols) / derecha desktop → Acumulado + Pico (inline)
└── Chart area (relative, min-h-[300px], flex-1)
    ├── DailyGenerationChart (full width)
    ├── Button prev (absolute, centrado vertical, overlay)
    └── Button next (absolute, centrado vertical, overlay)
```

### Spec visual

| Elemento | Mobile | Desktop (`md+`) |
|---|---|---|
| Contenedor | `-mx-4 flex-1` — edge-to-edge en card | igual |
| Header | `flex-col gap-4` — picker centrado, KPIs grid 2×50% | `flex-row` — picker izq, KPIs inline derecha |
| KPI labels | `Acumulado:` · `Pico:` | igual |
| KPI peak | `formatDailyPeakLabel` → `"1,4 kW · 12 Hrs"` | igual |
| Nav buttons | solo ícono (`max-md:size-8`), texto en `sr-only` | ícono + fecha corta (`May 4`) |
| Nav position | `absolute left-3/right-3 top-1/2` sobre el chart | igual |
| Chart height | `min-h-[300px] flex-1` — igual que bar chart | igual |

### Props

```tsx
interface DailyGenerationChartBlockProps {
  activeDay: Date
  today: Date
  onActiveDayChange: (day: Date) => void
  data: DailyPoint[]
  totalLabel: string
  peakLabel: string   // usar formatDailyPeakLabel(value, hour)
  className?: string
}
```

### Uso en vista

```tsx
{chartRange === "1d" ? (
  <div className="min-h-[300px] w-full flex-1">
    <DailyGenerationChartBlock
      activeDay={activeDay}
      today={MOCK_TODAY}
      onActiveDayChange={setActiveDay}
      data={dailyChartData}
      totalLabel={dailyTotal}
      peakLabel={formatDailyPeakLabel(dailyPeak.value, dailyPeak.hour)}
      className="h-full min-h-[300px]"
    />
  </div>
) : (
  <div className="min-h-[300px] w-full flex-1">
    <ParkEnergyBarChart ... />
  </div>
)}
```

### Notas para el agente
- El wrapper `min-h-[300px] flex-1` en la vista es obligatorio — paridad de altura con `ParkEnergyBarChart`.
- Socio Performance: debajo del block van `FeatureItem` en `grid grid-cols-2 gap-4` — no dentro del block.
- DatePicker: `/components/ui/date-picker.tsx` — no reimplementar Popover inline.
- `ChartDayNavigator` existe pero **no** se usa en esta vista — preferir `DailyGenerationChartBlock`.

---

## HinsTooltip

**Archivo:** `/components/ui/hins-tooltip.tsx`
**Estado:** ✅ Aprobado
**Fuente:** shadcn/ui Tooltip — comportamiento 100% nativo

### Cuándo usar
- Información contextual adicional sobre un dato o acción.
- Siempre disparado por un elemento trigger explícito (ícono, botón).
- Cuando el contenido es corto: una línea de texto, con o sin textlink.

### Cuándo NO usar
- Contenido largo o estructurado → usar Sheet
- Acciones destructivas → usar Dialog
- Mensajes de estado → usar Alert
- Nunca en hover — siempre click/tap

### Spec

| Propiedad | Valor | Implementación |
|---|---|---|
| Trigger | Click / tap (nunca hover) | `<TooltipProvider delayDuration={0}>` |
| Fondo | `--foreground` (#09090B) Zinc 950 | `bg-foreground` |
| Texto | `--background` (#FFFFFF) | `text-background` |
| Border radius | 6px | `rounded-md` |
| Padding | 8px vertical, 12px horizontal | `py-2 px-3` |
| Font size | 12px | `text-xs` |
| Font weight | 400 | `font-normal` |
| Posición default | Top | `side="top"` |
| Flecha/caret | Visible, color fondo tooltip | nativo shadcn |
| Variante textlink | `underline` sobre texto blanco | ver prop `href` |

**Variantes:**

| Variante | Cuándo usar |
|---|---|
| Solo texto | Información contextual sin acción |
| Con textlink | Cuando hay una acción o navegación asociada (ej. "Ver tarifas vigentes") |

```tsx
// /components/ui/hins-tooltip.tsx
"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface HinsTooltipProps {
  /** Elemento que dispara el tooltip (ej. InfoIcon) */
  trigger: React.ReactNode
  /** Texto principal del tooltip */
  content: string
  /** Si se pasa href, el contenido se renderiza como textlink */
  href?: string
  /** Posición del tooltip. Default: top */
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function HinsTooltip({
  trigger,
  content,
  href,
  side = "top",
  className,
}: HinsTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center cursor-pointer"
            aria-label="Más información"
          >
            {trigger}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn(
            "bg-foreground text-background text-xs font-normal rounded-md py-2 px-3",
            className
          )}
        >
          {href ? (
            <a
              href={href}
              className="underline underline-offset-2 text-background"
            >
              {content}
            </a>
          ) : (
            <p>{content}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

### Casos de uso en el producto

```tsx
// Solo texto
<HinsTooltip
  trigger={<InfoIcon className="size-4 text-muted-foreground" />}
  content="Tarifa vigente según resolución EPEC"
/>

// Con textlink (caso KpiSecondary Tarifa actual)
<HinsTooltip
  trigger={<InfoIcon className="size-4 text-muted-foreground" />}
  content="Ver tarifas vigentes"
  href="#"
/>
```

### Notas para el agente
- `delayDuration={0}` — sin delay, dispara inmediato al click.
- Trigger siempre dentro de un `<button type="button">` — accesible por teclado y tap.
- `asChild` en `TooltipTrigger` para evitar botón anidado si el trigger ya es un botón.
- Nunca usar hover como único trigger — no funciona en mobile.
- Ícono recomendado: `InfoIcon` de `lucide-react`, `size-4`, `text-muted-foreground`.
- `href` es opcional — si no se pasa, el contenido es texto plano.
- No agregar Subtitle, Icon badge ni Avatar — fuera de spec.

---

## StatList

**Archivo:** `/components/ui/stat-list.tsx`
**Estado:** ✅ Aprobado
**Usado en:** Vista Socio GDCV — organismo dentro de Card junto a KpiPrimary

### Cuándo usar
Lista de métricas con nombre y valor. Ideal para desglosar componentes
de un total (ej: ahorro por autoconsumo + ahorro por inyección = total).
Siempre dentro de una `Card`, nunca standalone.

### Cuándo NO usar
- Datos principales de una vista → `KpiPrimary`
- Datos de soporte individuales → `KpiSecondary`
- Tablas con múltiples columnas → `Table`

### Spec

**Anatomía:**
```
flex col, gap-0
  ├── Header row
  │   ├── title → text-sm font-medium text-foreground
  │   └── TabsForBlocks (opcional, ml-auto)
  └── List
      └── StatListItem[] (1..n)
          ├── IconBadge size="sm" (opcional)
          ├── flex col, gap-0.5
          │   ├── name → text-sm font-medium text-foreground
          │   └── subtitle → text-xs text-muted-foreground (opcional)
          └── value → text-sm font-semibold text-foreground tabular-nums ml-auto
```

| Elemento | Tailwind |
|---|---|
| Contenedor lista | `flex flex-col gap-0` |
| Header row | `flex items-center justify-between mb-3` |
| Title | `text-sm font-medium text-foreground` |
| Item row | `flex items-center gap-3 py-3` |
| Item name | `text-sm font-medium text-foreground` |
| Item subtitle | `text-xs font-normal text-muted-foreground` |
| Item value | `text-sm font-semibold text-foreground tabular-nums ml-auto` |
| IconBadge | `size="sm"` — reutiliza el existente (`bg-green-600 text-white`) |

```tsx
// /components/ui/stat-list.tsx
import { IconBadge } from "@/components/ui/icon-badge"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

export interface StatListItem {
  icon?: LucideIcon
  name: string
  subtitle?: string
  value: string
}

interface StatListTab {
  value: string
  label: string
}

interface StatListProps {
  title: string
  items: StatListItem[]
  tabs?: StatListTab[]
  defaultTab?: string
  onTabChange?: (value: string) => void
  className?: string
}

export function StatList({
  title,
  items,
  tabs,
  defaultTab,
  onTabChange,
  className,
}: StatListProps) {
  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {tabs && (
          <TabsForBlocks
            tabs={tabs}
            defaultValue={defaultTab}
            onValueChange={onTabChange}
          />
        )}
      </div>

      {/* Items */}
      <div className="flex flex-col">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 py-3"
          >
            {item.icon && <IconBadge icon={item.icon} size="sm" />}
            <div className="flex flex-col gap-0.5 flex-1">
              <p className="text-sm font-medium text-foreground">
                {item.name}
              </p>
              {item.subtitle && (
                <p className="text-xs font-normal text-muted-foreground">
                  {item.subtitle}
                </p>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground tabular-nums ml-auto">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Uso en vista Socio GDCV (tab Inyección / Energía)

```tsx
const ahorroItems: Record<string, StatListItem[]> = {
  inyeccion: [
    { icon: DollarSignIcon, name: "Por autoconsumo virtual", value: "$ 54.200" },
    { icon: DollarSignIcon, name: "Por Energía Inyectada",   value: "$ 20.200" },
    { icon: WalletIcon,     name: "Total Ahorro en Abril",   value: "$ 74.400",
      subtitle: "De mi 15% del parque" },
  ],
  energia: [
    { icon: DollarSignIcon, name: "Energía asignada",        value: "207.5 kWh" },
    { icon: ZapIcon,        name: "Energía neteada",         value: "185.3 kWh" },
    { icon: WalletIcon,     name: "Total kWh en Abril",      value: "207.5 kWh",
      subtitle: "De mi 15% del parque" },
  ],
}

const [activeTab, setActiveTab] = useState("inyeccion")

<StatList
  title="Ahorro"
  items={ahorroItems[activeTab]}
  tabs={[
    { value: "inyeccion", label: "Inyección" },
    { value: "energia",   label: "Energía" },
  ]}
  defaultTab="inyeccion"
  onTabChange={setActiveTab}
/>
```

### Notas para el agente
- Sin dividers entre items por ahora — solo `py-3` crea la separación visual.
- `icon` es opcional por item — cada item decide si lleva ícono.
- `subtitle` es opcional por item.
- Tabs son opcionales — si no se pasan, el header muestra solo el título.
- El estado del tab activo lo maneja el padre — `StatList` es controlado.
- `IconBadge size="sm"` reutiliza el existente: `bg-green-600 text-white`, `size-6`, ícono `size-3`.
- ⚠️ Pendiente: cuando se implemente `SectionHeader`, el header de este componente migrará a ese patrón.


---

## KpiWithAsset

**Archivo:** `/components/ui/kpi-with-asset.tsx`
**Estado:** ✅ Aprobado · integrado en GDD ROI (`/gdd/roi`, Col 1)
**Hijos:** `Card`, `KpiSecondaryMetric`, slot `asset` (ej. `KpiProgressBar`)
**Export adicional:** `KPI_WITH_ASSET_SECTION_GAP`

### Propósito

Organismo Card KPI + asset visual al fondo (progress bar, timeline, etc.). Tipografía vía `KpiSecondaryMetric` (`size="standard"`). Spacer flexible alinea assets entre cards hermanas en desktop.

### Cuándo usar

- KPI principal + visualización secundaria en la misma card (progreso, timeline)
- Dos KPIs en fila superior + asset abajo (Col 1 ROI: Inversión Recuperada + Pendiente)
- Cuando el asset es un componente intercambiable pasado por prop

### Cuándo NO usar

- Solo label + value sin asset → `KpiSecondaryMetric` o `KpiSecondaryCompact`
- Timeline payback con badge → `KpiWithTimeline` (wrapper sobre este organismo)
- Múltiples KPIs apilados sin asset → layout custom en vista (ver Card 3 GDD ROI)

### Props

| Prop | Tipo | Required | Descripción |
|---|---|---|---|
| `label` | `string` | ✅ | KPI principal |
| `value` | `string` | ✅ | Valor principal (prefijo moneda vía `formatRoiFromUsd` en vista) |
| `headerAction` | `ReactNode` | ❌ | Slot arriba a la derecha (ej. `SoftBadge`) — modo KPI simple |
| `bottomLabel` | `string` | ❌ | Segundo KPI (izquierda en fila dual) |
| `bottomValue` | `string` | ❌ | Valor segundo KPI — requiere `bottomLabel` |
| `asset` | `ReactNode` | ✅ | Componente visual al fondo |
| `className` | `string` | ❌ | Clases adicionales en `Card` |

**Modos:**
- **Simple:** `label` + `value` + `headerAction?` + `asset`
- **Dual KPI:** si `bottomLabel` y `bottomValue` están definidos → fila con dos `KpiSecondaryMetric` (izq. / der. `align="right"`) + `asset`

### Spec

| Elemento | Tailwind / token |
|---|---|
| Card | `flex h-full min-h-0 flex-col bg-white p-6 shadow-xs ring-0 rounded-xl` |
| KPIs | `KpiSecondaryMetric` `size="standard"` |
| Spacer | `KPI_WITH_ASSET_SECTION_GAP` = `min-h-8 flex-1 pt-8 md:min-h-12 md:pt-12` |
| Asset wrapper | `flex shrink-0 flex-col gap-2` |

### Uso (GDD ROI Col 1)

```tsx
<KpiWithAsset
  label="Inversión Recuperada"
  value={formatRoiFromUsd(inversionRecuperada, currency, TIPO_CAMBIO_ARS)}
  bottomLabel="Pendiente de recuperar"
  bottomValue={formatRoiFromUsd(pendienteRecuperar, currency, TIPO_CAMBIO_ARS)}
  asset={
    <KpiProgressBar
      percent={28.5}
      bottomLabels={{
        left: { value: formatCurrency(0, currency) },
        right: { label: "Total Invertido:", value: formatRoiFromUsd(total, currency, TIPO_CAMBIO_ARS) },
      }}
    />
  }
/>
```

### Notas para el agente

- Exportar y reutilizar `KPI_WITH_ASSET_SECTION_GAP` si otra card hermana necesita la misma alineación vertical de assets.
- Card mantiene `h-full` para equal height en grids (`lg:grid-cols-[1fr_1fr_auto]` en ROI).
- No mezclar `headerAction` con modo dual KPI en la misma card.

---

## KpiProgressBar

**Archivo:** `/components/ui/kpi-progress-bar.tsx`
**Estado:** ✅ Aprobado · integrado en GDD ROI (asset de Col 1)
**Tipo exportado:** `KpiProgressBarFootnote`

### Propósito

Barra de progreso gruesa (`h-2`) con nodo interactivo (tooltip) y footnotes opcionales en dos líneas (label + value).

### Cuándo usar

- Progreso de recuperación de inversión u otra métrica % dentro de `KpiWithAsset`
- Cuando se necesitan footnotes alineados con `KpiPaybackTimeline` (misma tipografía `text-[11px]`)

### Cuándo NO usar

- Timeline temporal Inicio → Hoy → Payback → `KpiPaybackTimeline`
- Progress genérico fuera de contexto KPI → evaluar shadcn `Progress`

### Props

| Prop | Tipo | Required | Descripción |
|---|---|---|---|
| `percent` | `number` | ✅ | 0–100; ancho fill + posición nodo tooltip |
| `bottomLabels` | `{ left, right: KpiProgressBarFootnote }` | ❌ | Footnotes bajo la barra |
| `KpiProgressBarFootnote.label` | `ReactNode` | ❌ | Línea superior (ej. `"Total Invertido:"`) |
| `KpiProgressBarFootnote.value` | `ReactNode` | ✅ | Línea inferior (valor) |
| `KpiProgressBarFootnote.align` | `"left"` \| `"right"` | ❌ | Default `left`; usar `right` en columna derecha |

### Spec

| Elemento | Tailwind / token |
|---|---|
| Track | `relative h-2 w-full overflow-hidden rounded-full bg-border` |
| Fill | `width: ${percent}%`, `backgroundColor: var(--chart-3)` |
| Trigger tooltip | Área **fill** completa (`width: ${percent}%`); desktop: hover/focus shadcn `Tooltip`; mobile `<lg`: tooltip abierto por defecto |
| Footnotes | `text-[11px]`, label `font-medium text-muted-foreground`, value `text-muted-foreground tabular-nums` |
| Placeholder sin label | línea invisible `·` para alinear altura con footnotes de timeline |

### Notas para el agente

- **No** unificar track con timeline: progress bar permanece `h-2`; timeline usa track `h-[3px]` en contenedor `h-6`.
- Tooltip vía shadcn `Tooltip` (hover/focus sobre el fill en desktop), no `HinsTooltip`. No usar nodo `size-3` separado — el trigger es la barra rellena.
- Color fill exclusivo chart: `var(--chart-3)`.

---

## KpiPaybackTimeline

**Archivo:** `/components/ui/kpi-payback-timeline.tsx`
**Estado:** ✅ Aprobado · integrado vía `KpiWithTimeline` (GDD ROI Col 2)
**Tipo exportado:** `KpiPaybackTimelineData`

### Propósito

Asset visual de timeline payback: track fino, nodos Inicio / Hoy / Payback, footnotes y tooltip en nodo "Hoy".

### Props

```tsx
interface KpiPaybackTimelineHoy {
  label: string
  fecha: string
  pct: number
  elapsedYears: string // ej. "2.0", "2.2"
}

interface KpiPaybackTimelineData {
  inicio: { label: string; fecha: string }
  hoy: KpiPaybackTimelineHoy
  payback: { label: string; fecha: string }
}

/** Tooltip unificado: `{fecha} · {elapsedYears} Años` — sin % (visible en Card 1). */
formatPaybackTooltipText(fecha, elapsedYears)
```

| Prop | Tipo | Required |
|---|---|---|
| `timelineData` | `KpiPaybackTimelineData` | ✅ |

### Spec

| Elemento | Tailwind / token |
|---|---|
| Contenedor track | `relative flex h-6 w-full items-center` |
| Track base | `absolute inset-x-0 h-[3px] rounded-full bg-border` |
| Track filled | `h-[3px] bg-green-600`, ancho `${pct}%` |
| Nodo Inicio | `size-[10px] bg-green-600`, `left-0` |
| Nodo Hoy | `size-3 bg-green-600 border-2 border-background`, tooltip shadcn |
| Nodo Payback | `size-[10px] bg-border`, `right-0` |
| Label central | `text-[11px] font-medium text-green-600`, posición `${pct}%` |
| Footnotes laterales | `"Inicio:"` / `"Payback:"` + fecha en `text-[11px] text-muted-foreground` |

### Notas para el agente

- `timelineData.hoy.pct` controla fill, nodo Hoy y label central.
- Color acento timeline: `green-600` (clases Tailwind), **distinto** del fill progress bar (`--chart-3`).
- Tooltip nodo Hoy: `formatPaybackTooltipText(hoy.fecha, hoy.elapsedYears)` → ej. `"Mayo 2026 · 2.0 Años"`. Mes/año = qué es “Hoy”; tiempo = línea filled `green-600`. **No** repetir % en tooltip.
- Usar como `asset` de `KpiWithAsset` o vía `KpiWithTimeline`.

---

## KpiWithTimeline

**Archivo:** `/components/ui/kpi-with-timeline.tsx`
**Estado:** ✅ Aprobado · integrado en GDD ROI (`/gdd/roi`, Col 2)
**Composición:** `KpiWithAsset` + `SoftBadge` + `KpiPaybackTimeline`

### Propósito

Wrapper fino para KPI con timeline de payback/recuperación. Delega layout en `KpiWithAsset` y timeline en `KpiPaybackTimeline`.

### Cuándo usar

- Métricas con timeline temporal (Recupero Estimado, payback)
- Badge contextual en header (`metricBadge`, ej. `"Payback"`)

### Cuándo NO usar

- Barra de progreso % → `KpiWithAsset` + `KpiProgressBar`
- KPI simple sin timeline → `KpiSecondaryMetric` / `KpiSecondaryCompact`

### Props

```tsx
type TimelineData = KpiPaybackTimelineData

interface KpiWithTimelineProps {
  label: string
  value: string
  metricBadge?: string
  timelineData: TimelineData
}
```

### Uso

```tsx
<KpiWithTimeline
  label="Recupero Estimado"
  value="7.0 años"
  metricBadge="Payback"
  timelineData={{
    inicio: { label: "Inicio", fecha: "Mayo 2024" },
    hoy: {
      label: "Hoy",
      fecha: "Mayo 2026",
      pct: 28.5,
      elapsedYears: "2.0",
    },
    payback: { label: "Payback", fecha: "Mayo 2031" },
  }}
/>
```

### Notas para el agente

- `metricBadge` se renderiza como `SoftBadge` en `headerAction` — no usar badge muted legacy.
- Re-exporta `TimelineData` como alias de `KpiPaybackTimelineData`.
- No duplicar markup de timeline en vistas; extender `KpiPaybackTimeline` si cambia el asset.

---

### Patrón GDD ROI — Fila superior (Bloque 1)

**Vista:** `/components/gdd/GddRoiView.tsx` · **Flow:** `flows/GDD/flow.md`

| Col | Implementación | Componentes |
|---|---|---|
| 1 | `KpiWithAsset` dual KPI + progress | `KpiProgressBar`, `KpiSecondaryMetric` |
| 2 | `KpiWithTimeline` | `KpiWithAsset`, `KpiPaybackTimeline`, `SoftBadge` |
| 3 | **Layout custom en vista** — sin organismo | `Card` + grid + 3× `KpiSecondaryMetric` |

**Grid:** `grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_auto]`

**Card 3 (TIR · Plazo · Invertido):**
- Mobile: `grid-cols-3` — tres métricas en fila
- Desktop (`lg`): `grid-cols-1` — apiladas verticalmente
- TIR: `valueClassName="text-green-600"`
- Invertido: valor compacto vía `formatRoiFromUsd(..., "axis")` (ej. `u$s 21M`)
- **Decisión explícita:** no componentizar Card 3; patrón circunstancial aprobado

**Tabla inferior:** [GddRoiRecuperoTable](#gddroirecuperotable) — misma instancia en `GdcvRoiView` con mocks `gdcvRoiProyectado` / `gdcvRoiHistorico`.

---

## GddRoiRecuperoTable

**Archivo:** `/components/gdd/GddRoiRecuperoTable.tsx`
**Estado:** ✅ Aprobado
**Usado en:** `/gdd/roi` (`GddRoiView`), `/gdcv/roi` (`GdcvRoiView`)

### Propósito

Tabla TanStack de recupero de inversión con dos variantes (**Proyectado** / **Histórico**), paginación, menú “Ver columnas” y montos vía `formatRoiFromUsdResponsive` según toggle global DOLAR | ARS.

### Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `"proyectado"` \| `"historico"` | — | Tab activo |
| `onVariantChange` | `(v) => void` | — | Controlado desde la vista |
| `currency` | `GddRoiCurrency` (`usd` \| `ars`) | — | Hereda tab del `PageHeading` |
| `proyectadoData` | `GddRoiProyectadoRow[]` | `gddRoiProyectado` | GDCV: `gdcvRoiProyectado` |
| `historicoData` | `GddRoiHistoricoRow[]` | `gddRoiHistorico` | GDCV: `gdcvRoiHistorico` |
| `tipoCambio` | `number` | `TIPO_CAMBIO_ARS` | Conversión USD → ARS |
| `layout` | `"page"` \| `"embedded"` | `"page"` | `page` = bloque en vista ROI; `embedded` = Sheet Socio sin shell blanco/sombra |
| `showColumnVisibility` | `boolean` | `true` | Menú «Ver columnas»; `false` en Sheet Socio para tabs Proyectado \| Histórico a ancho completo |
| `onCurrencyChange` | `(c: GddRoiCurrency) => void` | — | Tabs **DOLAR \| ARS** clickeables en la toolbar (mismo contenedor que Proyectado \| Histórico). Si se omite, no se renderiza: GDD/GDCV ROI heredan la moneda del `PageHeading`. Socio lo usa para cambiar moneda dentro del Sheet (no hay heading ahí) |
| `hideTitle` | `boolean` | `false` | @deprecated — usar `layout="embedded"` |

### Tabs internos

`TabsForBlocks`: **Proyectado** | **Histórico** (no confundir con Performance | ROI del page heading).

### Columnas — Proyectado

| Header (UI) | Campo | Formato |
|---|---|---|
| Período | `periodo` | texto |
| Ahorro Estimado | `ahorroEstimado` | `formatRoiFromUsdResponsive` |
| Pendiente de Recuperar | `pendienteRecuperar` | `formatRoiFromUsdResponsive` |
| Avance de Recuperación | `progresoEstimado` | `N.N%` (sin moneda) |
| Estado | `estado` | `StatusBadge` "En Curso" o texto "Estimado" |

### Columnas — Histórico

| Header (UI) | Campo | Formato |
|---|---|---|
| Período | `periodo` | texto |
| Cap. Recuperado | `capRecuperado` | `formatRoiFromUsdResponsive` |
| Recupero Acumulado | `capRecuperadoAcumulado` | `formatRoiFromUsdResponsive` |
| Avance de Recuperación | `porcentajeRecuperacion` | `N%` (sin moneda) |

> **Nombres canónicos:** usar **Recupero Acumulado** y **Avance de Recuperación** — no "Cap. Recuperado Acumulado" ni "Porcentaje de Recuperación (%)".

### Reglas de labels

- Headers = concepto de negocio **sin** sufijo `(DOLAR)` / `(ARS)`.
- Moneda solo en celdas monetarias vía helper + tab global del heading.

### Uso

```tsx
<GddRoiRecuperoTable
  variant={tablaTab}
  onVariantChange={setTablaTab}
  currency={currency}
  proyectadoData={gdcvRoiProyectado}
  historicoData={gdcvRoiHistorico}
  tipoCambio={TIPO_CAMBIO_ARS}
/>
```

### Notas para el agente

- Datos mock en USD numérico (`data/gdd-roi-mock.ts`, `data/gdcv-agc-mock.ts`); nunca strings `"$38.000.000"` en mocks ROI.
- Reutilizar este componente en GDD y GDCV; no duplicar tabla.
- Socio (`SocioRoiView`): `layout="embedded"`, `showColumnVisibility={false}`; título vía `SheetContentTable`. La moneda es un tab **clickeable** dentro de la toolbar (`onCurrencyChange={handleCurrencyChange}`), junto a Proyectado \| Histórico — convierte los valores y sincroniza `?currency=` (única fuente de verdad, igual que `/gdcv/roi`). **No** usar `CurrencyContextIndicator` solo-lectura en `headerAction` para este caso.
- Flows: `flows/GDD/data-roi.md`, `flows/GDD/flow.md`, `flows/GDCV-agc/GDCV_flow.md`, `flows/GDCV-socio/GDCV_socio_flow.md`.

---

## Sheet — drill-down y anchos

**Primitivo:** `/components/ui/sheet.tsx`  
**OPS (anchos + shell):** `/lib/sheet-layout.ts`, `/components/ui/sheet-ops.tsx`  
**Estado:** ✅ Primitivo shadcn/Radix — composición por vista  
**UX:** `ux-guidelines.md` §3 — drill-down → **Sheet**, no Dialog

### Principio

El **lienzo** (ancho, altura, padding del panel) se define en cada implementación con `className` en `SheetContent`. **No** agregar props de tamaño al primitivo ni cambiar sus defaults globales por un solo caso (tabla Socio, notificaciones, etc.).

### Default del primitivo (sin `className` extra)

| Aspecto | Comportamiento (`side="right"` / `"left"`) |
|---|---|
| Ancho &lt; `sm` | `w-3/4` (~75% viewport) |
| Ancho `sm+` | `w-3/4` con tope `sm:max-w-sm` (~384px) |
| Altura lateral | `h-full` |
| Superficie | `bg-popover`, `shadow-lg` (`design-system.md`) |
| Espaciado interno | `gap-4` en `SheetContent` |

En producto casi siempre se sobrescribe con las clases canónicas de abajo.

### Shell OPS recomendado (contenido estructurado)

Patrón usado en sheets de detalle y tabla (Socio):

| Pieza | Rol |
|---|---|
| `SheetContent` | `p-0 gap-0 overflow-hidden` + ancho canónico |
| `SheetHeader` | `shrink-0`, título (`SheetTitle`), cerrar (`SheetClose` + botón outline icon) |
| Área scroll | `min-h-0 flex-1 overflow-y-auto` + `px-6` (padding del contenido) |
| `SheetFooter` | `shrink-0 border-t`, botón «Cerrar» `outline` `w-full` (opcional en tablas densas) |

`showCloseButton={false}` en `SheetContent` — el cierre va en header (y footer si aplica), no el ghost del primitivo.

### Anchos canónicos (`className` en `SheetContent`)

Usar `sheetContentClassName(profile)` de `/lib/sheet-layout.ts` — no repetir strings sueltos.

| Perfil | API | Uso en producto |
|---|---|---|
| **Detalle** | `sheetContentClassName("detail")` | `SocioDetailSheet`, `SocioPerformanceView`, `MantenimientoDetailSheet` |
| **Notificaciones** | `sheetContentClassName("notifications")` | `GddHeader`, `MainHeader`, `GddViewHeader` |
| **Tabla** | `sheetContentClassName("table")` o `SheetContentTable` | `SocioRoiView` — tabla recupero ROI |

Constantes: `SHEET_CONTENT_BASE`, `SHEET_CONTENT_PROFILE`. Solo estos tres perfiles; otro ancho → acordar en DS antes de implementar.

**Ancho en ≥640px (`sm+`):** los perfiles usan `data-[side=left|right]:sm:max-w-*` para sobrescribir el default del primitivo (`data-[side=right]:sm:max-w-sm`). Sin eso, el tope del perfil `table` **no se aplica** y el sheet queda ~384px.

**Ancho custom por vista** (un solo sheet, sin cambiar el perfil global):

```tsx
<SheetContentTable
  contentClassName="data-[side=right]:sm:max-w-3xl data-[side=left]:sm:max-w-3xl"
  ...
/>
```

O editar `SHEET_CONTENT_PROFILE.table` en `/lib/sheet-layout.ts` si el nuevo ancho es estándar de producto.

### Mobile vs `sm+`

| Viewport | Qué aplica |
|---|---|
| **&lt; 640px (`sm`)** | Clases **sin** prefijo: `w-full`, `max-w-sm` (si está sin `sm:`), etc. **No** aplica `sm:max-w-md` ni `sm:max-w-3xl` (tabla). |
| **`sm` y más** | Entran los topes `sm:max-w-*`. |

- Con `w-full` en mobile el panel suele ocupar **casi todo el ancho** (no el `w-3/4` del primitivo).
- **Ensanchar para tablas** (`sm:max-w-3xl`, perfil `table`) es decisión **tablet/desktop**; en mobile la tabla gana espacio con **scroll horizontal** (`GddRoiRecuperoTable` `layout="embedded"`), no con un sheet más ancho que el viewport.

### Tablas dentro de Sheet

Reutilizar [GddRoiRecuperoTable](#gddroirecuperotable):

| Prop | Valor en sheet |
|---|---|
| `layout` | `"embedded"` — sin `rounded-xl bg-white shadow-xs` ni `Heading` h3 duplicado |
| `showColumnVisibility` | `false` — toolbar sin «Ver columnas» |
| `onCurrencyChange` | `handleCurrencyChange` — tabs **DOLAR \| ARS** clickeables en la toolbar (junto a Proyectado \| Histórico), sincroniza `?currency=` |
| Título del bloque | `SheetTitle` en `SheetHeader` (no título interno de la tabla) |

### Ejemplo — sheet tabla (`SocioRoiView`)

Ver también [SheetOps — composición drill-down](#sheetops--composición-drill-down).

```tsx
<SheetContentTable
  open={sheetOpen}
  onOpenChange={setSheetOpen}
  title="Tabla Recupero de Inversión"
  showFooter={false}
>
  <GddRoiRecuperoTable
    layout="embedded"
    showColumnVisibility={false}
    variant={tablaTab}
    onVariantChange={setTablaTab}
    currency={currency}
    onCurrencyChange={handleCurrencyChange}
    proyectadoData={socioRoiProyectado}
    historicoData={socioRoiHistorico}
    tipoCambio={TIPO_CAMBIO_ARS}
  />
</SheetContentTable>
```

### Notas para el agente

- **Sidebar mobile** usa `Sheet` con ancho propio (`--sidebar-width`) — no mezclar con estos perfiles de drill-down.
- Dentro del sheet: grupos internos → [CardWire](#cardwire); **no** envolver tablas en `Card` con sombra (ver anti-pattern en `ux-guidelines.md`).
- Botones en sheet: cerrar en header puede ser `outline` + `shadow-xs`; acción secundaria en footer `outline` `w-full` (`components.md` § Button).

---

## SheetOps — composición drill-down

**Archivos:** `/components/ui/sheet-ops.tsx`, `/lib/sheet-layout.ts`  
**Estado:** ✅ Aprobado — usar en todo drill-down lateral de producto  
**UX:** `ux-guidelines.md` §3

### Cuándo usar qué

| Necesidad | Componente / API |
|---|---|
| Tabla ancha + tabs variante | `SheetContentTable` |
| Detalle entidad (socio, mantenimiento, listas) | `SheetContentDetail` |
| Solo ancho + piezas sueltas | `sheetContentClassName(profile)` + `SheetOps*` |
| Notificaciones en header | `sheetContentClassName("notifications")` + `SheetOpsNotificationsHeader` |

### Piezas atómicas

| Export | Rol |
|---|---|
| `SheetOpsHeader` | Título + `action?` + `SheetClose` (`bordered` \| `detail`) |
| `SheetOpsNotificationsHeader` | Título + `SheetDescription` (sin icon cerrar) |
| `SheetOpsScroll` | Scroll con padding OPS (`px-6 py-4`) |
| `SheetOpsFooter` | «Cerrar» `outline` `w-full` `shadow-xs` |

### Recetas completas

**`SheetContentTable`** — perfil `table`, header bordered, scroll, footer opcional.

**`SheetContentDetail`** — perfil `detail`, header sin borde inferior, footer opcional.

| Componente | Prop | Default | Uso |
|---|---|---|---|
| `SheetContentTable` | `showFooter` | `false` | `true` si se quiere «Cerrar» duplicado abajo; Socio ROI usa solo X del header |
| `SheetContentTable` | `headerAction` | — | Slot opcional en header antes de cerrar. **Socio ROI ya no lo usa**: la moneda es un tab clickeable en la toolbar de la tabla (`GddRoiRecuperoTable` `onCurrencyChange`) |
| `SheetContentTable` | `contentClassName` | — | Override de ancho `sm+` (misma forma `data-[side=*]:sm:max-w-*`) |
| `SheetContentDetail` | `scrollVariant` | `"padded"` | `"flush"` cuando el hijo lleva `p-6 pt-0` (CardWire, charts en sheet) |
| `SheetContentDetail` | `showFooter` | `true` | `false` en placeholders sin acción de cierre inferior |

### Ejemplo — detalle (`SocioDetailSheet`)

```tsx
<SheetContentDetail
  open={open}
  onOpenChange={onOpenChange}
  title={socio.nombre}
  scrollVariant="flush"
>
  <div className="flex flex-col gap-6 p-6 pt-0">{/* CardWire, StatList, … */}</div>
</SheetContentDetail>
```

### Ejemplo — notificaciones (`GddHeader`)

```tsx
<SheetContent className={sheetContentClassName("notifications")}>
  <SheetOpsNotificationsHeader
    title="Notificaciones del parque"
    description={`Avisos y comunicaciones para ${parkName}. Solo lectura.`}
  />
  <GddNotificationsPanel />
</SheetContent>
```

### Showcase

`/app/dev/components` — sección **SheetOps** (tres perfiles interactivos).

---


## PageHeader

**Archivo:** `/components/ui/page-header.tsx`
**Estado:** ✅ Aprobado
**Usado en:** Header principal de cada vista (GDD_01, GDD_02, todas las vistas futuras)

### Cuándo usar
Siempre en el header principal de una página/vista.
Contiene el H1 (page title) + controles de primer nivel (badges, tabs, acciones).

### Cuándo NO usar
- Headers dentro de cards → `SectionHeader`
- Títulos secundarios → `SectionHeader`

### Spec

| Elemento | Tailwind | Semántica |
|---|---|---|
| Contenedor | `flex items-center justify-between gap-4` | — |
| **H1 (obligatorio)** | `text-4xl font-bold md:text-2xl text-foreground` | page title |
| Badge (opcional) | `px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium` | tipo de parque |
| Tabs (opcional) | `TabsForBlocks` | navegación de vistas |
| Action (opcional) | `Button` / `DropdownMenu` / etc | acción principal |

```tsx
// /components/ui/page-header.tsx
import { cn } from "@/lib/utils"

interface PageHeaderTab {
  value: string
  label: string
}

interface PageHeaderProps {
  /** Título principal de la página. Siempre h1. Obligatorio. */
  title: string
  /** Badge de categoría — tipo de parque (ej: "GDD", "GDCV"). Opcional. */
  badge?: string
  /** Tabs para navegación entre vistas. Opcional. */
  tabs?: PageHeaderTab[]
  defaultTab?: string
  onTabChange?: (value: string) => void
  /** Slot libre para acciones — Button, DropdownMenu, etc. Opcional. */
  action?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  badge,
  tabs,
  defaultTab,
  onTabChange,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 flex-wrap", className)}>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold md:text-4xl text-foreground">
          {title}
        </h1>
        {badge && (
          <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium">
            {badge}
          </span>
        )}
      </div>

      {(tabs || action) && (
        <div className="flex items-center gap-4">
          {tabs && (
            <TabsForBlocks
              tabs={tabs}
              defaultValue={defaultTab}
              onValueChange={onTabChange}
            />
          )}
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
    </div>
  )
}
```

**Nota:** Requiere importar `TabsForBlocks`:
```tsx
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
```

### Casos de uso en el producto

```tsx
// GDD_01 Performance del Parque
<PageHeader
  title="Parque General Roca"
  badge="GDD"
  tabs={[
    { value: "performance", label: "Performance del Parque" },
    { value: "roi", label: "Retorno de Inversión" }
  ]}
  defaultTab="performance"
  onTabChange={(value) => router.push(value === "performance" ? "/gdd/performance" : "/gdd/roi")}
  action={<Button size="sm" variant="ghost"><DownloadIcon className="size-4" /></Button>}
/>

// Sin tabs ni acción — solo H1 + badge
<PageHeader
  title="Mi Energía Generada"
  badge="GDCV"
/>

// Con solo action
<PageHeader
  title="Historial de Compensaciones"
  action={<Button><FilterIcon />Filtrar</Button>}
/>
```

### Notas para el agente
- `title` es **obligatorio** — siempre H1.
- `badge`, `tabs`, `action` son opcionales — combinables libremente.
- En mobile, H1 reduce de `text-4xl` a `text-2xl` automáticamente.
- El contenedor usa `flex-wrap` para que en mobile los elementos se apilen si no caben.
- Badge siempre verde (`bg-green-600`) — color estándar para tipo de parque.
- El slot `action` es flexible — acepta cualquier componente.

---

---

## PeriodSelector

**Archivo:** `/components/ui/period-selector.tsx`
**Estado:** ✅ Aprobado
**Usado en:** Header de tablas con filtro de período (SociosTable, HistorialTable, cualquier vista futura con filtro mensual)

### Cuándo usar
Selector de período mensual (ej. "Abril 2026") para filtrar tablas, KPIs o cualquier bloque de datos
que dependa de un período activo. Siempre en el header de la sección que controla.

### Cuándo NO usar
- Selector de rango temporal en bar charts → `CHART_RANGE_TABS` desde `chart-range-options.ts` (DIA / 1M / 6M / 1A / TODO). Densidad: `lib/chart-bar-density.ts` (tooltip off si >6 barras en mobile o >12 en desktop; labels top solo ≤6 barras).
- Selección de día calendario en vista 1D → `DatePicker` dentro de `DailyGenerationChartBlock`
- Filtros multi-selección → usar Checkbox
- Navegación entre vistas → usar Sidebar o `TabsForBlocks`

### Spec Visual

| Elemento | Tailwind |
|---|---|
| Trigger | `Button variant="outline" size="sm" gap-2 shadow-xs` |
| Ícono izquierdo | `CalendarIcon size-4 text-muted-foreground` |
| Label | período activo como texto (`string`) |
| Chevron | `ChevronDownIcon size-4 text-muted-foreground` |
| Dropdown | `DropdownMenuContent align="end" w-44` |
| Item activo | `font-medium text-foreground` |
| Item inactivo | Nativo shadcn |

### Props

```tsx
// Variante controlada (el padre maneja el estado)
interface PeriodSelectorProps {
  value: string                       // período activo ("Abril 2026")
  onValueChange: (value: string) => void
  options?: string[]                  // por defecto: últimos 6 meses
  className?: string
}

// Variante con estado interno (uso rápido)
interface PeriodSelectorLocalProps {
  defaultValue?: string
  options?: string[]
  onChange?: (value: string) => void
  className?: string
}
```

### Implementación

```tsx
// /components/ui/period-selector.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"

<PeriodSelector
  value={period}
  onValueChange={setPeriod}
/>
```

### Casos de uso en el producto

```tsx
// Variante controlada — el padre gestiona el estado
const [period, setPeriod] = useState("Abril 2026")

<PeriodSelector
  value={period}
  onValueChange={setPeriod}
/>

// Con opciones custom
<PeriodSelector
  value={period}
  onValueChange={setPeriod}
  options={["Jun 2026", "May 2026", "Abr 2026"]}
/>

// Variante local — sin levantar estado
<PeriodSelectorLocal
  defaultValue="Abril 2026"
  onChange={(v) => console.log(v)}
/>
```

### Notas para el agente
- `PeriodSelector` es la variante controlada (el padre provee `value` y `onValueChange`).
- `PeriodSelectorLocal` encapsula el estado interno — ideal para prototipos o cuando no se necesita levantar estado.
- Las opciones por defecto cubren los últimos 6 meses. Pasar `options` cuando el contexto lo requiera.
- Sin lógica de negocio adentro — solo UI y estado local.
- `align="end"` en el dropdown para alinearse al borde derecho del trigger.
- Usar siempre `variant="outline"` — nunca primario, nunca ghost para este control.

---

## DatePicker

**Archivo:** `/components/ui/date-picker.tsx`
**Estado:** ✅ Aprobado
**Dependencias:** `Calendar`, `Popover`, `Button` (shadcn), `formatChartDayPicker` (`/lib/chart-day-format.ts`)

### Cuándo usar
- Selección de **día calendario** en vista diaria (1D) de generación.
- Siempre controlado: el padre provee `value: Date` y `onValueChange`.

### Cuándo NO usar
- Filtro de período mensual agregado (Abril 2026) → `PeriodSelector`
- Rango temporal en bar charts (1M / 3M / 6M) → `TabsForBlocks`
- Navegación prev/next sola → los botones del `DailyGenerationChartBlock` complementan al picker, no lo reemplazan

### Spec Visual

| Elemento | Tailwind |
|---|---|
| Trigger | `Button variant="outline" h-8 justify-start gap-2 px-2.5 text-base font-normal shadow-xs` |
| Ícono izquierdo | `CalendarIcon size-4 text-muted-foreground` |
| Label | fecha activa — default `formatChartDayPicker` → `"Mayo 20, 2026"` |
| Chevron | `ChevronDownIcon size-4 text-muted-foreground ml-auto` |
| Popover | `PopoverContent w-auto p-0` |
| Calendar | shadcn `Calendar mode="single"`, locale `es` |

### Props

```tsx
interface DatePickerProps {
  value: Date
  onValueChange: (date: Date) => void
  disabled?: (date: Date) => boolean
  formatLabel?: (date: Date) => string
  className?: string
  align?: "start" | "center" | "end"
}
```

### Implementación

```tsx
<DatePicker
  value={activeDay}
  onValueChange={setActiveDay}
  disabled={(date) => date > today}
/>
```

### Notas para el agente
- Patrón visual alineado a `PeriodSelector` (outline + CalendarIcon + chevron) pero con `Calendar` en Popover, no DropdownMenu.
- `rounded-md` en trigger — **no** `rounded-full`.
- Fechas futuras: deshabilitar vía prop `disabled` — el Block pasa `date > today`.
- Formato de fecha: extender en `/lib/chart-day-format.ts`, no hardcodear en el componente.

---

## SocioAccessView

**Archivo:** `/components/gdcv/SocioAccessView.tsx`  
**Estado:** ✅ Aprobado (prototipo v1 — Agro Sur)  
**Dependencias:** `InputOTP`, `InputOTPGroup`, `InputOTPSlot` (`/components/ui/input-otp`), `Label`, `Card`, `Button`, `lib/gdcv-socio-auth`

### Cuándo usar

- Pantalla de verificación previa al flujo socio GDCV (`/gdcv/socio/acceso`).
- Primera visita o sesión no verificada antes de mostrar Mi Espacio / El Parque.

### Cuándo NO usar

- Dentro de vistas ya autenticadas del socio.
- Como sustituto de login global HINS o AGC.
- Para otros roles (Dueño GDD, AGC admin).

### Spec visual

| Elemento | Reglas |
|---|---|
| Contenedor | `min-h-[60vh]`, centrado, fondo hereda del shell socio |
| Card | `rounded-xl bg-white shadow-xs p-6 max-w-md` |
| H1 | `text-2xl font-semibold` — "Verificá tu acceso" |
| Subtítulo | `text-sm text-muted-foreground` |
| Label OTP | `text-sm font-medium text-muted-foreground` |
| Slots OTP | 4 dígitos, `size-11`, `rounded-md`, `border-input`, `gap-2` |
| Botón | Primary, `w-full shadow-xs`, disabled si OTP &lt; 4 |
| Error | `text-sm text-destructive`, `role="alert"` |

### Validación (mock v1)

- Solo socio `AS` (Agro Sur Industrial).
- Últimos 4 dígitos del medidor en `gdcv-mock` (`354904` → `4904`).
- Sesión en `sessionStorage` vía `setSocioVerified()` / `isSocioVerified()`.

### Notas para el agente

- Gate en `SocioAuthGate` — no duplicar lógica en cada página socio.
- No mostrar el medidor completo en UI.
- Documentar en `flows/GDCV-socio/GDCV_socio_flow.md` pantalla `GDCV_socio_00`.
- Link compartido desde `SociosTable` → Compartir (solo fila `AS`).
- El flow Socio **nunca** incluye Mantenimiento — ver `product-context.md` §5 (RBAC).

---

## MantenimientoHistorialTable

**Archivo:** `/components/gdcv/MantenimientoHistorialTable.tsx`  
**Vista:** `/components/gdcv/GdcvMantenimientoView.tsx` — ruta `/gdcv/mantenimiento`  
**Estado:** ✅ Prototipo GDCV AGC  
**Dependencias:** TanStack Table, `MantenimientoDetailSheet`, mock `mantenimientoHistorialMock`

### Cuándo usar

- Dashboard **administrativo** del parque (AGC GDCV, Dueño GDD, HINS Admin al entrar al parque).
- Historial de mantenciones por período con costos.

### Cuándo NO usar

- Flow **Socio** — prohibido por RBAC.
- Dentro de `Card` shadcn — usar contenedor `bg-white rounded-xl shadow-xs` (patrón Table §).

### Acceso por rol

| Rol | Acceso |
|---|---|
| HINS Admin, Dueño GDD, AGC | ✅ |
| Socio / Cesionario | ❌ |

### Spec (resumen)

- Título sección: **Historial de Mantenimiento**
- Botón **Nuevo** (estilo Main `ProjectsView`) — placeholder
- Columnas ordenables: Período | Cantidad de Mantenciones | Costos Asociados
- Badge **En Curso** en período activo (verde, igual que `CompensacionesTable`)
- Click fila → `MantenimientoDetailSheet` (contenido pendiente)

### Notas para el agente

- No agregar Mantenimiento al sidebar Socio ni a `GdcvPageHeading` tabs.
- Documentación de negocio: `product-context.md` §5, `flows/GDCV-agc/GDCV_flow.md`.

---


## HinsAlert

**Archivo:** shadcn/ui nativo — `Alert`, `AlertTitle`, `AlertDescription`
**Estado:** ✅ Aprobado
**Fuente:** shadcn/ui Alert — NO crear wrapper custom. Usar el componente nativo directamente con las variantes y tokens del design system.

### Cuándo usar
- Comunicar un estado real al usuario: advertencia, tipo especial de entidad, error, nota contextual.
- Inline dentro del contenido de una vista o Sheet, al inicio del bloque al que aplica.
- Cuando el mensaje tiene jerarquía (título + descripción) o es solo descriptivo (descripción sola).

### Cuándo NO usar
- Como elemento decorativo o de branding — solo cuando hay un estado real que comunicar.
- Para reemplazar tooltips o labels en formularios.
- Más de un Alert del mismo tipo por vista — si se repite, revisar si el problema es estructural.
- Dentro de `CardWithContent` como decoración — solo cuando hay un estado real.

### Variantes

| Variante | Cuándo usar en HINS | Background | Text |
|---|---|---|---|
| `warning` | Socio tipo Virtual, estado pendiente, atención requerida | `#FFFBEB` | `#92400E` |
| `info` | Nota contextual, aclaración de funcionamiento del sistema | `#EFF6FF` | `#1E40AF` |
| `success` | Confirmación de acción completada, estado saludable | `#F0FDF4` | `#166534` |
| `error` | Error de carga, validación fallida, estado crítico | `#FEF2F2` | `#991B1B` |

> Los colores mapean directo a los **Estados Semánticos** de `design-system.md` § 1. No hardcodear hex.

### Props habilitadas

| Slot / Prop | Estado | Notas |
|---|---|---|
| `variant` | ✅ Requerido | Siempre declarar explícitamente. El default de shadcn no se usa en HINS. |
| `AlertTitle` | ✅ Opcional | Título bold. Usar cuando el mensaje necesita jerarquía clara. |
| `AlertDescription` | ✅ Opcional | Cuerpo del mensaje. Puede usarse solo, sin título. |
| Left icon | ❌ Deshabilitado | No incluir íconos en el slot izquierdo — genera ruido visual. |
| Close icon | ❌ Deshabilitado | Los Alerts en HINS son estáticos, no dismissibles. |
| Actions | ❌ Deshabilitado | Las acciones van en botones separados fuera del Alert. |

### Spec Visual

| Propiedad | Valor | Tailwind |
|---|---|---|
| Border radius | 14px | `rounded-xl` |
| Padding | 16px | `p-4` |
| Font título | 14px medium | `text-sm font-medium` |
| Font descripción | 14px regular | `text-sm font-normal` |
| Gap título–descripción | 4px | nativo shadcn |
| Shadow | Ninguno | — |
| Width | Fill del contenedor padre | `w-full` |

### Implementación

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Variante warning — usado en Sheet Socio GDCV (socio tipo Virtual)
<Alert variant="warning">
  <AlertTitle>Socio Virtual</AlertTitle>
  <AlertDescription>
    Dispone de Autoconsumo y Crédito por inyección a red.
  </AlertDescription>
</Alert>

// Variante info — nota contextual sin título
<Alert variant="info">
  <AlertDescription>
    Los datos se actualizan con la lectura mensual de EPEC.
  </AlertDescription>
</Alert>

// Variante error — fallo de carga
<Alert variant="error">
  <AlertTitle>Error al cargar los datos</AlertTitle>
  <AlertDescription>
    No se pudo obtener la información del parque. Intentá de nuevo.
  </AlertDescription>
</Alert>

// Variante success — confirmación de acción
<Alert variant="success">
  <AlertDescription>
    La exportación se completó correctamente.
  </AlertDescription>
</Alert>
```

### Notas para el agente
- Siempre declarar `variant` explícitamente — nunca usar el default sin variante.
- `AlertTitle` es opcional pero recomendado cuando el mensaje tiene más de una línea de descripción.
- No anidar Alerts dentro de otros Alerts.
- No agregar íconos — el color semántico ya comunica el estado por sí solo.
- Los tokens de color semántico están definidos en `design-system.md` § Estados Semánticos — no reinventarlos.
- **Padding contextual:** `p-4` (16px) es el default. Si el Alert aparece como bloque de primer nivel en una vista (no dentro de otro contenedor), considerar `p-6` (24px) para alineación con cards. Pasar `className="p-6"` para sobreescribir si es necesario.
- Para representar categorías energéticas (Autoconsumo / Inyectada) dentro de un Sheet o vista, NO usar Alert — usar los tokens `--energy-autoconsumo` y `--energy-inyectada` definidos en `design-system.md` § Tokens de Dominio Energético.
