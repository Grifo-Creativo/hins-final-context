# Flow: Dueño del Parque GDD

## Actor
Dueño GDD — Usuario accede únicamente a su parque.
Pregunta clave: ¿Cuánto me está ahorrando el parque y cuándo recupero la inversión?

---

## Pantallas

### GDD_01 — Vista: Performance del Parque
Ruta: `/gdd/performance`
Vista por defecto al ingresar al flow.
Referencia visual: GDD_01.png

**Bloques (orden vertical):**

1. **Header:** Nombre del parque ("Parque General Roca") + badge GDD + TabsForBlocks navegación (Performance / Retorno de Inversión) + botón export.

2. **Card izquierda:** "Energía Generada del Parque" — bar chart 6 meses (Nov 25–Abr 26)
   - Chips período: 1M / 3M / 6M (default: 6M)
   - Período actual (Abr 26) destacado en `var(--chart-1)` (verde)

3. **Card derecha superior:** KpiPrimary "Generada en Abril"
   - Value: 830.17 kWh
   - Sparkline trend
   - SoftBadge: "+220 kWh vs mes anterior"
   - **NO se liga al filtro del chart**

4. **Cards derechas inferiores (2x KpiSecondary):**
   - KpiSecondary 1: "Ahorro acumulado en Abril" — $66.400 (sin tooltip)
   - KpiSecondary 2: "Valor de Tarifa Actual" — $80 /kWh (con `infoTooltip`)

5. **Tabla:** `ConsumptionHistoryTable` — "Historial de Generación"
   - Columnas: Período | Energía generada | Energía comprada | Cobertura (%) | Cobertura ($) | acciones (⋮)
   - Acciones fila: Descargar | Copiar | Compartir
   - Paginación al pie (derecha)
   - **NO se liga al filtro del chart**

**Interacciones:**
- Tab "Retorno de Inversión" → `/gdd/roi`
- Chips 1M/3M/6M → actualizan SOLO el chart de barras
- KPIs y tabla: independientes del filtro

---

### GDD_02 — Vista: Retorno de Inversión
Ruta: `/gdd/roi`
Referencia visual: GDD_02.png (actualizada)

**Header:** Igual a GDD_01 (nombre parque + badge GDD + tabs + export)

**Bloque 1 — Grid 3 columnas ROI KPIs**

Layout: `grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-3`

```
┌────────────────────┬────────────────────┬────────────────────┐
│ Col 1              │ Col 2              │ Col 3              │
│ Inversión +        │ Cap. Recuperado +  │ Recupero Estimado  │
│ Ahorro Total       │ Pendiente + Bar    │ + Timeline         │
└────────────────────┴────────────────────┴────────────────────┘
```

#### **Columna 1 — Una Card con 2 KPIs apiladas**

Card: `h-full min-h-0 flex flex-col`  
Interior: `flex-1 flex-col gap-6 p-6`

Fila 1 — Inversión Inicial:
- Icon wrapper: `size-9 rounded-md bg-[#F2ECE9]/36 text-green-600`
- Icon: TrendingUpIcon
- Label: "Inversión Inicial"
- Value: `roiKpis.inversionInicial` (text-xl font-semibold)

Fila 2 — Ahorrado Total Acumulado:
- Icon wrapper: `size-9 rounded-md bg-[#F2ECE9]/36 text-green-600`
- Icon: DollarSignIcon
- Label: "Ahorrado Total Acumulado"
- Value: `roiKpis.ahorradoTotal` (text-xl font-semibold)

**Spacing:** `gap-6` entre filas (sin dividers)

#### **Columna 2 — Una Card con métricas + progress bar**

Card: `h-full min-h-0 flex flex-col`  
Interior: `flex-1 flex flex-col p-6`

Fila superior (shrink-0):
- Layout: `flex justify-between gap-4`
- Izquierda: "Cap. Recuperado" label + value
- Derecha: "Pendiente" label + value (items-end)
- Values: text-xl font-semibold

Spacer: `mt-auto` (empuja barra al pie)

