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
Referencia visual: **GDD_ROI_Proyectado.png** (vista Proyectado - esta es la vista by default) + **GDD_ROI_historico.png** (vista Histórico)
**Datos y reglas de negocio:** `flows/GDD/roi-spec.md` · Mock: `data/gdd-roi-mock.ts`

**Header:** Nombre parque ("Parque General Roca") + badge GDD + TabsForBlocks navegación (Performance / Retorno de Inversión) + **Currency Toggle (DOLAR | ARS)** + botón export.

**Currency Toggle (CRÍTICO):**
- Control global en header que muta dinámicamente TODOS los valores USD de la página
- Default: DOLAR (`usd` — sin query param)
- Al cambiar a ARS: multiplica valores por `TIPO_CAMBIO_ARS` / `tipo_cambio_actual`, formateo vía `formatRoiFromUsd` (`lib/format-currency.ts`)
- Headers de tabla y KPIs: **sin** sufijo de moneda — contexto implícito del tab global (ver `design-system.md` → Currency Context Rules)
- **Agnósticos a currency:** Fechas, TIR, Plazo, Porcentajes, Estado

---

**Bloque 1 — Grid 3 columnas KPIs**

Layout: `grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_auto]`  
Implementación: `/components/gdd/GddRoiView.tsx` · Specs: `context/components.md` → KpiWithAsset, KpiWithTimeline, patrón Card 3

```
┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
│ Col 1: Inversión         │ Col 2: Payback           │ Col 3: TIR · Plazo · Inv.│
│ KpiWithAsset (dual KPI)  │ KpiWithTimeline          │ Card + grid custom       │
│ + KpiProgressBar         │ + KpiPaybackTimeline     │ 3× KpiSecondaryMetric    │
└──────────────────────────┴──────────────────────────┴──────────────────────────┘
```

#### **Columna 1 — Inversión Recuperada + Pendiente**

**Componente:** `KpiWithAsset` (modo dual KPI) + `KpiProgressBar`

- KPIs: `KpiSecondaryMetric` `size="standard"` — Inversión Recuperada (izq.) · Pendiente de recuperar (der.)
- Valores vía `formatRoiFromUsd` según tab DOLAR | ARS
- Asset: `KpiProgressBar`
  - Fill: `var(--chart-3)`, track `h-2`
  - Footnotes: izq. `formatCurrency(0, currency)` · der. `Total Invertido:` + valor
  - Tooltip en nodo: `{pct}% recuperado`

#### **Columna 2 — Recupero Estimado + Timeline**

**Componente:** `KpiWithTimeline` → `KpiWithAsset` + `SoftBadge` + `KpiPaybackTimeline`

- Label: "Recupero Estimado" · Value: ej. `7.0 años` (agnóstico a currency)
- Badge header: `SoftBadge` "Payback"
- Timeline: track `h-[3px]`, acento `green-600`, tooltip shadcn en nodo Hoy
- Props `timelineData` desde mock (`gdd-roi-mock.ts`)

#### **Columna 3 — TIR · Plazo · Invertido (layout custom, sin organismo)**

**Componente:** `Card` + grid responsive + 3× `KpiSecondaryMetric` — **no** crear organismo

- Mobile: `grid-cols-3` — TIR | Plazo | Invertido en fila
- Desktop (`lg`): `grid-cols-1` — apiladas verticalmente
- TIR: `valueClassName="text-green-600"` · agnóstico a currency
- Plazo: agnóstico a currency
- Invertido: `formatRoiFromUsd(..., "axis")` — afectado por currency toggle

**Nota:** TIR y Plazo son **agnósticos a currency**. Invertido sí muta con tab DOLAR | ARS.

---

**Bloque 2 — Tabla Dual: Proyectado | Histórico**

CardWithContent:
- Title: "Tabla Recupero de Inversión (Proyectado)" o "Tabla Recupero de Inversión (Histórico)" (depende tab activo)
- Action header: 
  - Tabs: `TabsForBlocks` — **Proyectado** (default) | Histórico
  - Button: "Ver columnas" (toggle visibilidad)
  - Columnas fijas (no ocultables): Período | acciones (⋮)

#### **Tab: PROYECTADO** (default, datos futuros)

