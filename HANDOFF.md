# 📋 HINS Handoff — Guía Completa para Ingeniero

> **Dirección:** Este documento es tu punto de entrada al proyecto. Léelo de arriba a abajo. Al final encontrarás referencias a documentos detallados.

---

## 1. Qué es HINS

**HINS** = Plataforma web B2B de **monitoreo visual** para parques fotovoltaicos.
- No ejecuta acciones sobre la red — solo muestra datos
- 3 modelos de negocio: GDD (dueño único), GDC (comunitario), GDCV (comunitario virtual)
- 4 roles de usuario con diferentes vistas y permisos

**Estado actual:** Prototipo UI/UX sin backend. Todo es mock data.

---

## 2. Stack Técnico Validado

| Componente | Tech | Versión | Notas |
|---|---|---|---|
| **Framework** | Next.js App Router | Latest | Vercel-native |
| **Lenguaje** | TypeScript | Strict | Sin `any` |
| **UI Components** | shadcn/ui | Latest | Accesibles + composables |
| **Estilos** | Tailwind CSS | v4 | Solo clases utilitarias |
| **Formularios** | React Hook Form + Zod | Latest | Validación tipada |
| **Tablas** | TanStack Table | Latest | Sort/filter/paginate |
| **Charts** | Recharts | Latest | Migrable a visx Fase 2 |
| **Íconos** | lucide-react | Latest | Sistema unificado |
| **Animaciones** | Framer Motion | Latest | PageTransition wrapper |
| **Estado Global** | Context API | - | Evolución a Zustand pendiente |
| **Gestor Paquetes** | pnpm | Latest | - |
| **Deploy** | Vercel | - | Next.js compatible |

**Decisiones confirmadas:** Ver `engineering/tech-stack.md`

---

## 3. Estructura del Proyecto

```
hins-final-context/
├── app/                              ← Rutas (Next.js App Router)
│   ├── globals.css                   ← Tokens CSS (fuente de verdad)
│   ├── main/                         ← HINS Admin cartera
│   ├── gdd/*                         ← GDD Dueño (secciones: Performance, ROI, Mantenimiento)
│   ├── gdcv/*                        ← GDCV (Administrador Comunitario + Socio)
│   ├── gdc/*                         ← GDC AGC (Administrador Comunitario)
│   └── dev/components                ← Pagina de Preview de los Componentes documentados
│
├── components/
│   ├── ui/                           ← Base components (shadcn + custom HINS)
│   ├── charts/                       ← Chart wrappers (Recharts)
│   ├── layout/                       ← Shells, sidebars, headers
│   ├── main/                         ← Admin view components
│   ├── gdd/                          ← GDD-specific components
│   ├── gdcv/                         ← GDCV components (AGC + Socio)
│   ├── gdc/                          ← GDC components
│   └── mantenimiento/                ← Transversal maintenance components
│
├── data/                             ← Mock data (reemplazar con APIs)
│   ├── gdd-performance-mock.ts       ← Energy monthly
│   ├── gdd-roi-mock.ts               ← ROI data
│   ├── gdcv-mock.ts                  ← Park details
│   ├── mantenimiento-mock.ts         ← Maintenance data
│   └── *-mock.ts                     ← Otros modelos
│
├── lib/                              ← Utilidades compartidas
│   ├── format-energy.ts              ← parseKwhDisplay, parseKwpDisplay (centralizadas)
│   ├── park-config.ts                ← Constants de parks (inyectar vía API)
│   ├── format-currency.ts            ← Formateo ARS/USD
│   ├── chart-*.ts                    ← Chart helpers
│   ├── mantenimiento-format.ts       ← Maintenance helpers
│   ├── table-utils.ts                ← TanStack Table utilities
│   ├── sheet-layout.ts               ← Sheet drill-down widths
│   ├── gdcv-socio-auth.ts            ← OTP demo (reemplazar con auth real)
│   └── utils.ts                      ← Misc (cn, etc)
│
├── hooks/                            ← Custom React hooks
│   └── use-is-mobile.ts              ← Mobile breakpoint detector
│
├── context/                          ← Documentación (LEE ESTO PRIMERO)
│   ├── kick-off.md                   ← START HERE (60 seg)
│   ├── product-context.md            ← Modelos, RBAC, reglas dominio
│   ├── design-system.md              ← Tokens, colores, spacing
│   ├── components.md                 ← Spec de cada componente
│   └── ux-guidelines.md              ← Patrones UX, anti-patterns
│
├── engineering/                      ← Documentación técnica
│   └── tech-stack.md                 ← Stack, convenciones, decisiones
│
├── flows/                            ← Wireframes anotados por flujo
│   └── [flujo]/flow.md               ← Wireframe + estructura vista
│
├── public/
│   └── images/                       ← Assets estáticos (logos, icons)
│
├── BACKEND_INTEGRATION.md            ← Mapa: mocks → APIs
├── HANDOFF.md                        ← Este archivo
├── README.md                         ← Project status + quick start
├── tsconfig.json                     ← TypeScript strict mode
├── tailwind.config.ts                ← Tailwind v4 config
└── package.json                      ← Dependencies

```

