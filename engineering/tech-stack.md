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
/app                        → Rutas (App Router de Next.js)
  /[ruta]
    page.tsx                → Una página por ruta
    layout.tsx              → Layout compartido si aplica

/components
  /ui                       → Componentes base (shadcn/ui + custom)
  /charts                   → Componentes de visualización de datos
  /layout                   → Shell, sidebar, topbar, page header

/data
  chart-config.ts           → Fuente de verdad de colores y config de charts
  [dominio]-mock.ts         → Datos mock por dominio

/lib
  utils.ts                  → cn() y utilidades compartidas

/styles
  globals.css               → Tokens CSS (design system completo)
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
        <main className="flex-1 bg-[#F2ECE9]/36 p-6 overflow-y-auto">
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


## 7. Arquitectura de Carpetas

/public
  /images               → SVG, PNG, iconografía no usada en componentes
    `logo-hins.png`     → Logo principal HINS
    `logo-hins-dark.png` → Logo para tema oscuro
  /fonts                → Alternativa por el momento usamos la declarada

  
## 8. Decisiones confirmadas (proyecto)

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