Fila inferior (shrink-0, mt-auto):
- Label: `{roiKpis.porcentajeRecuperado}% recuperado` (text-left)
- Progress bar: `h-2 w-full rounded-full bg-border`
  - Filled: `width: ${porcentajeRecuperado}%`
  - Color: `var(--chart-3)` (token de charts)

#### **Columna 3 — KpiWithTimeline**

Componente: `<KpiWithTimeline />`

Props:
```tsx
<KpiWithTimeline
  label="Recupero Estimado"
  value={roiKpis.recuperoEstimado}  // "6.8 años"
  metricBadge={`TIR ${roiKpis.tir}`}  // "TIR 18.5"
  timelineData={{
    inicio: roiKpis.timeline.inicio,
    hoy: roiKpis.timeline.hoy,
    payback: roiKpis.timeline.payback,
  }}
/>
```

**Spec interna:**
- Card: `h-full min-h-0 flex flex-col`
- Interior: `flex-1 flex flex-col justify-between p-6`
- Bloque superior: label + valor + badge (gap-4 entre)
- Bloque inferior: timeline (anchored al fondo)
- Timeline color: `var(--color-green-600)` (token consistente)
- Tooltip en nodo "Hoy": HinsTooltip (click/tap, NO hover)
- Etiquetas: solo fechas (Inicio | Hoy | Payback)

---

**Bloque 2 — Chart de Recuperación Acumulada**

CardWithContent:
- Title: "Curva de Recuperación Acumulada"
- Subtitle: "Crédito acumulado vs Inversión inicial"

Component: `<RoiRecoveryLineChart />`

Props:
```tsx
<RoiRecoveryLineChart
  data={curvaRecuperacionData}
  chartConfig={roiRecoveryChartConfig}
  investmentReference={curvaRecuperacionInversion}
/>
```

---

## Interacciones definidas

- Tab "Performance del Parque" → `/gdd/performance`
- Tab "Retorno de Inversión" → `/gdd/roi` (esta vista)
- Tooltip en nodo "Hoy" del timeline → HinsTooltip (click/tap)
- Botón export: placeholder (no implementar lógica)

---

## Mock data requerido

**Temporary:** Usar `roiKpis` de `data/gdcv-agc-mock.ts` (mismos datos que GDCV)

```ts
// data/gdcv-agc-mock.ts (reutilizar)
roiKpis = {
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

curvaRecuperacionData = [...]  // mismos datos que GDCV
curvaRecuperacionInversion = 38000
```

**Futuro:** Crear `data/gdd-mock.ts` con datos específicos del Dueño GDD.

---

## Notas para el agente

- Construir de una vez (no por pantalla — ya tenemos spec clara).
- Referencia visual: **GDD_02.png** (fuente de verdad para layout).
- Patrón: copiar estructura exacta de `components/gdcv/GdcvRoiView.tsx`.
- Grid: `min-h-0 grid-cols-1 gap-6 lg:grid-cols-3` — stretch vertical en desktop.
- Cards: `h-full min-h-0 flex flex-col` — igualan altura de fila.
- Progress bar: `mt-auto flex shrink-0 flex-col gap-2` — al pie de la card.
- NO usar `--primary` en charts. Usar `var(--chart-3)` para progress bars.
- NO hardcodear colores hex — usar tokens (ej. `var(--color-green-600)` para timeline).
- Reutilizar componentes: Card, CardWithContent, KpiWithTimeline, RoiRecoveryLineChart.
- Reutilizar mock: `roiKpis`, `curvaRecuperacionData` de `gdcv-agc-mock.ts` (temporalmente).
- Sin TypeScript errors.

---

## Checklist

- [ ] Grid 3 columnas con `min-h-0` en todos lados
- [ ] Col 1: Una Card, 2 KPIs, gap-6, sin dividers
- [ ] Col 2: Una Card, métricas arriba, barra abajo (mt-auto), % a la izquierda
- [ ] Col 3: KpiWithTimeline con timeline al fondo
- [ ] Block 2: CardWithContent + RoiRecoveryLineChart
- [ ] Imports correctos (gdcv-agc-mock)
- [ ] Sin errores TS
- [ ] Visual fiel a GDD_02.png
