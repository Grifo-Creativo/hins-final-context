# ux-guidelines.md
# HINS — Patrones de UX

Implementación exacta de componentes y clases: `components.md` (precede este doc).  
Tokens y geometría: `design-system.md`.

---

## 1. Principios

- El sistema es de **visibilidad**, no operativo: no inventar flujos de acción sobre la red.
- Cada rol ve solo su información (`product-context.md`).
- Jerarquía clara: contexto del parque → bloque de vista → detalle.
- En mobile, la acción principal del bloque debe quedar en viewport sin scroll excesivo.

---

## 2. Jerarquía visual

- Fondo del shell: `bg-background-subtle`; cards de contenido: `bg-white`.
- `--primary` solo en CTAs y focus — nunca en charts ni tabs activos.
- Tabs de bloque (`TabsForBlocks`): activo = `bg-white shadow-sm`, no `--primary`.
- Headings: el **tag semántico** define jerarquía (`h1` página, `h2` sección, `h3` bloque), no el tamaño visual (`SectionHeader` `level` en `components.md`).

---

## 3. Drill-down y Sheet

### Cuándo usar Sheet (panel lateral)

Usar **Sheet** cuando el usuario explora **detalle secundario** sin abandonar la vista actual:

| Caso | Ejemplo en producto |
|------|---------------------|
| Fila de tabla → detalle | Socio en parque, mantenimiento |
| KPI / CTA → tabla o desglose ancho | Socio ROI → tabla recupero |
| Icono header → lista | Notificaciones GDD / Main |

**No usar** Dialog (modal centrado) para drill-down.  
**No abrir** página nueva si el contenido cumple criterio Sheet y la vista padre debe mantener contexto (filtros, tabs, scroll).

Excepciones: sidebar mobile (`--sidebar-width`), rutas full-page de ROI admin (`/gdd/roi`, `/gdcv/roi`).

### Perfiles de ancho (UX)

Tres perfiles documentados — el agente no inventa anchos:

| Perfil | Intención UX | Referencia código |
|--------|----------------|-------------------|
| **Detalle** | Lectura focal, una entidad | `SheetContentDetail` o `sheetContentClassName("detail")` |
| **Notificaciones** | Lista + descripción corta | `SheetOpsNotificationsHeader` + `sheetContentClassName("notifications")` |
| **Tabla** | Tabla densa + tabs de variante | `SheetContentTable` |

En **mobile** el panel prioriza `w-full`; tablas ganan espacio con **scroll horizontal**, no ensanchando el sheet más allá del viewport (`components.md` § Sheet — mobile vs `sm+`).

### Shell OPS (experiencia)

Patrón mental para el usuario:

1. **Header** — título del bloque + cerrar (icono outline).
2. **Cuerpo con scroll** — contenido; tablas sin card blanca interna.
3. **Footer opcional** — «Cerrar» ancho completo cuando el contenido es largo (tablas).

No duplicar título: en sheets de tabla el título va en `SheetTitle`, no en un `h3` dentro de la tabla.

### Tablas en Sheet

- Una sola superficie (`bg-popover` del panel).
- Tabs **Proyectado | Histórico** a ancho útil; ocultar «Ver columnas» si el toolbar debe ser solo variante.
- Moneda: heredar el toggle de la vista padre (no duplicar DOLAR | ARS en el sheet).
- Agrupaciones internas → `CardWire`; **no** `Card` con sombra envolviendo la tabla.

**Implementación:** `lib/sheet-layout.ts`, `components/ui/sheet-ops.tsx` (`SheetContentTable`, `SheetContentDetail`, `SheetOpsNotificationsHeader`, …). Spec: `components.md` § Sheet + § SheetOps. Demo: `/app/dev/components`.

---

## 4. Navegación

- Rutas internas: `next/link`, no `<a href>`.
- Breadcrumb en vistas de parque; Socio sin sidebar de admin.
- Notificaciones: solo Sheet desde header, no ruta dedicada (`/gdd/notifications` redirige conceptualmente).

---

## 5. Mobile

- Sidebar: Sheet overlay; estado colapsado en desktop vía cookie (`design-system.md`).
- Drill-down: mismo Sheet; perfiles de ancho según §3.
- Acción principal del bloque visible sin depender de scroll hasta el footer de página.

---

## 6. Estados vacío, carga y error

- Nunca pantalla en blanco sin mensaje ni contexto.
- Siempre comunicar cargando / error / sin datos.
- Placeholders de módulo pendiente (GDC) deben indicar que el bloque llegará, no simular datos falsos como reales.

---

## 7. Datos y períodos

- No mezclar períodos distintos en la misma vista sin indicarlo.
- No reutilizar la misma serie para 1M / 3M / 6M sin derivación explícita.
- Labels de KPI sin moneda embebida — contexto vía tab DOLAR | ARS + prefijo en valor (`components.md` FormatCurrency).

