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
| 1 | `context/product-context.md` | Modelos de negocio, RBAC, reglas de dominio |
| 2 | `context/design-system.md` | Tokens de color, tipografía, spacing, shadows |
| 3 | `context/components.md` | Spec exacta de cada componente ← **última palabra** |
| 4 | `context/ux-guidelines.md` | Patrones UX, anti-patterns, Sheet drill-down |
| 5 | `engineering/tech-stack.md` | Stack, carpetas, convenciones de código |
| 6 | `flows/[flujo]/flow.md` | Wireframe y estructura de la vista a construir |

**Si hay conflicto entre documentos:** `components.md` > `design-system.md` > `ux-guidelines.md` > `flows/`

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

**Regla:** Verificar siempre si el componente existe en `components.md` antes de crear uno nuevo. El código documentado ahí se usa sin modificar salvo instrucción explícita.

---

## 4. Reglas no negociables

- ❌ No hardcodear colores hex en componentes — siempre tokens CSS (`var(--chart-1)`, `text-foreground`, etc.)
- ❌ No usar `--primary` en charts — solo `--chart-1` a `--chart-5`
- ❌ No crear variantes de `TabsForBlocks` — es el único componente de tabs del producto
- ❌ No usar `shadow-sm` — el estándar validado es `shadow-xs` en botones y cards
- ❌ No crear componentes custom si ya existe spec en `components.md`
- ❌ No exponer Mantenimiento al Socio — en ninguna ruta, sidebar, tabla ni KPI
- ❌ No usar `<a href>` para navegación interna — siempre `next/link`
- ❌ No usar `any` en TypeScript — props siempre tipadas

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

---

**Listo. Ahora leé el `flow.md` del flujo que vas a construir.**