Columnas:
1. **Período** — String (cronológico forward: "Mayo 2026", "Junio 2026", etc.)
2. **Ahorro Estimado** — Valor monetario (afectado por currency toggle; prefijo en celda)
3. **Pendiente de Recuperar** — Valor monetario (afectado por currency toggle; prefijo en celda)
4. **Avance de Recuperación** — Porcentaje (NO afectado por currency)
5. **Estado** — Tag (En Curso / Estimado) (NO afectado por currency)
6. **Acciones** (⋮) — Descargar | Copiar | Compartir

Mock data (exacto de Gemini, `data/gdd-roi-mock.ts`):
```
Mayo 2026:      $180.000  | $15.000.000  | 28.5%  | En Curso
Junio 2026:     $140.000  | $14.820.000  | 29.4%  | Estimado
Julio 2026:     $150.000  | $14.680.000  | 30.1%  | Estimado
Agosto 2026:    $190.000  | $14.530.000  | 30.8%  | Estimado
Septiembre 2026: $270.000 | $14.340.000  | 32.1%  | Estimado
Octubre 2026:   $320.000  | $14.070.000  | 33.0%  | Estimado
```

Paginación al pie (derecha)

#### **Tab: HISTÓRICO** (datos pasados)

Columnas:
1. **Período** — String (descendente backward: "Abril 2026", "Marzo 2026", etc.)
2. **Cap. Recuperado** — Valor monetario mensual (afectado por currency toggle; prefijo en celda)
3. **Recupero Acumulado** — Valor monetario acumulado (afectado por currency toggle; prefijo en celda)
4. **Avance de Recuperación** — Porcentaje (NO afectado por currency)
5. **Acciones** (⋮) — Descargar | Copiar | Compartir

Mock data (exacto de Gemini, `data/gdd-roi-mock.ts`):
```
Abril 2026:     $210.000  | $6.000.000   | 28.5%
Marzo 2026:     $260.000  | $5.790.000   | 27.6%
Febrero 2026:   $340.000  | $5.530.000   | 26.3%
Enero 2026:     $390.000  | $5.190.000   | 24.7%
Diciembre 2025: $370.000  | $4.800.000   | 22.9%
Noviembre 2025: $310.000  | $4.430.000   | 21.1%
```

Paginación al pie (derecha)

---

## Interacciones definidas

- Tab "Performance del Parque" → `/gdd/performance`
- Tab "Retorno de Inversión" → `/gdd/roi` (esta vista)
- Currency Toggle (DOLAR | ARS) → muta valores vía `formatRoiFromUsd`; montos `u$s ` / `$ ` según `context/components.md` → FormatCurrency
- Tabla tabs: Proyectado ↔ Histórico → cambia datos y columnas
- Tabla "Ver columnas" → toggle visibilidad de columnas (patrón estándar)
- Tabla acciones (⋮): Descargar | Copiar | Compartir
- Botón export (header): placeholder (no implementar lógica)

---

## Mock data requerido

Crear `data/gdd-roi-mock.ts`:

```ts
export const gddRoiKpis = {
  // Variables globales (KPIs superiores)
  totalInvertido: 21000000,      // USD base
  inversionRecuperada: 6000000,
  porcentajeRecuperado: 28.5,
  pendienteRecuperar: 15000000,
  recuperoEstimado: "7.0 años",
  fechaInicio: "Mayo 2024",
  fechaCorteActual: "Mayo 2026",
  tiempoTranscurrido: "2.0 años",
  fechaPayback: "Mayo 2031",
  tir: "15.00%",
  plazo: "20 años",
  paybackVelocity: "+8% más rápido de lo estimado", // tag informativo
  
  // Timeline Payback
  timeline: {
    inicio: { label: "Inicio", fecha: "Mayo 2024" },
    hoy: { label: "Hoy", fecha: "Mayo 2026", pct: 28.5, elapsedYears: "2.0" },
    // tooltip: "Mayo 2026 · 2.0 Años"
    payback: { label: "Payback", fecha: "Mayo 2031" },
  },
}

export const gddRoiProyectado = [
  { periodo: "Mayo 2026", ahorroEstimado: 180000, pendienteRecuperar: 15000000, progresoEstimado: 28.5, estado: "En Curso" },
  { periodo: "Junio 2026", ahorroEstimado: 140000, pendienteRecuperar: 14820000, progresoEstimado: 29.4, estado: "Estimado" },
  { periodo: "Julio 2026", ahorroEstimado: 150000, pendienteRecuperar: 14680000, progresoEstimado: 30.1, estado: "Estimado" },
  { periodo: "Agosto 2026", ahorroEstimado: 190000, pendienteRecuperar: 14530000, progresoEstimado: 30.8, estado: "Estimado" },
  { periodo: "Septiembre 2026", ahorroEstimado: 270000, pendienteRecuperar: 14340000, progresoEstimado: 32.1, estado: "Estimado" },
  { periodo: "Octubre 2026", ahorroEstimado: 320000, pendienteRecuperar: 14070000, progresoEstimado: 33.0, estado: "Estimado" },
]

export const gddRoiHistorico = [
  { periodo: "Abril 2026", capRecuperado: 210000, capRecuperadoAcumulado: 6000000, porcentajeRecuperacion: 28.5 },
  { periodo: "Marzo 2026", capRecuperado: 260000, capRecuperadoAcumulado: 5790000, porcentajeRecuperacion: 27.6 },
  { periodo: "Febrero 2026", capRecuperado: 340000, capRecuperadoAcumulado: 5530000, porcentajeRecuperacion: 26.3 },
  { periodo: "Enero 2026", capRecuperado: 390000, capRecuperadoAcumulado: 5190000, porcentajeRecuperacion: 24.7 },
  { periodo: "Diciembre 2025", capRecuperado: 370000, capRecuperadoAcumulado: 4800000, porcentajeRecuperacion: 22.9 },
  { periodo: "Noviembre 2025", capRecuperado: 310000, capRecuperadoAcumulado: 4430000, porcentajeRecuperacion: 21.1 },
]
```

---

## Notas para el agente

- **CRÍTICO:** El currency toggle es un control global en el header que afecta TODOS los valores USD de la página (KPIs y tablas).
- **Conversión dinámica:** Backend multiplica `valor_usd * tipo_cambio_actual` (NO tabla estática).
- **Agnósticos a currency:** Fechas, TIR (15%), Plazo (20 años), Porcentajes (%), Estado, Timeline.
- **Timeline:** Reutilizar componente existente del ROI actual. Solo cambiar wording, NO tocar comportamiento.
- **Chart "Curva de Recuperación":** Se construye como componente en `/components/charts/RoiRecoveryLineChart.tsx` pero NO se implementa en esta vista. Guardar para futuro.
- Grid: `min-h-0 grid-cols-1 gap-6 lg:grid-cols-3` — stretch vertical en desktop.
- Cards: `h-full min-h-0 flex flex-col` — igualan altura de fila.
- Progress bar: `var(--chart-3)` (verde recuperación).
- NO hardcodear colores hex — usar tokens (`var(--color-green-600)`, etc.).
- Tabla: `TabsForBlocks` para Proyectado | Histórico; "Ver columnas" para toggle de visibilidad.
- Data exacta de Gemini — respeta estacionalidad fotovoltaica (verano alto, invierno bajo).
- Sin TypeScript errors.

---

## Checklist

- [ ] Header con currency toggle (DOLAR | ARS)
- [ ] Grid 3 columnas con `min-h-0` en todos lados
- [ ] Col 1: Inv. Recuperada + progress bar + Pendiente + Total Invertido
- [ ] Col 2: Recupero Estimado + Timeline (reutilizado, mismo comportamiento)
- [ ] Col 3: TIR · Plazo · Invertido — layout custom (`Card` + grid + `KpiSecondaryMetric`); TIR/Plazo agnósticos a currency
- [ ] Bloque 2: Tabla dual con TabsForBlocks (Proyectado | Histórico)
- [ ] Tabla Proyectado: Período | Ahorro Est. | Pendiente | Progreso % | Estado | ⋮
- [ ] Tabla Histórico: Período | Cap. Recuperado | Cap. Acumulado | % Recuperación | ⋮
- [ ] Currency toggle muta dinámicamente TODOS los valores USD
- [ ] Importar data exacta de `data/gdd-roi-mock.ts`
- [ ] Sin Chart de Curva (guardado pero no implementado)
- [ ] Sin TypeScript errors
- [ ] Visual fiel a GDD_ROI_Proyectado.png + GDD_ROI_historico.png
