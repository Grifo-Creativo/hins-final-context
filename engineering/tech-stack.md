# engineering/tech-stack.md
# HINS — Stack Técnico y Arquitectura

---

## 1. Stack Validado

| Capa | Tecnología | Notas |
|---|---|---|
| **Framework** | Next.js (App Router) | |
| **Lenguaje** | TypeScript | Strict mode recomendado |
| **UI System** | shadcn/ui | Componentes accesibles, reutilizables y composables |
| **Estilos** | Tailwind CSS v4 | Solo clases utilitarias, sin CSS custom salvo tokens |
| **Gestor de paquetes** | pnpm | |
| **Estado global (fase actual)** | React Context API | Evolución (p. ej. Zustand) pendiente de decisión |
| **Validación** | Zod | Formularios con React Hook Form + Zod |
| **Auth (prototipo)** | Mock / sin backend | Datos estáticos; sin API de autenticación real |
| **Charts** | shadcn/ui Charts (Recharts) | Fase 1. Migrable a visx en Fase 2 |
| **Íconos** | lucide-react | Sistema unificado, no mezclar librerías |
| **Formularios** | React Hook Form | Con validación via Zod |
| **Tablas avanzadas** | TanStack Table | Para tablas con sort / filter / paginación |
| **Transiciones** | Framer Motion | Transiciones entre vistas (PageTransition wrapper) |
| **Deploy** | Vercel | |

---

## 2. Arquitectura de Carpetas

```
/app                          → Rutas (Next.js App Router)
  globals.css                 → Tokens CSS del design system (fuente de verdad de variables)
  /main                       → Vista HINS Admin (cartera de parques)
  /gdd                        → Vistas Dueño GDD (performance, roi, mantenimiento)
  /gdcv                       → Vistas AGC + Socio GDCV
  /gdc                        → Vistas AGC GDC
  /dev/components             → Playground de componentes (dev only)

/components
  /ui                         → Componentes base (shadcn/ui + custom HINS)
  /charts                     → Componentes de visualización de datos
  /layout                     → Shells, sidebars, headers por módulo
  /gdd                        → Vistas y bloques específicos GDD
  /gdcv                       → Vistas y bloques específicos GDCV (AGC + Socio)
  /gdc                        → Vistas y bloques específicos GDC
  /main                       → Vistas y bloques HINS Admin
  /mantenimiento              → Componentes compartidos de Mantenimiento (transversal GDD/GDC/GDCV)

/data
  chart-config.ts             → Colores y config de charts (única fuente para chartConfig)
  [dominio]-mock.ts           → Datos mock por dominio (gdcv-mock, gdd-roi-mock, etc.)

/lib
  utils.ts                    → cn() y utilidades compartidas
  format-currency.ts          → ARS/USD: formatCurrency, formatRoiFromUsd, formatRoiFromUsdResponsive (locale es-AR)
  chart-day-format.ts         → Helpers de formato para vista diaria 1D
  chart-bar-density.ts        → Lógica de densidad para bar charts (tooltips, labels)
  sheet-layout.ts             → Anchos de Sheet drill-down (detail / notifications / table)
  mantenimiento-format.ts     → Helpers de formato para el módulo Mantenimiento
  table-utils.ts              → Utilidades para tablas TanStack

/public
  /images                     → Logos e iconografía estática
    logo-hins.png             → Logo principal HINS
    logo-hins-dark.png        → Logo para tema oscuro

/context                      → Documentación del design system y producto
/flows                        → Wireframes anotados por flujo/pantalla
/engineering                  → Documentación técnica (este archivo)
```

---

## 3. Convenciones de Código

### Archivos
- Siempre indicar la ruta completa del archivo al generar código.
  Ejemplo: `app/dashboard/page.tsx`, `components/charts/MainLineChart.tsx`
- Un componente por archivo.
- Nombre de archivo = nombre del componente (PascalCase).

### Componentes
- Todos los componentes en TypeScript con props tipadas.
- Props opcionales con valor default explícito.
- No usar `any`.

### Navegación
- Usar `next/link` para todas las transiciones entre vistas.
- Nunca usar `<a href>` para rutas internas.

### Estilos
- Usar solo clases de Tailwind.
- No hardcodear colores hex en componentes — siempre referenciar tokens CSS.
- No mezclar estilos inline con Tailwind.

### Charts
- Separación obligatoria: `chartData` / `chartConfig` / `chartComponent`.
- `chartConfig` siempre importado desde `/data/chart-config.ts`.
- Nunca hardcodear colores de chart en componentes de renderizado.

### Formato monetario
- Usar `/lib/format-currency.ts` — no armar `$` / `u$s` + `toLocaleString` a mano.
- Tabs de moneda: labels **DOLAR** / **ARS** (`currencyTabLabel`); montos: `$ ` / `u$s ` **con espacio** (ej. `$ 74.400`, `u$s 5,7M`).
- **Labels de KPI/tabla/chart:** solo concepto de negocio — sin `(DOLAR)`, `(ARS)` ni moneda en copy.
- Modos: `full` (UI completa), `compact` (label barra + ROI mobile ≥1M), `axis` (eje Y).
- Mocks display: `formatCurrency(n, "ars"|"usd", mode)` al exportar strings — no `"$74.400"` manual.
- Spec: `context/components.md` → FormatCurrency + Currency Context Rules; principios: `context/design-system.md`.

### Unidades energéticas
- Casing SI: `kWh`, `kWp`, `kW` — nunca `Kwh`.
- Spec: `context/components.md` → FormatEnergy.