---

## 4. Qué Está Listo (UI/Prototipo)

✅ **Completamente funcional:**
- Dashboard HINS Admin (cartera de parques)
- Vistas de Performance (GDD, GDC, GDCV)
- Vistas de ROI (histórico + proyecciones + tablas)
- Vistas de Mantenimiento (transversales a todos los modelos)
- Tablas con sort/filter/paginate (TanStack Table)
- Charts (líneas, áreas, barras con Recharts)
- Sidebar responsive (desktop ícono/expandido, mobile sheet)
- OTP demo para Socio (static data)
- Formularios con validación Zod
- Design system completo (colores, spacing, shadows, tipografía)

✅ **Componentes reutilizables:**
- Todos los shadcn/ui base components
- KPI cards, badges, buttons, modals, sheets
- Custom HINS components (CardWire, ModelBadge, SheetOpsDetail, etc.)

---

## 5. Qué Falta (Backend/APIs)

❌ **No implementado (responsabilidad del backend):**

| Item | Ubicación | Impacto | Prioridad |
|---|---|---|---|
| **APIs reales** | Reemplazar todos `*-mock.ts` | Nada funciona sin esto | 🔴 CRITICAL |
| **Autenticación** | Middleware en `/gdd/*`, `/gdcv/*`, `/gdc/*` | Sin auth, cualquiera ve todo | 🔴 CRITICAL |
| **OTP verification** | `/gdcv/socio/acceso` | Acceso Socio abierto a todos | 🔴 CRITICAL |
| **Creación de proyectos** | `NewProjectDialog.tsx:58` | TODO comentado | 🟡 HIGH |
| **Estado global dinámico** | Context API → probablemente Zustand | Mock data solo funciona | 🟡 HIGH |
| **Error handling** | Toast/notificaciones | Sin feedback de errores | 🟠 MEDIUM |

---

## 6. Mocks a Reemplazar — Quick Map

**Para no perder tiempo buscando, acá están todos:**

