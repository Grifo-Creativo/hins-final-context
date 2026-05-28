# Flow: Administrador General Comunitario (AGC) — Parque GDCV

## Actor
AGC — Administrador del parque comunitario tipo GDCV.
Pregunta clave: ¿El parque está generando lo esperado y están llegando bien las compensaciones a cada socio?

**Acceso Mantenimiento:** ✅ Sí — módulo administrativo vía sidebar.  
**No confundir con el flow Socio** (`flows/GDCV-socio/`) — el socio no ve Mantenimiento.

---

## Pantallas

### GDCV_admin_01 — Vista: Performance del Parque
Ruta: `/gdcv/performance`
Vista por defecto al ingresar al flow.
Referencia visual: GDCV__admin_01.png

**Header:**
- H1: nombre del parque ("Parque Río Cuarto")
- Badge: "GDCV" — tipo de parque
- TabsForBlocks: "Performance del Parque" | "Retorno de Inversión" (tabs navegación entre vistas)
- Botón export: acción derecha

**Bloque 1 — Energía generada del parque (izquierda):**
- CardWithContent:
  - Title: "Energía generada del parque"
  - Subtitle: "Períodos mensuales"
  - Tabs: 1M / 3M / 6M (default 6M)
  - Chart: bar chart 6 meses (Nov 25–Abr 26), período actual destacado en --chart-1
  - Valores: 138 kWh (Nov), 121 kWh (Dic), 101 kWh (Ene), 85 kWh (Feb), 79 kWh (Mar), 124 kWh (Abr — actual)

**Bloque 2 — KPIs principales (derecha):**
- KpiPrimary:
  - Icon: ZapIcon
  - Label: "Generada en Abril"
  - Value: "124.2"
  - Unit: "kWh"
  - Delta: "+45 kWh vs mes anterior"
  - Sparkline: trend data
- Dos KpiSecondary en grid grid-cols-2 gap-6:
  - KpiSecondary 1: "Ahorro Total en Abril" | $248.143 | "+2.3% Mes"
  - KpiSecondary 2: "Promedio por usuario" | $21.836 | "+1.6% Mes"

**Bloque 3 — Socios del Parque (tabla principal):**
- SectionHeader: "Socios del Parque" size="md" + acciones derecha:
  - Botón "+ Nuevo Socio"
  - Selector período: "Abril 2026" dropdown
- Tabla con columnas:
  - Socio | Medidor | Participación (%) | Energía Generada | Ahorro Generado | acciones (⋮)
- Badges:
  - Socio "Ferretería Catalán" tiene badge "Virtual" (naranja)
- Row actions (⋮): acciones placeholder
- Paginación: "Showing 1 to 5 of 25 entries"
- Mock data: 6 socios visibles

---

### GDCV_admin_02 — Sheet: Detalle de Socio (overlay)
Trigger: click en row de tabla "Socios del Parque"
Referencia visual: GDCV__admin_02.png

**Header del sheet:**
- Nombre del socio: "Ferretería Catalán"
- Badge: "Socio Virtual" — naranja
- Botón cerrar (X) arriba derecha
- Copy corta: "Dispone de Autoconsumo y Crédito por Inyección a red."

**Contenido:**
- Row 1: "N° de Medidor" | 3551118 | gap | "Participación (%)" | 25%
- Row 2: "Energía generada" | 31.0 kWh | Abril 2026
- Row 3: Dos badges inline:
  - Badge 1: Ícono verde "Autoconsumo (virtual)" | 21.0 kWh
  - Badge 2: Ícono azul "Inyectada" | 10.0 kWh
  - Progress bar visual (68% | 32%)
- Row 4: "Ahorro Generado" | $62.000
- Row 5: Título "Más información del socio" + ícono menú (⋮)
- Rows adicionales: Potencia utilizada | Fecha de alta | Nombre del responsable | Teléfono de contacto | Ahorro en Emisiones
- Botón "Cerrar" al pie

---

### GDCV_admin_03 — Vista: Retorno de Inversión
Ruta: `/gdcv/roi`
Activado mediante tab "Retorno de Inversión"
Referencia visual: GDCV__admin_03.png

**Header:**
- Mismo que admin_01: nombre parque + badge GDCV + tabs + export

**Bloque 1 — KPIs ROI (grid 3 columnas):**

Layout: `grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_auto]`  
Implementación: `/components/gdcv/GdcvRoiView.tsx` · Mismo patrón que GDD ROI (`context/components.md` → KpiWithAsset, KpiWithTimeline, Card 3 custom)

| Col | Componentes | Datos Río Cuarto (base USD) |
|---|---|---|
| 1 | `KpiWithAsset` + `KpiProgressBar` | Recuperado `14.200.000` · Pendiente `23.800.000` · Total `38.000.000` · 37% |
| 2 | `KpiWithTimeline` | Recupero `6.8 años` · Payback Mar 2030 · TIR en Col 3 |
| 3 | `Card` + 3× `KpiSecondaryMetric` | TIR `18.50%` · Plazo `25 años` · Invertido compacto |

**Header ROI:** toggle **DOLAR | ARS** en `GdcvPageHeading` (mismo patrón que GDD).

**Bloque 2 — Tabla Dual: Proyectado | Histórico**

- Reutiliza `GddRoiRecuperoTable` con mock `gdcvRoiProyectado` / `gdcvRoiHistorico` (`data/gdcv-agc-mock.ts`)
- Mismas columnas y reglas de moneda que GDD (`flows/GDD/flow.md` Bloque 2)

