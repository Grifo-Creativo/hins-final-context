# HINS — Kick-off de Agente

> Leé esto primero. En ~60 segundos tenés todo lo que necesitás para arrancar.

---

## 1. Qué es el sistema

HINS es una plataforma web B2B de **visibilidad** para parques fotovoltaicos.
**No ejecuta acciones sobre la red** — solo muestra lo que sucede.

| Modelo | Descripción | Usuarios |
|---|---|---|
| **GDD** | Un dueño, un parque | HINS Admin, Dueño GDD |
| **GDC** | Parque comunitario | HINS Admin, AGC |
| **GDCV** | Parque comunitario virtual | HINS Admin, AGC, Socios/Cesionarios |

El **Socio** es el único usuario sin sidebar. Accede por OTP a una vista personal de solo lectura. No ve Mantenimiento nunca.

---

## 2. Orden de lectura obligatorio

Antes de generar cualquier código, leer en este orden:

| # | Archivo | Para qué |
|---|---|---|
| 1 | `context/kick-off.md` | Este archivo — reglas críticas y routing |
| 2 | `context/product-context.md` | Modelos de negocio, RBAC, reglas de dominio |
| 3 | `context/design-system.md` | Tokens de color, tipografía, spacing, shadows |
| 4 | `context/components.md` | Spec del componente — **leer solo la sección del § Índice** (no el archivo entero) ← **última palabra** |
| 5 | `context/ux-guidelines.md` | Patrones UX, anti-patterns, Sheet drill-down |
| 6 | `engineering/tech-stack.md` | Stack, carpetas, convenciones de código |
| 7 | `flows/[flujo]/flow.md` | Wireframe y estructura de la vista a construir |
| 8 | `flows/performance/about-performance-layout.md` | *Condicional:* fila superior Performance, `ParkDetailsCard`, `*_TOP_ROW_GRID` |
| 9 | `lib/format-currency.ts` + `components.md` → FormatCurrency | *Condicional:* montos, toggles DOLAR/ARS, labels monetarios |
| 10 | `flows/GDD/roi-spec.md` | *Condicional:* datos y reglas ROI GDD (Parque General Roca) |

**Precedencia (conflictos):** `components.md` > `design-system.md` > `ux-guidelines.md` > `flows/`

**Cómo leer `components.md`:** usar el **§ Índice** al inicio del archivo, identificar el componente del `flow.md` o de la tarea, y leer **únicamente** ese bloque (`## NombreComponente`). No cargar el archivo completo salvo que debas crear un componente nuevo sin spec previa.

---

## 3. El método de build

Cada vista nace de un wireframe anotado en `flows/`:

```
flows/[flujo]/flow.md          → qué bloques, qué datos, qué interacciones
      ↓
components.md                  → spec exacta de cada componente a usar
      ↓
design-system.md               → tokens para colores, spacing, shadows
      ↓
/components/[módulo]/Vista.tsx → implementación
/app/[ruta]/page.tsx           → integración en ruta
```

**Regla:** Verificar siempre si el componente existe en `components.md` (§ Índice → sección puntual) antes de crear uno nuevo. El código documentado ahí se usa sin modificar salvo instrucción explícita.

---

## 4. Reglas no negociables

### Producto y dominio
- ❌ No inventar flujos de acción sobre la red — el sistema es de **visibilidad**
- ❌ No exponer Mantenimiento al Socio — en ninguna ruta, sidebar, tabla ni KPI
- ❌ Respetar aislamiento de roles: cada usuario ve solo su información
- ❌ No tomar decisiones de diseño no documentadas — si falta spec, preguntar

### Color y tokens
- ❌ No hardcodear colores hex en componentes — siempre tokens CSS (`var(--chart-1)`, `text-foreground`, etc.)
- ❌ No usar `--primary` en charts — solo `--chart-1` a `--chart-5`
- ❌ Estados semánticos (success/warning/error/info) solo cuando hay un estado real que comunicar
- Fondo del shell: `bg-background-subtle` (`--background-subtle`). Cards: `bg-white` (`--background`). Nunca invertir.

### Componentes y UI
- ❌ No crear variantes de `TabsForBlocks` — es el único componente de tabs del producto
- ❌ No usar `shadow-sm` — el estándar validado es `shadow-xs` en botones y cards
- ❌ No crear componentes custom si ya existe spec en `components.md`
- Antes de crear un componente → verificar `components.md`. Si existe spec → usar exacto, sin interpretación
- Si no existe spec → mapear a shadcn/ui nativo antes de crear uno custom
- **Spacing responsivo (mobile):** wrappers de primer nivel usan `gap-4 sm:gap-6` y `p-4 sm:p-6` (ver `design-system.md` → Spacing Responsivo en Mobile)
- Charts: separación obligatoria `chartData / chartConfig / chartComponent`
- Navegación interna: siempre `next/link`, nunca `<a href>`
- Íconos: solo `lucide-react`, no mezclar librerías

### Código y output
- ❌ No usar `any` en TypeScript — props siempre tipadas
- Todo archivo generado incluye su ruta completa como comentario en la primera línea (ej. `// app/dashboard/page.tsx`)
- Un componente por archivo (PascalCase)
- Assets en `/public/images`, referenciar como `/images/[archivo]`
- Usar Next.js `Image` para imágenes estáticas

---

## 5. Quick start

```bash
pnpm install && pnpm dev
# → http://localhost:3000
```

**Demo Socio (OTP):** `/gdcv/socio/acceso?socio=AS` → código `4904` (medidor `354904`)

**Rutas activas:**
```
/main          → HINS Admin cartera
/gdd/*         → Performance, ROI, Mantenimiento (Dueño GDD)
/gdcv/*        → Performance, ROI, Mantenimiento (AGC), Socio
/gdc/*         → Performance, ROI, Mantenimiento (AGC GDC)
/dev/components → Playground de componentes (dev only)
```

**Estado del proyecto:** ver `README.md` → § Project Status  
**Integración backend:** ver `BACKEND_INTEGRATION.md`  
**Onboarding ingeniero:** ver `HANDOFF.md`

---

**Listo. Ahora leé el `flow.md` del flujo que vas a construir.**
