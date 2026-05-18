# Flow: Dueño del Parque GDD

## Actor
Dueño GDD — Usuario accede únicamente a su parque.
Pregunta clave: ¿Cuánto me está ahorrando el parque y cuándo recupero la inversión?

---

## Pantallas

### GDD_01 — Vista: Performance del Parque
Ruta: /gdd/performance
Vista por defecto al ingresar al flow.
Referencia visual: GDD_01.png

Bloques (orden vertical):
1. Header: nombre del parque ("Parque General Roca") + badge GDD + TabsForBlocks de navegación (Performance / Retorno de Inversión) + botón export. El heading vive dentro del main, no en el header sticky.
2. Card izquierda: chart de barras "Energía Generada del Parque" con chips 1M (semanal) / 3M / 6M / 1A / TODO (mensual) y copy de granularidad acorde — ver ux-guidelines §5. TODO = desde inicio de operaciones del parque (GDD: Mayo 2025).
3. Card derecha superior: KpiPrimary fijo "Generada en Abril — 830.17 kWh" + sparkline + SoftBadge "+220 kWh vs mes anterior". No depende del filtro del chart.
4. Cards derechas inferiores:
   - KpiSecondary "Ahorro acumulado en Abril" — sin tooltip
   - KpiSecondary "Valor de Tarifa Actual" — con `infoTooltip={{ content: "Ver tarifas vigentes", href: "#" }}`
5. Tabla inferior: `ConsumptionHistoryTable` — "Historial de Generación"
   - Acción header: botón "Ver columnas" — toggle visibilidad de columnas
   - Columnas visibles por defecto: Período | Energía generada | Energía comprada | Cobertura (%) | Cobertura ($)
   - Columna oculta por defecto: Consumo Total
   - Columnas fijas (no ocultables): Período | acciones (⋮)
   - Acciones de fila (⋮): Descargar | Copiar | Compartir
   - Paginación al pie, alineada a la derecha
   - Columna "Diferencia" eliminada
   - "Consumo Cooperativa" renombrada a "Energía comprada"
   
Interacciones definidas:
- Tab "Retorno de Inversión" → navega a GDD_02 (/gdd/roi)
- Filter chips 1M / 3M / 6M / 1A / TODO → actualizan SOLO el chart de barras. Por defecto: 6M. 6M = Nov 25–Abr 26; 1A = últimos 12 meses; TODO = desde Mayo 2025 (inicio operaciones GDD).
- KPIs y tabla NO se ligan al filtro del chart.

---

### GDD_02 — Vista: Retorno de Inversión
Ruta: /gdd/roi
Referencia visual: GDD_02.png

Bloques (orden vertical):
1. Header: mismo que GDD_01 — nombre del parque + badge GDD + TabsForBlocks + botón export.
2. Sección "Retorno de la Inversión (ROI)" con 3 cards en fila:
   - KpiSecondary: Ahorro Total Generado → $14.200.000 + SoftBadge "+8% anual"
   - KpiSecondary: Inversión inicial → $38.000.000 + progress bar "37% recuperada"
   - KpiSecondary: Payback estimado → 6.8 años + "Desde Marzo 2024"
3. Dos métricas secundarias en fila: TIR actualizada (16.2%) + Inicio de operaciones (Junio 2023).
4. CardWithContent: chart de línea "Curva de Recuperación Acumulada":
   - Línea sólida: Real (--chart-1)
   - Línea punteada: Proyectada (--chart-2)
   - Línea horizontal de referencia: inversión total
   - Chips 1M / 3M / 6M — por defecto 6M
   - Marker de Payback: solo visible en 3M y 6M. En 1M (semanal) no mostrar.

Interacciones definidas:
- Tab "Performance del Parque" → navega a GDD_01 (/gdd/performance)
- Filter chips 1M / 3M / 6M → actualizan SOLO la serie del chart + subtítulo de granularidad.
- KPIs superiores NO se ligan al filtro del chart.

---

## Nota para el agente
- Construir pantalla por pantalla. Esperar aprobación antes de continuar.
- Usar GDD_01.png y GDD_02.png como referencia visual de layout y jerarquía.
- Usar mock data representativa del dominio (KWh, $ARS, fechas reales del wireframe).
- Elementos sin interacción definida (paginación, menú de tres puntos en tabla): incluirlos si el componente los trae por defecto, sin lógica propia.
- No usar --primary en charts. Usar --chart-1 para serie principal, --chart-2 para proyectada.
- Default de chips de período: siempre 6M. Si hay conflicto con otro documento, este archivo manda.
- ⚠️ La mockup GDD_01.png muestra la barra actual del chart en negro — esto está desactualizado. El código correcto usa `var(--chart-1)` (verde). El código y `components.md` mandan sobre la mockup en este punto.
