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

**Header:** Nombre parque ("Parque General Roca") + badge GDD + TabsForBlocks navegación (Performance / Retorno de Inversión) + **Currency Toggle (DOLAR | ARS)** + botón export.

**Currency Toggle (CRÍTICO):**
- Control global en header que muta dinámicamente TODOS los valores USD de la página
- Default: DOLAR (`usd` — sin query param)
- Al cambiar a ARS: multiplica valores por `TIPO_CAMBIO_ARS` / `tipo_cambio_actual`, formateo vía `formatRoiFromUsd` (`lib/format-currency.ts`)
- Headers de tabla monetarios: sufijo `(DOLAR)` o `(ARS)` — ver `currencyColumnLabel`
- **Agnósticos a currency:** Fechas, TIR, Plazo, Porcentajes, Estado

---

**Bloque 1 — Grid 3 columnas KPIs**

Layout: `grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-3`

```
┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
│ Col 1: Inversión         │ Col 2: Payback           │ Col 3: TIR + Plazo       │
│ - Inv. Recuperada (DOLAR)│ - Recupero Estimado      │ - TIR                    │
│ - Progress bar 28.5%     │ - Timeline visual        │ - Plazo                  │
│ - Pendiente (DOLAR)      │                          │                          │
│ - Total Invertido        │                          │                          │
└──────────────────────────┴──────────────────────────┴──────────────────────────┘
```

#### **Columna 1 — Card Inversión Recuperada + Pendiente**

Card: `h-full min-h-0 flex flex-col`  
Interior: `flex-1 flex flex-col justify-between p-6 gap-4`

Fila 1 (top):
- Label: "Inversión Recuperada (DOLAR)" — secundario text-sm; en ARS → `(ARS)` + `formatRoiFromUsd`
- Value: `u$s 6.000.000` en DOLAR (text-2xl font-bold)
- Progress label badge: `28.5% recuperado` (text-xs font-semibold, bg-foreground text-background, rounded-full)

Progress bar:
- Height: `h-2 w-full rounded-full bg-border`
- Filled: `width: 28.5%` — color: `var(--chart-3)` (verde recuperación)
- Scale: `$ 0` (left) → `Total Invertido: $21.000.000` (right, text-xs)

Spacer: `mt-auto`

Fila 2 (bottom):
- Label: "Pendiente de recuperar (DOLAR)" — secundario text-sm
- Value: `u$s 15.000.000` en DOLAR (text-2xl font-bold)

#### **Columna 2 — Card Payback + Timeline**

Card: `h-full min-h-0 flex flex-col`  
Interior: `flex-1 flex flex-col justify-between p-6 gap-4`

Fila 1 (top):
- Label: "Recupero Estimado (Payback)" — secundario text-sm
- Value: `7.0 años` (text-2xl font-bold)

Spacer: `mt-auto`

Fila 2 (bottom):
- **Component:** `<RoiPaybackTimeline />` (reutilizar componente existente de ROI actual)
- Props:
  ```tsx
  <RoiPaybackTimeline
    timelineData={{
      inicio: { label: "Inicio", fecha: "Mayo 2024" },
      hoy: { label: "Hoy", fecha: "Hoy", pct: 28.5, tooltipText: "Mayo 2026 · 2.0 Años" },
      payback: { label: "Payback", fecha: "Mayo 2031" },
    }}
  />
  ```
- Timeline es visual, NO interactivo (tooltip on-click si existe en componente actual)
- Color: `var(--color-green-600)` (consistente con progreso)

#### **Columna 3 — Card TIR + Plazo**

Card: `h-full min-h-0 flex flex-col`  
Interior: `flex-1 flex flex-col justify-between p-6 gap-6`

Fila 1 (top):
- Label: "TIR" — secundario text-sm
- Value: `15.00%` (text-2xl font-bold, color: `var(--color-green-600)`)

Spacer: `mt-auto`

Fila 2 (bottom):
- Label: "Plazo" — secundario text-sm
- Value: `20 Años` (text-2xl font-bold)

**Nota:** TIR y Plazo son **agnósticos a currency** (no afectados por toggle USD/ARS)

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
2. **Ahorro Estimado (DOLAR/ARS)** — Valor monetario (afectado por currency toggle)
3. **Pendiente de Recuperar (DOLAR/ARS)** — Valor monetario (afectado por currency toggle)
4. **Progreso Estimado (%)** — Porcentaje (NO afectado por currency)
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
2. **Cap. Recuperado (DOLAR/ARS)** — Valor monetario mensual (afectado por currency toggle)
3. **Cap. Recuperado Acumulado (DOLAR/ARS)** — Valor monetario acumulado (afectado por currency toggle)
4. **Porcentaje de Recuperación (%)** — Porcentaje (NO afectado por currency)
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
    hoy: { label: "Hoy", fecha: "Hoy", pct: 28.5, tooltipText: "Mayo 2026 · 2.0 Años" },
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
- [ ] Col 3: TIR + Plazo (agnósticos a currency)
- [ ] Bloque 2: Tabla dual con TabsForBlocks (Proyectado | Histórico)
- [ ] Tabla Proyectado: Período | Ahorro Est. | Pendiente | Progreso % | Estado | ⋮
- [ ] Tabla Histórico: Período | Cap. Recuperado | Cap. Acumulado | % Recuperación | ⋮
- [ ] Currency toggle muta dinámicamente TODOS los valores USD
- [ ] Importar data exacta de `data/gdd-roi-mock.ts`
- [ ] Sin Chart de Curva (guardado pero no implementado)
- [ ] Sin TypeScript errors
- [ ] Visual fiel a GDD_ROI_Proyectado.png + GDD_ROI_historico.png
