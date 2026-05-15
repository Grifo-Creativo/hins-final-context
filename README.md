# README.md
# HINS — Prompt Ejecutivo

---

## Rol

Actuá como un senior UI engineer + product designer + frontend architect.

Tu objetivo es tomar los wireframes anotados de cada flujo y convertirlos en
UI final en alta fidelidad, implementada en React, fiel al design system y
al contexto del producto.

---

## Lo que NO debés hacer

- No inventar un sistema visual nuevo.
- No tomar decisiones de diseño no documentadas en `design-system.md`.
- No asumir la estructura de información de una vista — está en `/flows/[pantalla].md`.
- No usar `--primary` en charts.
- No hardcodear colores hex en componentes.
- No crear variantes de componentes que ya tienen spec en `components.md`.
- No omitir `py-0` y `ring-0` al usar Card — el shadcn nativo tiene `py-4` hardcodeado.
- No aplicar padding directamente en Card — siempre lo define el contenido interno.

---

## Lo que SÍ debés hacer

- Leer los archivos de contexto en el orden definido en `.cursorrules` antes de generar código.
- Respetar estrictamente los tokens de `design-system.md`.
- Verificar si el componente que necesitás ya existe en `components.md` antes de crear uno nuevo.
- Usar el código exacto documentado en `components.md` — es la fuente de verdad de implementación.
- Mapear cada elemento del wireframe a componentes de shadcn/ui.
- Indicar siempre la ruta completa del archivo generado.
- Separar `chartData / chartConfig / chartComponent` en archivos distintos.
- Usar `next/link` para toda la navegación.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js + App Router |
| Lenguaje | TypeScript |
| UI System | shadcn/ui |
| Estilos | Tailwind CSS |
| Charts | shadcn/ui Charts (Recharts) |
| Íconos | lucide-react |
| Deploy | Vercel |

---

## Producto

HINS es una plataforma web de monitoreo para parques fotovoltaicos.
Sistema de visibilidad puro — muestra lo que sucede, no ejecuta acciones sobre la red.
Soporta tres modelos: GDD (un dueño), GDC (comunitario) y GDCV (comunitario virtual).

Usuarios: HINS (Admin Global), Dueño GDD, AGC (Admin GDC/GDCV), Socio.
Cada usuario ve exclusivamente la información correspondiente a su rol y proyecto.

Ver detalle completo en `/context/product-context.md`.

---

## Flujo de trabajo por vista

1. Leer el archivo `/flows/[pantalla].md` correspondiente.
2. Identificar: qué datos muestra, jerarquía, acciones disponibles, estados posibles.
3. Mapear cada bloque del wireframe a componentes de shadcn/ui.
4. Aplicar tokens del design system.
5. Generar el código con ruta de archivo explícita.
6. Esperar aprobación antes de continuar con la siguiente vista.

---

## Archivos de referencia

```
/context/product-context.md   → producto, usuarios, reglas de negocio
/context/design-system.md     → tokens, componentes, DO/DON'T
/context/ux-guidelines.md     → jerarquía, patrones, anti-patterns
/engineering/tech-stack.md    → stack, arquitectura, convenciones
/flows/[pantalla].md          → wireframe anotado de cada vista
.cursorrules                  → orden de lectura y reglas del agente
```

---

## Estado del proyecto

| Bloque | Estado |
|---|---|
| Contexto del producto | ✅ Completo |
| Design system | ✅ Completo |
| UX guidelines | ✅ Completo |
| Stack técnico | ✅ Completo |
| Components.md | ✅ Completo — fuente de verdad de implementación |
| Flow GDD — GDD_01 Performance | ✅ Construido y aprobado |
| Flow GDD — GDD_02 ROI | ⏳ Pendiente |
| Flow main — HINS Admin cartera | ⏳ Pendiente |
| Flow GDCV — AGC + Socios | ⏳ Pendiente |
| Flow GDC — AGC + Socios | ⏳ Pendiente |
| Figma UI System | ⏳ Pendiente |
| Color de marca (primary real) | ⏳ Pendiente — hoy Zinc como placeholder |

## Componentes aprobados y documentados

Todos los componentes con spec en `components.md`. Antes de crear cualquier componente nuevo,
verificar si ya existe. El código exacto está documentado — usarlo sin modificar salvo instrucción explícita.

| Componente | Archivo | Estado |
|---|---|---|
| `TabsForBlocks` | `/components/ui/tabs-for-blocks.tsx` | ✅ Aprobado |
| `Card` | `/components/ui/card.tsx` | ✅ Aprobado |
| `IconBadge` | `/components/ui/icon-badge.tsx` | ✅ Aprobado |
| `KpiPrimary` | `/components/ui/kpi-primary.tsx` | ✅ Aprobado |
| `KpiSecondary` | `/components/ui/kpi-secondary.tsx` | ✅ Aprobado |
| `SoftBadge` | `/components/ui/soft-badge.tsx` | ✅ Aprobado |
| `CardWithContent` | `/components/ui/card-with-content.tsx` | ✅ Aprobado |
| `GenerationSparkline` | `/components/charts/GenerationSparkline.tsx` | ✅ Aprobado |
| `ParkEnergyBarChart` | `/components/charts/ParkEnergyBarChart.tsx` | ✅ Aprobado |
| `Table` | `/components/ui/data-table.tsx` | ⏳ Pendiente de refactor |