| Tipo | Archivo | Const/Export | Reemplazar con |
|---|---|---|---|
| **Park config** | `lib/park-config.ts` | `GDCV_TOTAL_POTENCIA`, `GDD_TOTAL_POTENCIA`, etc. | `GET /api/parks/{id}` → `potenciaTotal` |
| **Autoconsumo %** | `lib/park-config.ts` | `GDCV_AUTOCONSUMO_PORCENTAJE = 0.68` | `GET /api/parks/{id}/config` → `autoconsumoRatio` |
| **Energy monthly** | `gdd-performance-mock.ts` | `PARK_ENERGY_MONTHLY` | `GET /api/parks/{id}/energy/monthly` |
| **ROI histórico** | `gdd-roi-mock.ts`, `gdcv-agc-mock.ts`, `gdcv-socio-mock.ts` | `gddRoiHistorico`, `gdcvRoiHistorico`, etc. | `GET /api/parks/{id}/roi/historico` |
| **ROI proyectado** | Mismo | `gddRoiProjectionData`, etc. | `GET /api/parks/{id}/roi/projection` |
| **ROI "hoy"** | Mismo | `GDD_ROI_FECHA_HOY = "2026-05"` | Current date (Date.now() o API) |
| **Socio details** | `SocioDetailSheet.tsx` | `DETAIL_MAP` + `fallbackDetail()` | `GET /api/parks/{id}/socios/{socioId}` |
| **Maintenance** | `mantenimiento-mock.ts` | `mantenimientoHistorial` | `GET /api/parks/{id}/maintenance/history` |

**Ver `BACKEND_INTEGRATION.md` para detalles de API contracts.**

---

## 7. Rutas & Modelos de Negocio

### Rutas Activas

```
/main                           → HINS Admin (cartera)
  └─ NewProjectDialog          ←  Crear Nuevo proyecto (API)

/gdd/*                          → GDD Owner (dueño único)
  ├─ /gdd/performance           ✅ Energy charts
  ├─ /gdd/roi                   ✅ ROI tables + projection
  └─ /gdd/mantenimiento         ✅ Pagina de Mantenimiento (log)

/gdcv/*                         → GDCV AGC (comunitario virtual)
  ├─ /gdcv/performance          ✅ Vista de Performance del Parque
  ├─ /gdcv/roi                  ✅ Vista de ROI
  ├─ /gdcv/mantenimiento        ✅ Pagina de Mantenimiento
  └─ /gdcv/socios               ✅ Socio table

/gdcv/socio/*                   → GDCV Socio (acceso OTP)
  ├─ /gdcv/socio/acceso?socio=AS     ← OTP entry (TODO: real auth)
  ├─ /gdcv/socio/[id]/roi            ✅ Personal ROI
  └─ /gdcv/socio/[id]/details        ✅ Personal details

/gdc/*                          → GDC AGC (comunitario)
  ├─ /gdc/performance           ✅ Vista de Performance del Parque
  ├─ /gdc/roi                   ✅ Vista de ROI
  └─ /gdc/mantenimiento         ✅ Pagina de Mantenimiento

/dev/components                 ← Component playground (dev only)
```

### Modelos de Negocio (RBAC)

| Modelo | Descripción | Usuarios | Lo que ve |
|---|---|---|---|
| **GDD** | Dueño único, 1 parque | Admin, Owner | Performance, ROI, Maintenance |
| **GDC** | Parque comunitario | Admin, AGC | Community perf, ROI, Maintenance |
| **GDCV** | Parque virtual | Admin, AGC, Socios | ^ + Socio (personal data OTP) |

**Regla crítica:** Socio NO ve Mantenimiento. Nunca. En ninguna ruta, sidebar, tabla.

Ver `context/product-context.md` para detalles completos.

---

## 8. Convenciones de Código

### TypeScript
- ✅ Strict mode siempre
- ✅ Props tipadas, sin `any`
- ✅ Enums para valores fijos (ej: ProjectType, Currency)

### Componentes
- ✅ Un componente por archivo (PascalCase)
- ✅ Props interface clara
- ✅ Valores default explícitos
- ✅ Sin CSS inline (solo Tailwind)
- ✅ Colores siempre desde tokens CSS (`var(--color-*)`), nunca hex directo

### Navegación Interna
- ✅ `next/link` siempre (no `<a href>`)
- ✅ No hardcodear rutas (si cambian, update en un lugar)

