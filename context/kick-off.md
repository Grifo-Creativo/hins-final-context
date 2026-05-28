# HINS — Kick-off para Agentes de Cursor

Sos un agente de desarrollo trabajando en **HINS** (plataforma de monitoreo de parques fotovoltaicos) dentro de Cursor.

---

## 1. Contexto del Proyecto

Antes de ejecutar **cualquier tarea**, leer siempre el contexto en **este orden exacto:**

1. **`@context/product-context.md`** — Qué es HINS, modelos de negocio (GDD/GDCV/GDC), actores, reglas de negocio
2. **`@context/design-system.md`** — Tokens de color, tipografía, spacing, geometría, escala
3. **`@context/components.md`** — Specs exactas de implementación de cada componente ← **ÚLTIMA PALABRA SIEMPRE**
4. **`@engineering/tech-stack.md`** — Stack tecnológico, arquitectura de carpetas, convenciones de código

**Si hay conflicto entre documentos, seguir la precedencia (ver sección 4).**

---

## 2. Metodología: Construcción Basada en Flows

Cada flujo (cada actor/rol) tiene su propio archivo `flow.md` en `flows/`:

```
flows/
├── GDD/
│   ├── flow.md           ← Dueño del Parque GDD
│   ├── GDD_01.png
│   └── GDD_02.png
│
├── GDCV-agc/
│   ├── flow.md           ← AGC (Admin General Comunitario) — Parque GDCV
│   ├── GDCV__admin_01.png
│   ├── GDCV__admin_02.png
│   └── GDCV__admin_03.png
│
├── GDCV-socio/
│   ├── flow.md           ← Socio / Cesionario — Parque GDCV
│   ├── GDCV__socio_01.png
│   └── GDCV__socio_02.png
│
├── main/
│   └── flow.md           ← HINS Admin Global
│
└── GDC/
    └── flow.md           ← AGC — Parque GDC (futuro)
```

### Qué define cada `flow.md`:
- **Pantallas:** Qué vistas existen, rutas exactas, referencia a wireframes `.png`
- **Estructura visual:** Bloques por pantalla, componentes usados, grid/layout
- **Interacciones:** Navegación, filtros, tabs, clicks, triggers de overlays
- **Mock data:** Interfaces TypeScript + datos de ejemplo
- **Notas para el agente:** Consideraciones especiales, reglas locales

### Patrón de construcción:
1. Leer el `flow.md` del flujo que vas a construir
2. Revisar los wireframes `.png` en la misma carpeta
3. Usar `@context/components.md` para spec exacta de cada componente
4. Implementar con `@context/design-system.md` (tokens, no hardcodeados)

**El `flow.md` es la fuente de verdad de estructura y contenido.**

---

## 3. Mapeo: Flows → Rutas en /app

```
flows/GDD/flow.md
  → /gdd/performance       (GDD_01 — Performance del Dueño)
  → /gdd/roi               (GDD_02 — ROI del Dueño)

flows/GDCV-agc/flow.md
  → /gdcv/performance      (GDCV_admin_01 — Performance del Parque)
  → /gdcv/roi              (GDCV_admin_03 — ROI del Parque)
  → /gdcv/mantenimiento    (GDCV_admin — Mantenimiento — solo roles admin)

flows/GDD/flow.md
  → /gdd/performance       (GDD_01)
  → /gdd/roi               (GDD_02)
  → /gdd/mantenimiento     (Dueño GDD — Mantenimiento)
  → /gdc/mantenimiento     (AGC GDC — Mantenimiento, ej. Marcos Juárez)

flows/GDCV-socio/flow.md
  → /gdcv/socio            (GDCV_socio_01 — Mi Espacio Personal - landing)
  → /gdcv/socio/parque     (GDCV_socio_02 — Performance del Parque - contexto Socio)

flows/main/flow.md
  → /main/*                (HINS Admin Global — pendiente)

flows/GDC/flow.md
  → /gdc/*                 (futuro)
```

---

## 4. Arquitectura de Carpetas

### `/components` — Componentes organizados por contexto

```
components/
├── ui/                      ← Componentes base (shadcn + custom)
│   ├── card.tsx
│   ├── button.tsx
│   ├── tabs-for-blocks.tsx
│   ├── kpi-primary.tsx
│   ├── kpi-secondary.tsx
│   ├── soft-badge.tsx
│   ├── icon-badge.tsx
│   ├── section-header.tsx
│   ├── page-header.tsx
│   ├── hins-tooltip.tsx
│   ├── stat-list.tsx
│   └── [otros base]
│
├── charts/                  ← Charts especializados
│   ├── GenerationSparkline.tsx
│   ├── ParkEnergyBarChart.tsx
│   ├── RoiRecoveryLineChart.tsx
│   └── [otros charts]
│
├── gdd/                     ← Componentes específicos flujo GDD
│   ├── GddPageHeading.tsx
│   ├── ParkPerformanceView.tsx
│   └── [otros GDD]
│
├── gdcv/                    ← Componentes específicos flujo GDCV (AGC + Socio)
│   ├── GdcvPageHeading.tsx
│   ├── GdcvPerformanceView.tsx
│   ├── GdcvRoiView.tsx
│   ├── SocioPageHeading.tsx
│   ├── SocioEnergyView.tsx
│   ├── SocioPerformanceView.tsx
│   ├── SocioDetailSheet.tsx
│   └── [otros GDCV]
│
└── layout/                  ← Shell y estructura global
    ├── Sidebar.tsx
    ├── Header.tsx
    ├── MainLayoutShell.tsx
    └── [otros layout]
```