### Sheet drill-down (OPS)
- Anchos: `sheetContentClassName("detail" | "notifications" | "table")` en `/lib/sheet-layout.ts`.
- Recetas: `SheetContentTable`, `SheetContentDetail`, `SheetOpsNotificationsHeader` en `/components/ui/sheet-ops.tsx`.
- UX: `context/ux-guidelines.md` §3 · spec: `components.md` § Sheet + § SheetOps · demo: `/app/dev/components`.
- No modificar defaults globales de `/components/ui/sheet.tsx`.

### Sidebar (desktop vs mobile)

Implementación: `components/ui/sidebar.tsx` (shadcn Sidebar) + shells en `components/layout/*LayoutShell.tsx`.

| Viewport | Comportamiento | Estado inicial |
|---|---|---|
| **Desktop / tablet ≥768px** | `collapsible="icon"` — rail de íconos (~3rem) o expandido (16rem) | **Colapsado** (`defaultOpen={false}`) |
| **Mobile &lt;768px** | Sheet overlay — **no modificar** | Cerrado hasta `SidebarTrigger` |

**Persistencia (solo desktop):** cookie `sidebar_state` (`true` = expandido, `false` = colapsado). Se lee en mount (`useLayoutEffect`) y se escribe al togglear. No afecta `openMobile`.

**Toggle:** `SidebarTrigger` en headers + `SidebarRail` (borde del sidebar) + atajo `Ctrl/Cmd + B`.

**Tooltips en modo ícono:** `SidebarMenuButton` con prop `tooltip` — visible solo cuando `state === "collapsed"` y no mobile. Nav items y `NavUser` ya lo usan.

**Shells con sidebar:** `MainLayoutShell`, `GddLayoutShell`, `GdcvLayoutShell`, `GdcLayoutShell` → `SidebarProvider defaultOpen={false}`. Socio (`GdcvLayoutShellNoSidebar`) sin sidebar visible.

---

## 4. shadcn/ui — Setup y Skill

### components.json

Al inicializar shadcn/ui (`pnpm dlx shadcn@latest init`), CLI y Cursor generan o actualizan `components.json` según la **estructura real del repo** (ruta de `globals.css`, Tailwind v4, aliases `@/*`). El ejemplo siguiente es **ilustrativo**; los aliases y rutas deben coincidir con el proyecto (p. ej. `app/globals.css` vs `src/styles/globals.css`).

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "iconLibrary": "lucide"
}
```

### Skill de shadcn/ui (instalar en el proyecto)
```bash
pnpm dlx skills add shadcn/ui
```
Esto da al agente de Cursor contexto vivo del proyecto: componentes instalados,
framework, aliases y estructura real. Activar antes de comenzar la implementación.

### Instalación de componentes
Instalar solo los componentes que se van a usar:
```bash
pnpm dlx shadcn@latest add button card table sheet tabs alert badge chart sidebar
```

---

## 5. Deploy en Vercel

- El prototipo debe poder desplegarse en Vercel sin configuración adicional.
- Next.js App Router es compatible out-of-the-box con Vercel.
- Variables de entorno: definir en `.env.local` y documentar en `.env.example`.
- Datos del prototipo: mock data estática, no requiere backend para el prototipo.

---

## **6. Shell del producto**

### Sidebar
Componente base del layout de toda la aplicación.
Variante: **sidebar-05** (colapsa a íconos)

Instalación:
```bash
pnpm dlx shadcn@latest add sidebar-05
```

Referencia: [sidebar-05 — shadcn/ui](https://ui.shadcn.com/blocks/sidebar#sidebar-05)

### Estructura correcta del shell

```tsx
// app/layout.tsx
<html>
  <body>
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="flex flex-col">
        <Header /> {/* sticky */}
        <main className="flex-1 bg-background-subtle p-6 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  </body>
</html>
```

**Atributos críticos:**
- `SidebarProvider`: root container, flex, h-screen, w-screen
- `Sidebar`: h-screen, min-h-screen, w-auto (ancho variable según estado)
- `SidebarInset`: flex-1, flex flex-col (ocupa espacio restante)
- `main`: flex-1, overflow-y-auto (scroll vertical cuando necesario)

### Header sticky
El header debe ser sticky top para que las acciones siempre sean accesibles al scroll.

```tsx
<header className="sticky top-0 z-40 bg-white border-b">
  {/* PageHeader u otro contenido */}
</header>
```

### Comportamiento nativo que hereda
- Expansión / colapso del sidebar con SidebarTrigger
- Transición animada entre estado expandido e ícono
- Compatible con SidebarProvider + SidebarInset como wrapper global

**Regla:** Este sidebar es el wrapper de TODAS las vistas del producto.
No construir ninguna página fuera de este shell.


## 7. Decisiones confirmadas (proyecto)

| Tema | Decisión |
|---|---|
| Gestor de paquetes | **pnpm** |
| Tailwind | **v4** |
| Estado global | **Context API** por ahora; revisar más adelante |
| Validación de formularios | **Zod** (con React Hook Form) |
| Auth del prototipo | **Mock** — sin backend |
| Módulo Mantenimiento | Transversal GDD/GDC/GDCV; solo roles admin (sidebar). Socio sin acceso — ver `product-context.md` §5 |
| shadcn/ui | Tras `init`, **`components.json`** y aliases según estructura real; Cursor/CLI lo alinean automáticamente |

### Pendientes

- [ ] Reevaluar librería de estado global cuando el alcance de datos compartidos crezca.