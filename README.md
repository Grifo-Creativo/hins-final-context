# HINS — Prototipo B2B (monitoreo de parques fotovoltaicos)

Plataforma de **visibilidad** (no operativa) para parques GDD, GDC y GDCV.  
Stack: Next.js App Router, shadcn/ui, TanStack Table, Recharts.

**Repositorio:** https://github.com/juanma25/hins-final-context  
**Rama principal:** `main` (sin PR abierto por defecto; revisar commits recientes en `main`)

---

## Documentación del producto (orden de lectura)

1. [`context/product-context.md`](context/product-context.md) — usuarios, RBAC, reglas de negocio  
2. [`context/design-system.md`](context/design-system.md) — tokens y principios visuales  
3. [`context/components.md`](context/components.md) — specs de implementación (**última palabra**)  
4. [`context/ux-guidelines.md`](context/ux-guidelines.md) — patrones UX (⚠️ ver tech debt)  
5. [`engineering/tech-stack.md`](engineering/tech-stack.md) — stack y convenciones  
6. [`flows/`](flows/) — flujo por actor/pantalla  

---

## Rutas principales

| Área | Rutas |
|------|--------|
| Main | `/main` |
| GDD | `/gdd/performance`, `/gdd/roi`, `/gdd/mantenimiento`, `/gdd/notifications` |
| GDCV AGC | `/gdcv/performance`, `/gdcv/roi`, `/gdcv/mantenimiento` |
| GDCV Socio | `/gdcv/socio/acceso`, `/gdcv/socio`, `/gdcv/socio/parque` |
| GDC | `/gdc/performance`, `/gdc/roi`, `/gdc/mantenimiento` |
| Dev | `/dev/components` |

**Socio demo OTP:** `/gdcv/socio/acceso?socio=AS` → código `4904` (medidor `354904`).

---

## Project Status (May 20, 2026)

### What's Done

**Plataforma y shell**
- Next.js App Router + shadcn/ui + design tokens documentados
- Shell con sidebar, header sticky, breadcrumbs, transiciones (`PageTransition`)
- Rutas Main, GDD, GDCV (AGC + Socio), GDC y playground de componentes

**Main / entrada**
- Vista de proyectos (`ProjectsView`) con cards GDD/GDCV
- Diálogo “Nuevo proyecto” (prototipo)
- Acceso activo: General Roca (GDD), Río Cuarto (GDCV), Marcos Juárez (GDC → mantenimiento)

**GDD (Dueño del parque)**
- Performance y ROI
- Gráfico de generación diaria + navegación por fecha
- Historial de consumo, KPIs, notificaciones
- Mantenimiento con historial mock

**GDCV AGC (admin parque)**
- Performance, ROI, tabla Socios, sheets de detalle
- Compensaciones / generación (mock)
- Mantenimiento
- Gráfico diario en Performance

**GDCV Socio**
- OTP de acceso + gate de sesión
- Mi espacio, El Parque, ROI socio
- Compartir link (demo Agro Sur)
- **Sin** módulo Mantenimiento (RBAC)

**GDC (prototipo mínimo)**
- Layout + sidebar + header
- Mantenimiento con mock propio
- Performance / ROI como placeholders

**Mantenimiento (transversal GDD / GDC / GDCV)**
- Mock y UI compartidos (`components/mantenimiento/`, `data/mantenimiento-mock.ts`)
- Historial sortable, sheet de detalle placeholder, botón Nuevo sin flujo

**Documentación**
- `product-context.md` (roles, Mantenimiento §5)
- Flows: GDD, GDCV-agc, GDCV-socio, main (parcial)

### What's In Progress

- Cierre / pulido del prototipo HINS
- Alineación puntual docs ↔ código (ver tech debt)
- Plan post-proyecto: evolución del método de construcción en `context/` para reutilizar en futuros productos

### What's Next

**Producto**
1. Flow **Main / HINS Admin** — cartera global
2. **GDC** completo — Performance y ROI (hoy placeholders)
3. Mantenimiento — detalle en Sheet + flujo “Nueva mantención”
4. Pantallas GDCV/GDC pendientes de wireframes en docs
5. Auth / backend real (hoy mock + `sessionStorage` para socio)

**Método (post-HINS)**
- Restaurar `ux-guidelines.md` como guía completa
- Unificar `PageHeader` vs `*PageHeading`
- Auditoría doc ↔ código y plantilla reutilizable

### Known Issues / Tech Debt

**Build**
- `pnpm run build` puede fallar por TypeScript en `scripts/figma-flow-builder.ts`

**Documentación**
- `ux-guidelines.md` §1–§10 restaurado (§3 Sheet OPS); ampliar si hace falta más detalle histórico
- `product-context.md` §11 parcialmente desactualizado (Mantenimiento multi-modelo, estado Socio/GDC)
- `PageHeader` en `components.md` sin archivo `components/ui/page-header.tsx`
- `PageHeader` en `components.md` sin archivo `components/ui/page-header.tsx`

**UI**
- Headers duplicados: `GddPageHeading`, `GdcvPageHeading`, `SocioPageHeading`, inline en Mantenimiento
- Mantenimiento: detalle y “Nuevo” son placeholders
- Algunos proyectos en Main sin `href` (Próximamente)

**Git**
- Trabajo reciente en `main`; commits de referencia: `1fadf7a` (socio + mantenimiento), `f9680e7` (GDC + mantenimiento compartido), `04c62c2` (gráficos diarios)

---

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Abrir http://localhost:3000 — redirección según configuración en `app/page.tsx`.

---

## Roles y acceso (resumen)

| Rol | Mantenimiento | Navegación típica |
|-----|---------------|-------------------|
| HINS Admin | ✅ (por parque) | `/main` → parque |
| Dueño GDD | ✅ | Sidebar GDD |
| AGC GDCV / GDC | ✅ | Sidebar del parque |
| Socio GDCV | ❌ | Solo tabs internos `/gdcv/socio/*` |

---

## Para revisión de PR (Claude Code / externos)

```
Repositorio: https://github.com/juanma25/hins-final-context
Rama: main
PR: (crear si se necesita review aislada) — o revisar commits desde 1fadf7a
```