### `/data` — Mock data por flujo

```
data/
├── gdd-performance-mock.ts       ← GDD data
├── gdcv-agc-mock.ts              ← GDCV AGC data
├── gdcv-socio-mock.ts            ← GDCV Socio data
├── chart-config.ts               ← Colores y config global de charts
└── [otros datos]
```

### `/app` — Rutas y páginas

```
app/
├── gdd/
│   ├── layout.tsx
│   ├── performance/
│   │   └── page.tsx          ← GDD_01
│   └── roi/
│       └── page.tsx          ← GDD_02
│
├── gdcv/
│   ├── layout.tsx            ← Con SidebarProvider (AGC)
│   ├── performance/
│   │   └── page.tsx          ← GDCV_admin_01
│   ├── roi/
│   │   └── page.tsx          ← GDCV_admin_03
│   └── socio/
│       ├── layout.tsx        ← SIN SidebarProvider
│       ├── page.tsx          ← GDCV_socio_01 (Mi Espacio)
│       └── parque/
│           └── page.tsx      ← GDCV_socio_02 (Performance)
│
└── dev/
    └── components/
        └── page.tsx          ← Testing/showcase de componentes
```

---

## 5. Regla de Precedencia (En Caso de Conflicto)

**Orden de autoridad (de mayor a menor):**

1. **`@context/components.md`** ← ÚLTIMA PALABRA EN IMPLEMENTACIÓN
   - Si está documentado aquí, se implementa así.
   - Props, interfaces, tokens, comportamiento.

2. **`@context/design-system.md`** ← Tokens y principios visuales
   - Colores, tipografía, spacing, geometría.
   - Nunca hex hardcodeado; siempre usar tokens CSS.

3. **`flows/[flujo]/flow.md`** ← Estructura y contenido de la vista
   - Qué bloques, qué data, qué interacciones.
   - Si no está en `components.md`, sigue el flow.

---

## 6. Patrón: Documentación Antes de Implementación

**REGLA:** Todo componente nuevo DEBE documentarse en `components.md` ANTES de implementar.

### Documentar incluye:
- ✅ Cuándo usar / Cuándo NO usar
- ✅ Spec visual (colores, espacios, tamaños en Tailwind)
- ✅ Props interface (TypeScript tipado)
- ✅ Casos de uso (ejemplos de código)
- ✅ Notas para el agente (restricciones, evoluciones futuras)
- ✅ Montos monetarios → sección **FormatCurrency** en `components.md` + `lib/format-currency.ts` (no duplicar formateo)

### Luego:
- ✅ Implementar en `/components` siguiendo spec
- ✅ Usar en `/app` según `flow.md`
- ✅ **Todo nuevo componente construido y documentado en `@context/components.md` debe estar visible en `http://localhost:3000/dev/components`**

---

## 7. Patterns Reutilizables (Documentados en `components.md`)

Estos patterns se usan en múltiples vistas. Están documentados una sola vez, se reutilizan:

| Pattern | Uso | Documentado |
|---------|-----|------------|
| **Column Visibility** | Toggle de columnas en tablas | `components.md` § Table |
| **Row Actions** | Menú (⋮) con Descargar/Copiar/Compartir | `components.md` § Table |
| **Column Sorting** | Ordenar columnas (3 estados: off → asc → desc) | `components.md` § Table |
| **SectionHeader** | Título h3/h4 + acción derecha (tabs, botones, select) | `components.md` § SectionHeader |
| **PageHeader** | H1 + badge + tabs + acción (level superior) | `components.md` § PageHeader |

**Si necesitás un pattern, buscá primero en `components.md` antes de crear uno nuevo.**

---

## 8. Rutas y Sidebar

### Sidebar — estado por defecto (admin)

- **Desktop:** colapsado (rail de íconos); el usuario expande con `SidebarTrigger` si lo necesita. Preferencia en cookie `sidebar_state`.
- **Mobile:** sin cambios — Sheet cerrado hasta abrir desde el header.

### CON Sidebar (Usuarios admin / gestión del parque):
```
/gdd/performance         ← SidebarProvider
/gdd/roi                 ← SidebarProvider
/gdd/mantenimiento       ← SidebarProvider (Dueño GDD) — ítem sidebar "Mantenimiento"
/gdc/mantenimiento       ← SidebarProvider (AGC GDC) — ítem sidebar "Mantenimiento"

/gdcv/performance        ← SidebarProvider (AGC admin)
/gdcv/roi                ← SidebarProvider (AGC admin)
/gdcv/mantenimiento      ← SidebarProvider (AGC admin) — ítem sidebar "Mantenimiento"
```

