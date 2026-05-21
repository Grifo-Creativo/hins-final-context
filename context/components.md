# components.md
# HINS — Componentes UI

> **Este archivo tiene la última palabra en implementación.**
> Cuando hay conflicto entre este archivo y `design-system.md`,
> prevalece este archivo.

---

## Índice

1. [Form Elements (Inputs, Selects, etc)](#form-elements)
2. [InputWithIconButton](#inputwithiconbutton)
3. [Button](#button)
4. [TabsForBlocks](#tabsforblocks)
5. [Card](#card)
6. [CardWire](#cardwire)
7. [FeatureItem](#featureitem)
8. [IconBadge](#iconbadge)
9. [KpiPrimary](#kpiprimary)
10. [KpiSecondary](#kpisecondary)
11. [SoftBadge](#softbadge)
12. [CardWithContent](#cardwithcontent)
13. [Table](#table)
14. [GenerationSparkline](#generationsparkline)
15. [ParkEnergyBarChart](#parkenergybarchar)
16. [DailyGenerationChart](#dailygenerationchart)
17. [DailyGenerationChartBlock](#dailygenerationchartblock)
18. [HinsTooltip](#hinstooltip)

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
  className="shadow-sm"
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
  className="gap-1.5 shadow-sm"
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
    className="size-8 shadow-sm"
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

- Siempre usar `shadow-sm` en botones de acción — es regla de design-system.md
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
- Selector de período temporal (1M / 3M / 6M / 1A / TODO)
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
| Tab activo — shadow | sm | `data-[state=active]:shadow-sm` |
| Tab inactivo — texto | muted-foreground | nativo shadcn |
| Height | Fill contenedor | `h-full` |
| Has Icon | false | No incluir íconos |
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
              data-[state=active]:shadow-sm
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
- No agregar íconos salvo instrucción explícita.

---

## Card

**Archivo:** `/components/ui/card.tsx`
**Estado:** ✅ Aprobado v2
**Fuente:** shadcn/ui Card — sin variantes

### Cuándo usar
Superficie neutral que contiene: KpiPrimary, KpiSecondary, CardWithContent.

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
| Shadow | 0px 1px 2px -1px #000000 | `shadow-sm` |
| Padding | 0 | `p-0` |
| Overflow | hidden | `overflow-hidden` |

```tsx
// /components/ui/card.tsx
// shadcn nativo — se usa directamente sin wrapper custom.
// El shadcn nativo incluye py-4 por defecto. Overridear siempre con py-0.
// Clases base que todo consumidor debe respetar:
//   bg-white rounded-xl shadow-sm py-0 overflow-hidden
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
<Card className="py-0 shadow-sm">...</Card>

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

### Spec

| Propiedad | Valor | Tailwind |
|---|---|---|
| Background | Shell background | `bg-[#F2ECE9]/36` |
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
      <div className="flex flex-col gap-1 rounded-md bg-[#F2ECE9]/36 p-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tabular-nums text-[#0A0A0A]">{value}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-[#F2ECE9]/36 p-4">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xl font-semibold tabular-nums text-[#0A0A0A]">{value}</p>
    </div>
  )
}
```

### Uso en contexto

```tsx
// Horizontal (default) — al cierre de un desglose
<FeatureItem label="Ahorro Generado" value="$62.000" />

// Vertical — en grid 2 columnas (Medidor | Participación)
<div className="grid grid-cols-2 gap-4">
  <FeatureItem orientation="vertical" label="Nº de Medidor" value="3551118" />
  <FeatureItem orientation="vertical" label="Participación (%)" value="25%" />
</div>

// Con ícono — grid 2×2 bajo chart diario (Socio Performance)
<div className="grid grid-cols-2 gap-4">
  <FeatureItem label="Potencia Instalada" value="380 kWp" icon={ZapIcon} />
  <FeatureItem label="Potencia de Acople" value="310 kWp" icon={CircleDollarSignIcon} />
</div>
```

### Notas para el agente
- `orientation` default es `"horizontal"` — no hace falta declararlo para el caso estándar
- Con `icon`, en mobile el layout colapsa a columna (ícono arriba) para permitir `grid-cols-2` sin overflow
- En `"vertical"` el label usa `text-xs` (12px) — es un caption, no un título
- En `"vertical"` el value usa `text-[#0A0A0A]` — mismo que KpiSecondary para consistencia
- `tabular-nums` en value siempre — alineación correcta de números
- `bg-[#F2ECE9]/36` — mismo fondo sutil del shell, consistente con SoftBadge
- Spacing en CardWire: `gap-6` entre rows, `gap-4` entre elementos internos

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
| Background | `bg-green-600` | `bg-[#F2ECE9]/36` | `bg-[#F2ECE9]/36` |
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
    md: "size-9 rounded-md bg-[#F2ECE9]/36 text-green-600",
    lg: "size-12 rounded-md bg-[#F2ECE9]/36 text-green-600",
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
| Card wrapper | nativo (sin borde, solo shadow-sm) |
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
- Sin borde gradiente. Card neutral nativo (shadow-sm).
- Sparkline es edge-to-edge usando `mx-[-16px]` en wrapper.
- Sparkline es opcional — solo se renderiza si `sparklineData.length > 0`.
- `unit` es opcional.
- 1 por vista máximo. Si hay duda → KpiSecondary.

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
| Card wrapper | `bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden h-full` | idem |
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
      <Card className="bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden h-full">
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
    <Card className="bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden h-full">
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
  value="$66.400"
  delta="+36% Mes"
/>
```

### Uso VERTICAL con tooltip (caso Tarifa actual — GDD_01)
```tsx
<KpiSecondary
  icon={DollarSignIcon}
  label="Valor de Tarifa Actual"
  value="$80 / kWh"
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
  value="$38.000.000"
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
| Card wrapper | `bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden h-full` |
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
    <Card className="bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden h-full">
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
  value="$38.000.000"
  delta=""  // delta opcional — vacío si no hay comparativo
/>

<KpiSecondaryCompact
  icon={DollarSignIcon}
  label="Ahorrado Total (en facturas)"
  value="$8.933.000"
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
| Background | #F2ECE9 @ 36% | `bg-[#F2ECE9]/36` |
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
      "bg-[#F2ECE9]/36 text-foreground text-xs font-normal",
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
- Background siempre `bg-[#F2ECE9]/36`. No usar otros colores en estado Primary.
- Ícono opcional — no forzarlo si el contenido es claro sin él.
- No implementar closable ni avatar.
- Para estados semánticos usar Badge nativo de shadcn/ui sin modificar.
- `w-fit` es parte del spec base — el componente nunca se estira al ancho del contenedor,
  independientemente de si el padre es `flex-col`, `grid` u otro layout. No agregar
  `self-start` ni `w-fit` en los consumidores: ya está garantizado por el componente.

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

### Spec

**Anatomía:**
```
Card [p-0, overflow-hidden]
  └── flex col, gap-4
      ├── Header [p-6 pb-0]
      │   ├── flex col, gap-1          (título + subtítulo)
      │   │   ├── h3 → title
      │   │   └── p  → subtitle (opcional)
      │   └── TabsForBlocks (opcional, ml-auto)
      └── Content [p-6 pt-0]
          └── Chart / List / slot libre
```

| Elemento | Tailwind |
|---|---|
| Card wrapper | `bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden` |
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
  onTabChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function CardWithContent({
  title, subtitle, tabs, defaultTab,
  onTabChange, children, className,
}: CardWithContentProps) {
  return (
    <Card className={cn("bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden", className)}>
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
- Subtitle es opcional — en mobile se oculta (`hidden md:block`); la granularidad se comunica vía tabs o controles internos (ej. DatePicker en vista 1D).
- Nunca agregar padding al children directamente — el `p-6 pt-0` ya lo cubre.

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
| Contenedor | Blanco, redondeado, shadow | `bg-white rounded-xl shadow-sm overflow-hidden` |
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
- Variante: `outline`, size `sm`, `shadow-sm`
- Abre `DropdownMenu` con `DropdownMenuCheckboxItem` por cada columna ocultable

```tsx
// Botón trigger
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm" className="gap-2 shadow-sm">
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <h3 className="text-lg font-semibold text-foreground">
          Historial de Generación
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 shadow-sm">
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
  { period: "Abril 2026",     energyGenerated: "830 kWh",  energyPurchased: "60 kWh",  coveragePercent: "93%",   totalConsumption: "890 Kwh", coverageMoney: "$66.400" },
  { period: "Marzo 2026",     energyGenerated: "610 kWh",  energyPurchased: "220 kWh", coveragePercent: "73%",   totalConsumption: "830 Kwh", coverageMoney: "$48.800" },
  { period: "Febrero 2026",   energyGenerated: "690 kWh",  energyPurchased: "189 kWh", coveragePercent: "78.5%", totalConsumption: "879 Kwh", coverageMoney: "$55.200" },
  { period: "Enero 2026",     energyGenerated: "780 kWh",  energyPurchased: "20 kWh",  coveragePercent: "97.5%", totalConsumption: "800 Kwh", coverageMoney: "$62.400" },
  { period: "Diciembre 2025", energyGenerated: "870 kWh",  energyPurchased: "0 kWh",   coveragePercent: "100%",  totalConsumption: "870 Kwh", coverageMoney: "$69.600" },
  { period: "Noviembre 2025", energyGenerated: "920 kWh",  energyPurchased: "4.2 kWh", coveragePercent: "99.5%", totalConsumption: "924 Kwh", coverageMoney: "$73.600" },
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
**Usado en:** KpiPrimary

### Cuándo usar
Sparkline de tendencia dentro de KpiPrimary.
Muestra la evolución del dato principal en el tiempo.

### Cuándo NO usar
- Charts principales de una vista → ParkEnergyBarChart u otros
- Fuera de KpiPrimary

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
| Tooltip | `ChartTooltipContent hideIndicator` |

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
- Siempre se consume desde KpiPrimary dentro de `<div className="mx-[-16px]">`.
- `chartConfig` se importa desde `/data/chart-config` — nunca hardcodear colores.
- `data` requiere `{ i: number; value: number }[]` — el índice `i` es necesario.

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

## DailyGenerationChart

**Archivo:** `/components/charts/DailyGenerationChart.tsx`
**Estado:** ✅ Aprobado
**Usado en:** `DailyGenerationChartBlock` — vista **1D / DIARIO** de generación horaria

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
    { icon: DollarSignIcon, name: "Por autoconsumo virtual", value: "$54.200" },
    { icon: DollarSignIcon, name: "Por Energía Inyectada",   value: "$20.200" },
    { icon: WalletIcon,     name: "Total Ahorro en Abril",   value: "$74.400",
      subtitle: "De mi 25% del parque" },
  ],
  energia: [
    { icon: DollarSignIcon, name: "Energía asignada",        value: "207.5 kWh" },
    { icon: ZapIcon,        name: "Energía neteada",         value: "185.3 kWh" },
    { icon: WalletIcon,     name: "Total kWh en Abril",      value: "207.5 kWh",
      subtitle: "De mi 25% del parque" },
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

## KpiWithTimeline

**Archivo:** `/components/ui/kpi-with-timeline.tsx`
**Estado:** ✅ Nuevo
**Propósito:** KPI especializado para métricas con timeline de recuperación/proyección

### Cuándo usar
- Métricas con componente temporal visual (payback, recuperación, timeline)
- Contextos financieros que requieren mostrar progreso en el tiempo
- Cuando un KPI tiene badge adicional (TIR, meta, etc) + timeline

### Cuándo NO usar
- KPI simple sin timeline → KpiSecondaryCompact
- Dato principal → KpiPrimary
- Múltiples métricas sin timeline → múltiples KpiSecondaryCompact

### Spec

**Anatomía:**
```
Card [p-0]
  └── flex col, gap-4, p-6
      ├── Header row (flex items-start justify-between)
      │   ├── label → text-sm font-normal #737373
      │   └── metricBadge (opcional) → text-xs font-semibold
      │
      ├── value → text-xl font-semibold #0A0A0A
      │
      └── Timeline section (flex col gap-3)
          ├── Track + nodes (relative positioning)
          │   ├── Track base: h-[3px] rounded-full bg-border
          │   ├── Track filled: % ancho, backgroundColor #27500A
          │   ├── Node Inicio: size-[10px] left-0 #27500A
          │   ├── Node Hoy: size-3 con HinsTooltip (pct%)
          │   └── Node Payback: size-[10px] right-0 bg-border
          │
          └── Labels (text-[11px])
              ├── Inicio (left)
              ├── Hoy · pct% (center, colored #27500A)
              └── Payback (right)
```

| Elemento | Tailwind |
|---|---|
| Card wrapper | `bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden h-full` |
| Layout | `flex flex-col gap-4 p-6` |
| Header | `flex items-start justify-between gap-2` |
| Label | `text-sm font-normal text-[#737373]` |
| Badge | `rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground` |
| Value | `text-xl font-semibold text-[#0A0A0A] tabular-nums` |
| Timeline | `flex flex-col gap-3 mt-2` |
| Track nodes | `relative height-24` |
| Timeline labels | `text-[11px]` |

```tsx
// /components/ui/kpi-with-timeline.tsx
import { Card } from "@/components/ui/card"
import { HinsTooltip } from "@/components/ui/hins-tooltip"

interface TimelineData {
  inicio: { label: string; fecha: string }
  hoy: { label: string; fecha: string; pct: number; tooltipText: string }
  payback: { label: string; fecha: string }
}

interface KpiWithTimelineProps {
  label: string
  value: string
  metricBadge?: string
  timelineData: TimelineData
}

const TIMELINE_GREEN = "#27500A" as const

export function KpiWithTimeline({
  label,
  value,
  metricBadge,
  timelineData,
}: KpiWithTimelineProps) {
  const pct = timelineData.hoy.pct

  return (
    <Card className="bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden h-full">
      <div className="flex flex-col gap-4 p-6">
        {/* Header row: label + optional badge */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-normal text-[#737373]">{label}</p>
          {metricBadge && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground flex-shrink-0">
              {metricBadge}
            </span>
          )}
        </div>

        {/* Value */}
        <p className="text-xl font-semibold text-[#0A0A0A] tabular-nums">
          {value}
        </p>

        {/* Timeline section */}
        <div className="flex flex-col gap-3 mt-2">
          {/* Track + nodes */}
          <div className="relative flex items-center" style={{ height: 24 }}>
            {/* Track base (full) */}
            <div className="absolute inset-x-0 h-[3px] rounded-full bg-border" />

            {/* Track filled (Inicio → Hoy) */}
            <div
              className="absolute left-0 h-[3px] rounded-full"
              style={{ width: `${pct}%`, backgroundColor: TIMELINE_GREEN }}
            />

            {/* Node: Inicio */}
            <div
              className="absolute left-0 -translate-x-1/2 size-[10px] rounded-full"
              style={{ backgroundColor: TIMELINE_GREEN }}
            />

            {/* Node: Hoy (with HinsTooltip) */}
            <div className="absolute -translate-x-1/2" style={{ left: `${pct}%` }}>
              <HinsTooltip
                trigger={
                  <div
                    className="size-3 rounded-full cursor-pointer"
                    style={{
                      backgroundColor: TIMELINE_GREEN,
                      border: "2px solid var(--background)",
                      boxShadow: `0 0 0 2px ${TIMELINE_GREEN}`,
                    }}
                  />
                }
                content={timelineData.hoy.tooltipText}
              />
            </div>

            {/* Node: Payback */}
            <div className="absolute right-0 translate-x-1/2 size-[10px] rounded-full bg-border" />
          </div>

          {/* Labels */}
          <div className="relative flex justify-between">
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] font-medium text-foreground">
                {timelineData.inicio.label}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {timelineData.inicio.fecha}
              </p>
            </div>

            <div
              className="absolute flex -translate-x-1/2 flex-col items-center gap-0.5"
              style={{ left: `${pct}%` }}
            >
              <p
                className="text-[11px] font-medium"
                style={{ color: TIMELINE_GREEN }}
              >
                {timelineData.hoy.label}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {timelineData.hoy.fecha}
              </p>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <p className="text-[11px] font-medium text-foreground">
                {timelineData.payback.label}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {timelineData.payback.fecha}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
```

### Uso
```tsx
<KpiWithTimeline
  label="Recupero Estimado"
  value="6.8 años"
  metricBadge="TIR 18.5"
  timelineData={{
    inicio: { label: "Inicio", fecha: "Mar 2024" },
    hoy: {
      label: "Hoy · 37%",
      fecha: "May 2026",
      pct: 37,
      tooltipText: "Hoy · 2.2 años · 37% recuperado",
    },
    payback: { label: "Payback", fecha: "Mar 2030" },
  }}
/>
```

### Notas para el agente
- `metricBadge` es opcional — si no se pasa, no se renderiza
- `value` siempre requerido — dato principal
- `timelineData.hoy.pct` controla la posición del nodo "Hoy" y ancho de la línea filled
- Color #27500A (verde oscuro) es hardcodeado como `TIMELINE_GREEN` — constante interna
- HinsTooltip en nodo "Hoy" → click/tap, NO hover
- Timeline es visual estática — NO interactivo (excepto tooltip)
- Card mantiene `h-full` para equal height en grids
- Diseñado para ROI, payback, y proyecciones financieras

---

## SectionHeader

**Archivo:** `/components/ui/section-header.tsx`
**Estado:** ✅ Aprobado
**Usado en:** `CardWithContent`, `StatList`, `ConsumptionHistoryTable` y cualquier bloque que necesite título + acción opcional.

### Cuándo usar
Siempre que un bloque, card o sección necesite un título con acción opcional a la derecha.
Es el patrón unificado de header para todo el producto.

### Cuándo NO usar
- Títulos de página (`h1`) → usar directamente en el layout de la vista
- Labels inline dentro de componentes → usar `<p>` con clases Tailwind

### Spec

**Dos tamaños según jerarquía semántica:**

| size | Tag | Tailwind desktop | Tailwind mobile | Uso |
|---|---|---|---|---|
| `md` | `h3` | `text-lg font-semibold` | `text-base font-semibold` | Header principal de card o bloque |
| `sm` | `h4` | `text-sm font-medium` | `text-sm font-medium` | Sub-sección dentro de card |

**Slot `action` — acepta cualquier componente:**
- `TabsForBlocks` — filtros de período o navegación
- `DropdownMenu` — acciones de tabla
- `Button` — acción principal
- `Select` — selector de período
- `null` — sin acción (solo título)

| Elemento | Tailwind |
|---|---|
| Contenedor | `flex items-center justify-between gap-4` |
| Title `md` | `text-base font-semibold md:text-lg text-foreground` |
| Title `sm` | `text-sm font-medium text-foreground` |
| Action slot | `ml-auto flex-shrink-0` |

```tsx
// /components/ui/section-header.tsx
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  /** Jerarquía semántica. md = h3 (card principal). sm = h4 (sub-sección). */
  size?: "md" | "sm"
  /** Slot libre — TabsForBlocks, DropdownMenu, Button, Select, etc. */
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({
  title,
  size = "md",
  action,
  className,
}: SectionHeaderProps) {
  const isMd = size === "md"

  const titleClass = isMd
    ? "text-base font-semibold md:text-lg text-foreground"
    : "text-sm font-medium text-foreground"

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {isMd ? (
        <h3 className={titleClass}>{title}</h3>
      ) : (
        <h4 className={titleClass}>{title}</h4>
      )}
      {action && (
        <div className="ml-auto flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}
```

### Casos de uso en el producto

```tsx
// CardWithContent — header principal (h3)
<SectionHeader
  size="md"
  title="Energía Generada del Parque"
  action={
    <TabsForBlocks
      tabs={[{ value: "1m", label: "1M" }, { value: "3m", label: "3M" }, { value: "6m", label: "6M" }]}
      defaultValue="6m"
      onValueChange={setRange}
    />
  }
/>

// StatList — sub-sección dentro de card (h4)
<SectionHeader
  size="sm"
  title="Ahorro"
  action={
    <TabsForBlocks
      tabs={[{ value: "inyeccion", label: "Inyección" }, { value: "energia", label: "Energía" }]}
      defaultValue="inyeccion"
      onValueChange={setTab}
    />
  }
/>

// Table — header principal sin acción de tabs (h3)
<SectionHeader
  size="md"
  title="Historial de Generación"
  action={
    <Button variant="outline" size="sm" className="gap-2 shadow-sm">
      <TableIcon className="size-4" aria-hidden />
      Ver columnas
    </Button>
  }
/>

// Solo título, sin acción
<SectionHeader size="md" title="Retorno de Inversión" />
```

### Notas para el agente
- `size="md"` → `h3` semántico. `size="sm"` → `h4` semántico. Nunca invertir.
- El tag semántico define jerarquía en el documento — ver `ux-guidelines.md` §10.
- `action` es un slot libre — no acoplar tipos específicos.
- En mobile, `size="md"` reduce de `text-lg` a `text-base` automáticamente.
- `size="sm"` no cambia en mobile — 14px es legible en cualquier viewport.
- ⚠️ Migración pendiente: `CardWithContent`, `StatList` y `ConsumptionHistoryTable` deben migrar a usar `SectionHeader` internamente en una siguiente iteración.

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
- Selector de rango temporal en bar charts (1M / 3M / 6M / 1A / TODO) → usar `TabsForBlocks` + `CHART_RANGE_TABS`. Densidad: `lib/chart-bar-density.ts` (tooltip off si >6 barras en mobile o >12 en desktop; labels top solo ≤6 barras).
- Selección de día calendario en vista 1D → `DatePicker` dentro de `DailyGenerationChartBlock`
- Filtros multi-selección → usar Checkbox
- Navegación entre vistas → usar Sidebar o `TabsForBlocks`

### Spec Visual

| Elemento | Tailwind |
|---|---|
| Trigger | `Button variant="outline" size="sm" gap-2 shadow-sm` |
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
| Card | `rounded-xl bg-white shadow-sm p-6 max-w-md` |
| H1 | `text-2xl font-semibold` — "Verificá tu acceso" |
| Subtítulo | `text-sm text-muted-foreground` |
| Label OTP | `text-sm font-medium text-muted-foreground` |
| Slots OTP | 4 dígitos, `size-11`, `rounded-md`, `border-input`, `gap-2` |
| Botón | Primary, `w-full shadow-sm`, disabled si OTP &lt; 4 |
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

## Índice actualizado

1. [TabsForBlocks](#tabsforblocks)
2. [Card](#card)
3. [IconBadge](#iconbadge)
4. [KpiPrimary](#kpiprimary)
5. [KpiSecondary](#kpisecondary)
6. [SoftBadge](#softbadge)
7. [CardWithContent](#cardwithcontent)
8. [Table](#table)
9. [GenerationSparkline](#generationsparkline)
10. [ParkEnergyBarChart](#parkenergybarchar)
11. [DailyGenerationChart](#dailygenerationchart)
12. [DailyGenerationChartBlock](#dailygenerationchartblock)
13. [HinsTooltip](#hinstooltip)
14. [StatList](#statlist)
15. [SectionHeader](#sectionheader)
16. [PageHeader](#pageheader)
17. [PeriodSelector](#periodselector)
18. [DatePicker](#datepicker)
19. [SocioAccessView](#socioaccessview)
20. [MantenimientoHistorialTable](#mantenimientohistorialtable)
21. [HinsAlert](#hinsalert)

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
