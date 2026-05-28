Actúa como un experto senior en UX/UI y analista financiero especializado en proyectos de energía renovable (parques fotovoltaicos). Te comparto el contexto completo del rediseño que acabo de cerrar para la vista de "Retorno de Inversión (ROI)" de nuestra plataforma, junto con las reglas de negocio técnicas para que tengas toda la base necesaria para continuar con las fases de desarrollo o nuevas pantallas.

### 1. El Core del Negocio y Variables del Proyecto
*   **Proyecto:** Parque Fotovoltaico "Parque General Roca".
*   **Modelo de Negocio:** Retorno basado en el Ahorro Energético (USD o ARS) generado por la planta.
*   **Inversión Inicial Total:** $21.000.000 USD (Valor base).
*   **Fecha de Inicio:** Mayo 2024.
*   **Mes de Corte Actual:** Mayo 2026 (Cumplidos exactamente 2.0 años / 24 meses de operación).
*   **Estado Actual:** Se han recuperado $6.000.000 USD (28.5% de la inversión global). Faltan recuperar $15.000.000 USD.
*   **Payback Estimado Total:** 7.0 años (Fecha estimada de recupero final: Mayo 2031).
*   **TIR:** 15.00% | **Plazo del Proyecto:** 20 años.

### 2. Filosofía del Layout (Arquitectura de Información)
La pantalla se divide en dos grandes bloques para resolver la UX de inversores tradicionales corporativos:
1.  **Bloque Superior (Macro):** Tarjetas de KPI de alto impacto (Muestran los $6M recuperados, la barra de progreso al 28.5%, los $15M pendientes, el Payback de 7 años con su línea de tiempo, la TIR y el Plazo).
2.  **Bloque Inferior (Micro):** Tablas detalladas divididas en dos pestañas exclusivas mediante un Switch de Pestañas, separando conceptualmente el pasado (auditoría) del futuro (simulación).
3.  **Control Global de Moneda:** Toggle en cabecera (**DOLAR** | **ARS**). Montos: `formatRoiFromUsd` / `formatCurrency` — ver `lib/format-currency.ts` y `components.md` → FormatCurrency.

### 3. Reglas de Negocio Técnicas para el Frontend/Backend (DOLAR vs. ARS)
*   **Timeline e Hitos Temporales (Agnósticos):** Fechas y plazos fijos; no dependen del toggle.
*   **Conversión de Valores Monetarios:** Base USD en datos; en **ARS** → `valor * tipo_cambio`. Formato UI: `u$s ` (DOLAR) / `$ ` (ARS), locale `es-AR` — helper `formatRoiFromUsd`.
*   **TIR y Plazo (Agnósticos):** No se convierten ni reformatean con el toggle.
*   **Tabs:** labels literales **DOLAR** y **ARS** (no `u$s` en el chip).

### 4. Estructura de las Tablas y Lógica de Datos (Escenario Real Fotovoltaico)
Para el diseño de las tablas aplicamos una curva de estacionalidad fotovoltaica real para el hemisferio sur (altos ingresos en verano, bajos en invierno), manteniendo consistencia exacta con las tarjetas superiores.

#### Pestaña A: "Histórico" (Orden Descendente desde el pasado cercano)
*   **Columnas:** Período | Cap. Recuperado Mensual (DOLAR/ARS) | Cap. Recuperado Acumulado (DOLAR/ARS) | % de Recuperación Global
*   **Lógica de Datos (Muestra de Filas):**
    *   *Abril 2026:* $210.000 | $6.000.000 | 28.5% (Hito que coincide con la KPI general)
    *   *Marzo 2026:* $260.000 | $5.790.000 | 27.6%
    *   *Febrero 2026:* $340.000 | $5.530.000 | 26.3%
    *   *Enero 2026:* $390.000 | $5.190.000 | 24.7% (Pico de verano)
    *   *Diciembre 2025:* $370.000 | $4.800.000 | 22.9%
    *   *Noviembre 2025:* $310.000 | $4.430.000 | 21.1%

#### Pestaña B: "Proyectado" (Orden Cronológico hacia el futuro)
*   **Columnas:** Período | Ahorro Estimado (DOLAR/ARS) | Pendiente de Recuperar (DOLAR/ARS) | Progreso Estimado (%) | Estado
*   **Lógica de Datos (Muestra de Filas):**
    *   *Mayo 2026:* $180.000 | $15.000.000 | 28.5% | Tag: `[En Curso]` (Empieza la cuenta regresiva e iguala la KPI)
    *   *Junio 2026:* $140.000 | $14.820.000 | 29.4% | Tag: `[Estimado]` (Temporada baja / invierno)
    *   *Julio 2026:* $150.000 | $14.680.000 | 30.1% | Tag: `[Estimado]`
    *   *Agosto 2026:* $190.000 | $14.530.000 | 30.8% | Tag: `[Estimado]`
    *   *Septiembre 2026:* $270.000 | $14.340.000 | 32.1% | Tag: `[Estimado]` (Repunte de primavera)
    *   *Octubre 2026:* $320.000 | $14.070.000 | 33.0% | Tag: `[Estimado]`

---
A partir de este diseño consolidado y con las reglas de backend claras, confírmame que has procesado toda la lógica para poder darte las siguientes instrucciones.