**Módulo Mantenimiento:** transversal GDD / GDC / GDCV; **solo** en rutas con sidebar administrativo.

### SIN Sidebar (Usuarios Socio):
```
/gdcv/socio              ← Sin SidebarProvider, solo tabs internos
/gdcv/socio/parque       ← Sin SidebarProvider, solo tabs internos
/gdcv/socio/acceso       ← OTP — sin Mantenimiento
```

**El Socio navega solo entre sus 2 tabs. No necesita salir de ahí.**

**El Socio NO tiene:** `/gdcv/mantenimiento`, ítem sidebar Mantenimiento, ni datos de mantenimiento en ninguna vista.

---

## 9. El Actor Socio (Contexto Crítico)

### Quién es
Socio/Cesionario — Participante del parque GDCV con cuotaparte porcentual (ej: 15% — `socioPorcentaje`).

### Pregunta clave que responde
¿Me está rindiendo la inversión? ¿Qué impacto real está teniendo en mi factura?

### Qué ve
- ✅ Solo su vista personal (no puede ver otros socios)
- ✅ Su participación % en el parque
- ✅ Su energía generada y ahorro correspondiente
- ✅ Su ROI personal (payback, TIR, curva recuperación)
- ✅ Historial de compensaciones

### Qué NO ve
- ❌ Información de otros socios
- ❌ Administración del parque
- ❌ Datos globales del parque (solo con su contexto)
- ❌ **Mantenimiento** — sección, navegación, historial, costos ni acciones de mantención

### Acceso
- ✅ Read-only — visualización pura
- ❌ Sin permisos de modificación
- ❌ Sin Sidebar — solo 2 tabs internos

### Diferencia vs AGC
| Aspecto | Socio | AGC |
|---------|-------|-----|
| Ve | Solo sus datos | Todos los socios + parque |
| Navegación | 2 tabs internos | Sidebar + múltiples vistas |
| Permisos | Read-only | Admin del parque |
| Sidebar | ❌ No | ✅ Sí |
| Rutas | `/gdcv/socio` y `/gdcv/socio/parque` | `/gdcv/performance`, `/gdcv/roi`, `/gdcv/mantenimiento` |
| Mantenimiento | ❌ Prohibido | ✅ Sidebar |

### Rutas específicas del Socio
```
/gdcv/socio              → Mi Espacio Personal (landing)
                            - Mi Ahorro en abril
                            - Mi Energía Generada
                            - ROI personal
                            - Curva Recuperación
                            - Historial de Compensaciones

/gdcv/socio/parque       → Performance del Parque (vista compartida con contexto del socio)
                            - Energía total del parque
                            - Mi participación
                            - Historial de Generación del parque
```

---

## 10. Reglas No Negociables (Memorizá)

- ❌ **Cero hex hardcodeados** → siempre `var(--token)` de `design-system.md`
- ❌ **Cero `--primary` en charts** → solo `--chart-1` a `--chart-5`
- ❌ **Cero custom tabs** → SOLO `TabsForBlocks`
- ❌ **Cero `any` en TypeScript** → props siempre tipadas
- ✅ **Navegación:** `next/link`, nunca `<a href>`
- ✅ **Componentes:** 1 por archivo, nombre `PascalCase`
- ✅ **Reutilización:** Si está en `components.md`, úsalo — no reinventes

---

## 11. Flujo de Trabajo (Resumen)

1. **Recibís prompt** → incluye referencia a `flow.md` del flujo
2. **Lees contexto** → en orden: product → design-system → components → tech-stack
3. **Lees flow.md** → estructura, wireframes, data, interacciones
4. **Implementas** → siguiendo `components.md` (última palabra) + `design-system.md` (tokens)
5. **Testas en /dev/components** (si es componente nuevo) antes de integrar
6. **Integras en /app** → según rutas y estructura del flow
7. **Esperas aprobación** → antes de continuar al siguiente bloque

---

## 12. Checklist Antes de Empezar

Antes de cualquier implementación, verificá:

- [ ] Leí `@context/kick-off.md` — entiendo metodología y reglas
- [ ] Leí `@context/product-context.md` — entiendo negocio y actores
- [ ] Leí `@context/design-system.md` — conozco todos los tokens disponibles
- [ ] Leí `@context/components.md` — sé qué está documentado y reutilizable
- [ ] Leí `@engineering/tech-stack.md` — entiendo arquitectura
- [ ] Leí `flows/[flujo]/flow.md` — sé qué construir exactamente
- [ ] Revisé wireframes `.png` en `flows/[flujo]/`
- [ ] Si es Socio: entiendo que es read-only, sin Sidebar, solo 2 tabs
- [ ] Pregunté si algo no está claro

---

**¿Listo? Esperando el `flow.md` específico del flujo que vas a construir.**
