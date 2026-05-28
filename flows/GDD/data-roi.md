# Diccionario de Datos Finales - Módulo ROI "Parque General Roca"

Este documento contiene los valores finales oficiales y validados para la maqueta y la lógica del backend de la vista Retorno de Inversión. Los datos simulan un escenario fotovoltaico real con estacionalidad climática para el hemisferio sur.

**Moneda:** Los montos de la maqueta están en **base USD** (numéricos). En UI, toggle **DOLAR** → `formatRoiFromUsd` / `u$s `; **ARS** → conversión × `TIPO_CAMBIO_ARS` + `$ `. Ver `lib/format-currency.ts` y `components.md` → FormatCurrency.

## 1. Variables Globales del Proyecto (KPIs Superiores)
*   **Total Invertido (base USD):** `21.000.000`
*   **Inversión Recuperada a la Fecha (base USD):** `6.000.000`
*   **Porcentaje de Recuperación Global a la Fecha (%):** `28.5%`
*   **Pendiente de Recuperar (base USD):** `15.000.000`
*   **Plazo de Recupero Estimado (Payback Total):** `7.0 años`
*   **Fecha de Inicio del Proyecto:** `Mayo 2024`
*   **Fecha de Corte Actual (Mes en curso):** `Mayo 2026` (Tiempo transcurrido: `2.0 años` / `24 meses`)
*   **Fecha Estimada de Finalización del Payback:** `Mayo 2031`
*   **TIR (Tasa Interna de Retorno):** `15.00%` (Moneda-agnóstica en UI)
*   **Plazo Total del Proyecto:** `20 años` (Moneda-agnóstica en UI)
*   **Métrica de Velocidad (Payback Velocity - Tag Informativo):** `🟢 +8% más rápido de lo estimado`

---

## 2. Dataset para Tabla: Pestaña "Histórico"
*Lógica: Orden descendente hacia el pasado. Valores consolidados reales.*

| Período (String) | Cap. Recuperado Mensual | Recupero Acumulado | Avance de Recuperación |
| :--- | :--- | :--- | :--- |
| **Abril 2026** | `$210.000` | `$6.000.000` | `28.5%` |
| **Marzo 2026** | `$260.000` | `$5.790.000` | `27.6%` |
| **Febrero 2026** | `$340.000` | `$5.530.000` | `26.3%` |
| **Enero 2026** | `$390.000` | `$5.190.000` | `24.7%` |
| **Diciembre 2025** | `$370.000` | `$4.800.000` | `22.9%` |
| **Noviembre 2025** | `$310.000` | `$4.430.000` | `21.1%` |

---

## 3. Dataset para Tabla: Pestaña "Proyectado"
*Lógica: Orden cronológico hacia el futuro. Valores estimados basados en simulación.*

| Período (String) | Ahorro Estimado | Pendiente de Recuperar | Avance de Recuperación | Estado (Tag) |
| :--- | :--- | :--- | :--- | :--- |
| **Mayo 2026** | `$180.000` | `$15.000.000` | `28.5%` | `En Curso` |
| **Junio 2026** | `$140.000` | `$14.820.000` | `29.4%` | `Estimado` |
| **Julio 2026** | `$150.000` | `$14.680.000` | `30.1%` | `Estimado` |
| **Agosto 2026** | `$190.000` | `$14.530.000` | `30.8%` | `Estimado` |
| **Septiembre 2026** | `$270.000` | `$14.340.000` | `32.1%` | `Estimado` |
| **Octubre 2026** | `$320.000` | `$14.070.000` | `33.0%` | `Estimado` |

---

## 4. Reglas de Formateo de UI para el Desarrollador
1.  **Contexto global:** Toggle **DOLAR | ARS** en header — define moneda de toda la vista.
2.  **Labels de columna/KPI:** solo concepto (`Ahorro Estimado`, `Cap. Recuperado`) — **sin** sufijo de moneda.
3.  **Valores monetarios:** prefijo vía `formatRoiFromUsd` / `formatCurrency` — `u$s ` (DOLAR) o `$ ` (ARS), locale `es-AR`.
4.  **Comportamiento dinámico (Switch ARS):** Celdas monetarias (excepto TIR y Plazo) × `TIPO_CAMBIO_ARS` cuando tab ARS activo.
5.  **Spec completa:** `context/components.md` → FormatCurrency + Currency Context Rules.