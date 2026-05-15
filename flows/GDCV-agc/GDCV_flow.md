# Flow: Administrador General Comunitario (AGC) — Parque GDCV

## Actor
AGC — Administrador del parque comunitario tipo GDCV.
Pregunta clave: ¿El parque está generando lo esperado y están llegando bien las compensaciones a cada socio?

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

Layout: `grid grid-cols-3 gap-6`

- Columna 1 — 2 KpiSecondary apiladas (flex flex-col gap-6):
  - KpiSecondary 1:
    - Icon: TrendingUpIcon
    - Label: "Inversión Inicial"
    - Value: "$38.000.000"
    - Delta: (sin delta)
  - KpiSecondary 2:
    - Icon: DollarSignIcon
    - Label: "Ahorrado Total (en facturas)"
    - Value: "$8.933.000"
    - Delta: (sin delta)

- Columna 2 — Card con métricas de recuperación:
  - Label: "Cap. Recuperado" | Value grande: "$14.200.000"
  - Label: "Pendiente" | Value: "$23.800.000"
  - Progress bar: 37% recuperado (label "37% recuperado" debajo)
  - Usar tokens: barra filled → `--chart-3` | barra track → `--border`

- Columna 3 — Card "Recupero Estimado":
  - Badge derecha: "TIR 18.5"
  - Value grande: "6.8 años"
  - Label: "Recupero Estimado"
  - Timeline component (ver spec abajo)

**Spec: Timeline de Payback (componente inline — NO interactivo, NO slider)**

```
[●————————●· · · · · · · · · · ○]
Inicio         Hoy · 37%        Payback
Mar 2024       May 2026         Mar 2030
```

- Línea track completa: `--border` (gris)
- Línea filled (Inicio → Hoy): `#27500A` (verde oscuro — chart-3 equiv)
- Nodo Inicio (izquierda): círculo 10px filled `#27500A`
- Nodo Hoy (centro en 37%): círculo 12px filled `#27500A` + ring `var(--background)`
  - Tooltip (HinsTooltip — click/tap, NO hover): "Hoy · 2.2 años · 37% recuperado"
- Nodo Payback (derecha): círculo 10px `--border` (sin llegar)
- Labels debajo de cada nodo: título (bold) + fecha (muted)
- NO es slider, NO es stepper, NO es interactivo excepto el tooltip

**Bloque 2 — Curva de Recuperación Acumulada:**
- CardWithContent full width:
  - Title: "Curva de Recuperación Acumulada"
  - Subtitle: "Crédito acumulado vs Inversión inicial"
  - Reutilizar chart existente (`RoiRecoveryLineChart`) sin cambios
  - Mock data alineado con KPIs superiores:
    - Inversión referencia: $38.000.000
    - Punto actual (May 2026): ~$14.200.000 recuperado (37%)
    - Payback proyectado: Mar 2030

---

## Interacciones definidas

- Tab "Performance del Parque" → `/gdcv/performance`
- Tab "Retorno de Inversión" → `/gdcv/roi` (esta vista)
- Tooltip en nodo "Hoy" del timeline → HinsTooltip (click/tap) mostrando "Hoy · 2.2 años · 37% recuperado"
- Botón export: acción placeholder

---

## Mock data requerido

```ts
// GDCV_admin_03 — ROI
roi: {
  inversionInicial: "$38.000.000",
  ahorradoTotal: "$8.933.000",
  capRecuperado: "$14.200.000",
  pendiente: "$23.800.000",
  porcentajeRecuperado: 37,
  recuperoEstimado: "6.8 años",
  tir: "18.5",
  timeline: {
    inicio: { label: "Inicio", fecha: "Mar 2024" },
    hoy: { label: "Hoy · 37%", fecha: "May 2026", pct: 37, tooltipText: "Hoy · 2.2 años · 37% recuperado" },
    payback: { label: "Payback", fecha: "Mar 2030" },
  },
}

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
- Rutas: `/gdcv/performance` (default) y `/gdcv/roi`.