**Deprecado:** layout anterior (KpiCard + `RoiRecoveryLineChart`). La curva permanece en mock para `/dev/components` y charts sueltos.

**Spec legacy timeline (referencia):**

```
[●————————●· · · · · · · · · · ○]
Inicio         Hoy · 37%        Payback
Mar 2024       May 2026         Mar 2030
```

- Línea track completa: `--border` (gris)
- Línea filled (Inicio → Hoy): `#27500A` (verde oscuro — chart-3 equiv)
- Nodo Inicio (izquierda): círculo 10px filled `#27500A`
- Nodo Hoy (centro en 37%): círculo 12px filled `#27500A` + ring `var(--background)`
  - Tooltip en nodo Hoy: `"May 2026 · 2.2 Años"` (mes/año + tiempo transcurrido; sin %)
- Nodo Payback (derecha): círculo 10px `--border` (sin llegar)
- Labels debajo de cada nodo: título (bold) + fecha (muted)
- NO es slider, NO es stepper, NO es interactivo excepto el tooltip

**Bloque 2 — Curva de Recuperación Acumulada (solo dev / legacy):**
- Chart `RoiRecoveryLineChart` — ya no en vista producto; mock `curvaRecuperacionData` en `data/gdcv-agc-mock.ts`

---

## Interacciones definidas

- Tab "Performance del Parque" → `/gdcv/performance`
- Tab "Retorno de Inversión" → `/gdcv/roi` (esta vista)
- Tooltip en nodo "Hoy" del timeline → `"May 2026 · 2.2 Años"` (vía `formatPaybackTooltipText`)
- Botón export: acción placeholder

---

## Mock data requerido

```ts
// GDCV_admin_03 — ROI (base USD numérico → UI con formatRoiFromUsd)
gdcvRoiKpis: {
  totalInvertido: 38_000_000,
  inversionRecuperada: 14_200_000,
  pendienteRecuperar: 23_800_000,
  porcentajeRecuperado: 37,
  recuperoEstimado: "6.8 años",
  tir: "18.50%",
  plazo: "25 años",
  timeline: {
    inicio: { label: "Inicio", fecha: "Mar 2024" },
    hoy: { label: "Hoy", fecha: "May 2026", pct: 37, elapsedYears: "2.2" },
    // tooltip: "May 2026 · 2.2 Años"
    payback: { label: "Payback", fecha: "Mar 2030" },
  },
}
// UI ejemplos (DOLAR): u$s 14.200.000 · u$s 23,8M (compact)

// Curva recuperación — valores alineados con KPIs
curvaRecuperacionData: [
  { fecha: "Mar 24", real: 2000,  proyectada: 2500  },
  { fecha: "Dic 24", real: 5500,  proyectada: 6000  },
  { fecha: "Jun 25", real: 9000,  proyectada: 10000 },
  { fecha: "Dic 25", real: 12000, proyectada: 14000 },
  { fecha: "May 26", real: 14200, proyectada: 16000 }, // ← punto actual
  { fecha: "Dic 26", real: null,  proyectada: 22000 },
  { fecha: "Jun 27", real: null,  proyectada: 28000 },
  { fecha: "Mar 30", real: null,  proyectada: 38000 }, // ← payback
],
curvaRecuperacionInversion: 38000,
```

---

## Nota para el agente

- Construir pantalla por pantalla. Esperar aprobación antes de continuar.
- Referencia visual: GDCV__admin_03.png — es la fuente de verdad.
- No usar --primary en charts. Usar --chart-1 para serie principal, --chart-2 para proyectada.
- Timeline: NO es slider, NO es stepper. Solo visual estático + HinsTooltip en nodo Hoy.
- HinsTooltip: siempre click/tap — NUNCA hover (regla del design system).
- Reutilizar RoiRecoveryLineChart existente sin modificarlo.
- Rutas: `/gdcv/performance` (default), `/gdcv/roi`, `/gdcv/mantenimiento`.

---

### GDCV_admin_mantenimiento — Vista: Mantenimiento del Parque
Ruta: `/gdcv/mantenimiento`  
Acceso: **solo sidebar AGC** (no aparece en header TabsForBlocks Performance | ROI).  
Sin wireframe dedicado — prototipo funcional.

**Header de página:**
- H1: nombre del parque + badge GDCV (sin subtítulo “Mantenimiento” — la tabla define el contenido)

**Bloque — Historial de Mantenimiento:**
- Contenedor tabla (`bg-white rounded-xl shadow-xs`)
- Título sección: **Historial de Mantenimiento**
- Acción header: botón **Nuevo** (primary + `PlusCircleIcon`) — placeholder hasta flow “Nueva mantención”
- Columnas: Período | Cantidad de Mantenciones | Costos Asociados
- Ordenamiento por header (3 estados: off → asc → desc)
- Período **Abril 2026** (en curso): badge verde **En Curso** junto al período (mismo patrón que compensaciones)
- Click en fila → **Sheet** lateral (título compacto ej. `Mant. Abr 2026`; contenido detalle pendiente)

**Mock data:** 10 períodos Jul 2025 – Abr 2026 — alineados a ventana operativa del parque (`data/gdcv-mock.ts` → `mantenimientoHistorialMock`).

**Interacciones:**
- Sidebar “Mantenimiento” → esta vista
- Botón Nuevo → sin flujo (pendiente)
- Fila → abre Sheet vacío / placeholder

**Roles sin acceso:** Socio GDCV — no ruta, no sidebar, no datos.