### Datos & Formatos
- ✅ Energía: usar `lib/format-energy.ts` (parseKwhDisplay, parseKwpDisplay)
- ✅ Moneda: usar `lib/format-currency.ts` (ARS/USD)
- ✅ Casing SI: `kWh`, `kWp`, `kW` (nunca `Kwh`)
- ✅ Fechas: ISO format `YYYY-MM` para datos energéticos

### Charts
- ✅ Separación: `chartData` / `chartConfig` / `<Component>`
- ✅ Colors desde `data/chart-config.ts` (nunca hardcode)
- ✅ Ticks uniformes en ejes X (ver `ROIProjectionChart.tsx` como ref)

### Tablas
- ✅ TanStack Table (no custom tables)
- ✅ Consolidar parsing functions en `lib/format-energy.ts`
- ✅ Sorting/filtering lógica en columnas (`Column.sortingFn`)

Ver `engineering/tech-stack.md` § Convenciones de Código para detalles.

---

## 9. Cómo Correr Localmente

```bash
# 1. Install
pnpm install

# 2. Dev server
pnpm dev
# → http://localhost:3000

# 3. Build
pnpm build

# 4. Production
pnpm start
```

### Demo Users (Mock/OTP)
```
HINS Admin:     /main (sin auth, cartera visible)
GDD Owner:      /gdd/* (sin auth, puede ver perf/roi/maintenance)
GDCV AGC:       /gdcv/* (sin auth, puede ver todo)
GDCV Socio:     /gdcv/socio/acceso?socio=AS + OTP: 4904 (medidor: 354904)
```

**TODO:** Reemplazar mocks con autenticación real.

---

## 10. Puntos Críticos para el Ingeniero

### 🔴 Must-Know (antes de empezar)

1. **Mock data es EVERYWHERE** — antes de cambiar cualquier número, buscar en `data/*-mock.ts`
2. **Constants mágicos están centralizados** — `lib/park-config.ts` es el mapa
3. **Parsing functions consolidadas** — `lib/format-energy.ts` (tocar si backend cambia formato)
4. **Socio never sees Maintenance** — si una ruta lo permite, es un bug
5. **Charts dependen de `fechaHoy`** — ROI projection va de ahí en adelante (no anterior)

### 🟡 Atención (fácil de pasar por alto)

- Park capacity (`980` para GDCV) usada en 3+ lugares — cambiarla en un lugar rompe todo
- Autoconsumo % (`0.68`) hardcodeado en componente — ¿es config por parque?
- `NEW_PROJECT_DIALOG` tiene TODO — especificar API contract antes de implementar
- `gdcv-socio-auth.ts` es OTP demo — reemplazar con JWT/OAuth real
- Sidebar está colapsado por default en desktop — esto es intencional (en `SidebarProvider defaultOpen={false}`)

### 🟢 Fácil (no te preocupes, funciona)

- Design system está 100% listo, no cambiar
- Componentes shadcn/ui ya están aquí, listos para usar
- Validación Zod + React Hook Form setup completo
- Charts rendering sin issues

---

## 11. Documentación de Referencia

| Doc | Para qué | Dónde |
|---|---|---|
| **kick-off.md** | Orientación en 60 seg | `context/` |
| **product-context.md** | Modelos negocio, RBAC, reglas | `context/` |
| **design-system.md** | Tokens, colores, spacing, typography | `context/` |
| **components.md** | Spec exacta de componentes | `context/` |
| **ux-guidelines.md** | Patrones UX, anti-patterns | `context/` |
| **tech-stack.md** | Stack, carpetas, convenciones | `engineering/` |
| **flow.md** | Wireframes para cada vista | `flows/[flujo]/` |
| **BACKEND_INTEGRATION.md** | Mapa: mocks → APIs | Root |
| **README.md** | Quick start + project status | Root |

**Orden de lectura recomendado:**
1. Este archivo (HANDOFF.md) ← estás acá
2. `context/kick-off.md` (60 seg)
3. `context/product-context.md` (modelos)
4. `BACKEND_INTEGRATION.md` (mocks mapping)
5. `engineering/tech-stack.md` (convenciones)
6. `context/design-system.md` + `context/components.md` (si tocas UI)