---

## 8. Accesibilidad

- Estados de foco: siempre `--ring`.
- Contraste mínimo texto/fondo: 4.5:1 (WCAG AA).
- Colores de chart: ratio >3:1 sobre fondo blanco (estándar) o >2.7:1 si se mitiga con patrón visual (WCAG Border).
- No comunicar información solo por color — acompañar con patrón visual (sólido/punteado/grosor), texto o ícono.
- Íconos decorativos: `aria-hidden="true"`.
- Tablas: `<caption>` o `aria-label` descriptivo.
- Charts: validar con herramientas de daltonismo (protanopia, deuteranopia, tritanopia).
  - Recharts: usar `role="img"` + `aria-label` descriptivo en ResponsiveContainer.
  - Leyenda siempre: colores + patrones visuales (sólido/punteado) + labels.

---

## 9. Anti-patterns

- ❌ Mostrar datos de otros usuarios al Socio
- ❌ Exponer el módulo **Mantenimiento** al Socio / Cesionario (sidebar, rutas, tablas, KPIs o acciones de mantención)
- ❌ Incluir ítem “Mantenimiento” en navegación del flow Socio (`/gdcv/socio/*`)
- ❌ Usar `--primary` en charts
- ❌ Usar colores de chart en botones, badges o navegación
- ❌ Confiar SOLO en color para diferenciar series — siempre acompañar con patrón visual (sólido/punteado/grosor)
- ❌ Poner la acción principal fuera del viewport en mobile
- ❌ Usar Dialog (modal centrado) para drill-down — usar Sheet (§3)
- ❌ Mostrar pantalla vacía sin contexto cuando no hay datos
- ❌ Mezclar períodos distintos en la misma vista sin indicarlo
- ❌ Reutilizar la misma serie para 1M / 3M / 6M sin derivación
- ❌ Ocultar el estado del sistema (cargando, error, vacío)
- ❌ Abrir detalle o drill-down en página nueva si cumple criterio Sheet (§3)
- ❌ Fuentes distintas a `--font-sans`
- ❌ Hardcodear `font-family` en componentes
- ❌ Tamaños de fuente menores a 0.75rem (12px)
- ❌ Crear variantes de TabsForBlocks fuera del spec de `components.md`
- ❌ Usar tab activo con `--primary` o color negro — siempre `bg-white shadow-sm`
- ❌ Dejar columnas con altura auto en layouts multi-columna que requieren equal height
- ❌ Table dentro de Card
- ❌ Card con sombra **dentro** de Sheet envolviendo una tabla
- ❌ Usar heading semántico incorrecto — el nivel del tag define jerarquía, no el tamaño visual
- ❌ Charts sin tooltip accesible — información debe ser explorable sin hover
- ❌ Líneas de chart muy delgadas (<1.5px) con colores claros — aumentar grosor para visibilidad
- ❌ Inventar clases de ancho de Sheet fuera de los tres perfiles (§3)

---

## 10. Charts financieros — Paleta extendida (Zinc + Green + Rose)

### Contexto

Charts de proyección financiera (ROI, recuperación, payback) requieren semántica que va más allá de la paleta green estándar: datos reales, proyecciones, oportunidades, riesgos.

### Paleta y uso

| Rol | Color | Ejemplo | Grosor | Patrón | Contrast |
|---|---|---|---|---|---|
| Datos reales | Zinc 950 | Real acumulada | 3px | Sólido | 16:1 ✅ AAA |
| Proyecciones | Zinc 600 @ 60% | Base | 2px | Sólido | 8:1 ✅ AA |
| Favorable | Green 500 | Escenario optimista | 1.5px | Sólido | 7.1:1 ✅ AA |
| Riesgo | Rose 400 | Escenario cautela | 2.5px | Punteado | 3.1:1 ⚠️ Border |
| Meta/Éxito | Green 600 | Objetivo, breakeven | 2px | Sólido | 9.8:1 ✅ AA |
| Referencia | Zinc 800 | Hoy, marcador temporal | 1.5px | Sólido | 11:1 ✅ AAA |

### Reglas

**Construcción:**
1. Línea de dato real = Zinc 950 sólida, máxima prominencia
2. Líneas de proyección = Zinc 600 con alpha 0.6
3. Línea favorable = Green 500
4. Línea riesgo = Rose 400 punteada (grosor ≥ 2.5px)
5. Línea meta = Green 600
6. Referencia temporal = Zinc 800

**Accesibilidad:** Rose 400 solo con patrón punteado + leyenda + tooltip. Validar daltonismo antes de ship.

### Cuándo usar / no usar

✅ ROI, payback, recuperación, escenarios base/favorable/riesgo  
❌ Generación, consumo, energía (Green ramp estándar)  
❌ UI funcional (botones, badges, navegación)

Detalle de tokens: `design-system.md` — Paleta extendida para Finanzas.