---

## 12. Checklist de Integración

**Tareas en orden recomendado:**

### Fase 1: Auth & Access (🔴 CRITICAL)
- [ ] Implementar autenticación real (JWT/OAuth)
- [ ] Agregar middleware auth en `/gdd/*`, `/gdcv/*`, `/gdc/*`
- [ ] Implementar OTP verification para `/gdcv/socio/acceso`
- [ ] Agregar role checks (ADMIN, OWNER, AGC, SOCIO)
- [ ] Testear que Socio NO ve Mantenimiento

### Fase 2: Data APIs (🔴 CRITICAL)
- [ ] `GET /api/parks/{id}` — park details + config
- [ ] `GET /api/parks/{id}/energy/monthly` — performance data
- [ ] `GET /api/parks/{id}/roi/historico` — historical ROI
- [ ] `GET /api/parks/{id}/roi/projection` — projected ROI
- [ ] `GET /api/parks/{id}/socios` — socio list
- [ ] `GET /api/parks/{id}/socios/{socioId}` — socio details
- [ ] `GET /api/parks/{id}/maintenance/history` — maintenance log
- [ ] Test data format compatibility con `lib/format-energy.ts` regex

### Fase 3: Features (🟡 HIGH)
- [ ] `POST /api/projects` — crear proyecto (reemplazar TODO en NewProjectDialog)
- [ ] Queries/mutations con React Query o SWR
- [ ] Global state management (Context → Zustand?)
- [ ] Error handling + toast notifications

### Fase 4: Polish (🟠 MEDIUM)
- [ ] Spinners/skeletons para loading states
- [ ] Empty states (sin datos)
- [ ] Error boundaries
- [ ] Logging/monitoring
- [ ] Tests (unit + e2e)

---

## 13. Contacto & Preguntas

**Si hay dudas sobre:**
- **Diseño/UX:** Ver `context/ux-guidelines.md` o `flows/*/flow.md`
- **Componentes:** Ver `context/components.md` (última palabra)
- **Stack/Conv:** Ver `engineering/tech-stack.md`
- **Productos/Negocio:** Ver `context/product-context.md`
- **Mocks/APIs:** Ver `BACKEND_INTEGRATION.md`

**Estructura de documentos es clara. Cada pregunta tiene respuesta en alguno de estos archivos.**

---

## 14. Resumen Ejecutivo

### Qué Recibiste
- ✅ Prototipo UI funcional 100% (componentes, diseño, interacciones)
- ✅ Stack técnico validado y documentado
- ✅ Mock data centralizado (fácil de reemplazar)
- ✅ Componentes reutilizables tipados
- ✅ Design system completo (colores, spacing, etc.)
- ✅ Charts + tablas con funcionalidad completa

### Qué Necesita Hacer
- 🔴 Conectar APIs reales (reemplazar mocks)
- 🔴 Agregar autenticación (middleware + role checks)
- 🟡 Implementar creación de proyectos
- 🟠 Error handling + UX mejoras

### Tiempo Estimado
- **APIs setup:** 1-2 semanas (backend)
- **Auth integración:** 3-5 días (frontend + backend)
- **Testing & polish:** 1 semana

**El 70% del trabajo ya está hecho. Los próximos 30% es backend + glue.**

---

## 🚀 Listo para Comenzar

1. Lee `context/kick-off.md` (60 segundos)
2. Lee `BACKEND_INTEGRATION.md` (10 minutos)
3. Corre `pnpm install && pnpm dev`
4. Abre http://localhost:3000
5. Explora las vistas
6. Busca mocks en `data/` — ahí empiezas a integrar APIs

**Bienvenido al proyecto. Cualquier duda, la doc tiene la respuesta.**
